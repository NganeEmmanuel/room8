package com.userauth.user_auth.service;

import com.userauth.user_auth.exception.UserNotFoundException;
import com.userauth.user_auth.model.User;
import com.userauth.user_auth.model.UserDTO;

public interface UserService {
    /**
     *
     * @param id the Id of the user we want to retrieve
     * @return The user's information
     * @throws UserNotFoundException if no user is found associated with that id
     */
    UserDTO getUserById(Long id) throws UserNotFoundException;
}
