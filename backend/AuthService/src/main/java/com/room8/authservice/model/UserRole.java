package com.room8.authservice.model;


import com.room8.authservice.enums.UserAuthority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserRole {
    private Integer id;
    private UserAuthority userAuthority;
    private Date created;

    public UserRole(UserAuthority userAuthority) {
        this.userAuthority = userAuthority;
        this.created = new Date();
    }
}
