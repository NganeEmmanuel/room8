package com.room8.roomservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListingEvent {
    private String eventType; // CREATE, UPDATE, DELETE
    private ListingDTO listing;
    private List<Long> listingIds;  // used for BULK_DELETE

    public ListingEvent(String eventType, ListingDTO listingDTO) {
        this.eventType = eventType;
        this.listing = listingDTO;
    }
}