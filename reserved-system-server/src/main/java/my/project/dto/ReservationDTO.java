package my.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import my.project.constant.ReservationStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDTO {


    @JsonProperty("_id")
    private long reservationId;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ReservationStatus status;

    private MeetingRoomDTO room;
    private UserDTO user;
}
