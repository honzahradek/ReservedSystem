package my.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import my.project.constant.Role;


import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "users")
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private LocalDateTime createdAt; // When user was created.

    @OneToMany(mappedBy = "user")
    private List<ReservationEntity> reservations;

    @Enumerated(EnumType.STRING)
    private Role role; // USER or ADMIN

}
