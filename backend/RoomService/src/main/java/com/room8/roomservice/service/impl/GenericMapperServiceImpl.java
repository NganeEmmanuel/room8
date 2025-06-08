package com.room8.roomservice.service.impl;

import com.room8.roomservice.service.MapperService;
import org.springframework.beans.BeanUtils;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public class GenericMapperServiceImpl<T, U> implements MapperService<T, U> {

    private final Class<T> dtoClass;
    private final Class<U> entityClass;

    @SuppressWarnings("unchecked")
    public GenericMapperServiceImpl() {
        // Read generic types at runtime
        Type superClass = getClass().getGenericSuperclass();
        if (superClass instanceof ParameterizedType parameterized) {
            this.dtoClass = (Class<T>) parameterized.getActualTypeArguments()[0];
            this.entityClass = (Class<U>) parameterized.getActualTypeArguments()[1];
        } else {
            throw new IllegalArgumentException("Must provide parameterized types for GenericMapperServiceImpl.");
        }
    }

    @Override
    public T toDTO(U entity) {
        if (entity == null) return null;
        try {
            T dto = dtoClass.getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(entity, dto);
            return dto;
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert entity to DTO: " + e.getMessage(), e);
        }
    }

    @Override
    public U toEntity(T dto) {
        if (dto == null) return null;
        try {
            U entity = entityClass.getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(dto, entity);
            return entity;
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert DTO to entity: " + e.getMessage(), e);
        }
    }

    @Override
    public void updateEntity(T dto, U entity) {
        if (dto == null || entity == null) return;
        try {
            BeanUtils.copyProperties(dto, entity);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update entity: " + e.getMessage(), e);
        }
    }
}
