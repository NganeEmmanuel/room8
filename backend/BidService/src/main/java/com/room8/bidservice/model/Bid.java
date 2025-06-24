package com.room8.bidservice.model;

import com.room8.bidservice.enums.BidStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long listingId; // foreign key for listings

    @Column(nullable = false)
    private Long bidderId; // foreign key for user(bidder)

    @Column(nullable = false)
    private Boolean isShareInfo; // whether to share bidder's info with the listing owner

    @Column(nullable = false, length = 8000)
    private String proposal;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(updatable = false)
    private Date bidDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BidStatus bidStatus;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdated;


    @PrePersist
    protected void onCreate() {
        bidDate = new Date();
        lastUpdated = new Date();
    }

}
