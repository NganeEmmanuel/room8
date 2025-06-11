package com.room8.searchservice.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import co.elastic.clients.elasticsearch.indices.CreateIndexResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListingIndexInitializer {

    private static final String INDEX_NAME = "listings";

    private final ElasticsearchClient elasticsearchClient;

    @PostConstruct
    public void createIndexIfNotExists() {
        try {
            boolean exists = elasticsearchClient.indices()
                    .exists(e -> e.index(INDEX_NAME)).value();

            if (!exists) {
                CreateIndexResponse response = elasticsearchClient.indices().create(CreateIndexRequest.of(c -> c
                        .index(INDEX_NAME)
                        .mappings(m -> m
                                .properties("landlordId", p -> p.long_(v -> v))
                                .properties("title", p -> p.text(t -> t))
                                .properties("imageUrls", p -> p.keyword(k -> k))
                                .properties("numberOfRooms", p -> p.integer(i -> i))
                                .properties("roomArea", p -> p.double_(d -> d))
                                .properties("numberOfBathrooms", p -> p.integer(i -> i))
                                .properties("isSharedBathroom", p -> p.boolean_(b -> b))
                                .properties("bathroomArea", p -> p.double_(d -> d))
                                .properties("numberOfKitchens", p -> p.integer(i -> i))
                                .properties("isSharedKitchen", p -> p.boolean_(b -> b))
                                .properties("kitchenArea", p -> p.double_(d -> d))
                                .properties("bathroomLocation", p -> p.keyword(k -> k))
                                .properties("listingCountry", p -> p.keyword(k -> k))
                                .properties("listingState", p -> p.keyword(k -> k))
                                .properties("listingCity", p -> p.keyword(k -> k))
                                .properties("listingStreet", p -> p.keyword(k -> k))
                                .properties("listingPrice", p -> p.double_(d -> d))
                                .properties("listingDescription", p -> p.text(t -> t))
                                .properties("listingStyle", p -> p.keyword(k -> k))
                                .properties("numberOfHouseMates", p -> p.integer(i -> i))
                                .properties("listedDate", p -> p.date(d -> d.format("strict_date_time")))
                                .properties("lastUpdated", p -> p.date(d -> d.format("strict_date_time")))
                                .properties("hasLivingRoom", p -> p.boolean_(b -> b.nullValue(true)))
                                .properties("numberOfLivingRooms", p -> p.integer(i -> i.nullValue(0)))
                                .properties("livingRoomArea", p -> p.double_(d -> d.nullValue(0.0)))
                                .properties("hasOutDoorLivingArea", p -> p.boolean_(b -> b.nullValue(true)))
                                .properties("outDoorArea", p -> p.double_(d -> d.nullValue(0.0)))
                                .properties("listingType", p -> p.keyword(k -> k))
                        )
                ));
                System.out.println("Index 'listings' created: " + response.acknowledged());
            } else {
                System.out.println("Index 'listings' already exists.");
            }
        } catch (Exception e) {
            System.err.println("Failed to create 'listings' index: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
