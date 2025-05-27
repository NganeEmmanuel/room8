package com.room8.authservice.client;

import com.room8.authservice.model.VerificationRequest;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Component
@FeignClient("CONTACT-SERVICE")
public interface ContactServiceClient {

    @PostMapping("api/v1/contact/send-verification-email")
    ResponseEntity<Boolean> sendVerificationEmail(@Valid @RequestBody VerificationRequest request);
}
