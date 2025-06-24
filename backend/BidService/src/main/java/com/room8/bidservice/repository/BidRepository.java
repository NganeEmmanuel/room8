package com.room8.bidservice.repository;

import com.room8.bidservice.model.Bid;
import com.room8.bidservice.model.ResponseBidDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;


public interface BidRepository extends JpaRepository<Bid, Long> {
    Optional<Bid> getBidById(Long id);

    List<Bid> findAllByListingId(Long listingId);

    List<Bid> findAllByBidderId(Long userId);

    Optional<Bid> findByBidderIdAndListingId(Long userId, Long listingId);
}

