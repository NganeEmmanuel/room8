package com.room8.authservice.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.authservice.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserRedisService {
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper; // Jackson ObjectMapper to handle JSON

    public void storeUserInformation(String email, User user, long expirationInMinutes) {
        try {
            String userJson = objectMapper.writeValueAsString(user);
            redisTemplate.opsForValue().set(
                    getRedisKey(email), userJson, expirationInMinutes, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not serialize User object", e);
        }
    }

    public Optional<User> getUserInformation(String email) {
        String userJson = redisTemplate.opsForValue().get(getRedisKey(email));
        if (userJson == null) {
            return Optional.empty();
        }
        try {
            return Optional.ofNullable(objectMapper.readValue(userJson, User.class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not deserialize User JSON", e);
        }
    }

    public void invalidateUserInformation(String email) {
        redisTemplate.delete(getRedisKey(email));
    }

    public void updateUserInformation(String email, User updatedUser, long newExpirationInMinutes) {
        try {
            String userJson = objectMapper.writeValueAsString(updatedUser);
            redisTemplate.opsForValue().set(
                    getRedisKey(email), userJson, newExpirationInMinutes, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not serialize updated User object", e);
        }
    }

    // 🧹 Private helper method to generate Redis key
    private String getRedisKey(String email) {
        return "user_email_:" + email;
    }
}
