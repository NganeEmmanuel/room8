package com.room8.authservice.security.filter;

import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.model.User;
import com.room8.authservice.service.AuthService;
import com.room8.authservice.service.JwtService;
import com.room8.authservice.redis.UserRedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
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

    @Mock
    private UserRedisService userRedisService;

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

//    @Test
//    void shouldSkipFilterWhenNoAuthHeader() throws ServletException, IOException {
//        // Test case to check that the filter is skipped if there is no Authorization header
//        filter.doFilterInternal(request, response, filterChain);
//        verify(filterChain, times(1)).doFilter(request, response);
//    }

    @Test
    void shouldRejectInvalidToken() throws ServletException, IOException {
        // Test case to check that an invalid token results in an unauthorized response
        request.addHeader("Authorization", "Bearer invalid-token");
        when(jwtService.isJwtTokenValid("invalid-token")).thenReturn(false);

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertTrue(response.getContentAsString().contains("Invalid token"));
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldRejectWhenEmailInvalid() throws ServletException, IOException {
        // Test case to handle when the token is valid but the email format is incorrect
        String token = "valid-token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.isJwtTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserEmail(token)).thenReturn("invalid-email");
        when(authService.isCorrectEmailFormat("invalid-email")).thenReturn(false);

        // Mock the userServiceClient to return a valid ResponseEntity
        when(userServiceClient.getUserFromEmail("invalid-email")).thenReturn(ResponseEntity.ok(null));

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertTrue(response.getContentAsString().contains("Invalid token"));
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldRejectWhenUserNotFoundInRedisAndService() throws ServletException, IOException {
        // Test case to handle when the user is not found in both Redis and UserService
        String token = "valid-token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.isJwtTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserEmail(token)).thenReturn("user@example.com");
        when(authService.isCorrectEmailFormat("user@example.com")).thenReturn(true);
        when(userRedisService.getUserInformation("user@example.com")).thenReturn(Optional.empty());
        when(userServiceClient.getUserFromEmail("user@example.com"))
                .thenReturn(ResponseEntity.notFound().build());

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertTrue(response.getContentAsString().contains("Invalid token"));
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldAllowRequestWithValidTokenAndEmailFromRedis() throws ServletException, IOException {
        // Test case to check successful authentication when user is found in Redis
        String token = "valid-token";
        request.addHeader("Authorization", "Bearer " + token);

        User mockUser = new User();
        when(jwtService.isJwtTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserEmail(token)).thenReturn("user@example.com");
        when(authService.isCorrectEmailFormat("user@example.com")).thenReturn(true);
        when(userRedisService.getUserInformation("user@example.com")).thenReturn(Optional.of(mockUser));

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        assertEquals("user@example.com", request.getAttribute("email"));
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void shouldAllowRequestWithValidTokenAndEmailFromService() throws ServletException, IOException {
        // Test case to check successful authentication when user is found in UserService
        String token = "valid-token";
        request.addHeader("Authorization", "Bearer " + token);

        User mockUser = new User();
        when(jwtService.isJwtTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserEmail(token)).thenReturn("user@example.com");
        when(authService.isCorrectEmailFormat("user@example.com")).thenReturn(true);
        when(userRedisService.getUserInformation("user@example.com")).thenReturn(Optional.empty());
        when(userServiceClient.getUserFromEmail("user@example.com"))
                .thenReturn(ResponseEntity.ok(mockUser)); // Return a successful response with the mock user

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_OK, response.getStatus());
        assertEquals("user@example.com", request.getAttribute("email"));
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void shouldRejectWhenJwtServiceThrowsException() throws ServletException, IOException {
        // Test case to handle when JwtService throws an exception while validating the token
        String token = "valid-token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.isJwtTokenValid(token)).thenThrow(new RuntimeException("Service error"));

        assertThrows(RuntimeException.class, () -> {
            filter.doFilterInternal(request, response, filterChain);
        });
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldRejectWhenExtractingEmailThrowsException() throws ServletException, IOException {
        // Test case to handle when JwtService throws an exception while extracting email
        String token = "valid-token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.isJwtTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserEmail(token)).thenThrow(new RuntimeException("Service error"));

        assertThrows(RuntimeException.class, () -> {
            filter.doFilterInternal(request, response, filterChain);
        });
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldRejectWhenUserServiceClientReturnsErrorResponse() throws ServletException, IOException {
        // Test case to handle when UserService returns an error response
        String token = "valid-token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.isJwtTokenValid(token)).thenReturn(true);
        when(jwtService.extractUserEmail(token)).thenReturn("user@example.com");
        when(authService.isCorrectEmailFormat("user@example.com")).thenReturn(true);
        when(userRedisService.getUserInformation("user@example.com")).thenReturn(Optional.empty());
        when(userServiceClient.getUserFromEmail("user@example.com"))
                .thenReturn(ResponseEntity.status(HttpServletResponse.SC_BAD_REQUEST).build());

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        assertTrue(response.getContentAsString().contains("Invalid token"));
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldHandleEmptyToken() throws ServletException, IOException {
        // Test case to handle when the token is empty
        request.addHeader("Authorization", "Bearer ");

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldHandleTokenWithoutBearerPrefix() throws ServletException, IOException {
        // Test case to handle when the token does not have "Bearer " prefix
        request.addHeader("Authorization", "SomeOtherPrefix token");

        filter.doFilterInternal(request, response, filterChain);

        assertEquals(HttpServletResponse.SC_UNAUTHORIZED, response.getStatus());
        verify(filterChain, never()).doFilter(any(), any());
    }
}