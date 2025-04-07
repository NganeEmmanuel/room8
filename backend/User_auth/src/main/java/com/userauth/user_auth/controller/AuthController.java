package com.userauth.user_auth.controller;

import com.userauth.user_auth.auth.AuthenticationRequest;
import com.userauth.user_auth.auth.AuthenticationResponse;
import com.userauth.user_auth.auth.RegisterRequest;
import com.userauth.user_auth.model.UserDTO;
import com.userauth.user_auth.model.UserInfoDTO;
import com.userauth.user_auth.service.AuthService;
import com.userauth.user_auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication and authorization")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @Operation(summary = "Register a new user account")
    @PostMapping("/signup")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return authService.tenantSignup(request);
    }

    @Operation(summary = "Authenticate a user and return access and refresh tokens")
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return authService.login(request);
    }

    @Operation(summary = "Logout a user and invalidate their session/token")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @Parameter(description = "Bearer token", required = true)
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return authService.logout(token);
        } else {
            return ResponseEntity.badRequest().body("Invalid Request.");
        }
    }

    @Operation(summary = "Verify if a user is authenticated based on token validity")
    @PostMapping("/authenticate-user")
    public ResponseEntity<Boolean> authenticateUser(
            @Parameter(description = "Bearer token", required = true)
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return authService.authenticateUser(token);
        } else {
            return new ResponseEntity<>(Boolean.FALSE, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Generate a new access token using a refresh token")
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            @Parameter(description = "Refresh token", required = true)
            @RequestBody String refreshToken) {
        return authService.refreshToken(refreshToken);
    }

    @Operation(summary = "Retrieve the logged-in user's details from the token")
    @GetMapping("/get-logged-in-user")
    public ResponseEntity<UserDTO> getLoggedInUser(
            @Parameter(description = "Bearer token", required = true)
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return authService.getLoggedInUser(token);
        } else {
            return new ResponseEntity<>(new UserDTO(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-user")
    public ResponseEntity<UserDTO> getUserFromId(@RequestParam Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Operation(summary = "Retrieve the ID of the logged-in user")
    @GetMapping("/get-logged-in-userid")
    public ResponseEntity<Long> getLoggedInUserId(
            @Parameter(description = "Bearer token", required = true)
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return authService.getLoggedInUserId(token);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "Fetch user info by ID, authenticated with token")
    @GetMapping("/get-user-info")
    public ResponseEntity<UserInfoDTO> getUserInfo(
            @Parameter(description = "Bearer token", required = true)
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @Parameter(description = "User ID to fetch information for", required = true)
            @RequestParam Long userId) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return authService.getUserInfo(token, userId);
        } else {
            return new ResponseEntity<>(new UserInfoDTO(), HttpStatus.BAD_REQUEST);
        }
    }
}
