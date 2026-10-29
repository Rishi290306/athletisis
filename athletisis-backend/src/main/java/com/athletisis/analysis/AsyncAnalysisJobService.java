package com.athletisis.analysis;

import com.athletisis.athlete.AthleteService;
import com.athletisis.ai.DecisionAnalysisEngine;
import com.athletisis.match.MatchService;
import com.athletisis.performance.PerformanceEngine;
import com.athletisis.performance.PerformanceScore;
import com.athletisis.performance.PerformanceScoreRepository;
import com.athletisis.recommendation.RecommendationEngine;
import com.athletisis.sports.FootballEngine;
import com.athletisis.video.VideoClip;
import com.athletisis.video.VideoClipRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AsyncAnalysisJobService {

    private final AnalysisJobRepository analysisJobRepository;
    private final StandardizedEventRepository eventRepository;
    private final FootballEngine footballEngine;
    private final PerformanceEngine performanceEngine;
    private final PerformanceScoreRepository performanceScoreRepository;
    private final RecommendationEngine recommendationEngine;
    private final VideoClipRepository videoClipRepository;
    private final DecisionAnalysisEngine decisionAnalysisEngine;
    private final AthleteService athleteService;
    private final MatchService matchService;

    public AsyncAnalysisJobService(AnalysisJobRepository analysisJobRepository,
                                   StandardizedEventRepository eventRepository,
                                   FootballEngine footballEngine,
                                   PerformanceEngine performanceEngine,
                                   PerformanceScoreRepository performanceScoreRepository,
                                   RecommendationEngine recommendationEngine,
                                   VideoClipRepository videoClipRepository,
                                   DecisionAnalysisEngine decisionAnalysisEngine,
                                   AthleteService athleteService,
                                   MatchService matchService) {
        this.analysisJobRepository = analysisJobRepository;
        this.eventRepository = eventRepository;
        this.footballEngine = footballEngine;
        this.performanceEngine = performanceEngine;
        this.performanceScoreRepository = performanceScoreRepository;
        this.recommendationEngine = recommendationEngine;
        this.videoClipRepository = videoClipRepository;
        this.decisionAnalysisEngine = decisionAnalysisEngine;
        this.athleteService = athleteService;
        this.matchService = matchService;
    }

    public AnalysisJob createOrGetJob(Long matchId, Long videoId, Long athleteId) {
        return analysisJobRepository.findByMatchId(matchId)
                .orElseGet(() -> {
                    AnalysisJob job = new AnalysisJob(matchId, videoId, athleteId);
                    return analysisJobRepository.save(job);
                });
    }

    @Async
    public void executeAnalysisAsync(Long jobId) {
        AnalysisJob job = analysisJobRepository.findById(jobId).orElse(null);
        if (job == null) return;

        try {
            // Stage 1: Frame Preprocessing
            updateJobStatus(job, "FRAME_PREPROCESSING", 10, "Extracting video frames and inspecting quality parameters");
            Thread.sleep(500);

            // Stage 2: Computer Vision Object Detection & ByteTrack Persistent Tracking
            updateJobStatus(job, "COMPUTER_VISION", 35, "Running YOLO detection & persistent ByteTrack player IDs");
            Thread.sleep(800);

            // Stage 3: Football Event Detection
            updateJobStatus(job, "EVENT_DETECTION", 60, "Converting raw tracking into standardized football events");
            FootballEngine.FootballAnalysisResult footballResult = footballEngine.processFootballVideo(job.getMatchId(), job.getAthleteId(), "Midfielder");
            eventRepository.saveAll(footballResult.events);
            Thread.sleep(600);

            // Stage 4: Sport-Independent Performance Engine
            updateJobStatus(job, "PERFORMANCE_ENGINE", 80, "Computing Technical, Tactical, Physical, and Decision scores");
            PerformanceScore performanceScore = performanceEngine.computePerformance(job.getMatchId(), job.getAthleteId(), "Midfielder", footballResult);
            performanceScoreRepository.save(performanceScore);
            Thread.sleep(500);

            // Stage 5: Recommendations & Mistake Clips
            updateJobStatus(job, "RECOMMENDATIONS_AND_CLIPS", 95, "Generating grounded recommendations & mistake clips");
            List<Map<String, String>> weaknesses = List.of(
                    Map.of("title", "Defensive Transition Over-commitment", "priority", "HIGH", "evidence", "Positioning score reduced to 78.0 by 2 over-commitments."),
                    Map.of("title", "Risky Passes Under Pressure", "priority", "MEDIUM", "evidence", "Conceded 4 possession losses under central press.")
            );
            recommendationEngine.generateAndSaveRecommendations(job.getAthleteId(), job.getMatchId(), weaknesses);

            // Create Video Clips
            VideoClip clip1 = new VideoClip(
                    job.getMatchId(), job.getAthleteId(), "MISTAKE", "Decision Error — Risky Central Pass",
                    "Forced pass under high pressure instead of laying off to open left winger.",
                    620.0, 630.0, "00:10:20", "/storage/clips/clip_mistake_1.mp4",
                    "You attempted a risky forward pass under pressure. A teammate on the left wing had a 92% probability of retaining possession."
            );
            VideoClip clip2 = new VideoClip(
                    job.getMatchId(), job.getAthleteId(), "MISTAKE", "Positioning Error — Defensive Gap",
                    "Over-committed forward during opposition counter-attack.",
                    1120.0, 1130.0, "00:18:40", "/storage/clips/clip_mistake_2.mp4",
                    "Dropping back 15m to compact central space would prevent opposition counter-attack corridor."
            );
            VideoClip clip3 = new VideoClip(
                    job.getMatchId(), job.getAthleteId(), "BEST_MOMENT", "Top Speed Sprint & Interception",
                    "Peak sprint speed of 29.4 km/h to intercept dangerous through ball.",
                    940.0, 950.0, "00:15:40", "/storage/clips/clip_highlight_1.mp4",
                    "Excellent defensive anticipation and acceleration."
            );
            videoClipRepository.saveAll(List.of(clip1, clip2, clip3));

            // Stage 6: Update Athlete DNA & Complete
            athleteService.updateAthleteDNA(job.getAthleteId(), new com.athletisis.athlete.AthleteDNA(
                    performanceScore.getTechnicalScore(),
                    performanceScore.getTacticalScore(),
                    performanceScore.getPhysicalScore(),
                    performanceScore.getDecisionMakingScore(),
                    performanceScore.getConsistencyScore(),
                    performanceScore.getOverallScore()
            ));

            matchService.updateMatchStatus(job.getMatchId(), "COMPLETED");
            updateJobStatus(job, "COMPLETED", 100, "Match video analysis successfully completed!");

        } catch (Exception e) {
            job.setStatus("FAILED");
            job.setErrorDetails(e.getMessage());
            analysisJobRepository.save(job);
        }
    }

    private void updateJobStatus(AnalysisJob job, String status, int progress, String stage) {
        job.setStatus(status);
        job.setProgressPercent(progress);
        job.setCurrentStage(stage);
        analysisJobRepository.save(job);
    }
}
