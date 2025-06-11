package com.room8.searchservice.dto;

import com.room8.searchservice.enums.BathroomLocation;
import com.room8.searchservice.enums.ListingStyle;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchFilterDTO {
    private String query;
    private String country;
    private String state;
    private String city;

    private String listingType;
    private ListingStyle listingStyle;
    private Integer numberOfRooms;
    private Integer numberOfKitchens;
    private Integer numberOfBathrooms;
    private Integer numberOfHouseMates;
    private BathroomLocation bathroomLocation;
    private Double minPrice;
    private Double maxPrice;
}
