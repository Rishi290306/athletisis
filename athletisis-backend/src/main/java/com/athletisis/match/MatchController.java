package com.athletisis.match;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping
    public ResponseEntity<MatchDTOs.MatchResponse> createMatch(@Valid @RequestBody MatchDTOs.CreateMatchRequest request) {
        return ResponseEntity.ok(matchService.createMatch(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchDTOs.MatchResponse> getMatchById(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.getMatchById(id));
    }

    @GetMapping
    public ResponseEntity<List<MatchDTOs.MatchResponse>> getAllMatches(
            @RequestParam(required = false) Long athleteId) {
        if (athleteId != null) {
            return ResponseEntity.ok(matchService.getMatchesByAthlete(athleteId));
        }
        return ResponseEntity.ok(matchService.getAllMatches());
    }
}
