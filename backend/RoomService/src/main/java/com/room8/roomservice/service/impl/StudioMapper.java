package com.room8.roomservice.service.impl;

import com.room8.roomservice.model.Studio;
import com.room8.roomservice.dto.StudioDTO;
import org.jvnet.hk2.annotations.Service;
import org.modelmapper.ModelMapper;

@Service
public class StudioMapper extends GenericMapperServiceImpl<StudioDTO, Studio>{
    public StudioMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }
}
