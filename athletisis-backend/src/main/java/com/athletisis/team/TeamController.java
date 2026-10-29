package com.athletisis.team;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/team")
public class TeamController {

    @GetMapping("/{teamId}/analytics")
    public ResponseEntity<Map<String, Object>> getTeamAnalytics(@PathVariable String teamId) {
        Map<String, Object> response = new LinkedHashMap<>();

        response.put("teamName", "FC Thunder");
        response.put("overallRating", 82.5);
        response.put("matchesPlayed", 12);
        response.put("wins", 8);
        response.put("draws", 2);
        response.put("losses", 2);

        // Passing Network (node positions & edge pass counts)
        List<Map<String, Object>> passingNodes = List.of(
                Map.of("id", "P7", "name", "Rishi Tiwari (CM)", "x", 50, "y", 50, "passes", 42),
                Map.of("id", "P10", "name", "Alex Hunter (LW)", "x", 25, "y", 75, "passes", 35),
                Map.of("id", "P9", "name", "Marcus Rashford (ST)", "x", 50, "y", 85, "passes", 28),
                Map.of("id", "P4", "name", "Virgil van Dijk (CB)", "x", 50, "y", 25, "passes", 48)
        );

        List<Map<String, Object>> passingEdges = List.of(
                Map.of("from", "P4", "to", "P7", "count", 18, "accuracy", 94.4),
                Map.of("from", "P7", "to", "P10", "count", 15, "accuracy", 86.6),
                Map.of("from", "P7", "to", "P9", "count", 9, "accuracy", 77.7),
                Map.of("from", "P10", "to", "P9", "count", 8, "accuracy", 80.0)
        );

        Map<String, Object> passingNetwork = new LinkedHashMap<>();
        passingNetwork.put("nodes", passingNodes);
        passingNetwork.put("edges", passingEdges);

        response.put("passingNetwork", passingNetwork);
        response.put("mostImprovedPlayer", "Rishi Tiwari (+29.5% Positioning)");
        response.put("teamStrengths", List.of("High Midfield Buildup Volume", "Strong Central Defense Overload"));
        response.put("teamWeaknesses", List.of("Vulnerable to Quick Counter-Attacks on Left Flank"));

        return ResponseEntity.ok(response);
    }
}
