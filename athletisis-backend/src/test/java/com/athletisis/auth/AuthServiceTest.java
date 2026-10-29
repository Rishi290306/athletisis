package com.athletisis.auth;

import com.athletisis.athlete.Athlete;
import com.athletisis.athlete.AthleteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UserRepository userRepository;
    private AthleteRepository athleteRepository;
    private PasswordEncoder passwordEncoder;
    private JwtUtil jwtUtil;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        athleteRepository = mock(AthleteRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "athletisis_super_secret_jwt_key_that_is_at_least_256_bits_long_for_security_2026");
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", 86400000L);

        authService = new AuthService(userRepository, athleteRepository, passwordEncoder, jwtUtil);
    }

    @Test
    void register_Success() {
        AuthDTOs.RegisterRequest req = new AuthDTOs.RegisterRequest();
        req.setEmail("athlete@test.com");
        req.setPassword("secret123");
        req.setFullName("Test Athlete");
        req.setRole(UserRole.ATHLETE);

        when(userRepository.existsByEmail("athlete@test.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encodedPassword");

        User savedUser = new User("athlete@test.com", "encodedPassword", "Test Athlete", UserRole.ATHLETE);
        savedUser.setId(10L);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        Athlete savedAthlete = new Athlete(savedUser, "Test Athlete", 22, "Football", "Midfielder", "FC Thunder", "Playmaker", "Semi-Pro");
        savedAthlete.setId(100L);
        when(athleteRepository.save(any(Athlete.class))).thenReturn(savedAthlete);

        AuthDTOs.AuthResponse response = authService.register(req);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals(10L, response.getUserId());
        assertEquals(100L, response.getAthleteId());
        assertEquals("athlete@test.com", response.getEmail());
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        AuthDTOs.RegisterRequest req = new AuthDTOs.RegisterRequest();
        req.setEmail("existing@test.com");
        req.setPassword("secret123");
        req.setFullName("Existing User");

        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(req));
    }
}
