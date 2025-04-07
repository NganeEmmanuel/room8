package com.room8.contactservice.service;

import com.room8.contactservice.exception.*;
import com.room8.contactservice.model.SendEmailRequest;
import com.room8.contactservice.model.VerificationRequest;
import com.room8.contactservice.model.VerifyEmailCodeRequest;
import com.room8.contactservice.model.VerifySMSCodeRequest;
import com.room8.contactservice.util.EmailTemplateBuilder;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final EmailService emailService;
    private final StringRedisTemplate redisTemplate;
    private final JavaMailSender mailSender;

    private static final Duration TOKEN_EXPIRATION = Duration.ofMinutes(15);

    /**
     * Generates a verification token, stores it in Redis, and sends a formatted email to the user.
     */
    public ResponseEntity<?> sendVerificationEmail(VerificationRequest request) {
        String token = UUID.randomUUID().toString();
        String email = request.getEmail();

        // Store token in Redis with expiration
        try {
            redisTemplate.opsForValue().set("email_verification:" + token, email, TOKEN_EXPIRATION);
        } catch (Exception e) {
            throw new TokenStorageException("Failed to store token in Redis", e);
        }

        // Generate the verification URL
        String verificationUrl = "https://yourdomain.com/verify-email?email=" + email + "&token=" + token; //todo edit domain link
        String emailHtml = EmailTemplateBuilder.buildVerificationEmail(email, verificationUrl);

        // Send the email
        emailService.sendHtmlEmail(email, "Verify Your Email Address", emailHtml);

        return ResponseEntity.ok("Verification email sent successfully");
    }


    public ResponseEntity<?> verifyEmailToken(String email, String token) {
        String key = "email_verification:" + token;

        try {
            String storedEmail = redisTemplate.opsForValue().get(key);

            if (storedEmail == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid or expired token.");
            }

            if (!storedEmail.equals(email)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Email and token mismatch.");
            }

            // Email is verified — clean up token
            redisTemplate.delete(key);

            // Optional: notify user_auth service (can be integrated here)
            // userAuthClient.markEmailAsVerified(email);

            return ResponseEntity.ok("Email verified successfully.");

        } catch (Exception e) {
            throw new TokenStorageException("Failed to verify token from Redis", e);
        }
    }

    public ResponseEntity<?> sendEmail(SendEmailRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(request.getBody(), true); // HTML support

            mailSender.send(message);

            return ResponseEntity.ok("Email sent successfully.");
        } catch (MessagingException e) {
            throw new EmailSendException("Failed to send email: " + e.getMessage(), e);
        }
    }

    public ResponseEntity<?> verifySMSCode(VerifySMSCodeRequest request) {
        String redisKey = "sms_verification:" + request.getUserId();
        String savedCode;

        try {
            savedCode = redisTemplate.opsForValue().get(redisKey);
            if (savedCode == null) {
                throw new TokenExpiredOrNotFoundException("Verification code expired or not found");
            }

            if (!savedCode.equals(request.getCode())) {
                throw new InvalidTokenException("Invalid verification code");
            }

            // Optional: delete after success
            redisTemplate.delete(redisKey);

            return ResponseEntity.ok("Phone number verified successfully.");

        } catch (TokenExpiredOrNotFoundException | InvalidTokenException e) {
            throw e;
        } catch (Exception e) {
            throw new TokenVerificationException("Verification failed due to internal error", e);
        }
    }

    public ResponseEntity<?> verifyEmailCode(VerifyEmailCodeRequest request) {
        String redisKey = "email_verification:" + request.getEmail();
        String savedCode;

        try {
            savedCode = redisTemplate.opsForValue().get(redisKey);
            if (savedCode == null) {
                throw new TokenExpiredOrNotFoundException("Verification code expired or not found");
            }

            if (!savedCode.equals(request.getCode())) {
                throw new InvalidTokenException("Invalid verification code");
            }

            // Optional: delete key after success
            redisTemplate.delete(redisKey);

            return ResponseEntity.ok("Email verified successfully.");

        } catch (TokenExpiredOrNotFoundException | InvalidTokenException e) {
            throw e;
        } catch (Exception e) {
            throw new TokenVerificationException("Verification failed due to internal error", e);
        }
    }

}
