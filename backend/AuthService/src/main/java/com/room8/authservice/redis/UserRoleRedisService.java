package com.room8.authservice.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.authservice.model.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserRoleRedisService {
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper; // Jackson ObjectMapper to handle JSON

    public void storeUserRole(String role, UserRole userRole, long expirationInMinutes) {
        try {
            String userRoleJson = objectMapper.writeValueAsString(userRole);
            redisTemplate.opsForValue().set(
                    getRedisKey(role), userRoleJson, expirationInMinutes, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not serialize UserRole object", e);
        }
    }

    public UserRole getUserRole(String role) {
        String userRoleJson = redisTemplate.opsForValue().get(getRedisKey(role));
        if (userRoleJson == null) {
            return null;
        }
        try {
            return objectMapper.readValue(userRoleJson, UserRole.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not deserialize User JSON", e);
        }
    }

    public void invalidateUserRole(String role) {
        redisTemplate.delete(getRedisKey(role));
    }

    public void updateUserRole(String role, UserRole updatedUserRole, long newExpirationInMinutes) {
        try {
            String userJson = objectMapper.writeValueAsString(updatedUserRole);
            redisTemplate.opsForValue().set(
                    getRedisKey(role), userJson, newExpirationInMinutes, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not serialize updated UserRole object", e);
        }
    }

    // 🧹 Private helper method to generate Redis key
    private String getRedisKey(String role) {
        return "user_role_:" + role;
    }
}

