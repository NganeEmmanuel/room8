package com.room8.roomservice.repository;

import com.room8.roomservice.model.SingleRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SingleRoomRepository extends JpaRepository<SingleRoom, Long> {

    List<Long> findIdsByLandlordId(Long userId);

    void deleteAllByLandlordId(Long userId);
}
