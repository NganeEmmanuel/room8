package com.room8.authservice.controller;

import com.room8.authservice.dto.*;
import com.room8.authservice.enums.UserAuthority;
import com.room8.authservice.exception.InvalidTokenException;
import com.room8.authservice.model.UserRole;
import com.room8.authservice.service.AuthService;
import com.room8.authservice.utils.EmailUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@SuppressWarnings("unused")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private EmailUtils emailUtils;

    private AuthenticationResponse authResponse;
    private UserDTO userDTO;

    @BeforeEach
    void setup() {

        authResponse = AuthenticationResponse.builder()
                .token("jwt-token")
                .refreshToken("refresh-token")
                .build();

        UserRole userRole = UserRole.builder().
                userAuthority(UserAuthority.TENANT)
                .build();

        userDTO = UserDTO.builder()
                .id(1L)
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .role(List.of(userRole))
                .build();
    }

    @Test
    void authenticateUser_ValidToken_ReturnsTrue() throws Exception {
        when(authService.authenticateUser("jwt-token")).thenReturn(true);

        mockMvc.perform(post("/api/v1/auth/authenticate-user")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer jwt-token"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void authenticateUser_InvalidHeader_ReturnsFalse() throws Exception {
        mockMvc.perform(post("/api/v1/auth/authenticate-user")
                        .header(HttpHeaders.AUTHORIZATION, "InvalidHeader"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("false"));
    }

    @Test
    void refreshToken_Valid_ReturnsNewTokens() throws Exception {
        when(authService.refreshToken(any())).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"refresh-token\""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"));
    }

    @Test
    void getLoggedInUser_ValidToken_ReturnsUserDTO() throws Exception {
        when(authService.getLoggedInUser("jwt-token")).thenReturn(userDTO);

        mockMvc.perform(get("/api/v1/auth/get-logged-in-user")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer jwt-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }

    @Test
    void getLoggedInUser_MissingToken_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/auth/get-logged-in-user")
                        .header(HttpHeaders.AUTHORIZATION, " "))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getLoggedInUserId_ValidToken_ReturnsUserId() throws Exception {
        when(authService.getLoggedInUserId("jwt-token")).thenReturn(1L);

        mockMvc.perform(get("/api/v1/auth/get-logged-in-userid")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer jwt-token"))
                .andExpect(status().isOk())
                .andExpect(content().string("1"));
    }

    @Test
    void getLoggedInUserId_MissingToken_ReturnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/v1/auth/get-logged-in-userid")
                        .header(HttpHeaders.AUTHORIZATION, " "))
                .andExpect(status().isBadRequest());
    }

    @Test
    void markUserAsEmailVerified_ValidParams_ReturnsTrue() throws Exception {
        when(authService.markedAsEmailVerified("john.doe@example.com", "token123")).thenReturn(true);

        mockMvc.perform(put("/api/v1/auth/marked-as-verified/email")
                        .param("email", "john.doe@example.com")
                        .param("token", "token123"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void markUserAsPhoneVerified_ValidParams_ReturnsTrue() throws Exception {
        when(authService.markedAsPhoneVerified("+237678123456", "123456")).thenReturn(true);

        mockMvc.perform(put("/api/v1/auth/marked-as-verified/phone")
                        .param("phone", "+237678123456")
                        .param("otp", "123456"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void getEmailFromToken_ReturnsEmail() throws Exception {
        when(emailUtils.extractEmailFromToken("jwt-token")).thenReturn("john.doe@example.com");

        mockMvc.perform(get("/api/v1/auth/get-email-from-token")
                        .param("token", "jwt-token"))
                .andExpect(status().isOk())
                .andExpect(content().string("john.doe@example.com"));
    }

    // Unhappy Path Examples

    @Test
    void refreshToken_InvalidTokenString_ReturnsUnauthorized() throws Exception {

        when(authService.refreshToken(any()))
                .thenThrow(new InvalidTokenException(""));

        mockMvc.perform(post("/api/v1/auth/refresh-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("\"null\""))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid token:"));
    }


    @Test
    void markUserAsEmailVerified_InvalidToken_ReturnsFalse() throws Exception {
        when(authService.markedAsEmailVerified("john.doe@example.com", "badToken")).thenReturn(false);

        mockMvc.perform(put("/api/v1/auth/marked-as-verified/email")
                        .param("email", "john.doe@example.com")
                        .param("token", "badToken"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    @Test
    void markUserAsPhoneVerified_WrongOtp_ReturnsFalse() throws Exception {
        when(authService.markedAsPhoneVerified("+237678123456", "000000")).thenReturn(false);

        mockMvc.perform(put("/api/v1/auth/marked-as-verified/phone")
                        .param("phone", "+237678123456")
                        .param("otp", "000000"))
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }
}
