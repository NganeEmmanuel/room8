package com.room8.userservice.model;

import com.room8.userservice.enums.UserAuthority;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserAuthority userAuthority;

    @Temporal(TemporalType.TIMESTAMP)
    private Date created;

    @PrePersist
    protected void onCreate() {
        created = new Date();
    }

    // 📦 Deep Copy Constructor
    public UserRole(UserRole other) {
        this.id = other.id;
        this.userAuthority = other.userAuthority;
        this.created = other.created != null ? new Date(other.created.getTime()) : null;
        this.user = null; // ❗ Important: not copying user link to avoid circular reference
    }
}
