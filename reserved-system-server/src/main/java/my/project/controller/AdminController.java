package my.project.controller;

import my.project.dto.UserDTO;
import my.project.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

//Only for Admin
@RestController
@RequestMapping("/admin")
public class AdminController {

   @Autowired
   private AdminService adminService;

    // Get all users
    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
    return adminService.getAllUsers();
    }

    // Remove user from DB by his ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Add a new user
    @PostMapping("/users")
    public UserDTO createUser(@RequestBody UserDTO userDTO) {
        return adminService.createUser(userDTO);
    }

    // Edit user by his ID
    @PutMapping("/users/{id}")
    public  UserDTO updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return adminService.updateUser(id, userDTO);
    }

}
