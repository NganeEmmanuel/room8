package com.room8.authservice.utils;

import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.exception.UserNotFoundException;
import com.room8.authservice.model.User;
import com.room8.authservice.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link EmailUtils} class.
 */
@ExtendWith(MockitoExtension.class)
class EmailUtilsTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserServiceClient userServiceClient;

    @InjectMocks
    private EmailUtils emailUtils;

    private String validEmail;
    private String invalidEmail;
    private String emptyEmail;

    @BeforeEach
    void setUp() {
        validEmail = "test.user@example.com";
        invalidEmail = "invalid-email";
        emptyEmail = "";
    }

    @Test
    void testIsEmailNotExist_emailDoesNotExist() {
        // Arrange
        when(userServiceClient.getUserFromEmail(validEmail)).thenThrow(new UserNotFoundException("User not found"));

        // Act
        Boolean result = emailUtils.isEmailNotExist(validEmail);

        // Assert
        assertTrue(result); // Email does not exist
    }

    @Test
    void testIsEmailNotExist_emailExists() {
        // Arrange
        User mockUser = new User(); // Create a mock User object
        when(userServiceClient.getUserFromEmail(validEmail)).thenReturn(ResponseEntity.ok(mockUser)); // Mock a user exists

        // Act
        Boolean result = emailUtils.isEmailNotExist(validEmail);

        // Assert
        assertFalse(result); // Email exists
    }

    @Test
    void testIsCorrectEmailFormat_validEmail() {
        // Act
        Boolean result = emailUtils.isCorrectEmailFormat(validEmail);

        // Assert
        assertTrue(result); // Valid email format
    }

    @Test
    void testIsCorrectEmailFormat_invalidEmail() {
        // Act
        Boolean result = emailUtils.isCorrectEmailFormat(invalidEmail);

        // Assert
        assertFalse(result); // Invalid email format
    }

    @Test
    void testIsCorrectEmailFormat_emptyEmail() {
        // Act
        Boolean result = emailUtils.isCorrectEmailFormat(emptyEmail);

        // Assert
        assertFalse(result); // Empty email is invalid
    }

    @Test
    void testExtractEmailFromToken_validToken() {
        // Arrange
        String token = "valid_token";
        String expectedEmail = "user@example.com";
        when(jwtService.extractUserEmail(token)).thenReturn(expectedEmail);

        // Act
        String result = emailUtils.extractEmailFromToken(token);

        // Assert
        assertEquals(expectedEmail, result); // Extracted email matches
    }

    @Test
    void testExtractEmailFromToken_invalidToken() {
        // Arrange
        String invalidToken = "invalid_token";
        when(jwtService.extractUserEmail(invalidToken)).thenThrow(new RuntimeException("Invalid token"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> emailUtils.extractEmailFromToken(invalidToken));
    }
}