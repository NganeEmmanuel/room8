package com.room8.notificationservice.controller;

import com.room8.notificationservice.dto.Notification;
import com.room8.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@RequestParam Long userId) {
        return ResponseEntity.ok(notificationService.getNotifications(userId));
    }

    @PostMapping("/{notificationId}/read")
    public void markAsRead(@PathVariable Long notificationId, @RequestParam Long userId) {
        notificationService.markAsRead(userId, notificationId);
    }
}
