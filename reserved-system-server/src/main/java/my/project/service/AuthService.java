package my.project.service;

import my.project.dto.AuthenticationRequest;
import my.project.dto.AuthenticationResponse;
import my.project.dto.RegisterRequest;


public interface AuthService {

    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse login(AuthenticationRequest request);

}
