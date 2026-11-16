package com.revget.api.feature.user.dto;

import com.revget.api.feature.user.model.Role;
import com.revget.api.feature.user.model.User;

import java.time.Instant;
import java.util.UUID;

public record UserResponseDto(
    UUID publicId,
    String email,
    String fullName,
    String avatarUrl,
    long xpTotal,
    int currentLevel,
    Role role,
    Instant createdAt
) {
    public static UserResponseDto fromEntity(User user) {
        return new UserResponseDto(
            user.getPublicId(),
            user.getEmail(),
            user.getFullName(),
            user.getAvatarUrl(),
            user.getXpTotal(),
            user.getCurrentLevel(),
            user.getRole(),
            user.getCreatedAt()
        );
    }
}
