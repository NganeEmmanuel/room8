package com.room8.roomservice.config;

import com.room8.roomservice.service.impl.ApartmentMapper;
import com.room8.roomservice.service.impl.SingleRoomMapper;
import com.room8.roomservice.service.impl.StudioMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfig {
    @Bean
    public SingleRoomMapper getSingleRoomMapper() {
        return new SingleRoomMapper();
    }

    @Bean
    public StudioMapper getStudioMapper() {
        return new StudioMapper();
    }

    @Bean
    public ApartmentMapper getApartmentMapper() {
        return new ApartmentMapper();
    }
}
