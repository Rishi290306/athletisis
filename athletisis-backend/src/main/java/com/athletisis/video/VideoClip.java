package com.athletisis.video;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "video_clips")
public class VideoClip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long matchId;
    private Long athleteId;

    private String clipType; // MISTAKE, IMPORTANT_MOMENT, BEST_MOMENT, GOAL, SHOT, TACKLE
    private String title;
    private String description;

    private Double startTimestampSeconds;
    private Double endTimestampSeconds;
    private String formattedTimestamp; // e.g. 02:31:42

    private String clipUrl;
    private String thumbnailUrl;

    @Column(length = 2000)
    private String decisionAnalysis; // "What should I have done?" guidance

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public VideoClip() {}

    public VideoClip(Long matchId, Long athleteId, String clipType, String title, String description,
                     Double startTimestampSeconds, Double endTimestampSeconds, String formattedTimestamp,
                     String clipUrl, String decisionAnalysis) {
        this.matchId = matchId;
        this.athleteId = athleteId;
        this.clipType = clipType;
        this.title = title;
        this.description = description;
        this.startTimestampSeconds = startTimestampSeconds;
        this.endTimestampSeconds = endTimestampSeconds;
        this.formattedTimestamp = formattedTimestamp;
        this.clipUrl = clipUrl;
        this.decisionAnalysis = decisionAnalysis;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public Long getAthleteId() { return athleteId; }
    public void setAthleteId(Long athleteId) { this.athleteId = athleteId; }

    public String getClipType() { return clipType; }
    public void setClipType(String clipType) { this.clipType = clipType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getStartTimestampSeconds() { return startTimestampSeconds; }
    public void setStartTimestampSeconds(Double startTimestampSeconds) { this.startTimestampSeconds = startTimestampSeconds; }

    public Double getEndTimestampSeconds() { return endTimestampSeconds; }
    public void setEndTimestampSeconds(Double endTimestampSeconds) { this.endTimestampSeconds = endTimestampSeconds; }

    public String getFormattedTimestamp() { return formattedTimestamp; }
    public void setFormattedTimestamp(String formattedTimestamp) { this.formattedTimestamp = formattedTimestamp; }

    public String getClipUrl() { return clipUrl; }
    public void setClipUrl(String clipUrl) { this.clipUrl = clipUrl; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getDecisionAnalysis() { return decisionAnalysis; }
    public void setDecisionAnalysis(String decisionAnalysis) { this.decisionAnalysis = decisionAnalysis; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
