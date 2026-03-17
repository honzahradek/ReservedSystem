package my.project.service;

import my.project.dto.AuthenticationResponse;
import my.project.dto.UserDTO;
import org.springframework.security.core.Authentication;

public interface UserService {

    UserDTO getCurrentUser(Authentication authentication);

    AuthenticationResponse updateCurrentUser(UserDTO userDTO, Authentication authentication);

}
