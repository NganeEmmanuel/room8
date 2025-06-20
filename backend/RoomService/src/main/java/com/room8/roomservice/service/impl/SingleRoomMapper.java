package com.room8.roomservice.service.impl;

import com.room8.roomservice.model.SingleRoom;
import com.room8.roomservice.dto.SingleRoomDTO;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class SingleRoomMapper extends GenericMapperServiceImpl<SingleRoomDTO, SingleRoom> {
    public SingleRoomMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }
}
