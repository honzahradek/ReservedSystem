package my.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

//DTO for answer after login
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    @NonNull
    private String token;

    @NonNull
    private Long userId;

    private String username;
    private String email;
    private String role;

}

