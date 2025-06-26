package com.room8.bidservice.service;

import com.room8.bidservice.exception.NoBidFoundException;
import com.room8.bidservice.model.RequestBidDTO;
import com.room8.bidservice.model.ResponseBidDTO;

import java.util.List;

public interface BidService {
    /**
     * Adds a new bid for listing
     * @param requestBidDTO the bidding information
     * @return the saved bid information
     */
    ResponseBidDTO addBid(RequestBidDTO requestBidDTO);

    /**
     * Updates the bid in the database
     * @param requestBidDTO the updating bidding information
     * @param id the bid id to be updated
     * @return the updated bid information
     */
    ResponseBidDTO updateBid(RequestBidDTO requestBidDTO, Long id);

    /**
     * Removes bid from database
     * @param id the bid id to be removed
     * @return success if successful
     * @throws Exception if an exception exception occurs
     * @throws NoBidFoundException if no bid is found associated with the id
     */
    String removeBid(Long id) throws Exception, NoBidFoundException;

    /**
     * Gets the bid information associated with the provided id
     * @param id The id of the bid
     * @return the bid information requested
     * @throws NoBidFoundException if no bid is found associated with the given id
     */
    ResponseBidDTO getBid(Long id) throws NoBidFoundException;

    /**
     * Get Bids associated with the provided listing id
     * @param listingId id of the listing(room)
     * @return a list of bid information
     * @throws NoBidFoundException if no bid was found
     */
    List<ResponseBidDTO> getAllBidsByListingId(Long listingId) throws NoBidFoundException;

    /**
     * Get bids associated with the provided user id
     * @param userId id of the user
     * @return a list of bid information
     * @throws NoBidFoundException if no bid was found
     */
    List<ResponseBidDTO> getAllBidsByUserId(Long userId) throws NoBidFoundException;

    /**
     *
     * @param userId bidder id
     * @param listingId listing id
     * @return the bid made on the listing with listingId by user with userId
     * @throws NoBidFoundException if no bid is found
     */
    ResponseBidDTO getBidByUserIdListingId(Long userId, Long listingId) throws NoBidFoundException;

     /**
     * Updates the status of a specific bid.
     * @param id The ID of the bid to update.
     * @param status The new status (e.g., "ACCEPTED", "REJECTED").
     * @return The updated bid information.
     * @throws NoBidFoundException if no bid is found with the given ID.
     */
    ResponseBidDTO updateBidStatus(Long id, String status) throws NoBidFoundException;
}
