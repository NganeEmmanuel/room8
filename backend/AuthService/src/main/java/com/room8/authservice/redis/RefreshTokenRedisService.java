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
        redisTemplate.opsForValue().set(
                "refreshToken:" + email, refreshToken, expirationInMinutes, TimeUnit.MINUTES);
    }

    // Retrieve refresh token
    public String getRefreshToken(String email) {
        return redisTemplate.opsForValue().get("refreshToken:" + email);
    }

    // Delete refresh token (invalidate old one)
    public void invalidateRefreshToken(String email) {
        redisTemplate.delete("refreshToken:" + email);
    }
}
