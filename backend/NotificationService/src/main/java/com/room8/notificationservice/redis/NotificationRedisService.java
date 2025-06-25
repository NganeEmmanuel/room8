package com.room8.notificationservice.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.notificationservice.dto.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class NotificationRedisService {
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    private static final long MAX_NOTIFICATIONS = 50;

    public void storeNotification(Long userId, Notification notification, long expirationInMinutes) {
        validateInputs(userId, notification, expirationInMinutes);
        try {
            String notifJson = objectMapper.writeValueAsString(notification);
            String key = getRedisKey(userId);
            redisTemplate.opsForList().leftPush(key, notifJson);
            redisTemplate.opsForList().trim(key, 0, MAX_NOTIFICATIONS - 1); // keep only latest 50
            redisTemplate.expire(key, expirationInMinutes, TimeUnit.MINUTES);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Could not serialize notification", e);
        }
    }

    public List<Notification> getNotifications(Long userId) {
        validateUserId(userId);
        String key = getRedisKey(userId);
        List<String> notifJsonList = redisTemplate.opsForList().range(key, 0, -1);
        if (notifJsonList == null) return new ArrayList<>();

        List<Notification> notifications = new ArrayList<>();
        for (String json : notifJsonList) {
            try {
                notifications.add(objectMapper.readValue(json, Notification.class));
            } catch (JsonProcessingException e) {
                // log and skip corrupted entry
                System.err.println("Skipping corrupted notification JSON: " + json);
            }
        }
        return notifications;
    }

    public void invalidateNotifications(Long userId) {
        validateUserId(userId);
        redisTemplate.delete(getRedisKey(userId));
    }

    private String getRedisKey(Long userId) {
        return "notifications:user:" + userId;
    }

    private void validateUserId(Long userId) {
        if (userId == null) throw new IllegalArgumentException("UserId must not be null");
    }

    private void validateInputs(Long userId, Notification notification, long expirationInMinutes) {
        validateUserId(userId);
        if (notification == null) throw new IllegalArgumentException("Notification must not be null");
        if (expirationInMinutes <= 0) throw new IllegalArgumentException("Expiration must be > 0");
    }

    public void markNotificationAsRead(Long userId, Long notificationId) {
        validateUserId(userId);

        String key = getRedisKey(userId);
        List<String> rawList = redisTemplate.opsForList().range(key, 0, -1);
        if (rawList == null) return;

        List<String> updatedList = new ArrayList<>();

        for (String rawJson : rawList) {
            try {
                Notification notif = objectMapper.readValue(rawJson, Notification.class);
                if (notif.getBidId().equals(notificationId)) {
                    notif.setStatus("READ"); // Ensure your DTO supports this field
                    String updatedJson = objectMapper.writeValueAsString(notif);
                    updatedList.add(updatedJson);
                } else {
                    updatedList.add(rawJson);
                }
            } catch (JsonProcessingException e) {
                System.err.println("Skipping malformed notification JSON during update: " + rawJson);
            }
        }

        // Clear existing list and re-push updated list
        redisTemplate.delete(key);
        if (!updatedList.isEmpty()) {
            redisTemplate.opsForList().rightPushAll(key, updatedList);
            redisTemplate.expire(key, 30, TimeUnit.MINUTES); // or reuse previous expiration config
        }
    }

}
