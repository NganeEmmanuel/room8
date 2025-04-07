package com.userauth.user_auth.service;

import com.userauth.user_auth.exception.UserNotFoundException;
import com.userauth.user_auth.model.UserDTO;
import com.userauth.user_auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapperService userMapperService;
    @Override
    public UserDTO getUserById(Long id) throws UserNotFoundException {
        var user = userRepository.findById(id).orElseThrow(
                () -> new UserNotFoundException(id)
        );
        return userMapperService.toDTO(user);
    }
}
