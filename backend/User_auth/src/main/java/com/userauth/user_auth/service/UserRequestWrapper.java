package com.userauth.user_auth.service;

import com.userauth.user_auth.auth.RegisterRequest;
import com.userauth.user_auth.model.UserRequest;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@NoArgsConstructor
public class UserRequestWrapper {
    public UserRequest toUserRequest(RegisterRequest registerRequest) {
        UserRequest userRequest = new UserRequest();
        userRequest.setFirstName(registerRequest.getFirstName());
        userRequest.setLastName(registerRequest.getLastName());
        userRequest.setEmail(registerRequest.getEmail());
        userRequest.setPassword(registerRequest.getPassword());
        userRequest.setPhoneNumber(registerRequest.getPhoneNumber());
        return userRequest;
    }
}
