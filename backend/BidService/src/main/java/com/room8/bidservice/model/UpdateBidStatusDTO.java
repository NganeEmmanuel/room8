package com.room8.bidservice.model;


import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UpdateBidStatusDTO {
     // This will be a string like "ACCEPTED" or "REJECTED"
    private String status;
}
