package my.project.security;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserDetailsService userDetailsService;

    /**
     * A method that is executed on every HTTP request. It checks the JWT token and authenticates the user.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // We get the value from the Authorization header
        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String username;

        // If the header does not exist or does not start with "Bearer", we continue without authentication
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // We remove the "Bearer" prefix and get the token itself
        jwtToken = authHeader.substring(7);

        // We get the username from the token (typically email or username)
        username = jwtService.extractUsername(jwtToken);

        // If a username exists and authentication is not already set up in the Spring Security context
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Let's load users from the database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // We verify whether the token is valid (e.g. non-expiry, correct signature)
            if (jwtService.isTokenValid(jwtToken, userDetails)) {

                // We will create an authentication object with the user and their permissions
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // Add information about the request (e.g. IP address, user agent)
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // We will set up authentication in the Spring Security context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // We are continuing to process your request.
        filterChain.doFilter(request, response);
    }
}