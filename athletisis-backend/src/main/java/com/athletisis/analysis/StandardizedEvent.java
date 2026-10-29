package com.athletisis.analysis;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "standardized_events")
public class StandardizedEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long matchId;
    private Long athleteId;
    private String sport;
    private String eventType; // PASS, SHOT, TACKLE, INTERCEPTION, POSSESSION_LOSS, DECISION_ERROR, POSITIONING_ERROR

    private Double timestampSeconds;
    private String formattedTimestamp; // e.g. 00:32:14
    private Double durationSeconds;
    private Double confidence;

    private Boolean success;
    private Double startX;
    private Double startY;
    private Double endX;
    private Double endY;

    @Column(length = 2000)
    private String metadataJson;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public StandardizedEvent() {}

    public StandardizedEvent(Long matchId, Long athleteId, String sport, String eventType, 
                             Double timestampSeconds, String formattedTimestamp, Double durationSeconds, 
                             Double confidence, Boolean success, Double startX, Double startY, Double endX, Double endY, String metadataJson) {
        this.matchId = matchId;
        this.athleteId = athleteId;
        this.sport = sport;
        this.eventType = eventType;
        this.timestampSeconds = timestampSeconds;
        this.formattedTimestamp = formattedTimestamp;
        this.durationSeconds = durationSeconds;
        this.confidence = confidence;
        this.success = success;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.metadataJson = metadataJson;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public Long getAthleteId() { return athleteId; }
    public void setAthleteId(Long athleteId) { this.athleteId = athleteId; }

    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Double getTimestampSeconds() { return timestampSeconds; }
    public void setTimestampSeconds(Double timestampSeconds) { this.timestampSeconds = timestampSeconds; }

    public String getFormattedTimestamp() { return formattedTimestamp; }
    public void setFormattedTimestamp(String formattedTimestamp) { this.formattedTimestamp = formattedTimestamp; }

    public Double getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Double durationSeconds) { this.durationSeconds = durationSeconds; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Boolean getSuccess() { return success; }
    public void setSuccess(Boolean success) { this.success = success; }

    public Double getStartX() { return startX; }
    public void setStartX(Double startX) { this.startX = startX; }

    public Double getStartY() { return startY; }
    public void setStartY(Double startY) { this.startY = startY; }

    public Double getEndX() { return endX; }
    public void setEndX(Double endX) { this.endX = endX; }

    public Double getEndY() { return endY; }
    public void setEndY(Double endY) { this.endY = endY; }

    public String getMetadataJson() { return metadataJson; }
    public void setMetadataJson(String metadataJson) { this.metadataJson = metadataJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
