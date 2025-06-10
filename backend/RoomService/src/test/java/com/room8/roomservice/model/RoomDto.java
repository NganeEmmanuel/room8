package com.room8.roomservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomDto {
    private Long id;
    private String name;
    private List<String> urls;
    // Getters and Setters
}