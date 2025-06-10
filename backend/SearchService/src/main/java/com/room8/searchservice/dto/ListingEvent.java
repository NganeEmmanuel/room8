package com.room8.searchservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListingEvent {
    private String eventType; // CREATE, UPDATE, DELETE
    private ListingDTO listing;
    private List<Long> listingIds;  // used for BULK_DELETE
}
