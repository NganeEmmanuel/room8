package com.room8.authservice.service;

import com.room8.authservice.client.ContactServiceClient;
import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.dto.AuthenticationResponse;
import com.room8.authservice.dto.RegisterRequest;
import com.room8.authservice.enums.UserAuthority;
import com.room8.authservice.exception.DuplicateEmailException;
import com.room8.authservice.exception.EmailSendingException;
import com.room8.authservice.model.Tenant;
import com.room8.authservice.model.UserRole;
import com.room8.authservice.redis.*;
import com.room8.authservice.utils.EmailUtils;
import com.room8.authservice.utils.RoleUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link UserRegistrationService} class.
 */
@ExtendWith(MockitoExtension.class)
class UserRegistrationServiceTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserServiceClient userServiceClient;

    @Mock
    private RefreshTokenRedisService refreshTokenRedisService;

    @Mock
    private UserRedisService userRedisService;

    @Mock
    private EmailVerificationRedisService emailVerificationRedisService;

    @Mock
    private OTPRedisService otpRedisService;

    @Mock
    private ContactServiceClient contactServiceClient;

    @Mock
    private EmailUtils emailUtils;

    @Mock
    private RoleUtil roleUtil;

    @InjectMocks
    private UserRegistrationService userRegistrationService;

    private RegisterRequest registerRequest;
    private Tenant user;
    private UserAuthority userAuthority;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("John", "Doe", "john.doe@example.com", "password", "1234567890", "1234");
        user = new Tenant(); // Create a mock Tenant object
        userAuthority = UserAuthority.TENANT;
    }

    @Test
    void testRegisterUser_success() {
        // Arrange
        registerRequest.setEmail("john.doe@example.com"); // Ensure the email is set in the request
        when(emailUtils.isEmailNotExist(registerRequest.getEmail())).thenReturn(true);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encoded_password");

        // Ensure the user object returned has the correct email
        user.setEmail(registerRequest.getEmail());
        when(userServiceClient.addUser(any())).thenReturn(ResponseEntity.ok(user));
        when(roleUtil.generateRole(userAuthority)).thenReturn(List.of(new UserRole())); // Mock role
        when(jwtService.generateTokenWithRoles(any(), any(), anyLong())).thenReturn("jwt_token");
        when(jwtService.generateJwtToken(any(), anyLong())).thenReturn("email_token");
        when(contactServiceClient.sendVerificationEmail(any())).thenReturn(ResponseEntity.ok(true));

        // Act
        AuthenticationResponse response = userRegistrationService.registerUser(registerRequest, userAuthority);

        // Assert
        assertNotNull(response);
        assertEquals("jwt_token", response.getToken());

        // Verify calls with the expected email
        verify(refreshTokenRedisService).storeRefreshToken(eq(registerRequest.getEmail()), anyString(), eq(1440L));
        verify(emailVerificationRedisService).storeEmailToken(eq(registerRequest.getEmail()), eq("email_token"), eq(30L));
        verify(otpRedisService).storeOTP(eq(registerRequest.getPhoneNumber()), eq(registerRequest.getOtp()), eq(30L));
    }

    @Test
    void testRegisterUser_duplicateEmail() {
        // Arrange
        when(emailUtils.isEmailNotExist(registerRequest.getEmail())).thenReturn(false);

        // Act & Assert
        assertThrows(DuplicateEmailException.class, () ->
                userRegistrationService.registerUser(registerRequest, userAuthority)
        );
    }

    @Test
    void testRegisterUser_emailSendingFailure() {
        // Arrange
        when(emailUtils.isEmailNotExist(registerRequest.getEmail())).thenReturn(true);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encoded_password");
        when(userServiceClient.addUser(any())).thenReturn(ResponseEntity.ok(user));
        when(roleUtil.generateRole(userAuthority)).thenReturn(List.of(new UserRole())); // Mock role
        when(jwtService.generateTokenWithRoles(any(), any(), anyLong())).thenReturn("jwt_token");
        when(jwtService.generateJwtToken(any(), anyLong())).thenReturn("email_token");
        when(contactServiceClient.sendVerificationEmail(any())).thenReturn(ResponseEntity.ok(false));

        // Act & Assert
        assertThrows(EmailSendingException.class, () ->
                userRegistrationService.registerUser(registerRequest, userAuthority)
        );
    }

    @Test
    void testRegisterUser_assertions() {
        // Arrange
        when(emailUtils.isEmailNotExist(registerRequest.getEmail())).thenReturn(true);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encoded_password");
        when(userServiceClient.addUser(any())).thenReturn(ResponseEntity.ok(user));
        when(roleUtil.generateRole(userAuthority)).thenReturn(List.of(new UserRole())); // Mock role
        when(jwtService.generateTokenWithRoles(any(), any(), anyLong())).thenReturn("jwt_token");
        when(jwtService.generateJwtToken(any(), anyLong())).thenReturn("email_token");
        when(contactServiceClient.sendVerificationEmail(any())).thenReturn(ResponseEntity.ok(true));
        user.setEmail(registerRequest.getEmail()); // Set email for assertions

        // Act
        AuthenticationResponse response = userRegistrationService.registerUser(registerRequest, userAuthority);

        // Assert
        assertNotNull(response);
        assertEquals(user.getEmail(), registerRequest.getEmail());
    }
}