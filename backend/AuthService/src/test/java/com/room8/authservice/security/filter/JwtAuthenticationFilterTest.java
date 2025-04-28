package com.room8.authservice.security.filter;

import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.model.User;
import com.room8.authservice.service.AuthService;
import com.room8.authservice.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthService authService;

    @Mock
    private UserServiceClient userServiceClient;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    @Mock
    private FilterChain filterChain;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
    }

    @Test
    void shouldSkipFilterWhenNoAuthHeader() throws ServletException, IOException {
        filter.doFilterInternal(request, response, filterChain);
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void shouldRejectInvalidToken() throws ServletException, IOException {
        request.addHeader("Authorization", "Bearer invalid-token");
        when(jwtService.isJwtTokenValid("invalid-token")).thenReturn(false);

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertTrue(response.getContentAsString().contains("Invalid token"));
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldRejectWhenEmailInvalidOrUserNotFound() throws ServletException, IOException {
        //todo reimplement this method
        String token = "valid-token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.isJwtTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserEmail(token)).thenReturn("user@example.com");
        when(authService.isCorrectEmailFormat("user@example.com")).thenReturn(true);
        when(userServiceClient.getUserFromEmail("user@example.com")).thenReturn(Optional.empty());

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertTrue(response.getContentAsString().contains("Invalid token"));
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldAllowRequestWithValidTokenAndEmail() throws ServletException, IOException {
        //todo reimplement this method
        String token = "valid-token";
        request.addHeader("Authorization", "Bearer " + token);

        User mockUser = new User();
        when(jwtService.isJwtTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserEmail(token)).thenReturn("user@example.com");
        when(authService.isCorrectEmailFormat("user@example.com")).thenReturn(true);
        when(userServiceClient.getUserFromEmail("user@example.com")).thenReturn(Optional.of(mockUser));

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        assertEquals("user@example.com", request.getAttribute("email"));
        verify(filterChain, times(1)).doFilter(request, response);
    }
}