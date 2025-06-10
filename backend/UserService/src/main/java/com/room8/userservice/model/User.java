package com.room8.userservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    @NotBlank
    @Column(nullable = false)
    private String firstName;

    @NotBlank
    @Column(nullable = false)
    private String lastName;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String phoneNumber;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @NotNull
    @Column(nullable = false)
    private Boolean isEmailVerified;

    @NotNull
    @Column(nullable = false)
    private Boolean isPhoneVerified;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles_mapping",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<UserRole> role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private UserInfo userInfo;

    @Temporal(TemporalType.TIMESTAMP)
    private Date joinDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUpdated;

    public User(String firstName, String lastName, String email, String password, List<UserRole> role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.userInfo = new UserInfo();
        this.userInfo.setUser(this);
    }

    // 📦 Deep Copy Constructor
    public User(User other) {
        this.id = other.id;
        this.firstName = other.firstName;
        this.lastName = other.lastName;
        this.email = other.email;
        this.phoneNumber = other.phoneNumber;
        this.password = other.password;
        this.isEmailVerified = other.isEmailVerified;
        this.isPhoneVerified = other.isPhoneVerified;
        this.joinDate = other.joinDate != null ? new Date(other.joinDate.getTime()) : null;
        this.lastUpdated = other.lastUpdated != null ? new Date(other.lastUpdated.getTime()) : null;

        // Deep copy role list
        if (other.role != null) {
            this.role = new ArrayList<>();
            for (UserRole userRole : other.role) {
                this.role.add(new UserRole(userRole));
            }
        }

        // Deep copy userInfo
        if (other.userInfo != null) {
            this.userInfo = new UserInfo(other.userInfo);
        }
    }

    @PrePersist
    protected void onCreate() {
        joinDate = new Date();
        lastUpdated = new Date();
        isEmailVerified = false;
        isPhoneVerified = false;
    }
}