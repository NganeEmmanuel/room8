package com.room8.authservice.redis;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link RefreshTokenRedisService} class.
 */
@ExtendWith(MockitoExtension.class)
class RefreshTokenRedisServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private RefreshTokenRedisService refreshTokenRedisService;

    private String email;
    private String refreshToken;
    private long expirationInMinutes;

    @BeforeEach
    void setUp() {
        email = "testuser@example.com";
        refreshToken = "sample-refresh-token";
        expirationInMinutes = 30;

        // Mock redisTemplate.opsForValue() to return the mocked ValueOperations instance
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testStoreRefreshToken() {
        // Act
        refreshTokenRedisService.storeRefreshToken(email, refreshToken, expirationInMinutes);

        // Assert
        verify(valueOperations).set(
                "auth:refreshToken:" + email, refreshToken, expirationInMinutes, TimeUnit.MINUTES);
    }

    @Test
    void testGetRefreshToken() {
        // Arrange
        when(valueOperations.get("auth:refreshToken:" + email)).thenReturn(refreshToken);

        // Act
        String retrievedToken = refreshTokenRedisService.getRefreshToken(email);

        // Assert
        assertEquals(refreshToken, retrievedToken);
    }

    @Test
    void testGetRefreshToken_notFound() {
        // Arrange
        when(valueOperations.get("auth:refreshToken:" + email)).thenReturn(null);

        // Act
        String retrievedToken = refreshTokenRedisService.getRefreshToken(email);

        // Assert
        assertNull(retrievedToken); // Assert that null is returned if token is not found
    }

    @Test
    void testInvalidateRefreshToken() {
        // Act
        refreshTokenRedisService.invalidateRefreshToken(email);

        // Assert
        verify(redisTemplate).delete("auth:refreshToken:" + email);
    }

    @Test
    void testStoreRefreshToken_nullEmail() {
        // Assert
        // Expecting a NullPointerException
        assertThrows(NullPointerException.class, () -> refreshTokenRedisService.storeRefreshToken(null, refreshToken, expirationInMinutes));
    }

    @Test
    void testStoreRefreshToken_nullToken() {
        // Assert
        // Expecting a NullPointerException
        assertThrows(NullPointerException.class, () -> refreshTokenRedisService.storeRefreshToken(email, null, expirationInMinutes));
    }

    @Test
    void testInvalidateRefreshToken_nullEmail() {
        // Assert
        // Expecting a NullPointerException
        assertThrows(NullPointerException.class, () -> refreshTokenRedisService.invalidateRefreshToken(null));
    }

    @Test
    void testGetRefreshToken_nullEmail() {
        // Assert
        // Expecting a NullPointerException
        assertThrows(NullPointerException.class, () -> refreshTokenRedisService.getRefreshToken(null));
    }
}