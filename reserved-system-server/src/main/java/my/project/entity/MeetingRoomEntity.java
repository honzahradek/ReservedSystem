package my.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity(name = "rooms")
@Getter
@Setter
public class MeetingRoomEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Integer capacity;

    // 1:N to reservation
    @OneToMany(mappedBy = "room")
    private List<ReservationEntity> reservations;
 }
