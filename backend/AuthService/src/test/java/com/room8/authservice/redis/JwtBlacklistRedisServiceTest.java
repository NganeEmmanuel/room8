package com.room8.authservice.redis;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link JwtBlacklistRedisService}.
 * This test class verifies the correct behavior of blacklisting JWT tokens in Redis
 * and checking whether a token is blacklisted.
 */
@ExtendWith(MockitoExtension.class)
class JwtBlacklistRedisServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private JwtBlacklistRedisService jwtBlacklistRedisService;

    private String jwtToken;
    private Date futureExpirationDate;

    /**
     * Initialize test data and common mocking behavior.
     */
    @BeforeEach
    void setUp() {
        jwtToken = "sample.jwt.token";
        futureExpirationDate = new Date(System.currentTimeMillis() + 60000); // 1 minute in future

        // Allow redisTemplate.opsForValue() to return the mock ValueOperations object
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    /**
     * Test that blacklisting a token stores it in Redis with correct TTL.
     */
    @Test
    void testBlacklistToken_storesTokenInRedis() {
        // Act
        jwtBlacklistRedisService.blacklistToken(jwtToken, futureExpirationDate);

        // Assert
        ArgumentCaptor<Long> expirationCaptor = ArgumentCaptor.forClass(Long.class);

        verify(valueOperations).set(
                eq("auth:blacklist:" + jwtToken),
                eq("true"),
                expirationCaptor.capture(),
                eq(TimeUnit.MILLISECONDS)
        );

        long actualExpiration = expirationCaptor.getValue();
        long expectedExpiration = futureExpirationDate.getTime() - System.currentTimeMillis();

        // Allow slight drift of ±10ms
        assertTrue(Math.abs(actualExpiration - expectedExpiration) < 10,
                "Expiration time drifted by more than 10ms");
    }


    /**
     * Test that checking for a blacklisted token returns true if key exists in Redis.
     */
    @Test
    void testIsTokenBlacklisted_whenTokenIsBlacklisted_returnsTrue() {
        // Arrange
        when(redisTemplate.hasKey("auth:blacklist:" + jwtToken)).thenReturn(true);

        // Act & Assert
        assertTrue(jwtBlacklistRedisService.isTokenBlacklisted(jwtToken));
    }

    /**
     * Test that checking for a non-blacklisted token returns false.
     */
    @Test
    void testIsTokenBlacklisted_whenTokenIsNotBlacklisted_returnsFalse() {
        // Arrange
        when(redisTemplate.hasKey("auth:blacklist:" + jwtToken)).thenReturn(false);

        // Act & Assert
        assertFalse(jwtBlacklistRedisService.isTokenBlacklisted(jwtToken));
    }

    /**
     * Test that blacklisting a token with a past expiration date does not store the token.
     */
    @Test
    void testBlacklistToken_withPastExpirationDate_doesNotStoreToken() {
        // Arrange
        Date pastExpirationDate = new Date(System.currentTimeMillis() - 60000); // 1 minute in past

        // Act
        jwtBlacklistRedisService.blacklistToken(jwtToken, pastExpirationDate);

        // Assert
        verify(valueOperations, never()).set(anyString(), anyString(), anyLong(), any());
    }

    /**
     * Test that blacklisting a token with a zero expiration time triggers an immediate expiration.
     */
    @Test
    void testBlacklistToken_withZeroExpiration_doesNotStoreToken() {
        // Arrange
        Date zeroExpirationDate = new Date(System.currentTimeMillis()); // Current time

        // Act
        jwtBlacklistRedisService.blacklistToken(jwtToken, zeroExpirationDate);

        // Assert
        verify(valueOperations, never()).set(anyString(), anyString(), anyLong(), any());
    }

    /**
     * Test that checking for a null token returns false.
     */
    @Test
    void testIsTokenBlacklisted_whenTokenIsNull_returnsFalse() {
        // Act & Assert
        assertFalse(jwtBlacklistRedisService.isTokenBlacklisted(null));
    }
}