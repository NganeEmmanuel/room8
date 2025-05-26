package com.room8.userservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Component
@FeignClient("AUTH-SERVICE")
public interface AuthenticationServiceClient {
    @GetMapping("/api/v1/auth/get-email-from-token")
    ResponseEntity<String> getUserEmailFromToken(@RequestParam String token);

}

