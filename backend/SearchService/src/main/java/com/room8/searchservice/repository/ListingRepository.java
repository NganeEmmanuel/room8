package com.room8.searchservice.repository;

import com.room8.searchservice.model.ListingDocument;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends ElasticsearchRepository<ListingDocument, String> {

    // Custom query to find listings by city
    List<ListingDocument> findByListingCity(String city);

    @Query("""
            {
              "bool": {
                "should": [
                  { "match": { "listingDescription": "?0" }},
                  { "match": { "listingTitle": "?0" }}
                ]
              }
            }""")
    List<ListingDocument> searchByDescriptionOrTitle(String query);
}
