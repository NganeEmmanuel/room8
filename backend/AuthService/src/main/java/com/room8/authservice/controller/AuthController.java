package com.room8.authservice.controller;


import com.room8.authservice.auth.AuthenticationRequest;
import com.room8.authservice.auth.AuthenticationResponse;
import com.room8.authservice.auth.RegisterRequest;
import com.room8.authservice.model.UserDTO;
import com.room8.authservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.tenantSignup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return ResponseEntity.ok(authService.logout(token));
        } else {
            return ResponseEntity.badRequest().body("Invalid Request.");
        }
    }

    @PostMapping("/authenticate-user")
    public ResponseEntity<Boolean> authenticateUser(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return ResponseEntity.ok(authService.authenticateUser(token));
        } else {
            return new ResponseEntity<>(Boolean.FALSE, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            @RequestBody String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @GetMapping("/get-logged-in-user")
    public ResponseEntity<UserDTO> getLoggedInUser(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return ResponseEntity.ok(authService.getLoggedInUser(token));
        } else {
            return new ResponseEntity<>(new UserDTO(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-logged-in-userid")
    public ResponseEntity<Long> getLoggedInUserId(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return ResponseEntity.ok(authService.getLoggedInUserId(token));
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/marked-as-verified/email")
    public ResponseEntity<Boolean> markUserAsEmailVerified(@RequestParam String email, @RequestParam String token) {
        return ResponseEntity.ok(authService.markedAsEmailVerified(email, token));
    }

    @PutMapping("/marked-as-verified/phone")
    public ResponseEntity<Boolean> markUserAsPhoneVerified(@RequestParam String phone, @RequestParam String otp) {
        return ResponseEntity.ok(authService.markedAsPhoneVerified(phone, otp));
    }

    @GetMapping("/get-email-from-token")
    ResponseEntity<String> getUserEmailFromToken(@RequestParam String token){
        return ResponseEntity.ok(authService.extractEmailFromToken(token));
    }
}
