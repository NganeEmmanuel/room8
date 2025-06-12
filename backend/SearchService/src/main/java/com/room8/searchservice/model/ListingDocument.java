package com.room8.searchservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingDocument {

    private String id;
    private Long landlordId;

    private String title;
    private List<String> imageUrls;

    private Integer numberOfRooms;
    private Double roomArea;

    private Integer numberOfBathrooms;
    private Boolean isSharedBathroom;
    private Double bathroomArea;

    private Integer numberOfKitchens;
    private Boolean isSharedKitchen;
    private Double kitchenArea;

    private String bathroomLocation;
    private String listingCountry;
    private String listingState;
    private String listingCity;
    private String listingStreet;

    private Double listingPrice;
    private String listingDescription;
    private String listingStyle;

    private Integer numberOfHouseMates;

    private Date listedDate;
    private Date lastUpdated;

    private Boolean hasLivingRoom;
    private Integer numberOfLivingRooms;
    private Double livingRoomArea;

    private Boolean hasOutDoorLivingArea;
    private Double outDoorArea;

    private String listingType;
}
