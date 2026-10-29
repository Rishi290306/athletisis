package com.athletisis.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTOs {

    public static class RegisterRequest {
        @NotBlank @Email
        private String email;

        @NotBlank @Size(min = 6)
        private String password;

        @NotBlank
        private String fullName;

        private UserRole role = UserRole.ATHLETE;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public UserRole getRole() { return role; }
        public void setRole(UserRole role) { this.role = role; }
    }

    public static class LoginRequest {
        @NotBlank @Email
        private String email;

        @NotBlank
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private Long userId;
        private String email;
        private String fullName;
        private UserRole role;
        private Long athleteId;

        public AuthResponse(String token, Long userId, String email, String fullName, UserRole role, Long athleteId) {
            this.token = token;
            this.userId = userId;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
            this.athleteId = athleteId;
        }

        public String getToken() { return token; }
        public Long getUserId() { return userId; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public UserRole getRole() { return role; }
        public Long getAthleteId() { return athleteId; }
    }

    public static class UserProfileResponse {
        private Long id;
        private String email;
        private String fullName;
        private UserRole role;
        private String avatarUrl;
        private Long athleteId;

        public UserProfileResponse(Long id, String email, String fullName, UserRole role, String avatarUrl, Long athleteId) {
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
            this.avatarUrl = avatarUrl;
            this.athleteId = athleteId;
        }

        public Long getId() { return id; }
        public String getEmail() { return email; }
        public String getFullName() { return fullName; }
        public UserRole getRole() { return role; }
        public String getAvatarUrl() { return avatarUrl; }
        public Long getAthleteId() { return athleteId; }
    }
}
