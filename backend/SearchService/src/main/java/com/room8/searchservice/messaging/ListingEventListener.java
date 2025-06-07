package com.room8.searchservice.messaging;

import com.room8.searchservice.dto.ListingDTO;
import com.room8.searchservice.service.SearchService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ListingEventListener {

    private final SearchService searchService;
    private final ObjectMapper objectMapper;  // Jackson JSON mapper

    @KafkaListener(topics = "listing-events", groupId = "search-service-group")
    public void listenListingEvents(String message) {
        try {
            ListingDTO listingDTO = objectMapper.readValue(message, ListingDTO.class);
            // Index or update the listing document
            searchService.indexListing(listingDTO);
            log.info("Indexed listing from event: {}", listingDTO.getId());
        } catch (Exception e) {
            log.error("Failed to process listing event", e);
        }
    }
}
