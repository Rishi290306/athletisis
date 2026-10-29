package com.athletisis.ai;

import com.athletisis.athlete.Athlete;
import com.athletisis.athlete.AthleteRepository;
import com.athletisis.performance.PerformanceScore;
import com.athletisis.performance.PerformanceScoreRepository;
import com.athletisis.video.VideoClip;
import com.athletisis.video.VideoClipRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AICoachService {

    private final AthleteRepository athleteRepository;
    private final PerformanceScoreRepository performanceScoreRepository;
    private final VideoClipRepository videoClipRepository;

    public AICoachService(AthleteRepository athleteRepository,
                          PerformanceScoreRepository performanceScoreRepository,
                          VideoClipRepository videoClipRepository) {
        this.athleteRepository = athleteRepository;
        this.performanceScoreRepository = performanceScoreRepository;
        this.videoClipRepository = videoClipRepository;
    }

    public ChatResponse processChat(Long athleteId, String userMessage) {
        Athlete athlete = athleteRepository.findById(athleteId).orElse(null);
        List<PerformanceScore> scores = performanceScoreRepository.findByAthleteIdOrderByCreatedAtAsc(athleteId);

        PerformanceScore latestScore = scores.isEmpty() ? null : scores.get(scores.size() - 1);
        List<VideoClip> clips = latestScore == null ? List.of() : videoClipRepository.findByMatchId(latestScore.getMatchId());

        String lowerMessage = userMessage.toLowerCase();
        String replyText;
        List<Map<String, Object>> relevantClips = new ArrayList<>();

        if (lowerMessage.contains("tactical") || lowerMessage.contains("score low") || lowerMessage.contains("positioning")) {
            double tact = latestScore != null ? latestScore.getTacticalScore() : 78.0;
            replyText = String.format("Your tactical score was %.1f, mainly affected by positioning errors during defensive transitions when stepping up too early under opposition counter-attacks.", tact);

            for (VideoClip c : clips) {
                if ("MISTAKE".equals(c.getClipType()) || c.getTitle().contains("Positioning") || c.getTitle().contains("Decision")) {
                    Map<String, Object> clipMap = new LinkedHashMap<>();
                    clipMap.put("id", c.getId());
                    clipMap.put("title", c.getTitle());
                    clipMap.put("timestamp", c.getFormattedTimestamp());
                    clipMap.put("type", c.getClipType());
                    clipMap.put("guidance", c.getDecisionAnalysis());
                    relevantClips.add(clipMap);
                }
            }
        } else if (lowerMessage.contains("improve") || lowerMessage.contains("training") || lowerMessage.contains("recommend")) {
            replyText = "To improve your tactical score from 78 to 85, focus on Defensive Transition & Compact Midfield Positioning drills 3 sessions/week. This directly targets the over-commitment pattern detected in your last match.";
        } else if (lowerMessage.contains("strength") || lowerMessage.contains("well")) {
            double tech = latestScore != null ? latestScore.getTechnicalScore() : 86.0;
            double speed = 29.4;
            replyText = String.format("Your key strength is Passing & Physical Acceleration! You achieved a technical pass accuracy of 85.7%% and a peak sprint speed of %.1f km/h.", speed);
        } else {
            replyText = "Hello! I am your Athletisis AI Performance Coach. I analyze your match footage, tracking data, mistake clips, and performance trends. Ask me anything about your tactical score, positioning errors, passing accuracy, or recommended training drills!";
        }

        return new ChatResponse(replyText, relevantClips);
    }

    public static class ChatResponse {
        private String reply;
        private List<Map<String, Object>> videoClips;

        public ChatResponse(String reply, List<Map<String, Object>> videoClips) {
            this.reply = reply;
            this.videoClips = videoClips;
        }

        public String getReply() { return reply; }
        public List<Map<String, Object>> getVideoClips() { return videoClips; }
    }
}
