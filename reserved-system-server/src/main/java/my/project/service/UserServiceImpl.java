package my.project.service;

import jakarta.persistence.EntityNotFoundException;
import my.project.dto.AuthenticationResponse;
import my.project.dto.UserDTO;
import my.project.dto.mapper.UserMapper;
import my.project.entity.UserEntity;
import my.project.entity.repository.UserRepository;
import my.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtService jwtService;


    //Update user profile
    @Override
    public AuthenticationResponse updateCurrentUser(UserDTO userDTO, Authentication authentication) {
        // 1) Get current user from token
        String email = authentication.getName(); // from JWT subject

        // 2) Find user by email
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("UserService - User´s email not found:"));

        // 3) Update only the provided values
        if (userDTO.getUsername() != null && !userDTO.getUsername().isBlank()) {
            user.setUsername(userDTO.getUsername());
        }

        if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
            user.setEmail(userDTO.getEmail());
        }

        // 4) If a password is provided -> hash it & save
        if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
            String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
            user.setPassword(encodedPassword);
        }

        // 5️) Save the update
        UserEntity updated = userRepository.save(user);
        UserDTO updateDto = userMapper.toDTO(updated);

        // 6) Generate a new token
        String newToken = jwtService.generateToken(updateDto);

        // 7) Return DTO
        return new AuthenticationResponse(
                newToken,
                updated.getUserId(),
                updated.getUsername(),
                updated.getEmail(),
                updated.getRole().name()
        );
    }

    // Load users profile in frondend app
    @Override
    public UserDTO getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        System.out.println("Current logged in user JWT:" + email);
        UserEntity entity = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("getCurrentUser - User not found:"));
        return userMapper.toDTO(entity);
    }
}
