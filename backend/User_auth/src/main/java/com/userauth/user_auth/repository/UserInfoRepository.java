package com.userauth.user_auth.repository;

import com.userauth.user_auth.model.User;
import com.userauth.user_auth.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findByUser(User user);
}
