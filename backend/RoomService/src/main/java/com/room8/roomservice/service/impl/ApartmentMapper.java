package com.room8.roomservice.service.impl;

import com.room8.roomservice.model.Apartment;
import com.room8.roomservice.dto.ApartmentDTO;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class ApartmentMapper extends GenericMapperServiceImpl<ApartmentDTO, Apartment> {
    public ApartmentMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }
}
