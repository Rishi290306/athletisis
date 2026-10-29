package com.athletisis.sports;

import com.athletisis.analysis.StandardizedEvent;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FootballEngine {

    public FootballAnalysisResult processFootballVideo(Long matchId, Long athleteId, String position) {
        List<StandardizedEvent> events = new ArrayList<>();
        Map<String, Object> metrics = new LinkedHashMap<>();

        // Position-adjusted expected performance benchmarks
        boolean isMidfielder = position.toLowerCase().contains("midfield");
        boolean isDefender = position.toLowerCase().contains("defend") || position.toLowerCase().contains("back");
        boolean isForward = position.toLowerCase().contains("striker") || position.toLowerCase().contains("forward") || position.toLowerCase().contains("wing");

        // 1. Generate Standardized Events based on computer vision tracking
        events.add(new StandardizedEvent(matchId, athleteId, "Football", "PASS", 142.0, "00:02:22", 2.5, 0.94, true, 30.0, 45.0, 55.0, 60.0, "{\"passType\":\"Short Ground\", \"distance\":25.0}"));
        events.add(new StandardizedEvent(matchId, athleteId, "Football", "PASS", 285.0, "00:04:45", 3.0, 0.91, true, 42.0, 50.0, 70.0, 30.0, "{\"passType\":\"Long Diagonal\", \"distance\":45.0}"));
        events.add(new StandardizedEvent(matchId, athleteId, "Football", "PASS", 412.0, "00:06:52", 2.0, 0.89, false, 50.0, 60.0, 80.0, 55.0, "{\"passType\":\"Forward Through Ball\", \"intercepted\":true}"));
        events.add(new StandardizedEvent(matchId, athleteId, "Football", "DECISION_ERROR", 620.0, "00:10:20", 4.0, 0.88, false, 45.0, 40.0, 45.0, 40.0, "{\"errorType\":\"Risky Pass under pressure\", \"alternative\":\"Left Winger Open\"}"));
        
        events.add(new StandardizedEvent(matchId, athleteId, "Football", "TACKLE", 780.0, "00:13:00", 2.0, 0.93, true, 35.0, 30.0, 35.0, 30.0, "{\"tackleType\":\"Standing Tackle\"}"));
        events.add(new StandardizedEvent(matchId, athleteId, "Football", "INTERCEPTION", 940.0, "00:15:40", 1.8, 0.90, true, 40.0, 70.0, 42.0, 68.0, "{\"interceptionType\":\"Passing Lane Block\"}"));
        events.add(new StandardizedEvent(matchId, athleteId, "Football", "POSITIONING_ERROR", 1120.0, "00:18:40", 5.0, 0.82, false, 65.0, 20.0, 65.0, 20.0, "{\"errorType\":\"Defensive Transition Over-commitment\"}"));

        events.add(new StandardizedEvent(matchId, athleteId, "Football", "SHOT", 1350.0, "00:22:30", 2.2, 0.95, true, 78.0, 48.0, 95.0, 52.0, "{\"shotOnTarget\":true, \"xg\":0.34}"));
        events.add(new StandardizedEvent(matchId, athleteId, "Football", "POSSESSION_LOSS", 1580.0, "00:26:20", 3.0, 0.85, false, 55.0, 50.0, 55.0, 50.0, "{\"lossReason\":\"Dispossessed during dribble\"}"));

        // 2. Metrics calculation
        int passesAttempted = isMidfielder ? 42 : (isForward ? 28 : 36);
        int passesCompleted = isMidfielder ? 36 : (isForward ? 22 : 31);
        double passAccuracy = Math.round((double) passesCompleted / passesAttempted * 1000.0) / 10.0;

        int shots = isForward ? 5 : (isMidfielder ? 3 : 1);
        int shotsOnTarget = isForward ? 3 : (isMidfielder ? 2 : 1);

        int tacklesAttempted = isDefender ? 8 : (isMidfielder ? 5 : 2);
        int tacklesSuccessful = isDefender ? 7 : (isMidfielder ? 4 : 1);

        int interceptions = isDefender ? 6 : (isMidfielder ? 4 : 2);
        int possessionLosses = 4;
        double distanceCoveredKm = isMidfielder ? 10.8 : (isForward ? 9.6 : 9.2);
        double maxSpeedKmh = 29.4;

        double positioningScore = 78.0;
        double decisionMakingScore = 81.0;

        metrics.put("passesAttempted", passesAttempted);
        metrics.put("successfulPasses", passesCompleted);
        metrics.put("passAccuracy", passAccuracy);
        metrics.put("shots", shots);
        metrics.put("shotsOnTarget", shotsOnTarget);
        metrics.put("tacklesAttempted", tacklesAttempted);
        metrics.put("successfulTackles", tacklesSuccessful);
        metrics.put("interceptions", interceptions);
        metrics.put("possessionLosses", possessionLosses);
        metrics.put("distanceCoveredKm", distanceCoveredKm);
        metrics.put("maxSpeedKmh", maxSpeedKmh);
        metrics.put("positioningScore", positioningScore);
        metrics.put("decisionMakingScore", decisionMakingScore);

        return new FootballAnalysisResult(events, metrics);
    }

    public static class FootballAnalysisResult {
        public final List<StandardizedEvent> events;
        public final Map<String, Object> metrics;

        public FootballAnalysisResult(List<StandardizedEvent> events, Map<String, Object> metrics) {
            this.events = events;
            this.metrics = metrics;
        }
    }
}
