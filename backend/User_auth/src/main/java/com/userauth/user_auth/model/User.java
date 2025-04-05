package com.userauth.user_auth.model;

import com.userauth.user_auth.enums.UserAuthority;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Entity
@NoArgsConstructor(force = true)
@AllArgsConstructor
@Data
@Builder
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) //  creates a single table for all subclasses, using a discriminator column to distinguish them.
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING) // Optional, used for SINGLE_TABLE strategy to discrimination
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private Boolean isEmailVerified;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserAuthority authority;

    @OneToOne(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true) // Deletes UserInfo when User is deleted
    private UserInfo userInfo;

    @Temporal(TemporalType.TIMESTAMP)
    private Date joinDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdated;


    public User(String firstName, String lastName, String email, String password, UserAuthority authority){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.authority = authority;
        this.userInfo = new UserInfo();
        this.userInfo.setUser(this);
    }

    @PrePersist
    protected void onCreate() {
        joinDate = new Date();
        lastUpdated = new Date();
    }
}

