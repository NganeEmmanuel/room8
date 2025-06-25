package com.room8.notificationservice.service;

import com.room8.notificationservice.dto.Notification;

import java.util.List;

public interface NotificationService {

    /**
     *  * Creates a new notification for a user.
     * @param userId id of the user to whom the notification belongs
     * @return Notification object containing the details of the created notification
     */
    List<Notification> getNotifications(Long userId);

    void markAsRead(Long userId, Long notificationId);

    void addNotification(Notification notification);

}
