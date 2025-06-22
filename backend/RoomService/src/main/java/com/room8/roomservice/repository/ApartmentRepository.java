package com.room8.roomservice.repository;

import com.room8.roomservice.model.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {

    List<Long> findIdsByLandlordId(Long userId);

    void deleteAllByLandlordId(Long userId);

    List<Apartment> findAllByLandlordId(Long landlordId);
}
