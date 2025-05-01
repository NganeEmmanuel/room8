package com.room8.userservice.controller;

import com.room8.userservice.model.User;
import com.room8.userservice.model.UserDTO;
import com.room8.userservice.model.UserInfoDTO;
import com.room8.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;
    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody User request) {
        return ResponseEntity.ok(userService.addUser(request));
    }

    @PutMapping("/update")
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(userDTO));
    }

    @GetMapping("/get-user/email")
    public ResponseEntity<UserDTO> getUserFromEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @GetMapping("/get-user/phone-number")
    public ResponseEntity<User> getUserFromPhoneNumber(@RequestParam String phoneNumber) {
        return ResponseEntity.ok(userService.getUserByPhoneNumber(phoneNumber));
    }

    @GetMapping("/get-user/id")
    public ResponseEntity<UserDTO> getUserFromId(@RequestParam Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/get-user-id")
    public ResponseEntity<Long> getUserIdFromEmail(@RequestParam String email){
        return ResponseEntity.ok(userService.getUserIdByEmail(email));
    }

    @GetMapping("/get-user-info")
    public ResponseEntity<UserInfoDTO> getUserInfo(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestParam Long userId) {

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return ResponseEntity.ok(userService.getUserInfo(token, userId));
        } else {
            return new ResponseEntity<>(new UserInfoDTO(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/mark-as-verified/email")
    public ResponseEntity<User> markUserAsEmailVerified(@RequestBody String email) {
        return ResponseEntity.ok(userService.markUserAsEmailVerified(email));
    }

    @PutMapping("/mark-as-verified/phone")
    public ResponseEntity<User> markUserAsPhoneVerified(@RequestBody String phoneNumber) {
        return ResponseEntity.ok(userService.markUserAsPhoneVerified(phoneNumber));
    }
}
