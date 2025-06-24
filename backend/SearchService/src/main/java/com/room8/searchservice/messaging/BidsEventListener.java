package com.room8.searchservice.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.searchservice.dto.BidsEvent;
import com.room8.searchservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BidsEventListener {

    //Todo add event versioning for future implementation

    private final SearchService searchService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "bid-events", groupId = "search-service-group")
    public void listenBidEvents(String message) {
        try {
            BidsEvent event = objectMapper.readValue(message, BidsEvent.class);
            String eventType = event.getEventType();

            if (eventType.equals("NOTIFY_LANDLORD")) {
                var Listing =  searchService.findListingById(event.getListingId().toString());
                //todo: notify landlord about new bid (publish to a topic for notification service)
                log.info("emitting notify user event...: {}", event.getListingId());
            } else {
                log.warn("Received unknown event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Failed to process listing event", e);
        }
    }
}
