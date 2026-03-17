package my.project.controller;

import my.project.dto.AuthenticationResponse;
import my.project.dto.UserDTO;
import my.project.security.JwtService;
import my.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsService userDetailsService;

    //Load user profile - only for USER
    @GetMapping("/me")
    public UserDTO getCurrentUser(Authentication authentication){
        return userService.getCurrentUser(authentication);
    }

    //Update user profile - only for USER
    @PutMapping("/me")
    public AuthenticationResponse updateCurrentUser(@RequestBody UserDTO userDTO, Authentication authentication) {
        return userService.updateCurrentUser(userDTO, authentication);
    }
}
