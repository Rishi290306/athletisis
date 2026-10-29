package com.athletisis.opponent;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/opponent")
public class OpponentAnalysisController {

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeOpponent(@RequestBody Map<String, Object> request) {
        String opponentName = request.getOrDefault("opponentName", "Arsenal FC").toString();

        Map<String, Object> analysis = new LinkedHashMap<>();
        analysis.put("opponentName", opponentName);
        analysis.put("analyzedMatchesCount", 5);

        // Pre-Match AI Game Plan Recommendations
        List<String> gamePlan = List.of(
                "Opponent frequently initiates attack buildup through the left flank (62% volume).",
                "Their defensive transition is slow after losing possession in the central third.",
                "Recommended tactical approach: Exploit space behind their left wing-back during defensive transition with quick diagonal passes."
        );

        analysis.put("preMatchGamePlan", gamePlan);
        analysis.put("attackPatterns", List.of("High Press in 4-3-3 shape", "Overload Left Half-Space"));
        analysis.put("defensiveWeaknesses", List.of("Gap between Central Midfield and Backline under rapid turnover", "Low aerial duel win rate on right corner kicks"));
        analysis.put("keyThreatPlayers", List.of("Player #10 (Winger - 88 xG involvement)", "Player #8 (Box-to-Box Midfielder)"));

        return ResponseEntity.ok(analysis);
    }
}
