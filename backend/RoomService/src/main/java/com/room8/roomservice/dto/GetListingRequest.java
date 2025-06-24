package com.room8.roomservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.retry.annotation.Backoff;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetListingRequest {
    private Long landlordId;
    private Integer start;
    private Integer limit;
}
