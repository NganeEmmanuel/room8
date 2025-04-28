package com.room8.authservice.security.filter;

import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.service.AuthService;
import com.room8.authservice.service.JwtService;
import com.room8.authservice.redis.UserRedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final AuthService authService;
    private final UserRedisService userRedisService;
    private final UserServiceClient userServiceClient;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwtToken;
        final String email;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwtToken = authHeader.substring(7);

        // check jwt token validity
        if (!jwtService.isJwtTokenValid(jwtToken)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
            return;
        }

        email = jwtService.extractUserEmail(jwtToken); // Extract the email from JWT token
        var user = userRedisService.getUserInformation(email).orElseGet(
                () -> userServiceClient.getUserFromEmail(email).getBody()
        );

        // check if token contains email, it's a valid email format, and Authenticate User
        if (email != null && authService.isCorrectEmailFormat(email) && user != null) {
            request.setAttribute("email", email);
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
