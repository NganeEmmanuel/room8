package com.room8.contactservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.contactservice.model.*;
import com.room8.contactservice.service.VerificationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContactController.class)
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private VerificationService verificationService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /send-email (verification) - should return success")
    void testSendVerificationEmail() throws Exception {
        VerificationRequest request = new VerificationRequest("user@example.com");
        Mockito.when(verificationService.sendVerificationEmail(any(VerificationRequest.class)))
                .thenReturn(Boolean.TRUE);

        mockMvc.perform(post("/api/v1/verification/send-verification-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Verification email sent"));
    }

    @Test
    @DisplayName("GET /verify-email - should verify token and return success")
    void testVerifyEmail() throws Exception {
        Mockito.when(verificationService.verifyEmailToken("user@example.com", "valid-token"))
                .thenReturn("Email verified successfully");

        mockMvc.perform(get("/api/v1/verification/verify-email")
                        .param("email", "user@example.com")
                        .param("token", "valid-token"))
                .andExpect(status().isOk())
                .andExpect(content().string("Email verified successfully"));
    }

    @Test
    @DisplayName("POST /send-email (plain email) - should return success")
    void testSendEmail() throws Exception {
        SendEmailRequest request = new SendEmailRequest("user@example.com", "Subject", "Body");
        Mockito.when(verificationService.sendEmail(any(SendEmailRequest.class)))
                .thenReturn("Email sent");

        mockMvc.perform(post("/api/v1/verification/send-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Email sent"));
    }

    @Test
    @DisplayName("POST /send-sms-code - should save SMS code and return success")
    void testSendSMSCode() throws Exception {
        SendSMSCodeRequest request = new SendSMSCodeRequest("user123", "+1234567890");
        Mockito.when(verificationService.saveSMSVerificationCode(any(SendSMSCodeRequest.class)))
                .thenReturn("SMS code saved");

        mockMvc.perform(post("/api/v1/verification/send-sms-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("SMS code saved"));
    }

    @Test
    @DisplayName("POST /verify-sms-code - should verify and return success")
    void testVerifySMSCode() throws Exception {
        VerifySMSCodeRequest request = new VerifySMSCodeRequest("user123", "123456");
        Mockito.when(verificationService.verifySMSCode(any(VerifySMSCodeRequest.class)))
                .thenReturn("SMS code verified");

        mockMvc.perform(post("/api/v1/verification/verify-sms-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("SMS code verified"));
    }

    @Test
    @DisplayName("POST /verify-email-code - should verify and return success")
    void testVerifyEmailCode() throws Exception {
        VerifyEmailCodeRequest request = new VerifyEmailCodeRequest("user@example.com", "123456");
        Mockito.when(verificationService.verifyEmailCode(any(VerifyEmailCodeRequest.class)))
                .thenReturn("Email code verified");

        mockMvc.perform(post("/api/v1/verification/verify-email-code")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Email code verified"));
    }
}
