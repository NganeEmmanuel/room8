package com.room8.roomservice.dto;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper=true)
@AllArgsConstructor
@Data
@NoArgsConstructor
public class ApartmentDTO extends ListingDTO{
    private Boolean hasLivingRoom;
    private Integer numberOfLivingRooms;
    private Double livingRoomArea; //in square meters
    private Boolean hasOutDoorLivingArea;
    private Double outDoorArea; //in square meters
}
