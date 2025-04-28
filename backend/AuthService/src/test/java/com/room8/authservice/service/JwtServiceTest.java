package com.room8.authservice.service;

import com.room8.authservice.redis.JwtBlacklistRedisService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class JwtServiceTest {

    private JwtService jwtService;

    @Mock
    private JwtBlacklistRedisService jwtBlacklistRedisService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        jwtService = new JwtService(jwtBlacklistRedisService);
    }

    // Helper method to generate a sample token
    private String generateSampleToken(String userEmail, long expirationTimeMillis) {
        return jwtService.generateJwtToken(userEmail, expirationTimeMillis);
    }

    @Test
    void testExtractUserEmail_validToken() {
        String userEmail = "testuser@example.com";
        String token = generateSampleToken(userEmail, 3600000); // 1 hour expiration

        String extractedEmail = jwtService.extractUserEmail(token);
        assertEquals(userEmail, extractedEmail);
    }

    @Test
    void testExtractUserEmail_invalidToken() {
        String invalidToken = "invalidToken";
        assertThrows(io.jsonwebtoken.JwtException.class, () -> jwtService.extractUserEmail(invalidToken));
    }

    @Test
    void testGenerateJwtToken() {
        String userEmail = "testuser@example.com";
        long expirationTimeMillis = 3600000; // 1 hour expiration

        String token = generateSampleToken(userEmail, expirationTimeMillis);

        // Token should not be empty
        assertNotNull(token);
        assertTrue(token.startsWith("eyJhbGciOiJIUzI1NiJ9")); // Check part of token signature
    }

    @Test
    void testIsJwtTokenValid_validToken() {
        String userEmail = "testuser@example.com";
        long expirationTimeMillis = 3600000; // 1 hour expiration
        String token = generateSampleToken(userEmail, expirationTimeMillis);

        when(jwtBlacklistRedisService.isTokenBlacklisted(token)).thenReturn(false);

        boolean isValid = jwtService.isJwtTokenValid(token);
        assertTrue(isValid);
    }

    @Test
    void testIsJwtTokenValid_blacklistedToken() {
        String userEmail = "testuser@example.com";
        long expirationTimeMillis = 3600000; // 1 hour expiration
        String token = generateSampleToken(userEmail, expirationTimeMillis);

        when(jwtBlacklistRedisService.isTokenBlacklisted(token)).thenReturn(true);

        boolean isValid = jwtService.isJwtTokenValid(token);
        assertFalse(isValid);
    }

    @Test
    void testIsJwtTokenValid_expiredToken() throws InterruptedException {
        String userEmail = "testuser@example.com";
        long expirationTimeMillis = 1000; // Set expiration to 1 second in the future to ensure it's not expired initially
        String token = generateSampleToken(userEmail, expirationTimeMillis);

        when(jwtBlacklistRedisService.isTokenBlacklisted(token)).thenReturn(false);

        // Wait for 3 seconds to allow the token to expire
        TimeUnit.SECONDS.sleep(3);

        boolean isValid = jwtService.isJwtTokenValid(token);
        // Token should be invalid as it is expired after the delay.
        assertFalse(isValid);
    }


    @Test
    void testIsJwtTokenExpired_withDelay() throws InterruptedException {
        String userEmail = "testuser@example.com";
        long expirationTimeMillis = 5000; // Token expires in 5 seconds
        String token = generateSampleToken(userEmail, expirationTimeMillis);

        // Wait for 3 seconds to ensure the token is near expiration
        TimeUnit.SECONDS.sleep(3);

        // Now check if the token is expired
        boolean isExpired = jwtService.isJwtTokenExpired(token);

        // Since we waited for 3 seconds, the token should not yet be expired
        assertFalse(isExpired);

        // Wait an additional 3 seconds (total 6 seconds) for token to expire
        TimeUnit.SECONDS.sleep(3);

        // Check if the token is expired after 6 seconds (it should be)
        isExpired = jwtService.isJwtTokenExpired(token);
        assertTrue(isExpired);
    }


    @Test
    void testIsJwtTokenExpired_validToken() {
        String userEmail = "testuser@example.com";
        long expirationTimeMillis = 3600000; // 1 hour expiration
        String token = generateSampleToken(userEmail, expirationTimeMillis);

        boolean isExpired = jwtService.isJwtTokenExpired(token);
        assertFalse(isExpired);
    }

    @Test
    void testExtractExpiration() {
        String userEmail = "testuser@example.com";
        long expirationTimeMillis = 3600000; // 1 hour expiration
        String token = generateSampleToken(userEmail, expirationTimeMillis);

        Date expirationDate = jwtService.extractExpiration(token);
        assertNotNull(expirationDate);
        assertTrue(expirationDate.after(new Date()));
    }

    @Test
    void testExtractClaim_validToken() {
        String userEmail = "testuser@example.com";
        long expirationTimeMillis = 3600000; // 1 hour expiration
        String token = generateSampleToken(userEmail, expirationTimeMillis);

        String extractedSubject = jwtService.extractClaim(token, Claims::getSubject);
        assertEquals(userEmail, extractedSubject);
    }

    @Test
    void testExtractClaim_invalidToken() {
        String invalidToken = "invalidToken";
        assertThrows(io.jsonwebtoken.JwtException.class, () -> jwtService.extractClaim(invalidToken, Claims::getSubject));
    }
}
