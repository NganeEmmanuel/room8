package com.room8.userservice.service;

import com.room8.userservice.client.AuthenticationServiceClient;
import com.room8.userservice.enums.UserAuthority;
import com.room8.userservice.exception.*;
import com.room8.userservice.model.User;
import com.room8.userservice.dto.UserDTO;
import com.room8.userservice.dto.UserInfoDTO;
import com.room8.userservice.model.UserInfo;
import com.room8.userservice.model.UserRole;
import com.room8.userservice.repository.UserInfoRepository;
import com.room8.userservice.repository.UserRepository;
import com.room8.userservice.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapperService userMapperService;
    private final AuthenticationServiceClient authenticationServiceClient;
    private final UserInfoMapperService userInfoMapperService;
    private final UserInfoRepository userInfoRepository;
    private final UserRoleRepository userRoleRepository;

    @Override
    public User addUser(User user) {
        validateUserRequest(user);
        //save user in database
        userRepository.save(user);

        //create and save user info file/row in database
        var userInfo = UserInfo.builder()
                .user(user)
                .build();
        userInfoRepository.save(userInfo);
        return user;

    }

    @Override
    public UserDTO getUserById(Long id) {
        checkNullValue(id);
        return userMapperService.toDTO(findUserById(id));
    }

    @Override
    public User getUserByEmail(String email) {
        checkNullValue(email);
        return findUserByEmail(email);
    }

    @Override
    public User getUserByPhoneNumber(String phoneNumber) {
        checkNullValue(phoneNumber);
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new UserNotFoundException(phoneNumber));
    }

    @Override
    public Long getUserIdByEmail(String email) {
        checkNullValue(email);
        return findUserByEmail(email).getId();
    }

    @Override
    public UserInfoDTO getUserInfo(String token, Long userId) {
        checkNullValue(token);
        checkNullValue(userId);
//        String requesterEmail = authenticationServiceClient.getUserEmailFromToken(token).getBody();
//        User requester = findUserByEmail(requesterEmail);
        User targetUser = findUserById(userId);

//        // Users can only view their own info unless they are an ADMIN
//        if (!requester.getEmail().equals(targetUser.getEmail()) &&
//                requester.getRole().stream().noneMatch(r -> r.getUserAuthority() == UserAuthority.ADMIN)) {
//            throw new UserNotAuthorizedException("User not authorized to access this information");
//        }

        var userInfo = userInfoRepository.findByUser(targetUser)
                .orElseThrow(() -> new UserInfoNotFoundException("UserInfo not found for user ID: " + userId));

        return userInfoMapperService.toDTO(userInfo);
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO) {
        validateUserUpdateRequest(userDTO);

        User user = findUserById(userDTO.getId());
        User originalCopy = new User(user); // defensive copy

        userMapperService.updateEntity(userDTO, user);

        if (user.equals(originalCopy)) {
            throw new NoUpdateNeededException("No changes detected. Update skipped.");
        }

        user.setLastUpdated(new Date());
        return userMapperService.toDTO(userRepository.save(user));
    }

    @Override
    public User markUserAsEmailVerified(String email) {
        checkNullValue(email);
        User user = findUserByEmail(email);
        if (!Boolean.TRUE.equals(user.getIsEmailVerified())) {
            user.setIsEmailVerified(true);
            userRepository.save(user);
        }
        return user;
    }

    @Override
    public User markUserAsPhoneVerified(String phoneNumber) {
        checkNullValue(phoneNumber);
        User user = getUserByPhoneNumber(phoneNumber);
        if (!Boolean.TRUE.equals(user.getIsPhoneVerified())) {
            user.setIsPhoneVerified(true);
            userRepository.save(user);
        }
        return user;
    }

    @Override
    public UserRole getRole(UserAuthority role) {
        checkNullValue(role);
        return userRoleRepository.findByUserAuthority(role)
                .orElseGet(() -> userRoleRepository.save(UserRole.builder()
                        .userAuthority(role)
                        .build()));
    }

    @Override
    public Boolean checkConflict(String email, String phoneNumber) {
        return  userRepository.findByEmailOrPhoneNumber(email, phoneNumber).isPresent();
    }

    @Override
    public UserInfoDTO updateUserInfo(UserInfoDTO userInfoDTO, String token) {
        var userEmail = authenticationServiceClient.getUserEmailFromToken(token).getBody();
        checkNullValue(userEmail);
        var user = userRepository.findByEmail(userEmail).orElseThrow(() -> new UserNotFoundException(userEmail));
        var userInfo = userInfoMapperService.toEntity(userInfoDTO);
        userInfo.setUser(user); //add user
        userInfo.setLastUpdated(new Date()); //update last updated date
        return userInfoMapperService.toDTO(userInfoRepository.save(userInfo));
    }

    // ------------------- Private Helpers -----------------------

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
    }

    private void validateUserUpdateRequest(UserDTO userDTO) {
        if (userDTO == null ||
                isBlank(userDTO.getFirstName()) ||
                isBlank(userDTO.getLastName()) ||
                isBlank(userDTO.getEmail()) ||
                isBlank(userDTO.getPhoneNumber()) ||
                userDTO.getId() == null) {
            throw new BadRequestException("Invalid user update request: " + userDTO);
        }
    }

    private void validateUserRequest(User user) {
        if(user == null ||
            isBlank(user.getFirstName()) ||
            isBlank(user.getLastName()) ||
            isBlank(user.getPhoneNumber()) ||
            isBlank(user.getEmail()) ||
            isBlank(user.getPassword()) ||
            user.getIsEmailVerified() == null ||
            user.getIsPhoneVerified() == null

        ) {
            throw new BadRequestException("Invalid user request: " + user);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private <T> void checkNullValue(T t){
        if(t == null){
            throw new BadRequestException("Invalid Information: " + t);
        }
    }
}
