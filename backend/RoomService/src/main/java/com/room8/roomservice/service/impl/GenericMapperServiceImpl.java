package com.room8.roomservice.service.impl;

import com.room8.roomservice.service.MapperService;
import org.modelmapper.ModelMapper;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public class GenericMapperServiceImpl<T, U> implements MapperService<T, U> {

    private final Class<T> dtoClass;
    private final Class<U> entityClass;
    private final ModelMapper modelMapper;

    @SuppressWarnings("unchecked")
    public GenericMapperServiceImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;

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
        return modelMapper.map(entity, dtoClass);
    }

    @Override
    public U toEntity(T dto) {
        if (dto == null) return null;
        return modelMapper.map(dto, entityClass);
    }

    @Override
    public void updateEntity(T dto, U entity) {
        if (dto == null || entity == null) return;
        modelMapper.map(dto, entity);
    }
}
