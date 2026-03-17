package my.project.service;

import my.project.dto.ReservationDTO;
import my.project.entity.filter.ReservationFilter;
import org.springframework.security.core.Authentication;


import java.util.List;

public interface ReservationService {

    // Creation of a reservation
    ReservationDTO addReservation(ReservationDTO reservationDTO);

    // Returns a list of reservations for a specific room.
    List<ReservationDTO> getRoomToReservation(Long roomId);

    // Update reservation
    ReservationDTO updateReservation(Long id, ReservationDTO reservationDTO);

    // Returns a list of reservation login user
    List<ReservationDTO> getMyReservations(Authentication authentication);

    // Remove my reservation from the database
    void removeMyReservation(Long reservationId);

    // Cancels reservation
    void cancelReservation(Long reservationId);

    // Total number of reservations
    Integer getCountOfReservation();

    // Count of active reservation
    long getActiveOfReservation();

    // Last 5 reservations
    List<ReservationDTO> getLastFiveReservation();

   // gets list of all reservations  - for ADMIN
   List<ReservationDTO> getAllReservation(ReservationFilter filter);

  // Only admin can remove reservation
  void removeReservationByAdmin(Long reservationId);

  // Only for admin - CONFIRMED
  ReservationDTO confirmReservation(Long id);



}
