package com.room8.bidservice.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.bidservice.dto.BidsEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@RequiredArgsConstructor
public class BidsEventPublisher {
    //Todo add event versioning for future implementation

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String TOPIC = "bid-events";

    public void publishListingEvent(Long listingId, String eventType, Long bidId) {
        try {
            BidsEvent event = new BidsEvent( bidId, eventType, listingId);
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC, json);
            log.info("Published bid event: {}, type: {}", listingId, eventType);
        } catch (JsonProcessingException e) {
            log.error("Failed to publish listing event", e);
        }
    }

}
