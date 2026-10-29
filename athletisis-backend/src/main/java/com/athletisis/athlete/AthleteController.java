package com.athletisis.athlete;

import com.athletisis.auth.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/athletes")
public class AthleteController {

    private final AthleteService athleteService;

    public AthleteController(AthleteService athleteService) {
        this.athleteService = athleteService;
    }

    @GetMapping
    public ResponseEntity<List<AthleteDTOs.AthleteResponse>> getAllAthletes() {
        return ResponseEntity.ok(athleteService.getAllAthletes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AthleteDTOs.AthleteResponse> getAthleteById(@PathVariable Long id) {
        return ResponseEntity.ok(athleteService.getAthleteById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<AthleteDTOs.AthleteResponse> getMyAthleteProfile(@AuthenticationPrincipal User user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(athleteService.getAthleteByUserId(user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AthleteDTOs.AthleteResponse> updateAthlete(
            @PathVariable Long id,
            @RequestBody AthleteDTOs.UpdateAthleteRequest request) {
        return ResponseEntity.ok(athleteService.updateAthlete(id, request));
    }
}
