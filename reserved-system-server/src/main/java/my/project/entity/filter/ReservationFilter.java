package my.project.entity.filter;


import lombok.Data;
import my.project.constant.ReservationStatus;

import java.time.LocalDateTime;

@Data
public class ReservationFilter {
    private Long userID;
    private Long roomID;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ReservationStatus status;
    private Integer limit;
}
