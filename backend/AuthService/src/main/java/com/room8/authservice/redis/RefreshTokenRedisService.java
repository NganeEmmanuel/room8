package com.room8.authservice.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenRedisService {
    private final StringRedisTemplate redisTemplate;

    // Store refresh token in Redis with expiration
    public void storeRefreshToken(String email, String refreshToken, long expirationInMinutes) {
        if (email == null || refreshToken == null) {
            throw new NullPointerException("Email and refresh token must not be null");
        }
        redisTemplate.opsForValue().set(
                "auth:refreshToken:" + email, refreshToken, expirationInMinutes, TimeUnit.MINUTES);
    }

    // Retrieve refresh token
    public String getRefreshToken(String email) {
        if (email == null) {
            throw new NullPointerException("Email must not be null");
        }
        return redisTemplate.opsForValue().get("auth:refreshToken:" + email);
    }

    // Delete refresh token (invalidate old one)
    public void invalidateRefreshToken(String email) {
        if (email == null) {
            throw new NullPointerException("Email must not be null");
        }
        redisTemplate.delete("auth:refreshToken:" + email);
    }
}