package com.room8.authservice.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class JwtBlacklistRedisService {
    private final StringRedisTemplate redisTemplate;

    // Blacklist a token in Redis with its expiration time
    public void blacklistToken(String token, Date expirationDate) {
        long expirationTime = expirationDate.getTime() - System.currentTimeMillis();
        redisTemplate.opsForValue().set("blacklist:" + token, "true", expirationTime, TimeUnit.MILLISECONDS);
    }

    // Check if a token is blacklisted
    public boolean isTokenBlacklisted(String token) {
        return redisTemplate.hasKey("blacklist:" + token);
    }
}
