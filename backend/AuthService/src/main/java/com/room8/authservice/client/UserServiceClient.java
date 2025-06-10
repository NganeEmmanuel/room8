package com.room8.authservice.client;

import com.room8.authservice.dto.UserDTO;
import com.room8.authservice.enums.UserAuthority;
import com.room8.authservice.model.User;
import com.room8.authservice.model.UserRole;
import com.room8.authservice.security.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

@Component
@FeignClient(name = "user-service", url = "http://user-service.default.svc.cluster.local", configuration = FeignConfig.class)
public interface UserServiceClient {
    @GetMapping("/api/v1/user/get-user/email")
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

    @GetMapping("/api/v1/user/getRole")
    ResponseEntity<UserRole> getRole(@RequestParam UserAuthority role);

    @GetMapping("/api/v1/user/check-conflict")
    ResponseEntity<Boolean> checkConflict(@RequestParam String email, @RequestParam String phoneNumber);
}
