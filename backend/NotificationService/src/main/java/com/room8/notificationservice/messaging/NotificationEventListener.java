package com.room8.notificationservice.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.notificationservice.dto.Notification;
import com.room8.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    //Todo add event versioning for future implementation

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "notification-events", groupId = "notification-service-group")
    public void listenNotificationEvents(String message) {
        log.info("Received notification event: " + message);
        try {
            Notification event = objectMapper.readValue(message, Notification.class);
            notificationService.addNotification(event);

        } catch (Exception e) {
            log.error("Failed to process notification event", e);
        }
    }
}
