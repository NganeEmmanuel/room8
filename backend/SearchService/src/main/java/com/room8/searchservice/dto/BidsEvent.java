package com.room8.searchservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BidsEvent {
    private String eventType; // notify landlord (NOTIFY_LANDLORD)
    private Long listingId;
}