package com.room8.authservice.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class EmailVerificationRedisService {
    private final StringRedisTemplate redisTemplate;

    // Store email token in Redis with expiration
    public void storeEmailToken(String email, String emailToken, long expirationInMinutes) {
        redisTemplate.opsForValue().set(
                getRedisKey(email), emailToken, expirationInMinutes, TimeUnit.MINUTES);
    }

    // Retrieve email token
    public String getEmailToken(String email) {
        return redisTemplate.opsForValue().get(getRedisKey(email));
    }

    // Delete email token (invalidate old one)
    public void invalidateEmailToken(String email) {
        redisTemplate.delete(getRedisKey(email));
    }

    // 🧹 Private helper method to generate Redis key
    private String getRedisKey(String email) {
        return "emailToken_:" + email;
    }
}
