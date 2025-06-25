package com.room8.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Notification {
    private Long bidId;
    private Long userId;
    private Long listingId;
    private String message;
    private Date dateCreated;
    private String status;
}
