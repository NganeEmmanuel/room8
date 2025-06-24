package com.room8.bidservice.model;

import com.room8.bidservice.enums.BidStatus;
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

    private Long listingId; // foreign key for listings

    private Long bidderId; // foreign key for bidders

    private Boolean isShareInfo; // whether the bidder wants to share their information with the listing owner

    private String proposal;

    private BidStatus bidStatus;

    private Date bidDate;

    private Date lastUpdated;
}
