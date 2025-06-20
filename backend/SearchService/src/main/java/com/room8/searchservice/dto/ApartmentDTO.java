package com.room8.searchservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper=true)
@AllArgsConstructor
@Data
public class ApartmentDTO extends ListingDTO{
    private Boolean hasLivingRoom;
    private Integer numberOfLivingRooms;
    private Double livingRoomArea; //in square meters
    private Boolean hasOutDoorLivingArea;
    private Double outDoorArea; //in square meters
}
