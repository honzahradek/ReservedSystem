package my.project.service;

import jakarta.persistence.EntityNotFoundException;
import my.project.dto.MeetingRoomDTO;
import my.project.dto.mapper.MeetingRoomMapper;
import my.project.entity.MeetingRoomEntity;
import my.project.entity.repository.MeetingRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MeetingRoomServiceImpl implements MeetingRoomService{

    @Autowired
    MeetingRoomMapper meetingRoomMapper;

    @Autowired
    MeetingRoomRepository meetingRoomRepository;

    /**
     * gets all rooms from DB
     * @return List of rooms
     */
    @Override
    public List<MeetingRoomDTO> getAllRooms() {
        List<MeetingRoomEntity> entities = meetingRoomRepository.findAll();
        List<MeetingRoomDTO> roomDTOS = new ArrayList<>();
        for (MeetingRoomEntity entity : entities){
            roomDTOS.add(meetingRoomMapper.toDTO(entity));
        }
        return roomDTOS;
    }

    /**
     * creates a new meeting room in the system
     * @param meetingRoomDTO
     * @return DTO with save entity
     */
    @Override
    public MeetingRoomDTO createRoom(MeetingRoomDTO meetingRoomDTO) {
        MeetingRoomEntity entity = meetingRoomMapper.toEntity(meetingRoomDTO);
        MeetingRoomEntity savedEntity = meetingRoomRepository.save(entity);
        return meetingRoomMapper.toDTO(savedEntity);
    }

    /**
     * Update a meeting room
     * @param id
     * @param meetingRoomDTO
     * @return
     */
    @Override
    public MeetingRoomDTO updateRoom(Long id, MeetingRoomDTO meetingRoomDTO) {
        // Check whether a meeting room already exists
        if (!meetingRoomRepository.existsById(id)) {
            throw new EntityNotFoundException("Meetingroom not found.");
        }

        MeetingRoomEntity entity = meetingRoomRepository.getReferenceById(id);

        // Update values (over wrapper)
        meetingRoomMapper.editRoom(meetingRoomDTO, entity);
        //Save to DB
        MeetingRoomEntity updateEntity = meetingRoomRepository.save(entity);

        return meetingRoomMapper.toDTO(updateEntity);
    }

    /**
     * find a meeting room in the system by its ID
     * remove meeting room from DB
     * @param roomId
     */
    @Override
    public void removeRoom(Long roomId) {
        MeetingRoomEntity entity = meetingRoomRepository.findById(roomId)
                .orElseThrow(()-> new EntityNotFoundException("MeetingRoom not found."));
        meetingRoomRepository.delete(entity);
    }
}
