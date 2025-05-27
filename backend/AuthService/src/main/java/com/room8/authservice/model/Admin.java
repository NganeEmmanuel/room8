package com.room8.authservice.model;

import com.room8.authservice.enums.UserAuthority;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper=true)
@Data
@AllArgsConstructor
public class Admin extends User{

    public Admin(String firstName, String lastName, String email, String password, List<UserRole> roles) {
        super(firstName,lastName, email, password, roles);
    }
}
