package com.athletisis.sports;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CricketEngine {

    public static class CricketAnalysisResult {
        public Map<String, Object> metrics = new LinkedHashMap<>();
        public Map<String, Object> heatmaps = new LinkedHashMap<>();
    }

    public CricketAnalysisResult analyzeCricketMatch(String position) {
        CricketAnalysisResult result = new CricketAnalysisResult();

        result.metrics.put("battingStrikeRate", 142.5);
        result.metrics.put("timingAccuracyPercent", 88.4);
        result.metrics.put("bowlingReleaseSpeedKmh", 138.2);
        result.metrics.put("goodLengthAccuracyPercent", 84.0);
        result.metrics.put("fieldingReflexScore", 91.0);
        result.metrics.put("boundaryEfficiency", 76.5);

        // 360 Wagon Wheel & Pitch Map Heatmaps
        double[][] wagonWheel = {
            {0.1, 0.4, 0.7, 0.9, 0.6, 0.3},
            {0.3, 0.8, 0.95, 0.85, 0.5, 0.2},
            {0.2, 0.6, 0.8, 0.7, 0.4, 0.1}
        };

        double[][] pitchMap = {
            {0.0, 0.2, 0.84, 0.3, 0.0},
            {0.1, 0.4, 0.92, 0.5, 0.1}
        };

        result.heatmaps.put("wagonWheel", wagonWheel);
        result.heatmaps.put("pitchMap", pitchMap);

        return result;
    }
}
