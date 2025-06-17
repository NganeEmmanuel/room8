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

    //common and single studio and apartment
    private Long id;
    private Long landlordId;
    private String title;
    private String listingType;
    private List<String> imageUrls;
    private Integer numberOfRooms;
    private Double roomArea; //in square meters
    private Integer numberOfBathrooms;
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

    //common in studio and apartment only
    private Boolean hasLivingRoom;
    private Integer numberOfLivingRooms;
    private Double livingRoomArea; //in square meters

    // common in apartment only
    private Boolean hasOutDoorLivingArea;
    private Double outDoorArea; //in square meters
}
