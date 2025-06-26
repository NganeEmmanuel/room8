package com.room8.notificationservice.service.impl;

import com.room8.notificationservice.dto.Notification;
import com.room8.notificationservice.redis.NotificationRedisService;
import com.room8.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRedisService notificationRedisService;
    @Override
    public List<Notification> getNotifications(Long userId) {
        return notificationRedisService.getNotifications(userId);
    }

    @Override
    public void markAsRead(Long userId, Long notificationId) {
        notificationRedisService.markNotificationAsRead(userId, notificationId);
    }

    @Override
    public void addNotification(Notification notification) {
        notificationRedisService.storeNotification(notification.getUserId(), notification, 60 * 60 * 24 * 10); // Store for 1 hour
    }


}
