package com.room8.userservice.repository;

import com.room8.userservice.enums.UserAuthority;
import com.room8.userservice.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {
    Optional<UserRole> findByUserAuthority(UserAuthority userAuthority);
}
