package com.athletisis.performance;

import com.athletisis.sports.CricketEngine;
import com.athletisis.sports.FootballEngine;
import com.athletisis.sports.VolleyballEngine;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PerformanceEngineTest {

    private PerformanceEngine performanceEngine;

    @BeforeEach
    void setUp() {
        ExplainableAIEngine explainableAIEngine = new ExplainableAIEngine();
        StrengthWeaknessDetector strengthWeaknessDetector = new StrengthWeaknessDetector();
        CricketEngine cricketEngine = new CricketEngine();
        VolleyballEngine volleyballEngine = new VolleyballEngine();
        ObjectMapper objectMapper = new ObjectMapper();

        performanceEngine = new PerformanceEngine(explainableAIEngine, strengthWeaknessDetector, cricketEngine, volleyballEngine, objectMapper);
    }

    @Test
    void computeFootballPerformance_ValidCalculation() {
        FootballEngine footballEngine = new FootballEngine();
        FootballEngine.FootballAnalysisResult result = footballEngine.processFootballVideo(1L, 2L, "Midfielder");

        PerformanceScore score = performanceEngine.computePerformance(1L, 2L, "Midfielder", result);

        assertNotNull(score);
        assertEquals(1L, score.getMatchId());
        assertEquals(2L, score.getAthleteId());
        assertEquals("Football", score.getSport());
        assertTrue(score.getOverallScore() > 50.0 && score.getOverallScore() <= 100.0);
        assertNotNull(score.getHeatmapsJson());
    }

    @Test
    void computeCricketPerformance_ValidCalculation() {
        PerformanceScore score = performanceEngine.computeCricketPerformance(1L, 2L, "Batsman");

        assertNotNull(score);
        assertEquals(1L, score.getMatchId());
        assertEquals("Cricket", score.getSport());
        assertEquals("Batsman", score.getPosition());
        assertTrue(score.getOverallScore() > 50.0);
        assertNotNull(score.getHeatmapsJson());
    }

    @Test
    void computeVolleyballPerformance_ValidCalculation() {
        PerformanceScore score = performanceEngine.computeVolleyballPerformance(1L, 2L, "Spiker");

        assertNotNull(score);
        assertEquals(1L, score.getMatchId());
        assertEquals("Volleyball", score.getSport());
        assertEquals("Spiker", score.getPosition());
        assertTrue(score.getOverallScore() > 50.0);
        assertNotNull(score.getHeatmapsJson());
    }
}
