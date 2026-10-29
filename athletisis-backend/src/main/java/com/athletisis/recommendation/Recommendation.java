package com.athletisis.recommendation;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long athleteId;
    private Long matchId;

    private String weaknessTitle;
    private String priority; // HIGH, MEDIUM, LOW
    private String recommendedDrill;
    private String frequency; // 3 sessions/week
    private Double currentScore;
    private Double targetScore;
    private String status = "ACTIVE"; // ACTIVE, IN_PROGRESS, COMPLETED

    @Column(length = 2000)
    private String evidenceDescription;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Recommendation() {}

    public Recommendation(Long athleteId, Long matchId, String weaknessTitle, String priority, 
                          String recommendedDrill, String frequency, Double currentScore, Double targetScore, String evidenceDescription) {
        this.athleteId = athleteId;
        this.matchId = matchId;
        this.weaknessTitle = weaknessTitle;
        this.priority = priority;
        this.recommendedDrill = recommendedDrill;
        this.frequency = frequency;
        this.currentScore = currentScore;
        this.targetScore = targetScore;
        this.evidenceDescription = evidenceDescription;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAthleteId() { return athleteId; }
    public void setAthleteId(Long athleteId) { this.athleteId = athleteId; }

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public String getWeaknessTitle() { return weaknessTitle; }
    public void setWeaknessTitle(String weaknessTitle) { this.weaknessTitle = weaknessTitle; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getRecommendedDrill() { return recommendedDrill; }
    public void setRecommendedDrill(String recommendedDrill) { this.recommendedDrill = recommendedDrill; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public Double getCurrentScore() { return currentScore; }
    public void setCurrentScore(Double currentScore) { this.currentScore = currentScore; }

    public Double getTargetScore() { return targetScore; }
    public void setTargetScore(Double targetScore) { this.targetScore = targetScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEvidenceDescription() { return evidenceDescription; }
    public void setEvidenceDescription(String evidenceDescription) { this.evidenceDescription = evidenceDescription; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
