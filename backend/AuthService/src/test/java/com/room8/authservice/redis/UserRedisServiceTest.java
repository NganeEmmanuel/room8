package com.room8.authservice.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.authservice.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link UserRedisService} class.
 */
@ExtendWith(MockitoExtension.class)
class UserRedisServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private UserRedisService userRedisService;

    private String email;
    private User user;
    private long expirationInMinutes;

    @BeforeEach
    void setUp() {
        email = "testuser@example.com";
        user = new User(); // Assuming a default constructor exists
        expirationInMinutes = 5;

        // Mock redisTemplate.opsForValue() to return the mocked ValueOperations instance
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testStoreUserInformation() throws JsonProcessingException {
        // Arrange
        String userJson = "{\"name\":\"Test User\"}"; // Example JSON representation
        when(objectMapper.writeValueAsString(user)).thenReturn(userJson);

        // Act
        userRedisService.storeUserInformation(email, user, expirationInMinutes);

        // Assert
        verify(valueOperations).set(
                "auth:user_email_:" + email, userJson, expirationInMinutes, TimeUnit.MINUTES);
    }

    @Test
    void testGetUserInformation() throws JsonProcessingException {
        // Arrange
        String userJson = "{\"name\":\"Test User\"}";
        when(valueOperations.get("auth:user_email_:" + email)).thenReturn(userJson);
        when(objectMapper.readValue(userJson, User.class)).thenReturn(user);

        // Act
        Optional<User> retrievedUser = userRedisService.getUserInformation(email);

        // Assert
        assertTrue(retrievedUser.isPresent());
        assertEquals(user, retrievedUser.get());
    }

    @Test
    void testGetUserInformation_notFound() {
        // Arrange
        when(valueOperations.get("auth:user_email_:" + email)).thenReturn(null);

        // Act
        Optional<User> retrievedUser = userRedisService.getUserInformation(email);

        // Assert
        assertFalse(retrievedUser.isPresent()); // Assert that no user is found
    }

    @Test
    void testInvalidateUserInformation() {
        // Act
        userRedisService.invalidateUserInformation(email);

        // Assert
        verify(redisTemplate).delete("auth:user_email_:" + email);
    }

    @Test
    void testStoreUserInformation_nullEmail() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                userRedisService.storeUserInformation(null, user, expirationInMinutes)
        );
    }

    @Test
    void testStoreUserInformation_nullUser() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                userRedisService.storeUserInformation(email, null, expirationInMinutes)
        );
    }

    @Test
    void testStoreUserInformation_zeroExpiration() {
        // Assert
        assertThrows(IllegalArgumentException.class, () ->
                userRedisService.storeUserInformation(email, user, 0)
        );
    }

    @Test
    void testStoreUserInformation_negativeExpiration() {
        // Assert
        assertThrows(IllegalArgumentException.class, () ->
                userRedisService.storeUserInformation(email, user, -1)
        );
    }

    @Test
    void testGetUserInformation_nullEmail() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                userRedisService.getUserInformation(null)
        );
    }

    @Test
    void testInvalidateUserInformation_nullEmail() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                userRedisService.invalidateUserInformation(null)
        );
    }
}