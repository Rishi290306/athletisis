package com.athletisis.performance;

import com.athletisis.sports.CricketEngine;
import com.athletisis.sports.FootballEngine;
import com.athletisis.sports.VolleyballEngine;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PerformanceEngine {

    private final ExplainableAIEngine explainableAIEngine;
    private final StrengthWeaknessDetector strengthWeaknessDetector;
    private final CricketEngine cricketEngine;
    private final VolleyballEngine volleyballEngine;
    private final ObjectMapper objectMapper;

    public PerformanceEngine(ExplainableAIEngine explainableAIEngine,
                              StrengthWeaknessDetector strengthWeaknessDetector,
                              CricketEngine cricketEngine,
                              VolleyballEngine volleyballEngine,
                              ObjectMapper objectMapper) {
        this.explainableAIEngine = explainableAIEngine;
        this.strengthWeaknessDetector = strengthWeaknessDetector;
        this.cricketEngine = cricketEngine;
        this.volleyballEngine = volleyballEngine;
        this.objectMapper = objectMapper;
    }

    public PerformanceScore computePerformance(Long matchId, Long athleteId, String position, FootballEngine.FootballAnalysisResult footballResult) {
        return computePerformanceForSport(matchId, athleteId, "Football", position, footballResult.metrics, generateFootballHeatmaps());
    }

    public PerformanceScore computeCricketPerformance(Long matchId, Long athleteId, String position) {
        CricketEngine.CricketAnalysisResult cricketResult = cricketEngine.analyzeCricketMatch(position);
        return computePerformanceForSport(matchId, athleteId, "Cricket", position, cricketResult.metrics, cricketResult.heatmaps);
    }

    public PerformanceScore computeVolleyballPerformance(Long matchId, Long athleteId, String position) {
        VolleyballEngine.VolleyballAnalysisResult volleyballResult = volleyballEngine.analyzeVolleyballMatch(position);
        return computePerformanceForSport(matchId, athleteId, "Volleyball", position, volleyballResult.metrics, volleyballResult.heatmaps);
    }

    private PerformanceScore computePerformanceForSport(Long matchId, Long athleteId, String sport, String position, Map<String, Object> metrics, Map<String, Object> heatmaps) {
        double technicalScore = 86.0;
        double tacticalScore = 78.0;
        double physicalScore = 89.0;
        double decisionMakingScore = 81.0;
        double consistencyScore = 84.0;

        if ("Cricket".equalsIgnoreCase(sport)) {
            technicalScore = 87.0;
            tacticalScore = 84.0;
            physicalScore = 88.0;
            decisionMakingScore = 82.0;
        } else if ("Volleyball".equalsIgnoreCase(sport)) {
            technicalScore = 89.0;
            tacticalScore = 80.0;
            physicalScore = 91.0;
            decisionMakingScore = 85.0;
        }

        double overallScore = Math.round((technicalScore * 0.25 + tacticalScore * 0.25 + physicalScore * 0.20 + decisionMakingScore * 0.20 + consistencyScore * 0.10) * 10.0) / 10.0;

        List<Map<String, String>> strengths = strengthWeaknessDetector.detectStrengths(metrics);
        List<Map<String, String>> weaknesses = strengthWeaknessDetector.detectWeaknesses(metrics);

        Map<String, Object> explainable = explainableAIEngine.generateExplainableFactors(technicalScore, tacticalScore, physicalScore, decisionMakingScore, consistencyScore);
        Map<String, String> confidence = explainableAIEngine.generateAIConfidenceScores();

        PerformanceScore score = new PerformanceScore();
        score.setMatchId(matchId);
        score.setAthleteId(athleteId);
        score.setSport(sport);
        score.setPosition(position);
        score.setTechnicalScore(technicalScore);
        score.setTacticalScore(tacticalScore);
        score.setPhysicalScore(physicalScore);
        score.setDecisionMakingScore(decisionMakingScore);
        score.setConsistencyScore(consistencyScore);
        score.setOverallScore(overallScore);

        try {
            score.setMetricsJson(objectMapper.writeValueAsString(metrics));
            score.setStrengthsJson(objectMapper.writeValueAsString(strengths));
            score.setWeaknessesJson(objectMapper.writeValueAsString(weaknesses));
            score.setExplainableFactorsJson(objectMapper.writeValueAsString(explainable));
            score.setAiConfidenceJson(objectMapper.writeValueAsString(confidence));
            score.setHeatmapsJson(objectMapper.writeValueAsString(heatmaps));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing performance json data", e);
        }

        return score;
    }

    private Map<String, Object> generateFootballHeatmaps() {
        Map<String, Object> heatmaps = new LinkedHashMap<>();

        double[][] movementGrid = {
            {0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1},
            {0.2, 0.4, 0.6, 0.7, 0.5, 0.3, 0.2},
            {0.3, 0.6, 0.9, 0.95, 0.8, 0.5, 0.3},
            {0.4, 0.7, 0.95, 0.98, 0.85, 0.6, 0.4},
            {0.3, 0.5, 0.8, 0.85, 0.7, 0.4, 0.3},
            {0.2, 0.3, 0.5, 0.6, 0.5, 0.3, 0.2},
            {0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1}
        };

        heatmaps.put("movement", movementGrid);
        return heatmaps;
    }
}
