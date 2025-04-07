package com.room8.bidservice.service;

/**
 *
 * @param <T> Class of the ResponseDTO (data transfer object)
 * @param <U> Class of the Entity
 * @param <V> Class of the requestDTO
 */
public interface MapperService<T,U,V> {
    /**
     *
     * @param u entity to be converted to a DTO object
     * @return The specified DTO object
     */
    T toResponseDTO(U u);

    /**
     *
     * @param v the DTO object to convert to an entity object
     * @return the specified entity object
     */
    U requestDTOToEntity(V v);

    /**
     *
     * @param v the DTO object containing the updated entity information
     * @param u the entity object to be updated
     */
    void updateEntity(V v, U u);
}
