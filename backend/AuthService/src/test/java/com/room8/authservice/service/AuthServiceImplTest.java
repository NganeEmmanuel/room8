package com.room8.authservice.service;

import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.dto.AuthenticationRequest;
import com.room8.authservice.dto.AuthenticationResponse;
import com.room8.authservice.dto.RegisterRequest;
import com.room8.authservice.dto.UserDTO;
import com.room8.authservice.enums.UserAuthority;
import com.room8.authservice.exception.*;
import com.room8.authservice.model.Tenant;
import com.room8.authservice.redis.*;
import com.room8.authservice.utils.RoleUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the {@link AuthServiceImpl} class.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserServiceClient userServiceClient;

    @Mock
    private MapperService<UserDTO, Tenant> userMapperService;

    @Mock
    private RefreshTokenRedisService refreshTokenRedisService;

    @Mock
    private JwtBlacklistRedisService jwtBlacklistRedisService;

    @Mock
    private UserRedisService userRedisService;

    @Mock
    private EmailVerificationRedisService emailVerificationRedisService;

    @Mock
    private OTPRedisService otpRedisService;

    @Mock
    private UserRegistrationService userRegistrationService;

    @Mock
    private RoleUtil roleUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private AuthenticationRequest authenticationRequest;
    private Tenant user;
    private Tenant returnUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("John", "Doe", "john.doe@example.com", "password123", "1234567890");
        authenticationRequest = new AuthenticationRequest("john.doe@example.com", "password123");
        user = new Tenant();
        returnUser = new Tenant();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // Mock encoded password
        user.setRole(Collections.emptyList()); // Assuming roles can be empty for testing
    }

    @Test
    void testTenantSignup_success() {
        // Arrange
        when(userRegistrationService.registerUser(any(), eq(UserAuthority.TENANT))).thenReturn(new AuthenticationResponse("jwt_token", "refresh_token"));

        // Act
        AuthenticationResponse response = authService.tenantSignup(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt_token", response.getToken());
        assertEquals("refresh_token", response.getRefreshToken());
    }

    @Test
    void testLandlordSignup_success() {
        // Arrange
        when(userRegistrationService.registerUser(any(), eq(UserAuthority.LANDLORD))).thenReturn(new AuthenticationResponse("jwt_token", "refresh_token"));

        // Act
        AuthenticationResponse response = authService.landlordSignup(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt_token", response.getToken());
        assertEquals("refresh_token", response.getRefreshToken());
    }

    @Test
    void testLogin_success() {
        // Arrange
        String email = "john.doe@example.com";
        authenticationRequest.setEmail(email);

        // Set up the user object
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("password123")); // Ensure the password matches

        when(userRedisService.getUserInformation(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(true);
        when(roleUtil.getRoleList(any())).thenReturn(Collections.emptyList());
        when(jwtService.generateTokenWithRoles(eq(email), any(), anyLong())).thenReturn("jwt_token");

        // Set up the void method correctly
        doNothing().when(refreshTokenRedisService).storeRefreshToken(eq(email), anyString(), eq(60 * 24L)); // Ensure matching arguments

        // Act
        AuthenticationResponse response = authService.login(authenticationRequest);

        // Assert
        assertNotNull(response);
        assertEquals("jwt_token", response.getToken());
    }

    @Test
    void testLogin_invalidCredentials() {
        // Arrange
        when(userRedisService.getUserInformation(authenticationRequest.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword())).thenReturn(false);

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.login(authenticationRequest));
    }

    @Captor
    ArgumentCaptor<Date> dateCaptor;

    @Test
    void testLogout_success() {
        // Arrange
        String token = "valid_token";
        Date expiration = new Date(); // freeze the expected expiration
        when(jwtService.extractExpiration(token)).thenReturn(expiration);

        // Act
        String result = authService.logout(token);

        // Assert
        assertEquals("success", result);

        verify(jwtBlacklistRedisService).blacklistToken(eq(token), dateCaptor.capture());
        assertEquals(expiration.getTime(), dateCaptor.getValue().getTime());
    }


    @Test
    void testRefreshToken_success() {
        // Arrange
        String refreshToken = "valid_refresh_token";
        when(jwtService.isJwtTokenValid(refreshToken)).thenReturn(true);
        when(jwtService.extractUserEmail(refreshToken)).thenReturn(user.getEmail());
        when(refreshTokenRedisService.getRefreshToken(user.getEmail())).thenReturn(refreshToken);
        when(userRedisService.getUserInformation(user.getEmail())).thenReturn(Optional.of(user));
        when(roleUtil.getRoleList(any())).thenReturn(Collections.emptyList());
        when(jwtService.generateTokenWithRoles(any(), any(), anyLong())).thenReturn("new_jwt_token");

        // Act
        AuthenticationResponse response = authService.refreshToken(refreshToken);

        // Assert
        assertEquals("new_jwt_token", response.getToken());
        verify(refreshTokenRedisService).invalidateRefreshToken(user.getEmail());
        verify(refreshTokenRedisService).storeRefreshToken(eq(user.getEmail()), anyString(), eq(60 * 24L));
    }

    @Test
    void testRefreshToken_expiredRefreshToken() {
        // Arrange
        String expiredToken = "expired_refresh_token";
        when(jwtService.isJwtTokenValid(expiredToken)).thenReturn(true);

        // Act & Assert
        assertThrows(InvalidTokenException.class, () -> authService.refreshToken(expiredToken));
    }

    @Test
    void testAuthenticateUser_success() {
        // Arrange
        String token = "valid_token";
        when(jwtService.extractUserEmail(token)).thenReturn(user.getEmail());
        when(userRedisService.getUserInformation(user.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.isJwtTokenValid(token)).thenReturn(true);

        // Act
        Boolean result = authService.authenticateUser(token);

        // Assert
        assertTrue(result);
    }

    @Test
    void testAuthenticateUser_invalidToken() {
        // Arrange
        String token = "invalid_token";
        when(jwtService.extractUserEmail(token)).thenReturn(user.getEmail());
        when(userRedisService.getUserInformation(user.getEmail())).thenReturn(Optional.of(user));

        // Act & Assert
        assertFalse(authService.authenticateUser(token));
    }

    @Test
    void testGetLoggedInUser_success() {
        // Arrange
        String token = "valid_token";
        when(jwtService.isJwtTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserEmail(token)).thenReturn(user.getEmail());
        when(userRedisService.getUserInformation(user.getEmail())).thenReturn(Optional.of(user));
        when(userMapperService.toDTO(user)).thenReturn(new UserDTO());

        // Act
        UserDTO loggedInUser = authService.getLoggedInUser(token);

        // Assert
        assertNotNull(loggedInUser);
    }

    @Test
    void testGetLoggedInUser_invalidToken() {
        // Arrange
        String token = "invalid_token";
        when(jwtService.isJwtTokenValid(token)).thenReturn(false);

        // Act & Assert
        assertThrows(InvalidTokenException.class, () -> authService.getLoggedInUser(token));
    }

    @Test
    void testMarkedAsEmailVerified_success() {
        // Arrange
        String email = "john.doe@example.com";
        String token = "valid_token";

        // Set up the user object
        user.setEmail(email);
        user.setIsEmailVerified(Boolean.FALSE); // Initially not verified

        // Set up returnUser to show that it should now be verified
        Tenant returnUser = new Tenant();
        returnUser.setEmail(email);
        returnUser.setIsEmailVerified(Boolean.TRUE); // Simulate that the returnUser is now verified

        when(userRedisService.getUserInformation(email)).thenReturn(Optional.of(user));
        when(emailVerificationRedisService.getEmailToken(email)).thenReturn(token);
        when(userServiceClient.markUserAsEmailVerified(email)).thenReturn(ResponseEntity.ok(returnUser));

        // Act
        Boolean result = authService.markedAsEmailVerified(email, token);

        // Assert
        assertTrue(result);
        verify(emailVerificationRedisService).invalidateEmailToken(email);

        // Verify that the user object is updated to reflect the verification
        user.setIsEmailVerified(Boolean.FALSE); // Reset state for verification
        verify(userRedisService).updateUserInformation(eq(email), argThat(updatedUser ->
                email.equals(updatedUser.getEmail()) &&
                        Boolean.TRUE.equals(updatedUser.getIsEmailVerified())
        ), eq(300L));

    }

    @Test
    void testMarkedAsEmailVerified_invalidToken() {
        // Arrange
        user.setIsEmailVerified(Boolean.FALSE);
        String email = "john.doe@example.com";
        String token = "invalid_token";
        when(userRedisService.getUserInformation(email)).thenReturn(Optional.of(user));
        when(emailVerificationRedisService.getEmailToken(email)).thenReturn("different_token");

        // Act & Assert
        assertThrows(InvalidEmailVerificationTokenException.class, () ->
                authService.markedAsEmailVerified(email, token)
        );
    }

    @Test
    void testMarkedAsPhoneVerified_success() {
        // Arrange
        String phoneNumber = "1234567890";
        String otp = "1234";

        // Ensure user has the correct email and phone verification status
        user.setEmail("john.doe@example.com");
        user.setIsPhoneVerified(Boolean.FALSE);

        returnUser.setEmail(user.getEmail()); // Ensure returnUser has the same email
        returnUser.setIsPhoneVerified(Boolean.TRUE);

        when(userServiceClient.getUserFromPhoneNumber(phoneNumber)).thenReturn(ResponseEntity.ok(user));
        when(otpRedisService.getOTP(phoneNumber)).thenReturn(otp);
        when(userServiceClient.markUserAsPhoneVerified(phoneNumber)).thenReturn(ResponseEntity.ok(returnUser));

        // Act
        Boolean result = authService.markedAsPhoneVerified(phoneNumber, otp);

        // Assert
        assertTrue(result);
        verify(otpRedisService).invalidateOTP(phoneNumber);
        verify(userRedisService).updateUserInformation(eq(user.getEmail()), eq(returnUser), eq(300L)); // Ensure matching arguments
    }

    @Test
    void testMarkedAsPhoneVerified_invalidOtp() {
        // Arrange
        String phoneNumber = "1234567890";
        String otp = "wrong_otp";
        user.setIsPhoneVerified(Boolean.FALSE);
        when(userServiceClient.getUserFromPhoneNumber(phoneNumber)).thenReturn(ResponseEntity.ok(user));
        when(otpRedisService.getOTP(phoneNumber)).thenReturn("correct_otp");

        // Act & Assert
        assertThrows(InvalidPhoneVerificationTokenException.class, () ->
                authService.markedAsPhoneVerified(phoneNumber, otp)
        );
    }
}