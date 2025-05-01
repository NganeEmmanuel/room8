package com.room8.userservice.service;

/**
 *
 * @param <T> Class of the DTO (data transfer object
 * @param <U> Class of the Entity
 */
public interface MapperService<T,U> {
    /**
     *
     * @param u entity to be converted to a DTO object
     * @return The specified DTO object
     */
    T toDTO(U u);

    /**
     *
     * @param t the DTO object to convert to an entity object
     * @return the specified entity object
     */
    U toEntity(T t);

    /**
     *
     * @param t the DTO object containing the updated entity information
     * @param u the entity object to be updated
     */
    void updateEntity(T t, U u);
}
