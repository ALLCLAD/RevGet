package com.revget.api.feature.user.service;

import com.revget.api.feature.user.dto.UserResponseDto;
import com.revget.api.feature.user.model.Role;
import com.revget.api.feature.user.model.User;
import com.revget.api.feature.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final List<String> adminEmails;

    public UserService(
            UserRepository userRepository,
            @Value("${app.admin.emails:}") String adminEmailsConfig
    ) {
        this.userRepository = userRepository;
        this.adminEmails = Arrays.stream(adminEmailsConfig.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .toList();
    }

    public User processGoogleUser(Jwt jwt) {
        String googleId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        String fullName = jwt.getClaimAsString("name");
        String avatarUrl = jwt.getClaimAsString("picture");

        return userRepository.findByGoogleId(googleId)
                .map(existingUser -> updateExistingUser(existingUser, email, fullName, avatarUrl))
                .orElseGet(() -> createNewUser(googleId, email, fullName, avatarUrl));
    }

    private User updateExistingUser(User user, String email, String fullName, String avatarUrl) {
        if (email != null && !email.isBlank()) {
            user.setEmail(email);
        }
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName);
        }
        if (avatarUrl != null && !avatarUrl.isBlank()) {
            user.setAvatarUrl(avatarUrl);
        }
        if (isAdminEmail(user.getEmail()) && user.getRole() != Role.ADMIN) {
            user.setRole(Role.ADMIN);
        }
        return userRepository.save(user);
    }

    private User createNewUser(String googleId, String email, String fullName, String avatarUrl) {
        Role role = isAdminEmail(email) ? Role.ADMIN : Role.USER;
        User newUser = new User(googleId, email, fullName, avatarUrl, role);
        return userRepository.save(newUser);
    }

    private boolean isAdminEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }
        return adminEmails.contains(email.toLowerCase().trim());
    }

    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUserProfile(Jwt jwt) {
        String googleId = jwt.getSubject();
        User user = userRepository.findByGoogleId(googleId)
                .orElseGet(() -> processGoogleUser(jwt));
        return UserResponseDto.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public Optional<User> findByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId);
    }

    @Transactional(readOnly = true)
    public Optional<UserResponseDto> getByPublicId(UUID publicId) {
        return userRepository.findByPublicId(publicId)
                .map(UserResponseDto::fromEntity);
    }
}
