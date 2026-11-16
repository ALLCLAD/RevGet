package com.revget.api.feature.user.model;

import com.revget.api.core.config.BaseAuditableEntity;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(
    name = "users",
    indexes = {
        @Index(name = "idx_users_public_id", columnList = "public_id", unique = true),
        @Index(name = "idx_users_google_id", columnList = "google_id", unique = true),
        @Index(name = "idx_users_email", columnList = "email")
    }
)
public class User extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Long id;

    @Column(name = "public_id", nullable = false, unique = true, updatable = false)
    private UUID publicId;

    @Column(name = "google_id", nullable = false, unique = true, updatable = false)
    private String googleId;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "xp_total", nullable = false)
    private long xpTotal;

    @Column(name = "current_level", nullable = false)
    private int currentLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    public User() {
    }

    public User(String googleId, String email, String fullName, String avatarUrl, Role role) {
        this.publicId = UUID.randomUUID();
        this.googleId = googleId;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.role = role != null ? role : Role.USER;
        this.xpTotal = 0L;
        this.currentLevel = 1;
    }

    @PrePersist
    public void ensurePublicId() {
        if (this.publicId == null) {
            this.publicId = UUID.randomUUID();
        }
        if (this.role == null) {
            this.role = Role.USER;
        }
    }

    public Long getId() {
        return id;
    }

    public UUID getPublicId() {
        return publicId;
    }

    public void setPublicId(UUID publicId) {
        this.publicId = publicId;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public long getXpTotal() {
        return xpTotal;
    }

    public void setXpTotal(long xpTotal) {
        this.xpTotal = xpTotal;
    }

    public int getCurrentLevel() {
        return currentLevel;
    }

    public void setCurrentLevel(int currentLevel) {
        this.currentLevel = currentLevel;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
