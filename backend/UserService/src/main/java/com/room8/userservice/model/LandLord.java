package com.room8.userservice.model;

import jakarta.persistence.Entity;
import lombok.*;

import java.util.List;

@Entity
@EqualsAndHashCode(callSuper=true)
@ToString(callSuper=true)
@AllArgsConstructor
@Data
public class LandLord extends User{
    public LandLord(String firstName, String lastName, String email, String password, List<UserRole> roles) {
        super(firstName,lastName, email, password, roles);
    }
}
