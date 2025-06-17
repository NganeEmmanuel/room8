package com.room8.searchservice.dto;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper=true)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class StudioDTO extends ListingDTO{
    private Boolean hasLivingRoom;
    private Integer numberOfLivingRooms;
    private Double livingRoomArea; //in square meters
}
