package com.userauth.user_auth.model;

import com.userauth.user_auth.enums.UserAuthority;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequest {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private UserAuthority authority;

    public UserRequest(String firstName, String lastName, String email, UserAuthority authority, String password, String phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.authority = authority;
        this.setPhoneNumber(phoneNumber);
        this.password = password;
    }

    public UserRequest(String firstName, String lastName, String email, String password, String phoneNumber) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
    }
}
