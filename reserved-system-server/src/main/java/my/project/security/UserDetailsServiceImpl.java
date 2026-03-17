package my.project.security;

import my.project.entity.UserEntity;
import my.project.entity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;


// Load user from database
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;


    /**
     * This class:
     * - checks if a token is in the header
     * - validates the token
     * - if the token is valid, sets up authentication in the Spring Security context
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));


        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail()) //<-email is identifier
                .password(user.getPassword())
                .roles(user.getRole().name()) //set up role USER/ADMIN
                .build();
    }
}

