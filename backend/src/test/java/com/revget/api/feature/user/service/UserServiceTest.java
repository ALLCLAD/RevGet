package com.revget.api.feature.user.service;

import com.revget.api.feature.user.dto.UserResponseDto;
import com.revget.api.feature.user.model.Role;
import com.revget.api.feature.user.model.User;
import com.revget.api.feature.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, "admin@revget.com, root@revget.com");
    }

    private Jwt createMockJwt(String sub, String email, String name, String picture) {
        return new Jwt(
                "token-value",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                Map.of("alg", "none"),
                Map.of(
                        "sub", sub,
                        "email", email,
                        "name", name,
                        "picture", picture
                )
        );
    }

    @Test
    @DisplayName("Should create normal user when email is not admin")
    void shouldCreateNormalUserWhenNotAdmin() {
        Jwt jwt = createMockJwt("google-123", "etudiant@univ.fr", "Jean Dupont", "https://avatar.url");
        when(userRepository.findByGoogleId("google-123")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.processGoogleUser(jwt);

        assertThat(result.getGoogleId()).isEqualTo("google-123");
        assertThat(result.getEmail()).isEqualTo("etudiant@univ.fr");
        assertThat(result.getFullName()).isEqualTo("Jean Dupont");
        assertThat(result.getRole()).isEqualTo(Role.USER);
        assertThat(result.getXpTotal()).isZero();
        assertThat(result.getCurrentLevel()).isEqualTo(1);
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should create admin user when email is in admin list")
    void shouldCreateAdminUserWhenEmailInAdminList() {
        Jwt jwt = createMockJwt("google-admin-1", "admin@revget.com", "Super Admin", "https://admin.url");
        when(userRepository.findByGoogleId("google-admin-1")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.processGoogleUser(jwt);

        assertThat(result.getRole()).isEqualTo(Role.ADMIN);
    }

    @Test
    @DisplayName("Should return UserResponseDto without exposing technical Long id")
    void shouldReturnDtoWithoutLongId() {
        Jwt jwt = createMockJwt("google-123", "etudiant@univ.fr", "Jean Dupont", "https://avatar.url");
        User user = new User("google-123", "etudiant@univ.fr", "Jean Dupont", "https://avatar.url", Role.USER);
        when(userRepository.findByGoogleId("google-123")).thenReturn(Optional.of(user));

        UserResponseDto dto = userService.getCurrentUserProfile(jwt);

        assertThat(dto.email()).isEqualTo("etudiant@univ.fr");
        assertThat(dto.publicId()).isNotNull();
        assertThat(dto.role()).isEqualTo(Role.USER);
    }
}
