package com.room8.authservice.service;

import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    @Value("${twilio.verify-service-sid}")
    private String verifyServiceSid;

    public void sendOtp(String phoneNumber) {
        Verification.creator(
                verifyServiceSid,
                phoneNumber,
                "sms"
        ).create();
    }

    public boolean verifyOtp(String phoneNumber, String code) {
        VerificationCheck check = VerificationCheck.creator(verifyServiceSid)
                .setTo(phoneNumber)
                .setCode(code)
                .create();

        return "approved".equals(check.getStatus());
    }

}
