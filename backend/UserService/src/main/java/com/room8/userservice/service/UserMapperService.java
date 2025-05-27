package com.room8.userservice.service;


import com.room8.userservice.model.User;
import com.room8.userservice.model.UserDTO;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.function.Consumer;

@Service
@NoArgsConstructor
public class UserMapperService implements MapperService<UserDTO, User> {
    @Override
    public UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

    @Override
    public User toEntity(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setRole(userDTO.getRole());
        return user;
    }

    @Override
    public void updateEntity(UserDTO userDTO, User user) {
        updateIfChanged(userDTO.getFirstName(), user.getFirstName(), user::setFirstName);
        updateIfChanged(userDTO.getLastName(), user.getLastName(), user::setLastName);
        updateIfChanged(userDTO.getEmail(), user.getEmail(), user::setEmail);
        updateIfChanged(userDTO.getPhoneNumber(), user.getPhoneNumber(), user::setPhoneNumber);

        // For roles (List comparison), handle separately:
        if (userDTO.getRole() != null && !userDTO.getRole().isEmpty() && !user.getRole().equals(userDTO.getRole())) {
            user.setRole(userDTO.getRole());
        }
    }

    private void updateIfChanged(String newValue, String oldValue, Consumer<String> setter) {
        if (newValue != null && !newValue.isBlank() && !newValue.equals(oldValue)) {
            setter.accept(newValue);
        }
    }

}
