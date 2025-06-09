package com.room8.roomservice.service.impl;

import com.room8.roomservice.model.SingleRoom;
import com.room8.roomservice.dto.SingleRoomDTO;
import org.jvnet.hk2.annotations.Service;
import org.modelmapper.ModelMapper;

@Service
public class SingleRoomMapper extends GenericMapperServiceImpl<SingleRoomDTO, SingleRoom> {
    public SingleRoomMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }
}
