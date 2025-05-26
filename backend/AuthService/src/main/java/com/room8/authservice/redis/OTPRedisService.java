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
        return "phoneNumber:" + phoneNumber;
    }
}
