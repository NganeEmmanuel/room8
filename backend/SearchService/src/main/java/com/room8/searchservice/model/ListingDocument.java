package com.room8.searchservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "listings")
public class ListingDocument {

    @Id
    private String id;  // ES document id

    @Field(type = FieldType.Text)
    private String title;

    @Field(type = FieldType.Keyword)
    private List<String> imageUrls;

    @Field(type = FieldType.Integer)
    private Integer numberOfRooms;

    @Field(type = FieldType.Double)
    private Double roomArea;

    @Field(type = FieldType.Long)
    private Long numberOfBathrooms;

    @Field(type = FieldType.Boolean)
    private Boolean isSharedBathroom;

    @Field(type = FieldType.Double)
    private Double bathroomArea;

    @Field(type = FieldType.Integer)
    private Integer numberOfKitchens;

    @Field(type = FieldType.Boolean)
    private Boolean isSharedKitchen;

    @Field(type = FieldType.Double)
    private Double kitchenArea;

    @Field(type = FieldType.Keyword)
    private String bathroomLocation;

    @Field(type = FieldType.Keyword)
    private String listingCountry;

    @Field(type = FieldType.Keyword)
    private String listingState;

    @Field(type = FieldType.Keyword)
    private String listingCity;

    @Field(type = FieldType.Keyword)
    private String listingStreet;

    @Field(type = FieldType.Double)
    private Double listingPrice;

    @Field(type = FieldType.Text)
    private String listingDescription;

    @Field(type = FieldType.Keyword)
    private String listingStyle;

    @Field(type = FieldType.Integer)
    private Integer numberOfHouseMates;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private Date listedDate;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private Date lastUpdated;

    // Fields from subclasses
    @Field(type = FieldType.Boolean, storeNullValue = true)
    private Boolean hasLivingRoom;

    @Field(type = FieldType.Integer, storeNullValue = true)
    private Integer numberOfLivingRooms;

    @Field(type = FieldType.Double, storeNullValue = true)
    private Double livingRoomArea;

    @Field(type = FieldType.Boolean, storeNullValue = true)
    private Boolean hasOutDoorLivingArea;

    @Field(type = FieldType.Double, storeNullValue = true)
    private Double outDoorArea;

    // Discriminator for subclass type
    @Field(type = FieldType.Keyword)
    private String listingType;
}
