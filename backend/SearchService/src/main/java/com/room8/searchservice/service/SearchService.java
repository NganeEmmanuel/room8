package com.room8.searchservice.service;

import com.room8.searchservice.dto.ListingDTO;
import com.room8.searchservice.model.ListingDocument;

import java.util.List;

public interface SearchService {

    // Index or update a listing document in Elasticsearch
    void indexListing(ListingDTO listingDTO);

    // Search listings by keyword, location, filters etc. - simple example
    List<ListingDocument> searchListings(String query, String city, int page, int size);

    // Delete a listing document by id
    void deleteListingById(String id);
}
