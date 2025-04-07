package com.room8.bidservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ResponseBidDTO {
    private Long id;

    private Long ListingId; // foreign key for listings

    private String bidderFullName; // foreign key for user(bidder)

    private UserInfo bidderInfo;

    private String proposal;

    private Date bidDate;

    private Date lastUpdated;
}
