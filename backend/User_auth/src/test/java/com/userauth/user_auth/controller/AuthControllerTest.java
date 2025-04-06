package com.userauth.user_auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.userauth.user_auth.auth.AuthenticationRequest;
import com.userauth.user_auth.auth.RegisterRequest;
import com.userauth.user_auth.auth.AuthenticationResponse;
import com.userauth.user_auth.model.User;
import com.userauth.user_auth.model.UserDTO;
import com.userauth.user_auth.model.UserInfoDTO;
import com.userauth.user_auth.service.AuthService;
import com.userauth.user_auth.service.JwtService;
import com.userauth.user_auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)  // Disable Spring Security filters (including CSRF protection)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    private AuthenticationResponse mockAuthResponse;

    @BeforeEach
    void setUp() {
        mockAuthResponse = AuthenticationResponse.builder()
                .token("jwt-token")
                .refreshToken("refresh-token")
                .build();
    }

    // ------------------------
    // Tenant Signup (Register) Test Case
    // ------------------------
    @Test
    void testTenantSignup() throws Exception {
        RegisterRequest request = getRegisterRequest();

        // Mock repository and service layer methods
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");
        when(jwtService.generateJwtToken(anyString(), anyLong())).thenReturn("jwt-token")
                .thenReturn("refresh-token");

        when(authService.tenantSignup(Mockito.any(RegisterRequest.class)))
                .thenReturn(ResponseEntity.ok(mockAuthResponse));

        // Perform the POST request to the /signup endpoint and check for success
        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())  // Expect HTTP status 200 OK
                .andExpect(jsonPath("$.token").value("jwt-token"))  // Verify the token in response
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"));  // Verify the refresh token in response

        // Verify that the AuthService's tenantSignup method was called
        verify(authService).tenantSignup(Mockito.any(RegisterRequest.class));
    }

    // ------------------------
    // Helper Method to Create RegisterRequest
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

    @Test
    void testLogin() throws Exception {
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("test@example.com")
                .password("1234")
                .build();

        AuthenticationResponse mockLoginResponse = AuthenticationResponse.builder()
                .token("jwt-token")
                .refreshToken("refresh-token")
                .build();

        // Mock the authService login method
        when(authService.login(Mockito.any(AuthenticationRequest.class)))
                .thenReturn(ResponseEntity.ok(mockLoginResponse));

        // Perform the POST request to /login endpoint and check for success
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())  // Expect HTTP status 200 OK
                .andExpect(jsonPath("$.token").value("jwt-token"))  // Verify the token in response
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"));  // Verify the refresh token in response

        // Verify that the login method was called
        verify(authService).login(Mockito.any(AuthenticationRequest.class));
    }

    @Test
    void testLogout() throws Exception {
        String token = "jwt-token";

        // Mock the authService logout method
        when(authService.logout(token)).thenReturn(ResponseEntity.ok("success"));

        // Perform the POST request to /logout endpoint and check for success
        mockMvc.perform(post("/api/v1/auth/logout")
                        .header("Authorization", "Bearer " + token))  // Pass token as Authorization header
                .andExpect(status().isOk())  // Expect HTTP status 200 OK
                .andExpect(content().string("success"));  // Verify response content

        // Verify that the logout method was called
        verify(authService).logout(token);
    }

//    @Test
//    void testRefreshToken() throws Exception {
//        String refreshToken = "refresh-token";
//
//        AuthenticationResponse mockRefreshResponse = AuthenticationResponse.builder()
//                .token("new-jwt-token")
//                .refreshToken("new-refresh-token")
//                .build();
//
//        // Mock the authService refreshToken method
//        when(authService.refreshToken(refreshToken)).thenReturn(ResponseEntity.ok(mockRefreshResponse));
//
//        // Perform the POST request to /refresh-token endpoint and check for success
//        mockMvc.perform(post("/api/v1/auth/refresh-token")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content("{\"refreshToken\": \"" + refreshToken + "\"}"))  // Wrap the refresh token in a JSON object
//                .andDo(print())  // This will print the response body to the console
//                .andExpect(status().isOk())  // Expect HTTP status 200 OK
//                .andExpect(jsonPath("$.token").value("new-jwt-token"))  // Verify the new token in response
//                .andExpect(jsonPath("$.refreshToken").value("new-refresh-token"));  // Verify the new refresh token in response
//
//        // Verify that the refreshToken method was called
//        verify(authService).refreshToken(refreshToken);
//    }


//    @Test
//    void testGetLoggedInUser() throws Exception {
//        String token = "jwt-token";
//
//        UserDTO mockUserDTO = UserDTO.builder()
//                .id(1L)
//                .firstName("John")
//                .lastName("Doe")
//                .email("test@example.com")
//                .build();
//
//        // Mock the authService getLoggedInUser method
//        when(authService.getLoggedInUser(token)).thenReturn(ResponseEntity.ok(mockUserDTO));
//
//        // Perform the GET request to /logged-in-user endpoint and check for success
//        mockMvc.perform(get("/api/v1/auth/logged-in-user")
//                        .header("Authorization", "Bearer " + token))  // Pass token as Authorization header
//                .andExpect(status().isOk())  // Expect HTTP status 200 OK
//                .andExpect(jsonPath("$.firstName").value("John"))  // Verify first name in response
//                .andExpect(jsonPath("$.lastName").value("Doe"))  // Verify last name in response
//                .andExpect(jsonPath("$.email").value("test@example.com"));  // Verify email in response
//
//        // Verify that the getLoggedInUser method was called
//        verify(authService).getLoggedInUser(token);
//    }

//    @Test
//    void testGetUserInfo() throws Exception {
//        String token = "jwt-token";
//        Long userId = 1L;
//        User user = User.builder().id(userId).build();
//
//        UserInfoDTO mockUserInfoDTO = UserInfoDTO.builder()
//                .aboutMe("John Doe")
//                .build();
//
//        // Mock the authService getUserInfo method
//        when(authService.getUserInfo(token, userId)).thenReturn(ResponseEntity.ok(mockUserInfoDTO));
//
//        // Perform the GET request to /user-info endpoint and check for success
//        mockMvc.perform(get("/api/v1/auth/user-info/{userId}", userId)
//                        .header("Authorization", "Bearer " + token))  // Pass token as Authorization header
//                .andExpect(status().isOk())  // Expect HTTP status 200 OK
//                .andExpect(jsonPath("$.userId").value(1L))  // Verify userId in response
//                .andExpect(jsonPath("$.fullName").value("John Doe"))  // Verify fullName in response
//                .andExpect(jsonPath("$.email").value("test@example.com"))  // Verify email in response
//                .andExpect(jsonPath("$.phoneNumber").value("1234567890"));  // Verify phoneNumber in response
//
//        // Verify that the getUserInfo method was called
//        verify(authService).getUserInfo(token, userId);
//    }


}
