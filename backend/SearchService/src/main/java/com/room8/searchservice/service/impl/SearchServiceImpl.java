package com.room8.searchservice.service.impl;

import com.room8.searchservice.dto.ListingDTO;
import com.room8.searchservice.mapper.ListingMapper;
import com.room8.searchservice.model.ListingDocument;
import com.room8.searchservice.repository.ListingRepository;
import com.room8.searchservice.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.room8.searchservice.exception.IllegalArgumentException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class SearchServiceImpl implements SearchService {

    private final ListingRepository listingRepository;

    @Override
    public void indexListing(ListingDTO listingDTO) {
        if (listingDTO == null) {
            throw new IllegalArgumentException("ListingDTO cannot be null");
        }
        ListingDocument doc = ListingMapper.toDocument(listingDTO);
        listingRepository.save(doc);
    }

    @Override
    public List<ListingDocument> searchListings(String query, String city, int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Page index must not be less than zero");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than zero");
        }

        if (query != null && !query.isEmpty()) {
            // Perform full text search by description
            return listingRepository.searchByDescriptionOrTitle(query);
        }

        if (city == null || city.isEmpty()) {
            Iterable<ListingDocument> iterable = listingRepository.findAll();
            return StreamSupport.stream(iterable.spliterator(), false)
                    .collect(Collectors.toList());
        }

        return listingRepository.findByListingCity(city);
    }

    @Override
    public void deleteListingById(String id) {
        if (id == null || id.isEmpty()) {
            throw new IllegalArgumentException("Id cannot be null or empty");
        }
        listingRepository.deleteById(id);
    }
}
