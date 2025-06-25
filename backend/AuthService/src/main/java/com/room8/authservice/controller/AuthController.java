package com.room8.authservice.controller;


import com.room8.authservice.dto.*;
import com.room8.authservice.exception.BadCredentialsException;
import com.room8.authservice.service.AuthService;
import com.room8.authservice.utils.EmailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
//@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final EmailUtils emailUtils;

    @PostMapping("/signup/tenant")
    public ResponseEntity<AuthenticationResponse> registerTenant(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.tenantSignup(request));
    }

    @PostMapping("/signup/landlord")
    public ResponseEntity<AuthenticationResponse> registerLandlord(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.landlordSignup(request));
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
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return ResponseEntity.ok(authService.refreshToken(token));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/me")
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
    public ResponseEntity<Boolean> markUserAsPhoneVerified(@RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.markedAsPhoneVerified(request.getPhoneNumber(), request.getOtpCode()));
    }

    @PutMapping("/resend-code")
    public ResponseEntity<Boolean> resentCode(@RequestParam(required = false) String phoneNumber, @RequestParam(required = false) String email) {
        if (phoneNumber == null) {
            throw new BadCredentialsException("require phoneNumber or email");
        }

        if (email == null) {
            throw new BadCredentialsException("require phoneNumber or email");
        }

        if (phoneNumber.isBlank() && email.isBlank()) {
            throw new BadCredentialsException("At least one of phoneNumber or email must not be blank");
        }

        return ResponseEntity.ok(authService.resentCode(!phoneNumber.isBlank()? phoneNumber: email, !phoneNumber.isBlank()? "phone" : "email"));
    }

    @GetMapping("/get-email-from-token")
    ResponseEntity<String> getUserEmailFromToken(@RequestParam String token){
        return ResponseEntity.ok(emailUtils.extractEmailFromToken(token));
    }


}
