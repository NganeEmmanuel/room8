package com.room8.searchservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.room8.searchservice.dto.ListingDTO;
import com.room8.searchservice.dto.SearchFilterDTO;
import com.room8.searchservice.exception.IllegalArgumentException;
import com.room8.searchservice.mapper.ListingMapper;
import com.room8.searchservice.model.ListingDocument;
import com.room8.searchservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.opensearch.action.delete.DeleteRequest;
import org.opensearch.action.index.IndexRequest;
import org.opensearch.action.search.SearchRequest;
import org.opensearch.action.search.SearchResponse;
import org.opensearch.client.RequestOptions;
import org.opensearch.client.RestHighLevelClient;
import org.opensearch.common.unit.TimeValue;
import org.opensearch.common.xcontent.XContentType;
import org.opensearch.index.query.*;
import org.opensearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchServiceImpl implements SearchService {

    private final RestHighLevelClient openSearchClient;
    private final ObjectMapper objectMapper;

    private static final String INDEX_NAME = "listings";

    @Override
    public void indexListing(ListingDTO listingDTO) {
        if (listingDTO == null) throw new IllegalArgumentException("ListingDTO cannot be null");

        ListingDocument doc = ListingMapper.toDocument(listingDTO);

        try {
            IndexRequest request = new IndexRequest(INDEX_NAME)
                    .id(doc.getId())
                    .source(objectMapper.writeValueAsString(doc), XContentType.JSON);

            openSearchClient.index(request, RequestOptions.DEFAULT);
            log.info("✅ Indexed document with ID: {}", doc.getId());
        } catch (IOException e) {
            throw new RuntimeException("❌ Failed to index listing", e);
        }
    }

    @Override
    public List<ListingDocument> searchListings(String query, String city, int page, int size) {
        try {
            SearchRequest searchRequest = new SearchRequest(INDEX_NAME);
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();

            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();

            if (query != null && !query.isEmpty()) {
                boolQuery.should(QueryBuilders.matchQuery("title", query));
                boolQuery.should(QueryBuilders.matchQuery("listingDescription", query));
            }

            if (city != null && !city.isEmpty()) {
                boolQuery.must(QueryBuilders.matchQuery("listingCity", city));
            }

            if (boolQuery.should().isEmpty() && boolQuery.must().isEmpty()) {
                sourceBuilder.query(QueryBuilders.matchAllQuery());
            } else {
                sourceBuilder.query(boolQuery);
            }

            sourceBuilder.from(page * size);
            sourceBuilder.size(size);
            sourceBuilder.timeout(TimeValue.timeValueSeconds(5));

            searchRequest.source(sourceBuilder);
            SearchResponse response = openSearchClient.search(searchRequest, RequestOptions.DEFAULT);

            return Arrays.stream(response.getHits().getHits())
                    .map(hit -> {
                        try {
                            return objectMapper.readValue(hit.getSourceAsString(), ListingDocument.class);
                        } catch (IOException e) {
                            log.error("⚠️ Failed to parse search hit: {}", hit.getId(), e);
                            return null;
                        }
                    })
                    .filter(doc -> doc != null)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            throw new RuntimeException("❌ Failed to search listings", e);
        }
    }

    @Override
    public List<ListingDocument> searchListings(SearchFilterDTO filter, int page, int size) {
        try {
            SearchRequest searchRequest = new SearchRequest(INDEX_NAME);
            SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();

            BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();

            if (filter.getQuery() != null && !filter.getQuery().isEmpty()) {
                boolQuery.should(QueryBuilders.matchQuery("title", filter.getQuery()));
                boolQuery.should(QueryBuilders.matchQuery("listingDescription", filter.getQuery()));
            }

            // Location filters
            if (filter.getCountry() != null) {
                boolQuery.must(QueryBuilders.matchQuery("listingCountry", filter.getCountry()));
            }
            if (filter.getState() != null) {
                boolQuery.must(QueryBuilders.matchQuery("listingState", filter.getState()));
            }
            if (filter.getCity() != null) {
                boolQuery.must(QueryBuilders.matchQuery("listingCity", filter.getCity()));
            }

            // Enum & other filters
            if (filter.getListingType() != null) {
                boolQuery.must(QueryBuilders.matchQuery("listingType", filter.getListingType()));
            }
            if (filter.getListingStyle() != null) {
                boolQuery.must(QueryBuilders.matchQuery("listingStyle", filter.getListingStyle().name()));
            }
            if (filter.getBathroomLocation() != null) {
                boolQuery.must(QueryBuilders.matchQuery("bathroomLocation", filter.getBathroomLocation().name()));
            }

            // Numeric filters
            if (filter.getNumberOfRooms() != null) {
                boolQuery.must(QueryBuilders.termQuery("numberOfRooms", filter.getNumberOfRooms()));
            }
            if (filter.getNumberOfBathrooms() != null) {
                boolQuery.must(QueryBuilders.termQuery("numberOfBathrooms", filter.getNumberOfBathrooms()));
            }
            if (filter.getNumberOfKitchens() != null) {
                boolQuery.must(QueryBuilders.termQuery("numberOfKitchens", filter.getNumberOfKitchens()));
            }
            if (filter.getNumberOfHouseMates() != null) {
                boolQuery.must(QueryBuilders.termQuery("numberOfHouseMates", filter.getNumberOfHouseMates()));
            }

            // Price range
            if (filter.getMinPrice() != null || filter.getMaxPrice() != null) {
                RangeQueryBuilder priceRange = QueryBuilders.rangeQuery("listingPrice");
                if (filter.getMinPrice() != null) {
                    priceRange.gte(filter.getMinPrice());
                }
                if (filter.getMaxPrice() != null) {
                    priceRange.lte(filter.getMaxPrice());
                }
                boolQuery.must(priceRange);
            }

            // Use match_all if no filters provided
            if (boolQuery.should().isEmpty() && boolQuery.must().isEmpty()) {
                sourceBuilder.query(QueryBuilders.matchAllQuery());
            } else {
                sourceBuilder.query(boolQuery);
            }

            // Pagination & sorting
            sourceBuilder.from(page * size);
            sourceBuilder.size(size);
            sourceBuilder.timeout(TimeValue.timeValueSeconds(5));
            sourceBuilder.sort("listedDate", org.opensearch.search.sort.SortOrder.DESC); // sort by newest

            searchRequest.source(sourceBuilder);

            SearchResponse response = openSearchClient.search(searchRequest, RequestOptions.DEFAULT);

            return Arrays.stream(response.getHits().getHits())
                    .map(hit -> {
                        try {
                            return objectMapper.readValue(hit.getSourceAsString(), ListingDocument.class);
                        } catch (IOException e) {
                            log.error("⚠️ Failed to parse search hit: {}", hit.getId(), e);
                            return null;
                        }
                    })
                    .filter(doc -> doc != null)
                    .collect(Collectors.toList());

        } catch (IOException e) {
            throw new RuntimeException("❌ Failed to perform filtered search", e);
        }
    }



    @Override
    public void deleteListingById(String id) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("Id cannot be null or empty");
        }
        try {
            DeleteRequest request = new DeleteRequest(INDEX_NAME, id);
            openSearchClient.delete(request, RequestOptions.DEFAULT);
            log.info("🗑️ Deleted listing with ID: {}", id);
        } catch (IOException e) {
            throw new RuntimeException("❌ Failed to delete listing", e);
        }
    }
}
