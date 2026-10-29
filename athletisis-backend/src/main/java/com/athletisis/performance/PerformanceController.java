package com.athletisis.performance;

import com.athletisis.recommendation.Recommendation;
import com.athletisis.recommendation.RecommendationEngine;
import com.athletisis.video.VideoClip;
import com.athletisis.video.VideoClipRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/performance")
public class PerformanceController {

    private final PerformanceScoreRepository performanceScoreRepository;
    private final RecommendationEngine recommendationEngine;
    private final VideoClipRepository videoClipRepository;

    public PerformanceController(PerformanceScoreRepository performanceScoreRepository,
                                 RecommendationEngine recommendationEngine,
                                 VideoClipRepository videoClipRepository) {
        this.performanceScoreRepository = performanceScoreRepository;
        this.recommendationEngine = recommendationEngine;
        this.videoClipRepository = videoClipRepository;
    }

    @GetMapping("/match/{matchId}")
    public ResponseEntity<Map<String, Object>> getMatchPerformance(@PathVariable Long matchId) {
        PerformanceScore score = performanceScoreRepository.findByMatchId(matchId).orElse(null);
        if (score == null) return ResponseEntity.notFound().build();

        List<VideoClip> clips = videoClipRepository.findByMatchId(matchId);
        List<Recommendation> recommendations = recommendationEngine.getRecommendationsByAthlete(score.getAthleteId());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("score", score);
        response.put("clips", clips);
        response.put("recommendations", recommendations);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/athlete/{athleteId}/history")
    public ResponseEntity<List<PerformanceScore>> getAthletePerformanceHistory(@PathVariable Long athleteId) {
        return ResponseEntity.ok(performanceScoreRepository.findByAthleteIdOrderByCreatedAtAsc(athleteId));
    }
}
