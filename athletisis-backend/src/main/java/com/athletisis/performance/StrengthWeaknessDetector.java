package com.athletisis.performance;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StrengthWeaknessDetector {

    public List<Map<String, String>> detectStrengths(Map<String, Object> metrics) {
        List<Map<String, String>> strengths = new ArrayList<>();

        double passAcc = ((Number) metrics.getOrDefault("passAccuracy", 85.0)).doubleValue();
        double maxSpeed = ((Number) metrics.getOrDefault("maxSpeedKmh", 29.0)).doubleValue();
        int tackles = ((Number) metrics.getOrDefault("successfulTackles", 4)).intValue();

        if (passAcc >= 80.0) {
            Map<String, String> s = new LinkedHashMap<>();
            s.put("category", "Passing & Distribution");
            s.put("title", "High Pass Precision");
            s.put("evidence", String.format("Your passing accuracy was %.1f%%, maintaining strong short and medium pass consistency under opponent pressure.", passAcc));
            strengths.add(s);
        }

        if (maxSpeed >= 28.0) {
            Map<String, String> s = new LinkedHashMap<>();
            s.put("category", "Physical Acceleration");
            s.put("title", "Top Speed Burst");
            s.put("evidence", String.format("Recorded a peak sprint speed of %.1f km/h, outpacing opposition markers during high-intensity transitions.", maxSpeed));
            strengths.add(s);
        }

        if (tackles >= 3) {
            Map<String, String> s = new LinkedHashMap<>();
            s.put("category", "Defensive Workrate");
            s.put("title", "Tackle Efficiency");
            s.put("evidence", String.format("Successfully executed %d defensive tackles, disrupting opposition buildup in central areas.", tackles));
            strengths.add(s);
        }

        return strengths;
    }

    public List<Map<String, String>> detectWeaknesses(Map<String, Object> metrics) {
        List<Map<String, String>> weaknesses = new ArrayList<>();

        double positioningScore = ((Number) metrics.getOrDefault("positioningScore", 78.0)).doubleValue();
        int possessionLosses = ((Number) metrics.getOrDefault("possessionLosses", 4)).intValue();

        if (positioningScore < 80.0) {
            Map<String, String> w = new LinkedHashMap<>();
            w.put("category", "Tactical Positioning");
            w.put("title", "Defensive Transition Over-commitment");
            w.put("priority", "HIGH");
            w.put("evidence", String.format("Your positioning score was reduced to %.1f by repeated over-commitments during fast defensive transitions.", positioningScore));
            weaknesses.add(w);
        }

        if (possessionLosses >= 3) {
            Map<String, String> w = new LinkedHashMap<>();
            w.put("category", "Decision Making");
            w.put("title", "Risky Passes Under Pressure");
            w.put("priority", "MEDIUM");
            w.put("evidence", String.format("Conceded %d possession losses when attempting high-risk forward passes into congested central corridors.", possessionLosses));
            weaknesses.add(w);
        }

        return weaknesses;
    }
}
