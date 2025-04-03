package com.userauth.user_auth.model;

import com.userauth.user_auth.enums.UserAuthority;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@EqualsAndHashCode(callSuper=true)
@ToString(callSuper=true)
@AllArgsConstructor
@Data
public class Tenant extends User {
    public Tenant(String firstName, String lastName, String email, String password) {
        super(firstName,lastName, email, password, UserAuthority.TENANT);
    }
}
