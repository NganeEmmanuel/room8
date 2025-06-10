package com.room8.roomservice.service;

import com.room8.roomservice.dto.ListingRequest;
import com.room8.roomservice.exception.InvalidRoomTypeException;
import com.room8.roomservice.exception.NotFoundException;
import com.room8.roomservice.dto.ListingDTO;

import java.util.List;

/**
 * The RoomService interface defines the contract for managing room listings
 * in a property management system. It provides methods for adding, retrieving,
 * updating, and deleting room listings, as well as managing rooms associated
 * with specific users.
 */
public interface RoomService {

    /**
     * Adds a new room listing.
     *
     * @param listingDTO the details of the room to be added
     * @return the added room listing
     * @throws NotFoundException if the listing cannot be added due to
     *         missing dependencies or invalid data
     */
    ListingDTO addRoom(ListingDTO listingDTO) throws NotFoundException;

    /**
     * Retrieves a room listing by its ID.
     *
     * @param listingRequest contains the ID and listingType of the room to retrieve
     * @return the room listing associated with the specified ID
     * @throws NotFoundException if no room listing is found with the given ID
     * @throws InvalidRoomTypeException if the room type passed isn't a valid room type
     */
    ListingDTO getRoom(ListingRequest listingRequest) throws NotFoundException, InvalidRoomTypeException;

    /**
     * Updates an existing room listing.
     *
     * @param listingDTO the updated details of the room
     * @return the updated room listing
     * @throws NotFoundException if the room listing to be updated does not exist
     */
    ListingDTO updateRoom(ListingDTO listingDTO) throws NotFoundException;

    /**
     * Deletes a room listing by its ID.
     *
     * @param listingRequest contains the ID and listingType of the room to be deleted
     * @throws NotFoundException if no room listing is found with the given ID
     * @throws InvalidRoomTypeException if the room type passed isn't a valid room type
     */
    void deleteRoom(ListingRequest listingRequest) throws NotFoundException, InvalidRoomTypeException;


    /**
     * Deletes all room listings associated with a specific user ID.
     *
     * @param userId the ID of the user whose room listings are to be deleted
     * @throws NotFoundException if no room listings are found for the user
     */
    void deleteAllRoomsByUserID(Long userId) throws NotFoundException;
}
