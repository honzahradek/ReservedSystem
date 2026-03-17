package my.project.service;

import jakarta.persistence.EntityNotFoundException;
import my.project.constant.ReservationStatus;
import my.project.dto.MeetingRoomDTO;
import my.project.dto.ReservationDTO;
import my.project.dto.UserDTO;
import my.project.dto.mapper.ReservationMapper;
import my.project.entity.MeetingRoomEntity;
import my.project.entity.ReservationEntity;
import my.project.entity.UserEntity;
import my.project.entity.filter.ReservationFilter;
import my.project.entity.repository.MeetingRoomRepository;
import my.project.entity.repository.ReservationRepository;
import my.project.entity.repository.UserRepository;
import my.project.entity.repository.specification.ReservationSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService{

    @Autowired
    ReservationMapper reservationMapper;

    @Autowired
    ReservationRepository reservationRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    MeetingRoomRepository meetingRoomRepository;

    @Override
    public ReservationDTO addReservation(ReservationDTO reservationDTO) {

        validateCreate(reservationDTO);

        //endTime is not before startTime when creating a reservation
        checkDateTime(reservationDTO);

        // Check Overlapping reservation. It´s private method - see below
        checkOverlappingReservations(reservationDTO.getRoom().getRoomId(),
                                     reservationDTO.getStartTime(),
                                     reservationDTO.getEndTime(),
                                     -1L //No reservation is ignored
                                    );

        ReservationEntity entity = reservationMapper.toEntity(reservationDTO);
        entity.setUser(userRepository.getReferenceById(reservationDTO.getUser().getUserId()));
        entity.setRoom(meetingRoomRepository.getReferenceById(reservationDTO.getRoom().getRoomId()));
        entity.setStatus(ReservationStatus.PENDING);
        entity.setCreatedAt(LocalDateTime.now());
        ReservationEntity savedEntity = reservationRepository.save(entity);
        return reservationMapper.toDTO(savedEntity);
    }

    /**
     * Returns a list of reservations for a specific room.
     * <p>
     * The method first verifies the existence of the room by the given ID.
     * Then it retrieves all reservations associated with that room
     * and maps them to {@link ReservationDTO}, including detailed information
     * about the room ({@link MeetingRoomDTO}) and the user ({@link UserDTO}).
     *
     * @param roomId the ID of the room for which reservations should be retrieved
     * @return a list of reservations as {@link ReservationDTO} objects
     * @throws EntityNotFoundException if a room with the specified ID does not exist
     */
    @Override
    public List<ReservationDTO> getRoomToReservation(Long roomId){

        MeetingRoomEntity room = meetingRoomRepository.findById(roomId)
                .orElseThrow(() -> new EntityNotFoundException("Room with ID " + roomId + " not found"));

        // Load all reservation
        List<ReservationEntity> reservations = reservationRepository.findByRoomId(roomId);

        // Conversion to DTO
        return reservations.stream().map(res -> {
            ReservationDTO dto = new ReservationDTO();

            dto.setReservationId(res.getReservationId());
            dto.setStartTime(res.getStartTime());
            dto.setEndTime(res.getEndTime());
            dto.setStatus(res.getStatus());

            // Paste MeetingRoomDTO
            MeetingRoomDTO roomDTO = new MeetingRoomDTO();
            roomDTO.setRoomId(res.getRoom().getRoomId());
            roomDTO.setName(res.getRoom().getName());
            roomDTO.setCapacity(res.getRoom().getCapacity());
            dto.setRoom(roomDTO);

            // Paste UserDTO
            UserDTO userDTO = new UserDTO();
            userDTO.setUserId(res.getUser().getUserId());
            userDTO.setUsername(res.getUser().getUsername());
            userDTO.setEmail(res.getUser().getEmail());
            dto.setUser(userDTO);

            return dto;
        }).toList();

    }


    @Override
    public ReservationDTO updateReservation(Long id, ReservationDTO reservationDTO){
        // The date must not be in the past - see below
        validateNotInPast(reservationDTO.getStartTime(),reservationDTO.getEndTime());

        // Date and time validation: end must not be earlier than start. - see below
        checkDateTime(reservationDTO);

        // Checking for overlapping reservations - see below
        checkOverlappingReservations(
                reservationDTO.getRoom().getRoomId(),
                reservationDTO.getStartTime(),
                reservationDTO.getEndTime(),
                id // Ignoring the reservation currently being edited.
        );

        reservationDTO.setReservationId(id);
        ReservationEntity entity = reservationRepository.getReferenceById(id);

        //Update data from DTO to entity(Mapstruct)
        reservationMapper.editReservation(reservationDTO, entity);

        entity.setUser(userRepository.getReferenceById(reservationDTO.getUser().getUserId()));
        entity.setRoom(meetingRoomRepository.getReferenceById(reservationDTO.getRoom().getRoomId()));

        // Save update entity
        ReservationEntity update = reservationRepository.save(entity);

        return reservationMapper.toDTO(update);
    }

    @Override
    public List<ReservationDTO> getMyReservations(Authentication authentication) {
        String email = authentication.getName();

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()-> new EntityNotFoundException("User not exist"));

        List<ReservationEntity> entities = reservationRepository.findByUser(user);
        return entities.stream()
                .map(reservationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void removeMyReservation(Long reservationId) {
        ReservationEntity entity = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found"));
        reservationRepository.delete(entity);
    }

    @Override
    public void cancelReservation(Long reservationId) {
        ReservationEntity entity = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found"));

        // if it´s already cancelled
        if(entity.getStatus() == ReservationStatus.CANCELLED) {
            throw new IllegalStateException("Reservation is already cancelled");
        }

        if (entity.getStatus() == ReservationStatus.PENDING ||
            entity.getStatus() == ReservationStatus.CONFIRMED){
            entity.setStatus(ReservationStatus.CANCELLED);
            reservationRepository.save(entity);
        }
    }

    // For our app just integer, alright long
    @Override
    public Integer getCountOfReservation() {
        return Math.toIntExact(reservationRepository.count());
    }


    @Override
    public long getActiveOfReservation() {
        return reservationRepository.activeReservation();
    }

    @Override
    public List<ReservationDTO> getLastFiveReservation() {
        Pageable topFive = PageRequest.of(0, 5);

        return reservationRepository.lastReservation(topFive)
                .stream()
                .map(reservationMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Return all reservation or filtered reservation
    @Override
    public List<ReservationDTO> getAllReservation(ReservationFilter filter){
        ReservationSpecification reservationSpecification = new ReservationSpecification((filter));

        Integer limit = filter.getLimit();
        List<ReservationEntity> entities;

        if (limit != null && limit > 0) {
             entities = reservationRepository.findAll(reservationSpecification,PageRequest.of(0, limit)).getContent();
        } else {
            entities= reservationRepository.findAll(reservationSpecification);
        }

        return entities.stream()
                .map(reservationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void removeReservationByAdmin(Long reservationId) {
      ReservationEntity entity = reservationRepository.findById(reservationId)
              .orElseThrow(() -> new EntityNotFoundException("Reservation not found"));

      reservationRepository.delete(entity);
    }

    @Override
    public ReservationDTO confirmReservation(Long id) {

        ReservationEntity entity = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found"));

        if (entity.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Only PENDING reservations can be confirmed.");
        }

        validateConfirm(entity);

        entity.setStatus(ReservationStatus.CONFIRMED);
        ReservationEntity saved = reservationRepository.save(entity);

        return reservationMapper.toDTO(saved);
    }



    // PRIVATE AREA
    //Control start and end date & time
    private void checkDateTime(ReservationDTO dto) {
        LocalDateTime start = dto.getStartTime();
        LocalDateTime end = dto.getEndTime();

        if(start == null || end == null) {
            throw new IllegalArgumentException("Start time and end time must not be null");
        }

        if(end.isBefore(start)) {
            throw new IllegalArgumentException("End time cannot be before start time.");
        }
    }

    // Overlapping reservation
    private void checkOverlappingReservations(Long roomId,
                                              LocalDateTime start,
                                              LocalDateTime end,
                                              Long excludeId) {

        List<ReservationEntity> overlaps =
                reservationRepository.findOverlappingReservations(roomId, start, end, excludeId);

        if (!overlaps.isEmpty()) {
            throw new IllegalArgumentException("Reservation overlaps with an existing one.");
        }
    }

    // Validate reservation in past
    private void validateNotInPast(LocalDateTime start, LocalDateTime end) {
        LocalDateTime now = LocalDateTime.now();

        if (start.isBefore(now)){
            throw new IllegalArgumentException("Start time cannot be in the past");
        }

        if (end.isBefore(now)) {
            throw new IllegalArgumentException("End time cannot be in the past");
        }
    }

    // Validate for creation of reservation
    private void validateCreate(ReservationDTO dto) {

        // 1) Reservation in the past
        if (dto.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reservation cannot start in the past.");
        }

        if (dto.getEndTime().isBefore(dto.getStartTime())) {
            throw new IllegalArgumentException("End time cannot be before start time.");
        }

        // 2) Conflict with CONFIRM
        List<ReservationEntity> conflicts =
                reservationRepository.findOverlappingConfirmed(
                        dto.getRoom().getRoomId(),
                        dto.getStartTime(),
                        dto.getEndTime()
                );

        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Selected time already has a confirmed reservation.");
        }
    }

    //Validate for confirm
    private void validateConfirm(ReservationEntity reservation) {

        List<ReservationEntity> conflicts =
                reservationRepository.findOverlappingConfirmed(
                        reservation.getRoom().getRoomId(),
                        reservation.getStartTime(),
                        reservation.getEndTime()
                );

        // We remove ourselves so that the method only checks other reservations, not the one we are currently confirming or editing.
        conflicts.removeIf(r -> r.getReservationId().equals(reservation.getReservationId()));

        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException(
                    "Reservation cannot be confirmed because it overlaps with another confirmed reservation."
            );
        }
    }


}
