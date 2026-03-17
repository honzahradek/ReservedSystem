package my.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import my.project.constant.Role;

// DTO
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    @JsonProperty("_id")
    private long userId;

    private String username;

    @Email
    @NotBlank (message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private Role role;

}
