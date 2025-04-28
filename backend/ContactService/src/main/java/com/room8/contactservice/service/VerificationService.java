package com.room8.contactservice.service;

import com.room8.contactservice.client.UserAuthClient;
import com.room8.contactservice.exception.*;
import com.room8.contactservice.model.*;
import com.room8.contactservice.util.EmailTemplateBuilder;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final EmailService emailService;
    private final StringRedisTemplate redisTemplate;
    private final JavaMailSender mailSender;
    private final UserAuthClient userAuthClient;

    private static final Duration TOKEN_EXPIRATION = Duration.ofMinutes(30);
    private static final Duration SMS_EXPIRATION = Duration.ofMinutes(10);

    /**
     * Generates a verification token, stores it in Redis, and sends a formatted email to the user.
     */
    public Boolean sendVerificationEmail(VerificationRequest request) {
        String email = request.getEmail();

        // Generate the verification URL todo edit the link to reflect the service (authentication service is the one verifying)
        String verificationUrl = "https://yourdomain.com/verify-email?email=" + email + "&token=" + request.getToken(); //todo edit domain link you can use environmental variable to set it since we are using ec2
        String emailHtml = EmailTemplateBuilder.buildVerificationEmail(email, verificationUrl);

        // Send the email
        emailService.sendHtmlEmail(email, "Verify Your Email Address", emailHtml);

        return Boolean.TRUE;
    }


    public String verifyEmailToken(String email, String token) {
        String key = "email_verification:" + token;

        String storedEmail = redisTemplate.opsForValue().get(key);

        if (storedEmail == null) {
            throw new TokenExpiredOrNotFoundException("Invalid or expired token.");
        }

        if (!storedEmail.equals(email)) {
            throw new EmailAndTokenMissMatchException("Email and token mismatch.");
        }

        // notify user_auth service
        try {
            var isMarkedAsVerified = userAuthClient.markUserAsVerified(email).getBody();
            if (Boolean.FALSE.equals(isMarkedAsVerified)) {
                throw new UserAuthMarkedAsVerifiedException("Error while verifying user emailed token.");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        // Email is verified — clean up token
        redisTemplate.delete(key);

        return "success";
    }

    public String sendEmail(SendEmailRequest request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(request.getBody(), true); // HTML support

            mailSender.send(message);

            return "success";
        } catch (Exception e) {
            throw new EmailSendException("Failed to send email: " + e.getMessage(), e);
        }
    }

    public String verifySMSCode(VerifySMSCodeRequest request) {
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

            return "success";

        } catch (TokenExpiredOrNotFoundException | InvalidTokenException e) {
            throw e;
        } catch (Exception e) {
            throw new TokenVerificationException("Verification failed due to internal error", e);
        }
    }

    public String saveSMSVerificationCode(SendSMSCodeRequest request) {
        // Store token in Redis with expiration
        try {
            redisTemplate.opsForValue().set("sms_verification:" + request.getUserId(), request.getCode(), SMS_EXPIRATION);
        } catch (Exception e) {
            throw new SmsCodeStorageException("Failed to store sms verification code in Redis", e);
        }

        return "success";
    }

    public String verifyEmailCode(VerifyEmailCodeRequest request) {
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

            return "success";

        } catch (TokenExpiredOrNotFoundException | InvalidTokenException e) {
            throw e;
        } catch (Exception e) {
            throw new TokenVerificationException("Verification failed due to internal error", e);
        }
    }

}
