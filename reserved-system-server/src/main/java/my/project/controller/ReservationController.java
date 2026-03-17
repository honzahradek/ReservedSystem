package my.project.controller;

import my.project.dto.ReservationDTO;
import my.project.entity.filter.ReservationFilter;
import my.project.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // Create a new reservation  - only for USER
    @PostMapping("/new")
    public ReservationDTO addReservation(@RequestBody ReservationDTO reservationDTO) {
        return reservationService.addReservation(reservationDTO);
    }

    // Edit reservation by its ID - only for USER
    @PutMapping("/edit/{id}")
    public ReservationDTO updateReservation(@PathVariable Long id, @RequestBody ReservationDTO reservationDTO) {
        return reservationService.updateReservation(id, reservationDTO);
    }

    // Gets a list my reservations - only for USER
    @GetMapping("/mine")
    public List<ReservationDTO> getMyReservations(Authentication authentication) {
        return reservationService.getMyReservations(authentication);
    }

    // Delete my reservation - only for USER - NOT USED
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteMyReservation(@PathVariable Long id) {
        reservationService.removeMyReservation(id);
        return ResponseEntity.noContent().build();
    }

    //Confirm a reservation - only for ADMIN
    @PutMapping("/confirm/{id}")
    public ReservationDTO confirm(@PathVariable Long id) {
        return reservationService.confirmReservation(id);
    }

    // Admin remove reservation - only for ADMIN - NOT USED
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteReservationByAdmin(@PathVariable Long id) {
        reservationService.removeReservationByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    //Cancel reservation (ADMIN and USER)
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }

    // Gets the total number of reservation
    @GetMapping("/count")
    public Integer getCountOfReservation() {
        return reservationService.getCountOfReservation();
    }

    // Gets active reservation, (status=Pending or confirm)
    @GetMapping("/active")
    public long getActiveOfReservation() {
        return reservationService.getActiveOfReservation();
    }

    // Gets last 5 reservation
    @GetMapping("/last")
    public List<ReservationDTO> getLastFiveReservation() {
        return reservationService.getLastFiveReservation();
    }

    // Gets all reservations for a specific room based on its ID. (ADMIN i USER)
    // This method uses to load reservation by Meetting room
    @GetMapping("/room/{id}")
    public List<ReservationDTO> getReservationByRoom(@PathVariable Long id) {
        return reservationService.getRoomToReservation(id);
    }

    // Gets all reservation - ADMIN i USER
    @GetMapping("/all")
    public List<ReservationDTO> getAllReservation(ReservationFilter filter) {
        return reservationService.getAllReservation(filter);
    }
}