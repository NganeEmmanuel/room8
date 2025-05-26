package com.room8.contactservice.service;

import com.room8.contactservice.client.UserAuthClient;
import com.room8.contactservice.exception.*;
import com.room8.contactservice.model.*;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
class VerificationServiceTest {

    @Mock
    private EmailService emailService;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private UserAuthClient userAuthClient;

    @Mock
    private ValueOperations<String, String> valueOps;

    @InjectMocks
    private VerificationService verificationService;

    @BeforeEach
    void setup() {
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
    }

    @AfterEach
    void tearDown() {
        // Ensures no interaction leaks across tests
        Mockito.reset(emailService, redisTemplate, valueOps, mailSender, userAuthClient);
    }

    // Tests go here...
    @Test
    void sendVerificationEmail_success() {
        VerificationRequest request = new VerificationRequest("test@example.com");

        doNothing().when(valueOps).set(anyString(), anyString(), any());

        doNothing().when(emailService).sendHtmlEmail(anyString(), anyString(), anyString());

        Boolean result = verificationService.sendVerificationEmail(request);

        assertEquals(Boolean.TRUE, result);
        verify(emailService).sendHtmlEmail(eq("test@example.com"), any(), contains("https://yourdomain.com"));
    }

    @Test
    void sendVerificationEmail_redisFailure_throwsTokenStorageException() {
        VerificationRequest request = new VerificationRequest("test@example.com");

        doThrow(new RuntimeException("Redis error")).when(valueOps).set(anyString(), anyString(), any());

        assertThrows(TokenStorageException.class, () -> verificationService.sendVerificationEmail(request));
    }

    /**
     * Test successful email verification when correct token and email are provided.
     */
    @Test
    void verifyEmailToken_success() {
        String email = "test@example.com";
        String token = "token123";
        String key = "email_verification:" + token;

        when(valueOps.get(key)).thenReturn(email);
        when(userAuthClient.markUserAsVerified(email)).thenReturn(ResponseEntity.ok(true));
        when(redisTemplate.delete(key)).thenReturn(true);

        String result = verificationService.verifyEmailToken(email, token);

        assertEquals("success", result);
    }

    /**
     * Test when token does not exist in Redis (expired or invalid).
     * Should throw TokenExpiredOrNotFoundException.
     */
    @Test
    void verifyEmailToken_tokenNotFound_throwsException() {
        String email = "test@example.com";
        String token = "invalidToken";
        String key = "email_verification:" + token;

        when(valueOps.get(key)).thenReturn(null);

        assertThrows(TokenExpiredOrNotFoundException.class,
                () -> verificationService.verifyEmailToken(email, token));
    }

    /**
     * Test when the email retrieved from Redis does not match the input email.
     * Should throw EmailAndTokenMissMatchException.
     */
    @Test
    void verifyEmailToken_emailMismatch_throwsException() {
        String inputEmail = "user1@example.com";
        String storedEmail = "user2@example.com";
        String token = "tokenABC";
        String key = "email_verification:" + token;

        when(valueOps.get(key)).thenReturn(storedEmail);

        assertThrows(EmailAndTokenMissMatchException.class,
                () -> verificationService.verifyEmailToken(inputEmail, token));
    }

    /**
     * Test when userAuthClient returns false, indicating failure in marking user as verified.
     * Should throw UserAuthMarkedAsVerifiedException.
     */
//    @Test
//    void verifyEmailToken_userAuthNotMarkedVerified_throwsException() {
//        String email = "test@example.com";
//        String token = "tokenFail";
//        String key = "email_verification:" + token;
//
//        when(valueOps.get(key)).thenReturn(email);
//        when(userAuthClient.markUserAsVerified(email).getBody()).thenReturn(false);
//
//        assertThrows(UserAuthMarkedAsVerifiedException.class,
//                () -> verificationService.verifyEmailToken(email, token));
//    }
//
//    /**
//     * Test when userAuthClient throws a runtime exception.
//     * Should wrap it inside TokenStorageException.
//     */
//    @Test
//    void verifyEmailToken_userAuthThrowsException_wrappedInTokenStorageException() {
//        String email = "test@example.com";
//        String token = "tokenError";
//        String key = "email_verification:" + token;
//
//        when(valueOps.get(key)).thenReturn(email);
//        when(userAuthClient.markUserAsVerified(email)).thenThrow(new RuntimeException("Unexpected"));
//
//        TokenStorageException exception = assertThrows(TokenStorageException.class,
//                () -> verificationService.verifyEmailToken(email, token));
//
//        assertTrue(exception.getMessage().contains("Failed to verify token from Redis"));
//    }

    @Test
    void sendEmail_success() throws Exception {
        SendEmailRequest request = new SendEmailRequest("to@example.com", "Subject", "<h1>Hello</h1>");

        MimeMessage mockMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mockMessage);
        doNothing().when(mailSender).send(any(MimeMessage.class));

        String result = verificationService.sendEmail(request);
        assertEquals("success", result);
    }

    @Test
    void sendEmail_messagingException_throwsException() {
        SendEmailRequest request = new SendEmailRequest("to@example.com", "Subject", "Body");

        when(mailSender.createMimeMessage()).thenThrow(new RuntimeException("Failed"));

        assertThrows(EmailSendException.class, () -> verificationService.sendEmail(request));
    }

    @Test
    void verifySMSCode_success() {
        VerifySMSCodeRequest request = new VerifySMSCodeRequest("user123", "123456");

        when(valueOps.get("sms_verification:user123")).thenReturn("123456");
        when(redisTemplate.delete("sms_verification:user123")).thenReturn(true);

        String result = verificationService.verifySMSCode(request);
        assertEquals("success", result);
    }

    @Test
    void verifySMSCode_expired_throwsException() {
        VerifySMSCodeRequest request = new VerifySMSCodeRequest("user123", "123456");

        when(valueOps.get("sms_verification:user123")).thenReturn(null);

        assertThrows(TokenExpiredOrNotFoundException.class, () -> verificationService.verifySMSCode(request));
    }

    @Test
    void verifySMSCode_invalidCode_throwsException() {
        VerifySMSCodeRequest request = new VerifySMSCodeRequest("user123", "999999");

        when(valueOps.get("sms_verification:user123")).thenReturn("123456");

        assertThrows(InvalidTokenException.class, () -> verificationService.verifySMSCode(request));
    }

    @Test
    void saveSMSVerificationCode_success() {
        SendSMSCodeRequest request = new SendSMSCodeRequest("user123", "123456");

        doNothing().when(valueOps).set(anyString(), anyString(), any());

        String result = verificationService.saveSMSVerificationCode(request);

        assertEquals("success", result);
    }

    @Test
    void saveSMSVerificationCode_redisError_throwsException() {
        SendSMSCodeRequest request = new SendSMSCodeRequest("user123", "123456");

        doThrow(new RuntimeException()).when(valueOps).set(anyString(), anyString(), any());

        assertThrows(SmsCodeStorageException.class, () -> verificationService.saveSMSVerificationCode(request));
    }

    @Test
    void verifyEmailCode_success() {
        VerifyEmailCodeRequest request = new VerifyEmailCodeRequest("test@example.com", "abc123");

        when(valueOps.get("email_verification:test@example.com")).thenReturn("abc123");
        when(redisTemplate.delete("email_verification:test@example.com")).thenReturn(true);

        String result = verificationService.verifyEmailCode(request);
        assertEquals("success", result);
    }
    @Test
    void verifyEmailCode_expired_throwsException() {
        VerifyEmailCodeRequest request = new VerifyEmailCodeRequest("test@example.com", "abc123");

        when(valueOps.get(anyString())).thenReturn(null);

        assertThrows(TokenExpiredOrNotFoundException.class, () -> verificationService.verifyEmailCode(request));
    }

    @Test
    void verifyEmailCode_invalid_throwsException() {
        VerifyEmailCodeRequest request = new VerifyEmailCodeRequest("test@example.com", "wrong");

        when(valueOps.get(anyString())).thenReturn("correct");

        assertThrows(InvalidTokenException.class, () -> verificationService.verifyEmailCode(request));
    }



}
