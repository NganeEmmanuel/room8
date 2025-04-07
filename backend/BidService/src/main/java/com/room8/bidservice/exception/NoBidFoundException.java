package com.room8.bidservice.exception;

public class NoBidFoundException extends RuntimeException {
    public NoBidFoundException(Long id) {
        super("No bid found with id " + id);
    }
    public NoBidFoundException(Long listingId, Long bidderId) {
        super("No bid found with listingId " + listingId + " and bidderId " + bidderId);
    }
}
