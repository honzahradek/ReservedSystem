package my.project.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import my.project.dto.UserDTO;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

/**
 * Service for working with JWT – generation, validation and extraction of data from the token.
 */
@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    /**
     * Returns subject(email) from the JWT token
     * Claims::getSubject return value claim :sub
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject); // back email
    }

    /**
     *Extracts a specific claim from a JWT token.
     *
     * This is a generic helper method that allows retrieval of any value
     * stored in the token's claims by applying a resolver function.
     *
     * @param token the JWT token from which the claim should be extracted
     * @param claimsResolver a function that defines which claim should be returned (for example Claims::getSubject or a custom claim)
     * @param <T> the expected return type of the claim
     * @return the value of the requested claim extracted from the token
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Verifying that the token is valid
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Generates a new JWT token for a given user directly from the UserEntity
     */
    public String generateToken(UserDTO user) {

        return Jwts.builder()
            .setSubject(user.getEmail()) //email=subject
            .claim("role", user.getRole()) // <-- role from enum Role
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration()))
            .signWith(getSignInKey(),SignatureAlgorithm.HS256)
            .compact();
    }

    private Key getSignInKey() {
        String secret = jwtProperties.getSecret();
        if (secret == null) {
            throw new IllegalStateException("!!!!!JWT secret is null! Check your configuration.");
        }
        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
