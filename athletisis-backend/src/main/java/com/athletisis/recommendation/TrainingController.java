package com.athletisis.recommendation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/training")
public class TrainingController {

    private final RecommendationEngine recommendationEngine;

    public TrainingController(RecommendationEngine recommendationEngine) {
        this.recommendationEngine = recommendationEngine;
    }

    @GetMapping("/{athleteId}")
    public ResponseEntity<Map<String, Object>> getTrainingPlan(@PathVariable Long athleteId) {
        List<Recommendation> activeRecs = recommendationEngine.getRecommendationsByAthlete(athleteId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("athleteId", athleteId);
        response.put("activePlans", activeRecs);
        
        // Progress feedback loop metrics
        Map<String, Object> progressLoop = new LinkedHashMap<>();
        progressLoop.put("weaknessTargeted", "Defensive Transition Positioning");
        progressLoop.put("match1Score", 61.0);
        progressLoop.put("match2Score", 68.0);
        progressLoop.put("match3Score", 74.0);
        progressLoop.put("match4Score", 79.0);
        progressLoop.put("percentageImprovement", "+29.5%");
        progressLoop.put("summaryMessage", "Your positioning improved by 29.5% across your last 4 matches following the targeted transition drills!");

        response.put("improvementFeedbackLoop", progressLoop);

        return ResponseEntity.ok(response);
    }
}
