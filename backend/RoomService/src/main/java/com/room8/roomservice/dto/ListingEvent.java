package com.room8.roomservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListingEvent {
    private String eventType; // CREATE, UPDATE, DELETE
    private ListingDTO listing;
}