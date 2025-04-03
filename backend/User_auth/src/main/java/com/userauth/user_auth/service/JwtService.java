package com.userauth.user_auth.service;

import com.userauth.user_auth.repository.TokenBlacklistRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {
    private static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY") != null
            ? System.getenv("JWT_SECRET_KEY")
            : "DE79AF2BD6D2F70D654D80B16DDFCA5487A75795E8C33A906F990C64522C45BE";
    private TokenBlacklistRepository tokenBlacklistRepository;
    private JwtBlacklistService jwtBlacklistService;

    /**
     * Extract user's email address from the jwt token
     *
     * @param jwtToken String token from which the email si to be extracted
     * @return A valid email address is token is valid a nd contain the email
     */
    public String extractUserEmail(String jwtToken) {
        return extractClaim(jwtToken, Claims::getSubject);
    }

    public <T> T extractClaim(String jwtToken, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(jwtToken);
        return claimsResolver.apply(claims);
    }

    /**
     * Generate JWT authentication token
     *
     * @param userEmail email address if the user
     * @return encrypted Jwt authentication token
     */
    public String generateJwtToken(String userEmail, long expirationTimeMillis) {
        return generateJwtToken(new HashMap<>(), userEmail, expirationTimeMillis);
    }

    public String generateJwtToken(Map<String, Object> extraClaims, String userEmail, long expirationTimeMillis) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userEmail)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTimeMillis)) // Dynamic expiration
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validate token
     *
     * @param jwtToken string to be validated
     * @return true if token is valid and false otherwise
     */
    public boolean isJwtTokenValid(String jwtToken) {
        if (jwtBlacklistService.isTokenBlacklisted(jwtToken)) {
            return false;
        }
        return extractExpiration(jwtToken).after(new Date());
    }

//    public boolean isJwtTokenValid(String jwtToken) {
//        if (isTokenBlacklisted(jwtToken)) {
//            return false;
//        }
//        final String email = extractUserEmail(jwtToken);
//        return (email != null && !isJwtTokenExpired(jwtToken));
//    }

    public boolean isJwtTokenExpired(String jwtToken) {
        return extractExpiration(jwtToken).before(new Date());
    }

    /**
     *
     * @param jwtToken String token from which the expiration date is to be extracted from
     * @return the expiration date as a Date object
     */
    public Date extractExpiration(String jwtToken) {
        return extractClaim(jwtToken, Claims::getExpiration);
    }

    private Claims extractAllClaims(String jwtToken) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(jwtToken)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

//    /**
//     * Check if a jwt token is blacklisted by the system
//     *
//     * @param token String token to check against a list of blacklisted token
//     * @return true if the token is found in the list of blacklisted tokens and false if not
//     */
//    private boolean isTokenBlacklisted(String token) {
//        return tokenBlacklistRepository.findByToken(token).isPresent();
//    }
}
