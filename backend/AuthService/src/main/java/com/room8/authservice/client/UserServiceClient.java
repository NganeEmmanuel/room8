package com.room8.authservice.client;

import com.room8.authservice.model.User;
import com.room8.authservice.model.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

@Component
@FeignClient("USER-SERVICE")
public interface UserServiceClient {
    @GetMapping("/api/v1/user/get-with-username")
    ResponseEntity<User> getUserFromEmail(@RequestParam String email);

    @GetMapping("/api/v1/user/get-user/phone-number")
    ResponseEntity<User> getUserFromPhoneNumber(@RequestParam String phoneNumber);

    @PostMapping("/api/v1/user/add")
    ResponseEntity<User> addUser(@RequestBody User user);

    @PutMapping("/api/v1/user/update")
    ResponseEntity<UserDTO> updateUser(@RequestBody UserDTO userDTO);

    @PutMapping("/api/v1/user/mark-as-verified/email")
    ResponseEntity<User> markUserAsEmailVerified(@RequestBody String email);

    @PutMapping("/api/v1/user/mark-as-verified/phone")
    ResponseEntity<User> markUserAsPhoneVerified(@RequestBody String phoneNumber);
}
