package com.room8.authservice.service;


import com.room8.authservice.exception.UserNotFoundException;
import com.room8.authservice.model.UserDTO;

public interface UserService {
    /**
     *
     * @param id the Id of the user we want to retrieve
     * @return The user's information
     * @throws UserNotFoundException if no user is found associated with that id
     */
    UserDTO getUserById(Long id) throws UserNotFoundException;
}
