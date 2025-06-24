// src/utils/listingUtils.js

import { ListingStyle, BathroomLocation, ListingType } from './listingConstants.js';

// The initial blank state for a new listing
export const initialListingData = {
    listingTitle: '',
    listingDescription: '',
    listingPrice: '',
    imagePreviews: [],
    images: [],
    listingCountry: '',
    listingState: '',
    listingCity: '',
    listingStreet: '',
    listingType: Object.keys(ListingType)[0], // Defaults to 'SingleRoom'
    listingStyle: Object.keys(ListingStyle)[0], // Defaults to 'MODERN'
    numberOfRooms: 1,
    roomArea: '',
    numberOfBathrooms: 1,
    bathroomArea: '',
    isSharedBathroom: false,
    bathroomLocation: Object.keys(BathroomLocation)[0], // Defaults to 'INDOOR'
    numberOfKitchens: 1,
    kitchenArea: '',
    isSharedKitchen: false,
    numberOfHouseMates: 0,
    hasLivingRoom: false,
    numberOfLivingRooms: 1,
    livingRoomArea: '',
};

// This helper function maps the backend DTO to the form's data structure
export const mapDtoToInitialData = (dto) => {
    if (!dto) return null;
    return {
        id: dto.id,
        listingTitle: dto.title || '',
        listingDescription: dto.listingDescription || '',
        listingPrice: dto.listingPrice || '',
        imagePreviews: dto.imageUrls || [],
        images: [],
        listingCountry: dto.listingCountry || '',
        listingState: dto.listingState || '',
        listingCity: dto.listingCity || '',
        listingStreet: dto.listingStreet || '',
        listingType: dto.listingType || 'Apartment',
        listingStyle: dto.listingStyle || 'MODERN',
        numberOfRooms: dto.numberOfRooms || 1,
        roomArea: dto.roomArea || '',
        numberOfBathrooms: dto.numberOfBathrooms || 1,
        bathroomArea: dto.bathroomArea || '',
        isSharedBathroom: dto.isSharedBathroom || false,
        bathroomLocation: dto.bathroomLocation || 'INDOOR',
        numberOfKitchens: dto.numberOfKitchens || 1,
        kitchenArea: dto.kitchenArea || '',
        isSharedKitchen: dto.isSharedKitchen || false,
        numberOfHouseMates: dto.numberOfHouseMates || 0,
        hasLivingRoom: dto.hasLivingRoom || false,
        numberOfLivingRooms: dto.numberOfLivingRooms || 1,
        livingRoomArea: dto.livingRoomArea || '',
    };
};