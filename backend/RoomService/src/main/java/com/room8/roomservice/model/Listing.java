package com.room8.roomservice.model;

import com.room8.roomservice.enums.BathroomLocation;
import com.room8.roomservice.enums.ListingStyle;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS) //  creates a table for each subclass, using a discriminator column to distinguish them.
public class Listing {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;
    @Column(nullable = false)
    private Long landlordId;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String listingType;
    @ElementCollection
    @Column(nullable = false)
    private List<String> imageUrls;
    @Column(nullable = false)
    private Integer numberOfRooms;
    @Column(nullable = false)
    private Double roomArea; //in square meters
    @Column(nullable = false)
    private Integer numberOfBathrooms;
    @Column(nullable = false)
    private Boolean isSharedBathroom;
    @Column(nullable = false)
    private Double bathroomArea; //in square meters
    @Column(nullable = false)
    private Integer numberOfKitchens;
    @Column(nullable = false)
    private Boolean isSharedKitchen;
    @Column(nullable = false)
    private Double kitchenArea; //in square meters
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BathroomLocation bathroomLocation;
    @Column(nullable = false)
    private String listingCountry;
    @Column(nullable = false)
    private String listingState;
    @Column(nullable = false)
    private String listingCity;
    @Column(nullable = false)
    private String listingStreet;
    @Column(nullable = false)
    private Double listingPrice;
    @Column(nullable = false, length = 7000)
    private String listingDescription;
    @Column(nullable = false)
    private ListingStyle listingStyle;
    @Column(nullable = false)
    private Integer numberOfHouseMates;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(updatable = false)
    private Date listedDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdated;


    @PrePersist
    protected void onCreate() {
        listedDate = new Date();
        lastUpdated = new Date();
    }
}
