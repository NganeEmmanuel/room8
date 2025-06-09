package com.room8.roomservice.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.roomservice.dto.ListingDTO;
import com.room8.roomservice.dto.ListingEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ListingEventPublisher {
    //Todo add event versioning for future implementation

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String TOPIC = "listing-events";

    public void publishListingEvent(ListingDTO listingDTO, String eventType) {
        try {
            ListingEvent event = new ListingEvent(eventType, listingDTO);
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC, json);
            log.info("Published listing event: {}, type: {}", listingDTO.getId(), eventType);
        } catch (JsonProcessingException e) {
            log.error("Failed to publish listing event", e);
        }
    }

    public void publishBulkDeleteEvent(List<Long> listingIds) {
        try {
            ListingEvent event = new ListingEvent();
            event.setEventType("BULK_DELETE");
            event.setListingIds(listingIds);
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC, json);
            log.info("Published bulk delete event for {} listings", listingIds.size());
        } catch (JsonProcessingException e) {
            log.error("Failed to publish bulk delete event", e);
        }
    }

}
