package my.project.service;

import  my.project.constant.Role;
import my.project.dto.AuthenticationRequest;
import my.project.dto.AuthenticationResponse;
import my.project.dto.RegisterRequest;
import my.project.dto.mapper.UserMapper;
import my.project.entity.UserEntity;
import my.project.entity.repository.UserRepository;
import my.project.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public AuthenticationResponse register(RegisterRequest request) {
        // Check whether a user with this email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("A user with this email already exists");
        }
        try{
            UserEntity entity = new UserEntity();
            entity.setUsername(request.getUsername());
            entity.setEmail(request.getEmail());
            entity.setPassword(passwordEncoder.encode(request.getPassword()));
            entity.setCreatedAt(LocalDateTime.now());
            // Assignment of the ADMIN or USER role
            if (!userRepository.existsByRole(Role.ADMIN)) {
                entity.setRole(Role.ADMIN);
            } else {
                entity.setRole(Role.USER);
            }

            // Save to database
            userRepository.save(entity);

            // Create a token
            String token = jwtService.generateToken(userMapper.toDTO(entity));

            // return responseDTO
            return new AuthenticationResponse(
                    token,
                    entity.getUserId(),
                    entity.getUsername(),
                    entity.getEmail(),
                    entity.getRole().name()
            );

        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
        // Verification of credentials using the AuthenticationManager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Searching for a user in the database
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow( () -> new UsernameNotFoundException(
                        "A User not found with this email" + request.getEmail()));

        // Create token
        String token = jwtService.generateToken(userMapper.toDTO(user));

        // Return responseDTO
        return new AuthenticationResponse(
                token,
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
