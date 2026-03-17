package my.project.service;

import jakarta.persistence.EntityNotFoundException;
import my.project.constant.Role;
import my.project.dto.UserDTO;
import my.project.dto.mapper.ReservationMapper;
import my.project.dto.mapper.UserMapper;
import my.project.entity.UserEntity;
import my.project.entity.repository.ReservationRepository;
import my.project.entity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationMapper reservationMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<UserDTO> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean deleteUser(Long id){
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        // check if a user with this email already exists
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("User with this email exist.");
        }
        try {
            UserEntity entity = new UserEntity();
            entity.setUsername(userDTO.getUsername());
            entity.setEmail(userDTO.getEmail());

            // admin enters password
            entity.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            entity.setCreatedAt(LocalDateTime.now());

            // Admin determines the role. Default role is USER
            if (userDTO.getRole() != null) {
                entity.setRole(Role.valueOf(userDTO.getRole().toString().toUpperCase()));
            } else {
                entity.setRole(Role.USER);
            }

            userRepository.save(entity);

            // return no password
            UserDTO responseDTO = new UserDTO();
            responseDTO.setUserId(entity.getUserId());
            responseDTO.setUsername(entity.getUsername());
            responseDTO.setEmail(entity.getEmail());
            responseDTO.setRole(entity.getRole());

            return responseDTO;

        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {

        if(!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found.");
        }

        UserEntity entity = userRepository.getReferenceById(id);

        // update common fields
        entity.setUsername(userDTO.getUsername());
        entity.setEmail(userDTO.getEmail());
        entity.setRole(userDTO.getRole());

        // if password is entered - it´s updated
        if (userDTO.getPassword() != null && !userDTO.getPassword().isBlank()) {
            entity.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        UserEntity updateEntity = userRepository.save(entity);

        return userMapper.toDTO(updateEntity);
    }
}
