package com.room8.authservice.utils;

import com.room8.authservice.client.UserServiceClient;
import com.room8.authservice.enums.UserAuthority;
import com.room8.authservice.model.UserRole;
import com.room8.authservice.redis.UserRoleRedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Utility class for handling user roles.
 * Interacts with Redis and external user service to fetch and cache role information.
 */
@Component
@RequiredArgsConstructor
public class RoleUtil {

    // Service for accessing and storing user roles in Redis
    private final UserRoleRedisService userRoleRedisService;

    // Client for communicating with the external User Service
    private final UserServiceClient userServiceClient;

    /**
     * Converts a list of UserRole objects into a list of role strings (authorities).
     *
     * @param roles list of UserRole objects
     * @return list of role names as strings
     */
    public List<String> getRoleList(List<UserRole> roles) {
        var roleList = new ArrayList<String>();
        roles.forEach(role -> roleList.add(role.getUserAuthority().toString()));
        return roleList;
    }

    /**
     * Retrieves or generates a UserRole based on the provided UserAuthority.
     * Attempts to fetch from Redis cache first. If not found, fetches from user service and caches it.
     *
     * @param userAuthority the authority for which to retrieve or generate a role
     * @return a singleton list containing the UserRole
     */
    public List<UserRole> generateRole(UserAuthority userAuthority) {
        // Attempt to retrieve role from Redis cache
        var role = userRoleRedisService.getUserRole(userAuthority.toString());

        // If not found in cache, retrieve from user service and store in Redis
        if (role == null) {
            role = userServiceClient.getRole(userAuthority).getBody();
            if (role != null) {
                userRoleRedisService.storeUserRole(userAuthority.toString(), role, 60 * 24);
            } else {
                throw new NullPointerException("Role is null");
            }
        }

        return List.of(role);
    }
}

