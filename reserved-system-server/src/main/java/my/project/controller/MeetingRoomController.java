package my.project.controller;

import my.project.dto.MeetingRoomDTO;
import my.project.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rooms")
public class MeetingRoomController {

    @Autowired
    MeetingRoomService meetingRoomService;

    // Displays a list of existing rooms (for both USER and ADMIN)
    @GetMapping("/all")
    public List<MeetingRoomDTO> getAllRooms(){
        return meetingRoomService.getAllRooms();
    }

    // Create  a new Meeting room - only for ADMIN
    @PostMapping("/add")
    public MeetingRoomDTO createRoom(@RequestBody MeetingRoomDTO meetingRoomDTO){
        return meetingRoomService.createRoom(meetingRoomDTO);
    }

    // Edit Meetting room - only for ADMIN
    @PutMapping("/{id}")
    public MeetingRoomDTO updateRoom(@PathVariable Long id, @RequestBody MeetingRoomDTO meetingRoomDTO){
        return  meetingRoomService.updateRoom(id, meetingRoomDTO);
    }

    // Remove a Meetting room from databaze ( if it doesn´t exist ) - only for ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id){
        meetingRoomService.removeRoom(id);
        return ResponseEntity.noContent().build();
    }
}
