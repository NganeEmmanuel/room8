package com.room8.searchservice.messaging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.searchservice.dto.NotificationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;


@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationEventPublisher {
    //Todo add event versioning for future implementation

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String TOPIC = "notification-events";

    public void publishListingEvent(Long listingId, Long userId, String message, String status, Date dateCreated, Long bidId ) {
        try {
            NotificationEvent event = new NotificationEvent("New Bid Received", bidId, userId, listingId, message,dateCreated, status);
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC, json);
            log.info("Published notification event: {}, message: {}", userId, event);
        } catch (JsonProcessingException e) {
            log.error("Failed to publish listing event", e);
        }
    }

}
