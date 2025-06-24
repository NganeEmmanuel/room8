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
public class RequestBidDTO {
    private Long listingId; // foreign key for listings

    private Long bidderId; // foreign key for user(bidder)

    private String proposal;

    private Boolean isShareInfo;
}
