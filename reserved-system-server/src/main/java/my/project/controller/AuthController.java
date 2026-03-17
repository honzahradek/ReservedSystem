package my.project.controller;

import my.project.dto.AuthenticationRequest;
import my.project.dto.AuthenticationResponse;
import my.project.dto.RegisterRequest;
import my.project.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Public access for everyone
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    // Create a new user for registrate
    @PostMapping("/register")
    public AuthenticationResponse addUser(@RequestBody RegisterRequest request){
        return authService.register(request);
    }

    // Login a user
    @PostMapping("/login")
    public AuthenticationResponse loginUser (@RequestBody AuthenticationRequest authenticationRequest){
       return authService.login(authenticationRequest);

    }

}
