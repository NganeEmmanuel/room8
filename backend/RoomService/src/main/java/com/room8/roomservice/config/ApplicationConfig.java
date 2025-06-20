package com.room8.roomservice.config;

import com.room8.roomservice.service.impl.ApartmentMapper;
import com.room8.roomservice.service.impl.SingleRoomMapper;
import com.room8.roomservice.service.impl.StudioMapper;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {
    private final ModelMapper modelMapper = new ModelMapper();
    @Bean
    public SingleRoomMapper getSingleRoomMapper() {
        return new SingleRoomMapper(modelMapper);
    }

    @Bean
    public StudioMapper getStudioMapper() {
        return new StudioMapper(modelMapper);
    }

    @Bean
    public ApartmentMapper getApartmentMapper() {
        return new ApartmentMapper(modelMapper);
    }

    @Bean
    public ModelMapper getModelMapper() {
        return modelMapper;
    }
}
