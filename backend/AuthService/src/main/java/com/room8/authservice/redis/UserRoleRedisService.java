package com.room8.authservice.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.authservice.model.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserRoleRedisService {
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper; // Jackson ObjectMapper to handle JSON

    public void storeUserRole(String role, UserRole userRole, long expirationInMinutes) {
        validateInputs(role, userRole, expirationInMinutes);
        storeUser(role, userRole, expirationInMinutes);
    }

    public UserRole getUserRole(String role) {
        validateRole(role);
        String userRoleJson = redisTemplate.opsForValue().get(getRedisKey(role));
        return deserializeUserRole(userRoleJson);
    }

    public void invalidateUserRole(String role) {
        validateRole(role);
        redisTemplate.delete(getRedisKey(role));
    }

    public void updateUserRole(String role, UserRole updatedUserRole, long newExpirationInMinutes) {
        validateInputs(role, updatedUserRole, newExpirationInMinutes);
        storeUser(role, updatedUserRole, newExpirationInMinutes);
    }

    // 🧹 Private helper method to generate Redis key
    private String getRedisKey(String role) {
        return "auth:user_role_:" + role;
    }

    // Validation methods
    private void validateRole(String role) {
        if (role == null) {
            throw new NullPointerException("Role must not be null");
        }
    }

    private void validateInputs(String role, UserRole userRole, long expirationInMinutes) {
        validateRole(role);
        if (userRole == null) {
            throw new NullPointerException("UserRole must not be null");
        }
        if (expirationInMinutes <= 0) {
            throw new IllegalArgumentException("Expiration time must be greater than zero");
        }
    }

    private void storeUser(String role, UserRole userRole, long expirationInMinutes) {
        try {
            String userRoleJson = objectMapper.writeValueAsString(userRole);
            redisTemplate.opsForValue().set(
                    getRedisKey(role), userRoleJson, expirationInMinutes, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not serialize UserRole object", e);
        }
    }

    private UserRole deserializeUserRole(String userRoleJson) {
        if (userRoleJson == null) {
            return null;
        }
        try {
            return objectMapper.readValue(userRoleJson, UserRole.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not deserialize UserRole JSON", e);
        }
    }
}