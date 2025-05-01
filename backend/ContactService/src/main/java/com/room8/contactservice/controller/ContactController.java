package com.room8.contactservice.controller;

import com.room8.contactservice.model.SendEmailRequest;
import com.room8.contactservice.model.SendSMSCodeRequest;
import com.room8.contactservice.model.VerificationRequest;
import com.room8.contactservice.model.VerifySMSCodeRequest;
import com.room8.contactservice.model.VerifyEmailCodeRequest;
import com.room8.contactservice.service.VerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/verification")
@RequiredArgsConstructor
public class ContactController {

    private final VerificationService verificationService;

    /**
     * Sends a verification email with a temporary token link.
     *
     * @param request the request body containing the email to verify
     * @return ResponseEntity indicating success or failure
     */
    @PostMapping("/send-verification-email")
    public ResponseEntity<Boolean> sendVerificationEmail(@Valid @RequestBody VerificationRequest request) {
        return ResponseEntity.ok(verificationService.sendVerificationEmail(request));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(
            @RequestParam("email") String email,
            @RequestParam("token") String token) {
        return ResponseEntity.ok(verificationService.verifyEmailToken(email, token));
    }

    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@Valid @RequestBody SendEmailRequest request) {
        return ResponseEntity.ok(verificationService.sendEmail(request));
    }

    @PostMapping("/send-sms-code")
    public ResponseEntity<String> saveSMSCode(@Valid @RequestBody SendSMSCodeRequest request) {
        return ResponseEntity.ok(verificationService.saveSMSVerificationCode(request)); //todo implement so that it just saves the code and the user id from the request ot redis. we will use twillo in the frontend to actually send the code
    }

    @PostMapping("/verify-sms-code")
    public ResponseEntity<String> verifySMSCode(@Valid @RequestBody VerifySMSCodeRequest request) {
        return ResponseEntity.ok(verificationService.verifySMSCode(request));
    }

    @PostMapping("/verify-email-code")
    public ResponseEntity<String> verifyEmailCode(@Valid @RequestBody VerifyEmailCodeRequest request) {
        return ResponseEntity.ok(verificationService.verifyEmailCode(request));
    }

}

