package com.room8.roomservice.repository;

import com.room8.roomservice.model.SingleRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SingleRoomRepository extends JpaRepository<SingleRoom, Long> {
}
