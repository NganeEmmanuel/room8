package com.room8.roomservice.service.impl;

import com.room8.roomservice.model.Room;
import com.room8.roomservice.model.RoomDto;
import org.modelmapper.ModelMapper;

public class RoomMapperServiceImpl extends GenericMapperServiceImpl<RoomDto, Room> {
    public RoomMapperServiceImpl(ModelMapper modelMapper) {
        super(modelMapper);
    }
}
