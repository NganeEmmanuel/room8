package com.room8.searchservice.messaging;

import com.room8.searchservice.dto.ListingEvent;
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

    //Todo add event versioning for future implementation

    private final SearchService searchService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "listing-events", groupId = "search-service-group")
    public void listenListingEvents(String message) {
        try {
            ListingEvent event = objectMapper.readValue(message, ListingEvent.class);
            String eventType = event.getEventType();

            switch (eventType) {
                case "CREATE", "UPDATE" -> {
                    searchService.indexListing(event.getListing());
                    log.info("Indexed listing with ID: {}", event.getListing().getId());
                }
                case "DELETE" -> {
                    searchService.deleteListingById(String.valueOf(event.getListing().getId()));
                    log.info("Deleted listing with ID: {}", event.getListing().getId());
                }
                case "BULK_DELETE" -> {
                    if (event.getListingIds() != null) {
                        for (Long id : event.getListingIds()) {
                            searchService.deleteListingById(String.valueOf(id));
                            log.info("Bulk Delete - Deleted listing with ID: {}", id);
                        }
                    }else {
                        throw new IllegalArgumentException("Listing IDs cannot be null");
                    }
                }
                default -> log.warn("Received unknown event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Failed to process listing event", e);
        }
    }
}
