package com.athletisis.performance;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_scores")
public class PerformanceScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long matchId;
    private Long athleteId;
    private String sport = "Football";
    private String position;

    private Double technicalScore;
    private Double tacticalScore;
    private Double physicalScore;
    private Double decisionMakingScore;
    private Double consistencyScore;
    private Double overallScore;

    @Column(length = 4000)
    private String metricsJson;

    @Column(length = 4000)
    private String strengthsJson;

    @Column(length = 4000)
    private String weaknessesJson;

    @Column(length = 4000)
    private String explainableFactorsJson;

    @Column(length = 2000)
    private String aiConfidenceJson;

    @Column(length = 8000)
    private String heatmapsJson;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public PerformanceScore() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public Long getAthleteId() { return athleteId; }
    public void setAthleteId(Long athleteId) { this.athleteId = athleteId; }

    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public Double getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(Double technicalScore) { this.technicalScore = technicalScore; }

    public Double getTacticalScore() { return tacticalScore; }
    public void setTacticalScore(Double tacticalScore) { this.tacticalScore = tacticalScore; }

    public Double getPhysicalScore() { return physicalScore; }
    public void setPhysicalScore(Double physicalScore) { this.physicalScore = physicalScore; }

    public Double getDecisionMakingScore() { return decisionMakingScore; }
    public void setDecisionMakingScore(Double decisionMakingScore) { this.decisionMakingScore = decisionMakingScore; }

    public Double getConsistencyScore() { return consistencyScore; }
    public void setConsistencyScore(Double consistencyScore) { this.consistencyScore = consistencyScore; }

    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }

    public String getMetricsJson() { return metricsJson; }
    public void setMetricsJson(String metricsJson) { this.metricsJson = metricsJson; }

    public String getStrengthsJson() { return strengthsJson; }
    public void setStrengthsJson(String strengthsJson) { this.strengthsJson = strengthsJson; }

    public String getWeaknessesJson() { return weaknessesJson; }
    public void setWeaknessesJson(String weaknessesJson) { this.weaknessesJson = weaknessesJson; }

    public String getExplainableFactorsJson() { return explainableFactorsJson; }
    public void setExplainableFactorsJson(String explainableFactorsJson) { this.explainableFactorsJson = explainableFactorsJson; }

    public String getAiConfidenceJson() { return aiConfidenceJson; }
    public void setAiConfidenceJson(String aiConfidenceJson) { this.aiConfidenceJson = aiConfidenceJson; }

    public String getHeatmapsJson() { return heatmapsJson; }
    public void setHeatmapsJson(String heatmapsJson) { this.heatmapsJson = heatmapsJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
