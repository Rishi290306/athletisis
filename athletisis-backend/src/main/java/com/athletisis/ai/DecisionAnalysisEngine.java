package com.athletisis.ai;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DecisionAnalysisEngine {

    public List<Map<String, Object>> analyzeMistakesAndAlternatives(Long matchId) {
        List<Map<String, Object>> decisionAnalysisList = new ArrayList<>();

        // Mistake 1: Decision Error
        Map<String, Object> m1 = new LinkedHashMap<>();
        m1.put("mistakeId", 1);
        m1.put("formattedTimestamp", "00:10:20");
        m1.put("timestampSeconds", 620.0);
        m1.put("errorType", "Risky Pass under High Pressure");
        m1.put("gameState", "Opponent pressing high in 4-3-3 shape. You received the ball facing your own goal in the central third.");
        m1.put("athletePosition", "Central Midfield (x:45.0, y:40.0)");
        m1.put("athleteAction", "Attempted a forced ground pass through two opposition central midfielders.");
        m1.put("evaluatedAlternatives", List.of(
                "Option A (Chosen): Central pass through traffic — Possession Retention Probability: 28%",
                "Option B (Recommended): Lay off to left winger with 18m open space — Possession Retention Probability: 92%"
        ));
        m1.put("recommendation", "You attempted a risky forward pass through congested space. A teammate on the left wing had a higher probability of retaining possession and advancing the attack.");
        m1.put("clipTitle", "Decision Error — Forced Pass vs Left Wing Reset");
        decisionAnalysisList.add(m1);

        // Mistake 2: Positioning Error
        Map<String, Object> m2 = new LinkedHashMap<>();
        m2.put("mistakeId", 2);
        m2.put("formattedTimestamp", "00:18:40");
        m2.put("timestampSeconds", 1120.0);
        m2.put("errorType", "Defensive Transition Over-commitment");
        m2.put("gameState", "Opposition counter-attack initiated following turn-over in opposition half.");
        m2.put("athletePosition", "Attacking Third (x:65.0, y:20.0)");
        m2.put("athleteAction", "Pressed forward aggressively instead of dropping back into central defensive covering zone.");
        m2.put("evaluatedAlternatives", List.of(
                "Option A (Chosen): High press — Defensive Recovery Probability: 20%",
                "Option B (Recommended): Track back 15m into central passing lane — Defensive Recovery Probability: 85%"
        ));
        m2.put("recommendation", "During defensive transition, stepping forward left open space behind your midfield line. Dropping back 15m to compact the central space would prevent the opposition counter.");
        m2.put("clipTitle", "Positioning Error — Midfield Gap on Counter Attack");
        decisionAnalysisList.add(m2);

        return decisionAnalysisList;
    }
}
