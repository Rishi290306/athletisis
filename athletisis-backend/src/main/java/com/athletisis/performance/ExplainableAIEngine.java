package com.athletisis.performance;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ExplainableAIEngine {

    public Map<String, Object> generateExplainableFactors(double technical, double tactical, double physical, double decision, double consistency) {
        Map<String, Object> explainable = new LinkedHashMap<>();

        // Tactical Score Breakdown (e.g. Tactical: 78)
        Map<String, Integer> tacticalFactors = new LinkedHashMap<>();
        tacticalFactors.put("Positioning", +18);
        tacticalFactors.put("Movement Patterns", +16);
        tacticalFactors.put("Decision Quality", +14);
        tacticalFactors.put("Defensive Actions", +12);
        tacticalFactors.put("Transition Errors", -7);
        explainable.put("tacticalBreakdown", tacticalFactors);

        // Technical Score Breakdown (e.g. Technical: 86)
        Map<String, Integer> technicalFactors = new LinkedHashMap<>();
        technicalFactors.put("Pass Accuracy & Range", +24);
        technicalFactors.put("First Touch Control", +20);
        technicalFactors.put("Tackle Success Rate", +18);
        technicalFactors.put("Shot Selection & Power", +15);
        technicalFactors.put("Dispossessions", -5);
        explainable.put("technicalBreakdown", technicalFactors);

        return explainable;
    }

    public Map<String, String> generateAIConfidenceScores() {
        Map<String, String> confidenceMap = new LinkedHashMap<>();
        confidenceMap.put("Passing Analysis", "94%");
        confidenceMap.put("Player Tracking", "89%");
        confidenceMap.put("Positioning Analysis", "82%");
        confidenceMap.put("Event Detection", "91%");
        confidenceMap.put("Decision Modeling", "85%");
        return confidenceMap;
    }
}
