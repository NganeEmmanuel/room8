package com.room8.bidservice.model;

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
    private Long ListingId; // foreign key for listings

    @Column(nullable = false)
    private Long bidderId; // foreign key for user(bidder)

    @OneToOne(mappedBy = "bid", cascade = CascadeType.REMOVE, orphanRemoval = true) // Deletes UserInfo when User is deleted
    private UserInfo bidderInfo;


    @Column(nullable = false, length = 8000)
    private String proposal;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(updatable = false)
    private Date bidDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdated;


    @PrePersist
    protected void onCreate() {
        bidDate = new Date();
        lastUpdated = new Date();
    }

}
