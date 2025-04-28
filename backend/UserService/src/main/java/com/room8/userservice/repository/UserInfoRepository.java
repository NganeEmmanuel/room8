package com.room8.userservice.repository;

import com.room8.userservice.model.User;
import com.room8.userservice.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findByUser(User user);
}
