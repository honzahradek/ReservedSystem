package my.project.service;

import my.project.dto.MeetingRoomDTO;

import java.util.List;

public interface MeetingRoomService {

    //Get a list all Meeting rooms
    List<MeetingRoomDTO> getAllRooms();

    // Create new room in the ReservedSystem
    MeetingRoomDTO createRoom(MeetingRoomDTO meetingRoomDTO);

    // Update a room
    MeetingRoomDTO updateRoom(Long id, MeetingRoomDTO meetingRoomDTO);

    // Remove a room from DB
    void removeRoom(Long id);
}
