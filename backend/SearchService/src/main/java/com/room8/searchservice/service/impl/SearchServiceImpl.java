package com.room8.searchservice.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.*;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.room8.searchservice.dto.ListingDTO;
import com.room8.searchservice.mapper.ListingMapper;
import com.room8.searchservice.model.ListingDocument;
import com.room8.searchservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.room8.searchservice.exception.IllegalArgumentException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchServiceImpl implements SearchService {

    private final ElasticsearchClient elasticsearchClient;

    private static final String INDEX_NAME = "listings";

    @Override
    public void indexListing(ListingDTO listingDTO) {
        if (listingDTO == null) throw new IllegalArgumentException("ListingDTO cannot be null");

        ListingDocument doc = ListingMapper.toDocument(listingDTO);
        try {
            IndexResponse response = elasticsearchClient.index(i -> i
                    .index(INDEX_NAME)
                    .id(doc.getId())
                    .document(doc)
            );
            log.info("Indexed document with ID: {}", response.id());
        } catch (IOException e) {
            throw new RuntimeException("Failed to index listing", e);
        }
    }

    @Override
    public List<ListingDocument> searchListings(String query, String city, int page, int size) {
        try {
            SearchResponse<ListingDocument> response;

            if (query != null && !query.isEmpty()) {
                response = elasticsearchClient.search(s -> s
                                .index(INDEX_NAME)
                                .query(q -> q
                                        .bool(b -> b
                                                .should(s1 -> s1.match(m -> m.field("title").query(query)))
                                                .should(s2 -> s2.match(m -> m.field("listingDescription").query(query)))
                                        )
                                )
                                .from(page * size)
                                .size(size),
                        ListingDocument.class
                );
            } else if (city != null && !city.isEmpty()) {
                response = elasticsearchClient.search(s -> s
                                .index(INDEX_NAME)
                                .query(q -> q
                                        .match(m -> m.field("listingCity").query(city))
                                )
                                .from(page * size)
                                .size(size),
                        ListingDocument.class
                );
            } else {
                // Return everything
                response = elasticsearchClient.search(s -> s
                                .index(INDEX_NAME)
                                .query(q -> q.matchAll(m -> m))
                                .from(page * size)
                                .size(size),
                        ListingDocument.class
                );
            }

            return response.hits().hits().stream()
                    .map(Hit::source)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            throw new RuntimeException("Failed to search listings", e);
        }
    }

    @Override
    public void deleteListingById(String id) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("Id cannot be null or empty");
        }
        try {
            elasticsearchClient.delete(d -> d.index(INDEX_NAME).id(id));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete listing", e);
        }
    }
}
