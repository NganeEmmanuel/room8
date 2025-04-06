package com.room8.roomservice.model;

import lombok.*;

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
