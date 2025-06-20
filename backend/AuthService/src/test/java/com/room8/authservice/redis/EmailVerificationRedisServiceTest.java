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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link EmailVerificationRedisService} class.
 */
@ExtendWith(MockitoExtension.class)
class EmailVerificationRedisServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @InjectMocks
    private EmailVerificationRedisService emailVerificationRedisService;

    private String email;
    private String emailToken;
    private long expirationInMinutes;

    @BeforeEach
    void setUp() {
        email = "testuser@example.com";
        emailToken = "sample-email-token";
        expirationInMinutes = 30;

        // Mock redisTemplate.opsForValue() to return the mocked ValueOperations instance
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testStoreEmailToken() {
        // Act
        emailVerificationRedisService.storeEmailToken(email, emailToken, expirationInMinutes);

        // Assert
        verify(valueOperations).set(
                "auth:emailToken_:" + email, emailToken, expirationInMinutes, TimeUnit.MINUTES);
    }

    @Test
    void testGetEmailToken() {
        // Arrange
        when(valueOperations.get("auth:emailToken_:" + email)).thenReturn(emailToken);

        // Act
        String retrievedToken = emailVerificationRedisService.getEmailToken(email);

        // Assert
        assertEquals(emailToken, retrievedToken);
    }

    @Test
    void testGetEmailToken_notFound() {
        // Arrange
        when(valueOperations.get("auth:emailToken_:" + email)).thenReturn(null);

        // Act
        String retrievedToken = emailVerificationRedisService.getEmailToken(email);

        // Assert
        assertNull(retrievedToken); // Assert that null is returned if token is not found
    }

    @Test
    void testInvalidateEmailToken() {
        // Act
        emailVerificationRedisService.invalidateEmailToken(email);

        // Assert
        verify(redisTemplate).delete("auth:emailToken_:" + email);
    }

    @Test
    void testStoreEmailToken_nullEmail() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                emailVerificationRedisService.storeEmailToken(null, emailToken, expirationInMinutes)
        );
    }

    @Test
    void testStoreEmailToken_nullToken() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                emailVerificationRedisService.storeEmailToken(email, null, expirationInMinutes)
        );
    }

    @Test
    void testInvalidateEmailToken_nullEmail() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                emailVerificationRedisService.invalidateEmailToken(null)
        );
    }

    @Test
    void testGetEmailToken_nullEmail() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                emailVerificationRedisService.getEmailToken(null)
        );
    }
}