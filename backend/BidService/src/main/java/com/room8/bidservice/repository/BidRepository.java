package com.room8.bidservice.repository;

import com.room8.bidservice.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface BidRepository extends JpaRepository<Bid, Long> {
    Optional<Bid> getBidById(Long id);

}
