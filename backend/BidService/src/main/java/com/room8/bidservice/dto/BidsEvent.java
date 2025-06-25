package com.room8.bidservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidsEvent {
    private Long bidId;
    private String eventType; // notify landlord (NOTIFY_LANDLORD)
    private Long listingId;
}