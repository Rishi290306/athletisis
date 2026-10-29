package com.athletisis.athlete;

import jakarta.persistence.Embeddable;

@Embeddable
public class AthleteDNA {

    private double technicalScore;
    private double tacticalScore;
    private double physicalScore;
    private double decisionMakingScore;
    private double consistencyScore;
    private double overallScore;

    public AthleteDNA() {
        this.technicalScore = 75.0;
        this.tacticalScore = 75.0;
        this.physicalScore = 75.0;
        this.decisionMakingScore = 75.0;
        this.consistencyScore = 75.0;
        this.overallScore = 75.0;
    }

    public AthleteDNA(double technicalScore, double tacticalScore, double physicalScore, 
                      double decisionMakingScore, double consistencyScore, double overallScore) {
        this.technicalScore = Math.round(technicalScore * 10.0) / 10.0;
        this.tacticalScore = Math.round(tacticalScore * 10.0) / 10.0;
        this.physicalScore = Math.round(physicalScore * 10.0) / 10.0;
        this.decisionMakingScore = Math.round(decisionMakingScore * 10.0) / 10.0;
        this.consistencyScore = Math.round(consistencyScore * 10.0) / 10.0;
        this.overallScore = Math.round(overallScore * 10.0) / 10.0;
    }

    public double getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(double technicalScore) { this.technicalScore = technicalScore; }

    public double getTacticalScore() { return tacticalScore; }
    public void setTacticalScore(double tacticalScore) { this.tacticalScore = tacticalScore; }

    public double getPhysicalScore() { return physicalScore; }
    public void setPhysicalScore(double physicalScore) { this.physicalScore = physicalScore; }

    public double getDecisionMakingScore() { return decisionMakingScore; }
    public void setDecisionMakingScore(double decisionMakingScore) { this.decisionMakingScore = decisionMakingScore; }

    public double getConsistencyScore() { return consistencyScore; }
    public void setConsistencyScore(double consistencyScore) { this.consistencyScore = consistencyScore; }

    public double getOverallScore() { return overallScore; }
    public void setOverallScore(double overallScore) { this.overallScore = overallScore; }
}
