package com.athletisis.recommendation;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendationEngine {

    private final RecommendationRepository recommendationRepository;

    public RecommendationEngine(RecommendationRepository recommendationRepository) {
        this.recommendationRepository = recommendationRepository;
    }

    public List<Recommendation> generateAndSaveRecommendations(Long athleteId, Long matchId, List<Map<String, String>> weaknesses) {
        List<Recommendation> created = new ArrayList<>();

        for (Map<String, String> w : weaknesses) {
            String title = w.getOrDefault("title", "Performance Area");
            String priority = w.getOrDefault("priority", "MEDIUM");
            String evidence = w.getOrDefault("evidence", "");

            String drill = "Positioning & Spatial Awareness Drills";
            String frequency = "3 sessions/week";
            double targetScore = 80.0;

            if (title.contains("Positioning")) {
                drill = "Defensive Transition & Compact Midfield Positioning Drills";
                frequency = "3 sessions/week";
                targetScore = 85.0;
            } else if (title.contains("Passes")) {
                drill = "Press-Resistance & Quick Option Scan Drills";
                frequency = "2 sessions/week";
                targetScore = 88.0;
            }

            Recommendation rec = new Recommendation(
                    athleteId,
                    matchId,
                    title,
                    priority,
                    drill,
                    frequency,
                    65.0,
                    targetScore,
                    evidence
            );
            created.add(recommendationRepository.save(rec));
        }

        return created;
    }

    public List<Recommendation> getRecommendationsByAthlete(Long athleteId) {
        return recommendationRepository.findByAthleteIdOrderByCreatedAtDesc(athleteId);
    }
}
