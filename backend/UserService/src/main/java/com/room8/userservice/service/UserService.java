package com.room8.userservice.service;


import com.room8.userservice.exception.UserInfoNotFoundException;
import com.room8.userservice.exception.UserNotFoundException;
import com.room8.userservice.model.User;
import com.room8.userservice.model.UserDTO;
import com.room8.userservice.model.UserInfoDTO;

public interface UserService {

    /**
     *
     * @param user user information to be added
     * @return The user's information that has been added
     */
    User addUser(User user);

    /**
     *
     * @param id the Id of the user we want to retrieve
     * @return The user's information
     * @throws UserNotFoundException if no user is found associated with that id
     */
    UserDTO getUserById(Long id) throws UserNotFoundException;

    /**
     *
     * @param email the email of the user we want to retrieve
     * @return The user's information
     * @throws UserNotFoundException if no user is found associated with that id
     */
    UserDTO getUserByEmail(String email) throws UserNotFoundException;

    /**
     *
     * @param phoneNumber the phone number of the user we want to retrieve
     * @return The user's information
     * @throws UserNotFoundException if no user is found associated with that id
     */
    User getUserByPhoneNumber(String phoneNumber) throws UserNotFoundException;

    /**
     *
     * @param email the email of the user we want to retrieve its id
     * @return The user's id
     * @throws UserNotFoundException if no user is found associated with that id
     */
    Long getUserIdByEmail(String email) throws UserNotFoundException;

    /**
     *
     * @param token barrear token to verify the user
     * @param userId id of the user whose information is to be gotten
     * @return UserInfoDTO containing the specified user's information if authorized
     * @throws UserInfoNotFoundException if user information is not found
     */
    UserInfoDTO getUserInfo(String token, Long userId) throws UserInfoNotFoundException;

    /**
     *
     * @param userDTO user information to be updated including the user id to get the user by
     * @return UserDTO containing the specified user's information if authorized
     * @throws UserNotFoundException if user  is not found
     */
    UserDTO updateUser(UserDTO userDTO) throws UserNotFoundException;

    /**
     * Updated the isEmailVerified section of user to true
     *
     * @param email email of the user to change the email verified status
     * @return the user data if operation is successful and false otherwise
     * @throws UserNotFoundException if user  is not found
     */
    User markUserAsEmailVerified(String email) throws UserNotFoundException;

    /**
     * Updated the isPhoneVerified section of user to user
     *
     * @param phoneNumber mobile phone number of the user to change the email verified status
     * @return the user data if operation is successful and false otherwise
     * @throws UserNotFoundException if user  is not found
     */
    User markUserAsPhoneVerified(String phoneNumber) throws UserNotFoundException;
}
