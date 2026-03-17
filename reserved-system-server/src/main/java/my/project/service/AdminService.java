package my.project.service;

import my.project.dto.UserDTO;

import java.util.List;

public interface AdminService {

    List<UserDTO> getAllUsers();

    boolean deleteUser(Long id);

    UserDTO createUser(UserDTO userDTO);

    UserDTO updateUser(Long id, UserDTO userDTO);
}
