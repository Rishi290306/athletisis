package com.athletisis.auth;

import com.athletisis.athlete.Athlete;
import com.athletisis.athlete.AthleteRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AthleteRepository athleteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, AthleteRepository athleteRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.athleteRepository = athleteRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthDTOs.AuthResponse register(AuthDTOs.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getRole()
        );
        User savedUser = userRepository.save(user);

        Long athleteId = null;
        if (savedUser.getRole() == UserRole.ATHLETE) {
            Athlete athlete = new Athlete(savedUser, savedUser.getFullName(), 22, "Football", "Midfielder", "FC Thunder", "Playmaker", "Semi-Pro");
            Athlete savedAthlete = athleteRepository.save(athlete);
            athleteId = savedAthlete.getId();
        }

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());
        return new AuthDTOs.AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole(), athleteId);
    }

    public AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        Long athleteId = athleteRepository.findByUserId(user.getId()).map(Athlete::getId).orElse(null);
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthDTOs.AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), athleteId);
    }

    public AuthDTOs.UserProfileResponse getProfile(User user) {
        Long athleteId = athleteRepository.findByUserId(user.getId()).map(Athlete::getId).orElse(null);
        return new AuthDTOs.UserProfileResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getAvatarUrl(), athleteId);
    }
}
