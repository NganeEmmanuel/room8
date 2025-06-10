package com.room8.roomservice.service.impl;

import com.room8.roomservice.model.Apartment;
import com.room8.roomservice.dto.ApartmentDTO;
import org.jvnet.hk2.annotations.Service;
import org.modelmapper.ModelMapper;

@Service

public class ApartmentMapper extends GenericMapperServiceImpl<ApartmentDTO, Apartment> {
    public ApartmentMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }
}
