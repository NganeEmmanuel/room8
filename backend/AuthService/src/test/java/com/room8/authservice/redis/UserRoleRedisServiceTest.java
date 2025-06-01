package com.room8.authservice.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.authservice.model.UserRole;
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
 * Unit tests for the {@link UserRoleRedisService} class.
 */
@ExtendWith(MockitoExtension.class)
class UserRoleRedisServiceTest {

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private UserRoleRedisService userRoleRedisService;

    private String role;
    private UserRole userRole;
    private long expirationInMinutes;

    @BeforeEach
    void setUp() {
        role = "ADMIN";
        userRole = new UserRole(); // Assuming a default constructor exists
        expirationInMinutes = 5;

        // Mock redisTemplate.opsForValue() to return the mocked ValueOperations instance
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void testStoreUserRole() throws JsonProcessingException {
        // Arrange
        String userRoleJson = "{\"name\":\"Admin Role\"}"; // Example JSON representation
        when(objectMapper.writeValueAsString(userRole)).thenReturn(userRoleJson);

        // Act
        userRoleRedisService.storeUserRole(role, userRole, expirationInMinutes);

        // Assert
        verify(valueOperations).set(
                "auth:user_role_:" + role, userRoleJson, expirationInMinutes, TimeUnit.MINUTES);
    }

    @Test
    void testGetUserRole() throws JsonProcessingException {
        // Arrange
        String userRoleJson = "{\"name\":\"Admin Role\"}";
        when(valueOperations.get("auth:user_role_:" + role)).thenReturn(userRoleJson);
        when(objectMapper.readValue(userRoleJson, UserRole.class)).thenReturn(userRole);

        // Act
        UserRole retrievedRole = userRoleRedisService.getUserRole(role);

        // Assert
        assertEquals(userRole, retrievedRole);
    }

    @Test
    void testGetUserRole_notFound() {
        // Arrange
        when(valueOperations.get("auth:user_role_:" + role)).thenReturn(null);

        // Act
        UserRole retrievedRole = userRoleRedisService.getUserRole(role);

        // Assert
        assertNull(retrievedRole); // Assert that null is returned if UserRole is not found
    }

    @Test
    void testInvalidateUserRole() {
        // Act
        userRoleRedisService.invalidateUserRole(role);

        // Assert
        verify(redisTemplate).delete("auth:user_role_:" + role);
    }

    @Test
    void testStoreUserRole_nullRole() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                userRoleRedisService.storeUserRole(null, userRole, expirationInMinutes)
        );
    }

    @Test
    void testStoreUserRole_nullUserRole() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                userRoleRedisService.storeUserRole(role, null, expirationInMinutes)
        );
    }

    @Test
    void testStoreUserRole_zeroExpiration() {
        // Assert
        assertThrows(IllegalArgumentException.class, () ->
                userRoleRedisService.storeUserRole(role, userRole, 0)
        );
    }

    @Test
    void testStoreUserRole_negativeExpiration() {
        // Assert
        assertThrows(IllegalArgumentException.class, () ->
                userRoleRedisService.storeUserRole(role, userRole, -1)
        );
    }

    @Test
    void testGetUserRole_nullRole() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                userRoleRedisService.getUserRole(null)
        );
    }

    @Test
    void testInvalidateUserRole_nullRole() {
        // Assert
        assertThrows(NullPointerException.class, () ->
                userRoleRedisService.invalidateUserRole(null)
        );
    }
}