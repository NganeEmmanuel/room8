package com.room8.authservice.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OTPRedisService {
    private final StringRedisTemplate redisTemplate;

    // Store OTP in Redis with expiration
    public void storeOTP(String phoneNumber, String otp, long expirationInMinutes) {
        if (otp == null) {
            throw new NullPointerException("OTP must not be null");
        }
        if (expirationInMinutes <= 0) {
            throw new IllegalArgumentException("Expiration time must be greater than zero");
        }

        redisTemplate.opsForValue().set(
                getRedisKey(phoneNumber), otp, expirationInMinutes, TimeUnit.MINUTES);
    }

    // Retrieve OTP
    public String getOTP(String phoneNumber) {
        return redisTemplate.opsForValue().get(getRedisKey(phoneNumber));
    }

    // Delete OTP (invalidate old one)
    public void invalidateOTP(String phoneNumber) {
        redisTemplate.delete(getRedisKey(phoneNumber));
    }

    // 🧹 Private helper method to generate Redis key
    private String getRedisKey(String phoneNumber) {
        if (phoneNumber == null) {
            throw new NullPointerException("Phone number must not be null");
        }
        return "auth:phoneNumber:" + phoneNumber;
    }
}