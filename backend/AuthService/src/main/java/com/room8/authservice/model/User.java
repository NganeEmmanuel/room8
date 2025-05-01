package com.room8.authservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@NoArgsConstructor(force = true)
@AllArgsConstructor
@Data
@Builder
public class User {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;
    private Boolean isEmailVerified;
    private Boolean isPhoneVerified;
    private List<UserRole> role;


    public User(String firstName, String lastName, String email, String password, List<UserRole> role){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}

