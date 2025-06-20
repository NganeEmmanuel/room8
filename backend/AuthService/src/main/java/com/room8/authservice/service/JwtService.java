package com.room8.authservice.service;

import com.room8.authservice.redis.JwtBlacklistRedisService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtService {
    private static final String SECRET_KEY = System.getenv("JWT_SECRET_KEY") != null
            ? System.getenv("JWT_SECRET_KEY")
            : "DE79AF2BD6D2F70D654D80B16DDFCA5487A75795E8C33A906F990C64522C45BE";
    private final JwtBlacklistRedisService jwtBlacklistRedisService;

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

    /**
     *
     * @param userEmail the user email
     * @param roles the roles for that user
     * @param expirationTimeMillis the time in millisecond for the token to last
     * @return the jwt token
     */
    public String generateTokenWithRoles(String userEmail, List<String> roles, long expirationTimeMillis) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles); // or "role" if it's a single role
        return generateJwtToken(claims, userEmail, expirationTimeMillis);
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
        if (jwtBlacklistRedisService.isTokenBlacklisted(jwtToken)) {
            return false;
        }
        try {
            return extractExpiration(jwtToken).after(new Date());
        }catch (ExpiredJwtException | SignatureException e) {
            return false;
        }
    }

    public boolean isJwtTokenExpired(String jwtToken) {
        try {
            return extractExpiration(jwtToken).before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
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

    /**
     *
     * @param jwtToken the token from which the roles will be extracted
     * @return the list of roles
     */
    public List<String> extractUserRoles(String jwtToken) {
        return extractClaim(jwtToken, claims -> {
            Object rolesClaim = claims.get("roles");
            if (rolesClaim instanceof List<?>) {
                return ((List<?>) rolesClaim)
                        .stream()
                        .map(Object::toString)
                        .collect(Collectors.toList());
            }
            return new ArrayList<>();
        });
    }


    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
