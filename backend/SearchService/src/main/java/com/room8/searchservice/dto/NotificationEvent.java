package com.room8.searchservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class NotificationEvent {
    private Long bidId;
    private Long userId;
    private Long listingId;
    private String message;
    private Date dateCreated;
    private String status;

}
