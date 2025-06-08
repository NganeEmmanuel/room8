package com.room8.roomservice.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.roomservice.dto.ListingDTO;
import com.room8.roomservice.dto.ListingEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ListingEventPublisher {

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
}
