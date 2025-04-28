package com.room8.authservice.service;

import com.room8.authservice.redis.RefreshTokenRedisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link RefreshTokenRedisService} class.
 * These tests validate the interaction with Redis using mocked dependencies,
 * ensuring that refresh tokens are correctly stored, retrieved, and invalidated.
 */
@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private RefreshTokenRedisService refreshTokenRedisService;

    private String email;
    private String refreshToken;
    private long expirationInMinutes;

    /**
     * Set up common test variables and stubbing behavior before each test.
     * Uses lenient stubbing to prevent unnecessary stubbing warnings in tests
     * that don’t use redisTemplate.opsForValue().
     */
    @BeforeEach
    void setUp() {
        email = "testuser@example.com";
        refreshToken = "sample-refresh-token";
        expirationInMinutes = 30;

        // Mock redisTemplate.opsForValue() to return the mocked ValueOperations instance
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    /**
     * Verifies that storing a refresh token results in the correct Redis operation
     * with appropriate expiration settings.
     */
    @Test
    void testStoreRefreshToken() {
        // Act
        refreshTokenRedisService.storeRefreshToken(email, refreshToken, expirationInMinutes);

        // Assert
        verify(valueOperations).set(
                "refreshToken:" + email, refreshToken, expirationInMinutes, TimeUnit.MINUTES);
    }

    /**
     * Verifies that the service correctly retrieves a stored refresh token
     * from Redis using the associated user email.
     */
    @Test
    void testGetRefreshToken() {
        // Arrange
        when(valueOperations.get("refreshToken:" + email)).thenReturn(refreshToken);

        // Act
        String retrievedToken = refreshTokenRedisService.getRefreshToken(email);

        // Assert
        assertEquals(refreshToken, retrievedToken);
    }

    /**
     * Verifies that invalidating a refresh token results in a Redis delete operation
     * for the correct key.
     */
    @Test
    void testInvalidateRefreshToken() {
        // Act
        refreshTokenRedisService.invalidateRefreshToken(email);

        // Assert
        verify(redisTemplate).delete("refreshToken:" + email);
    }
}
