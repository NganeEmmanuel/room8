package com.room8.roomservice.repository;

import com.room8.roomservice.model.Studio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudioRepository extends JpaRepository<Studio, Long> {

    List<Long> findIdsByLandlordId(Long userId);

    void deleteAllByLandlordId(Long userId);
}
