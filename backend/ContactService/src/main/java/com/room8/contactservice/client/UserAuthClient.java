package com.room8.contactservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Component
@FeignClient("USER-AUTH")
public interface UserAuthClient {
    @PostMapping("/api/v1/auth/marked-as-verified")
    ResponseEntity<Boolean> markUserAsVerified(@RequestParam String email);
}
