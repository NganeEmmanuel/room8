package com.room8.authservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@EqualsAndHashCode(callSuper=true)
@ToString(callSuper=true)
@AllArgsConstructor
@Data
public class LandLord extends User{
    public LandLord(String firstName, String lastName, String email, String password, List<UserRole> roles) {
        super(firstName,lastName, email, password, roles);
    }
}
