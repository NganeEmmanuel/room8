package com.room8.searchservice.dto;

import com.room8.searchservice.enums.BathroomLocation;
import com.room8.searchservice.enums.ListingStyle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ListingDTO {
    private Long id;
    private String title;
    private List<String> imagesUrls;
    private Integer numberOfRooms;
    private Double roomArea; //in square meters
    private Long numberOfBathrooms;
    private Boolean isSharedBathroom;
    private Double bathroomArea; //in square meters
    private Integer numberOfKitchens;
    private Boolean isSharedKitchen;
    private Double kitchenArea; //in square meters
    private BathroomLocation bathroomLocation;
    private String listingCountry;
    private String listingState;
    private String listingCity;
    private String listingStreet;
    private Double listingPrice;
    private String listingDescription;
    private ListingStyle listingStyle;
    private Integer numberOfHouseMates;
    private Date listedDate;
    private Date lastUpdated;
}
