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
        validateInputs(email, user, expirationInMinutes);
        storeUser(email, user, expirationInMinutes);
    }

    public Optional<User> getUserInformation(String email) {
        validateEmail(email);
        String userJson = redisTemplate.opsForValue().get(getRedisKey(email));
        return deserializeUser(userJson);
    }

    public void invalidateUserInformation(String email) {
        validateEmail(email);
        redisTemplate.delete(getRedisKey(email));
    }

    public void updateUserInformation(String email, User updatedUser, long newExpirationInMinutes) {
        validateInputs(email, updatedUser, newExpirationInMinutes);
        storeUser(email, updatedUser, newExpirationInMinutes);
    }

    // 🧹 Private helper method to generate Redis key
    private String getRedisKey(String email) {
        return "auth:user_email_:" + email;
    }

    // Validation methods
    private void validateEmail(String email) {
        if (email == null) {
            throw new NullPointerException("Email must not be null");
        }
    }

    private void validateInputs(String email, User user, long expirationInMinutes) {
        validateEmail(email);
        if (user == null) {
            throw new NullPointerException("User must not be null");
        }
        if (expirationInMinutes <= 0) {
            throw new IllegalArgumentException("Expiration time must be greater than zero");
        }
    }

    private void storeUser(String email, User user, long expirationInMinutes) {
        try {
            String userJson = objectMapper.writeValueAsString(user);
            redisTemplate.opsForValue().set(
                    getRedisKey(email), userJson, expirationInMinutes, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not serialize User object", e);
        }
    }

    private Optional<User> deserializeUser(String userJson) {
        if (userJson == null) {
            return Optional.empty();
        }
        try {
            return Optional.of(objectMapper.readValue(userJson, User.class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not deserialize User JSON", e);
        }
    }
}