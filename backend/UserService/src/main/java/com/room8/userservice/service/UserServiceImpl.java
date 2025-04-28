package com.room8.userservice.service;

import com.room8.userservice.client.AuthenticationServiceClient;
import com.room8.userservice.enums.UserAuthority;
import com.room8.userservice.exception.NoUpdateNeededException;
import com.room8.userservice.exception.UserInfoNotFoundException;
import com.room8.userservice.exception.UserNotAuthorizedException;
import com.room8.userservice.exception.UserNotFoundException;
import com.room8.userservice.model.User;
import com.room8.userservice.model.UserDTO;
import com.room8.userservice.model.UserInfoDTO;
import com.room8.userservice.repository.UserInfoRepository;
import com.room8.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapperService userMapperService;
    private final AuthenticationServiceClient authenticationServiceClient;
    private final UserInfoMapperService userInfoMapperService;
    private final UserInfoRepository userInfoRepository;

    @Override
    public User addUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public UserDTO getUserById(Long id) throws UserNotFoundException {
        var user = userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException(id)
        );
        return userMapperService.toDTO(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) throws UserNotFoundException {
        var user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException(email)
        );
        return userMapperService.toDTO(user);
    }

    @Override
    public User getUserByPhoneNumber(String phoneNumber) throws UserNotFoundException {
        return userRepository.findByPhoneNumber(phoneNumber).orElseThrow(
                () -> new UserNotFoundException(phoneNumber)
        );
    }

    @Override
    public Long getUserIdByEmail(String email) throws UserNotFoundException {
        var user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException(email)
        );
        return user.getId();
    }

    @Override
    public UserInfoDTO getUserInfo(String token, Long userId) {
        // extract email from token, no need to check validity since auth filter already did before sending request here
        String userEmail = authenticationServiceClient.getUserEmailFromToken(token).getBody();
        assert userEmail != null;

        //get users from database
        //requested user
        var requestedInfoUser = userRepository.findById(userId).orElseThrow(
                () -> new UserNotFoundException(userId)
        );
        // Requesting user
        var user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new UserNotFoundException(String.format("User with email %s not found", userEmail))
        );


        //extract authorities from role
        List<UserAuthority> authorities = new ArrayList<>();
        user.getRole().forEach(role -> authorities.add(role.getUserAuthority()));

        //* check for authorization
        //* first check if it's the same loggedIn user's information we are trying to get using the emails. Users have authority to view their own info
        //* secondly, if it's not the same user, check if the loggedIn user has admin permission, since admins are the only other kind of users with permission to view other user's information
        if(!userEmail.equals(requestedInfoUser.getEmail()) && !authorities.contains(UserAuthority.ADMIN)){
            throw new UserNotAuthorizedException("user not authorized");
        }

        //get the requested user information from the database
        var userInfo = userInfoRepository.findByUser(user).orElseThrow(
                () -> new UserInfoNotFoundException(String.format("User with email %s not found", userEmail)) //todo creat custom userinfo exception
        );

        //Return the userinfo dto for data control
        return userInfoMapperService.toDTO(userInfo);
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO) throws UserNotFoundException {
        var user = userRepository.findById(userDTO.getId())
                .orElseThrow(() -> new UserNotFoundException(userDTO.getId()));

        // make a copy before updating
        var userCopy = new User(user);

        // update the user (original object)
        userMapperService.updateEntity(userDTO, user);

        // compare updated user vs original
        if (user.equals(userCopy)) {
            throw new NoUpdateNeededException("User not updated because no changes were detected.");
        }

        // Save the updated user
        user.setLastUpdated(new Date()); // optionally update last updated field
        return userMapperService.toDTO(userRepository.save(user));
    }

    @Override
    public User markUserAsEmailVerified(String email) throws UserNotFoundException {
        var user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with email " + email + " not found")
        );

        // return true if user is already verified
        if (user.getIsEmailVerified()) {
            return user;
        }

        // update isEmailVerified section for the user
        user.setIsEmailVerified(true);

        // save the changes to the database
        return userRepository.save(user);
    }

    @Override
    public User markUserAsPhoneVerified(String phoneNumber) throws UserNotFoundException {
        var user = userRepository.findByPhoneNumber(phoneNumber).orElseThrow(
                () -> new UserNotFoundException("User with email " + phoneNumber + " not found")
        );

        // return true if user is already verified
        if (user.getIsPhoneVerified()) {
            return user;
        }

        // update isPhoneVerified section for the user
        user.setIsPhoneVerified(true);

        // save the changes to the database
        return userRepository.save(user);
    }

}
