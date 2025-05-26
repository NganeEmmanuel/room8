package com.room8.authservice.service;

import com.room8.authservice.redis.JwtBlacklistRedisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link JwtBlacklistRedisService}.
 * This test class verifies the correct behavior of blacklisting JWT tokens in Redis
 * and checking whether a token is blacklisted.
 */
@ExtendWith(MockitoExtension.class)
class JwtBlacklistServiceTest {

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
        verify(valueOperations).set(
                eq("blacklist:" + jwtToken),
                eq("true"),
                anyLong(),
                eq(TimeUnit.MILLISECONDS)
        );
    }

    /**
     * Test that checking for a blacklisted token returns true if key exists in Redis.
     */
    @Test
    void testIsTokenBlacklisted_whenTokenIsBlacklisted_returnsTrue() {
        // Arrange
        when(redisTemplate.hasKey("blacklist:" + jwtToken)).thenReturn(true);

        // Act & Assert
        assertTrue(jwtBlacklistRedisService.isTokenBlacklisted(jwtToken));
    }

    /**
     * Test that checking for a non-blacklisted token returns false.
     */
    @Test
    void testIsTokenBlacklisted_whenTokenIsNotBlacklisted_returnsFalse() {
        // Arrange
        when(redisTemplate.hasKey("blacklist:" + jwtToken)).thenReturn(false);

        // Act & Assert
        assertFalse(jwtBlacklistRedisService.isTokenBlacklisted(jwtToken));
    }
}
