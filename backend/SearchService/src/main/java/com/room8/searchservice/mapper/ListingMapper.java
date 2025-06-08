package com.room8.searchservice.mapper;

import com.room8.searchservice.dto.ApartmentDTO;
import com.room8.searchservice.dto.ListingDTO;
import com.room8.searchservice.dto.SingleRoomDTO;
import com.room8.searchservice.dto.StudioDTO;
import com.room8.searchservice.exception.IllegalArgumentException;
import com.room8.searchservice.model.ListingDocument;


/**
 * Utility class for mapping ListingDTO objects to ListingDocument for Elasticsearch.
 */
public final class ListingMapper {

    private ListingMapper() {
        // Utility class - prevent instantiation
    }

    /**
     * Converts a ListingDTO to a ListingDocument suitable for Elasticsearch indexing.
     *
     * @param listing the ListingDTO to convert; must not be null
     * @return the corresponding ListingDocument
     * @throws IllegalArgumentException if the listing is null
     */
    public static ListingDocument toDocument(ListingDTO listing) {
        if (listing == null) {
            throw new IllegalArgumentException("Listing must not be null");
        }

        ListingDocument.ListingDocumentBuilder builder = baseBuilder(listing);

        // Determine subclass type for discriminator and additional fields
        switch (listing) {
            case StudioDTO studio -> builder.listingType("Studio")
                    .hasLivingRoom(studio.getHasLivingRoom())
                    .numberOfLivingRooms(studio.getNumberOfLivingRooms())
                    .livingRoomArea(studio.getLivingRoomArea());

            case ApartmentDTO apartment -> builder.listingType("Apartment")
                    .hasLivingRoom(apartment.getHasLivingRoom())
                    .numberOfLivingRooms(apartment.getNumberOfLivingRooms())
                    .livingRoomArea(apartment.getLivingRoomArea())
                    .hasOutDoorLivingArea(apartment.getHasOutDoorLivingArea())
                    .outDoorArea(apartment.getOutDoorArea());

            case SingleRoomDTO singleRoomDTO -> builder.listingType("SingleRoom");

            default -> builder.listingType("Listing"); // fallback base type
        }

        return builder.build();
    }

    private static ListingDocument.ListingDocumentBuilder baseBuilder(ListingDTO listing) {
        return ListingDocument.builder()
                .id(listing.getId() != null ? listing.getId().toString() : null)
                .landlordId(listing.getLandlordId() != null ? listing.getLandlordId() : null)
                .title(listing.getTitle())
                .imageUrls(listing.getImagesUrls() != null ? listing.getImagesUrls() : null)
                .numberOfRooms(listing.getNumberOfRooms())
                .roomArea(listing.getRoomArea())
                .numberOfBathrooms(listing.getNumberOfBathrooms())
                .isSharedBathroom(listing.getIsSharedBathroom())
                .bathroomArea(listing.getBathroomArea())
                .numberOfKitchens(listing.getNumberOfKitchens())
                .isSharedKitchen(listing.getIsSharedKitchen())
                .kitchenArea(listing.getKitchenArea())
                .bathroomLocation(listing.getBathroomLocation() != null ? listing.getBathroomLocation().name() : null)
                .listingCountry(listing.getListingCountry())
                .listingState(listing.getListingState())
                .listingCity(listing.getListingCity())
                .listingStreet(listing.getListingStreet())
                .listingPrice(listing.getListingPrice())
                .listingDescription(listing.getListingDescription())
                .listingStyle(listing.getListingStyle() != null ? listing.getListingStyle().name() : null)
                .numberOfHouseMates(listing.getNumberOfHouseMates())
                .listedDate(listing.getListedDate())
                .lastUpdated(listing.getLastUpdated())
                .listingType(listing.getListingType());
    }
}
