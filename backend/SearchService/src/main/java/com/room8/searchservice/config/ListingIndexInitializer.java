package com.room8.searchservice.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.opensearch.client.RequestOptions;
import org.opensearch.client.RestHighLevelClient;
import org.opensearch.client.indices.CreateIndexRequest;
import org.opensearch.client.indices.GetIndexRequest;
import org.opensearch.client.indices.CreateIndexResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class ListingIndexInitializer {

    private static final String INDEX_NAME = "listings";
    private final RestHighLevelClient openSearchClient;

    @PostConstruct
    public void createIndexIfNotExists() {
        try {
            boolean exists = openSearchClient.indices()
                    .exists(new GetIndexRequest(INDEX_NAME), RequestOptions.DEFAULT);

            if (!exists) {
                CreateIndexRequest request = new CreateIndexRequest(INDEX_NAME);
                request.mapping(getIndexMappings(), org.opensearch.common.xcontent.XContentType.JSON);

                CreateIndexResponse response = openSearchClient.indices()
                        .create(request, RequestOptions.DEFAULT);

                if (response.isAcknowledged()) {
                    log.info("✅ Index '{}' created successfully.", INDEX_NAME);
                } else {
                    log.warn("⚠️ Index '{}' creation not acknowledged.", INDEX_NAME);
                }
            } else {
                log.info("ℹ️ Index '{}' already exists.", INDEX_NAME);
            }
        } catch (IOException e) {
            log.error("❌ Failed to create '{}' index: {}", INDEX_NAME, e.getMessage(), e);
        }
    }

    private String getIndexMappings() {
        return """
        {
          "properties": {
            "landlordId": { "type": "long" },
            "title": { "type": "text" },
            "imageUrls": { "type": "keyword" },
            "numberOfRooms": { "type": "integer" },
            "roomArea": { "type": "double" },
            "numberOfBathrooms": { "type": "integer" },
            "isSharedBathroom": { "type": "boolean" },
            "bathroomArea": { "type": "double" },
            "numberOfKitchens": { "type": "integer" },
            "isSharedKitchen": { "type": "boolean" },
            "kitchenArea": { "type": "double" },
            "bathroomLocation": { "type": "keyword" },
            "listingCountry": { "type": "keyword" },
            "listingState": { "type": "keyword" },
            "listingCity": { "type": "keyword" },
            "listingStreet": { "type": "keyword" },
            "listingPrice": { "type": "double" },
            "listingDescription": { "type": "text" },
            "listingStyle": { "type": "keyword" },
            "numberOfHouseMates": { "type": "integer" },
            "listedDate": { "type": "date", "format": "strict_date_optional_time||epoch_millis" },
            "lastUpdated": { "type": "date", "format": "strict_date_optional_time||epoch_millis" },
            "hasLivingRoom": { "type": "boolean", "null_value": true },
            "numberOfLivingRooms": { "type": "integer", "null_value": 0 },
            "livingRoomArea": { "type": "double", "null_value": 0.0 },
            "hasOutDoorLivingArea": { "type": "boolean", "null_value": true },
            "outDoorArea": { "type": "double", "null_value": 0.0 },
            "listingType": { "type": "keyword" }
          }
        }
        """;
    }
}
