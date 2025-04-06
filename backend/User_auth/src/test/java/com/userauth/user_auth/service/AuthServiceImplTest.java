package com.userauth.user_auth.service;

import com.userauth.user_auth.auth.AuthenticationRequest;
import com.userauth.user_auth.auth.AuthenticationResponse;
import com.userauth.user_auth.auth.RegisterRequest;
import com.userauth.user_auth.enums.UserAuthority;
import com.userauth.user_auth.model.*;
import com.userauth.user_auth.repository.UserInfoRepository;
import com.userauth.user_auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @InjectMocks
    private AuthServiceImpl authService;

    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private UserRepository userRepository;
    @Mock private UserInfoRepository userInfoRepository;
    @Mock private MapperService<UserDTO, User> userMapperService;
    @Mock private MapperService<UserInfoDTO, UserInfo> userInfoMapperService;
    @Mock private RefreshTokenService refreshTokenService;
    @Mock private JwtBlacklistService jwtBlacklistService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ------------------------
    // Tenant Signup
    // ------------------------
    @Test
    void tenantSignup_shouldRegisterTenantAndReturnTokens() {
        RegisterRequest request = getRegisterRequest();
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");
        when(jwtService.generateJwtToken(anyString(), anyLong()))
                .thenReturn("jwt-token")
                .thenReturn("refresh-token");

        ResponseEntity<AuthenticationResponse> response = authService.tenantSignup(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("jwt-token", response.getBody().getToken());
        assertEquals("refresh-token", response.getBody().getRefreshToken());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertInstanceOf(User.class, savedUser);
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals(UserAuthority.TENANT, savedUser.getAuthority());
        assertEquals("encoded-password", savedUser.getPassword());
    }


    // ------------------------
    // Landlord Signup
    // ------------------------
    @Test
    void landlordSignup_shouldRegisterLandlordAndReturnTokens() {
        RegisterRequest request = getRegisterRequest();
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");
        when(jwtService.generateJwtToken(anyString(), anyLong()))
                .thenReturn("jwt-token")
                .thenReturn("refresh-token");

        ResponseEntity<AuthenticationResponse> response = authService.landlordSignup(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("jwt-token", response.getBody().getToken());
        assertEquals("refresh-token", response.getBody().getRefreshToken());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertInstanceOf(User.class, savedUser);
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals(UserAuthority.LANDLORD, savedUser.getAuthority());
        assertEquals("encoded-password", savedUser.getPassword());
    }


    // ------------------------
    // Login
    // ------------------------
    @Test
    void login_shouldAuthenticateUserAndReturnTokens() {
        AuthenticationRequest request = new AuthenticationRequest("test@example.com", "password");
        User user = User.builder().email(request.getEmail()).password("encoded").build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPassword())).thenReturn(true);
        when(jwtService.generateJwtToken(anyString(), anyLong())).thenReturn("jwt-token", "refresh-token");

        ResponseEntity<AuthenticationResponse> response = authService.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(Objects.requireNonNull(response.getBody()).getToken());

        // Update to match the expected argument for expiration (1440L)
        verify(refreshTokenService).storeRefreshToken(eq("test@example.com"), eq("refresh-token"), eq(1440L));
    }

    @Test
    void login_shouldThrowExceptionForWrongPassword() {
        AuthenticationRequest request = new AuthenticationRequest("test@example.com", "wrong");
        User user = User.builder().email(request.getEmail()).password("encoded").build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPassword())).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }

    // ------------------------
    // Refresh Token
    // ------------------------
    @Test
    void refreshToken_shouldReturnNewTokens() {
        String refreshToken = "refresh-token";
        when(jwtService.isJwtTokenExpired(refreshToken)).thenReturn(false);
        when(jwtService.extractUserEmail(refreshToken)).thenReturn("user@example.com");
        when(refreshTokenService.getRefreshToken("user@example.com")).thenReturn(refreshToken);
        when(jwtService.generateJwtToken(anyString(), anyLong())).thenReturn("new-token", "new-refresh-token");

        ResponseEntity<AuthenticationResponse> response = authService.refreshToken(refreshToken);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Updated verify to expect Long type for the third argument
        verify(refreshTokenService).invalidateRefreshToken("user@example.com");
        verify(refreshTokenService).storeRefreshToken(eq("user@example.com"), eq("new-refresh-token"), eq(1440L));  // Corrected to use Long
    }



    // ------------------------
    // Token Auth
    // ------------------------
    @Test
    void authenticateUser_shouldReturnTrueForValidToken() {
        String token = "token";
        when(jwtService.extractUserEmail(token)).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(new User()));
        when(jwtService.isJwtTokenValid(token)).thenReturn(true);

        ResponseEntity<Boolean> result = authService.authenticateUser(token);

        assertEquals(Boolean.TRUE, result.getBody());
    }

    // ------------------------
    // Logout
    // ------------------------
    @Test
    void logout_shouldBlacklistToken() {
        String token = "expired-token";
        Date expiration = new Date();
        when(jwtService.extractExpiration(token)).thenReturn(expiration);

        ResponseEntity<String> result = authService.logout(token);

        assertEquals("success", result.getBody());
        verify(jwtBlacklistService).blacklistToken(token, expiration);
    }

    // ------------------------
    // Get User Info
    // ------------------------
//    @Test
//    void getUserInfo_shouldReturnUserInfoIfAuthorized() {
//        String token = "token";
//        Long userId = 1L;
//        String email = "user@example.com";
//
//        User user = User.builder().id(1L).email(email).authority(UserAuthority.TENANT).build();
//        User requestedUser = User.builder().id(1L).email(email).build();
//        UserInfo userInfo = UserInfo.builder().id(1L).user(requestedUser).build();
//        UserInfoDTO userInfoDTO = UserInfoDTO.builder().id(1L).build();
//
//        // Mocking the JWT and repository methods
//        when(jwtService.extractUserEmail(token)).thenReturn(email);
//        when(userRepository.findById(userId)).thenReturn(Optional.of(requestedUser));
//        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
//        when(userInfoRepository.findByUser(user)).thenReturn(Optional.of(userInfo));
//        when(userInfoMapperService.toDTO(userInfo)).thenReturn(userInfoDTO);
//
//        // Mock the refreshTokenService methods to avoid side effects
//        when(refreshTokenService.getRefreshToken(anyString())).thenReturn(String.valueOf(Optional.empty()));
//        doNothing().when(refreshTokenService).invalidateRefreshToken(anyString());
//
//
//        // Perform the method under test
//        ResponseEntity<UserInfoDTO> result = authService.getUserInfo(token, userId);
//
//        // Debugging: Print the response body to see what's returned
//        System.out.println("Response Body: " + result.getBody());
//
//        // Assertions to validate the result
//        assertEquals(HttpStatus.OK, result.getStatusCode());
//        assertEquals(userInfoDTO, result.getBody());
//    }



    // ------------------------
    // Get Logged In User
    // ------------------------
//    @Test
//    void getLoggedInUser_shouldReturnUserDTOIfValidToken() {
//        String token = "valid-token";
//        String email = "user@example.com";
//        User user = new User();
//        user.setEmail(email);  // Ensure user has the expected email
//        user.setId(1L);        // Set the ID for the user
//
//        UserDTO userDTO = UserDTO.builder().id(1L).build();
//
//        when(jwtService.isJwtTokenValid(token)).thenReturn(true);
//        when(jwtService.extractUserEmail(token)).thenReturn(email);
//        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
//        when(userMapperService.toDTO(user)).thenReturn(userDTO);  // Ensure this mock returns the expected UserDTO
//
//        ResponseEntity<UserDTO> response = authService.getLoggedInUser(token);
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        assertNotNull(response.getBody());  // Ensure body is not null
//        assertEquals(userDTO, response.getBody());  // Assert that the response body matches the expected UserDTO
//    }


    // ------------------------
    // Utility Method Tests
    // ------------------------
    @Test
    void isEmailExist_shouldReturnTrueIfExists() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(new User()));
        assertTrue(authService.isEmailExist("test@example.com"));
    }

    @Test
    void isCorrectEmailFormat_shouldReturnTrueForValidEmail() {
        assertTrue(authService.isCorrectEmailFormat("email@example.com"));
    }

    @Test
    void isCorrectEmailFormat_shouldReturnFalseForInvalidEmail() {
        assertFalse(authService.isCorrectEmailFormat("invalid-email"));
    }

    // ------------------------
    // Helper Method
    // ------------------------
    private RegisterRequest getRegisterRequest() {
        return RegisterRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("test@example.com")
                .password("1234")
                .phoneNumber("1234567890")
                .build();
    }
}
