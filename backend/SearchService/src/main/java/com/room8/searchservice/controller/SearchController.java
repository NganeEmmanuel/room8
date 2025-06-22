package com.room8.searchservice.controller;

import com.room8.searchservice.dto.SearchFilterDTO;
import com.room8.searchservice.model.ListingDocument;
import com.room8.searchservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<List<ListingDocument>> searchListings(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<ListingDocument> results = searchService.searchListings(query, city, page, size);
        return ResponseEntity.ok(results);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable String id) {
        searchService.deleteListingById(id);
        return ResponseEntity.noContent().build();
    }
}
