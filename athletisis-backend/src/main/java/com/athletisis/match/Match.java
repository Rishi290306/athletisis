package com.athletisis.match;

import com.athletisis.athlete.Athlete;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String matchName;

    private String sport = "Football";

    private LocalDate matchDate;

    private String teamName;

    private String opponentName;

    private String venue;

    private String matchType; // Competitive, Friendly, Tournament, Training

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "athlete_id", nullable = false)
    private Athlete athlete;

    @Column(length = 2000)
    private String notes;

    private String status = "CREATED"; // CREATED, UPLOADED, PROCESSING, COMPLETED, FAILED

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Match() {}

    public Match(String matchName, String sport, LocalDate matchDate, String teamName, 
                 String opponentName, String venue, String matchType, Athlete athlete, String notes) {
        this.matchName = matchName;
        this.sport = sport != null ? sport : "Football";
        this.matchDate = matchDate;
        this.teamName = teamName;
        this.opponentName = opponentName;
        this.venue = venue;
        this.matchType = matchType;
        this.athlete = athlete;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMatchName() { return matchName; }
    public void setMatchName(String matchName) { this.matchName = matchName; }

    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }

    public LocalDate getMatchDate() { return matchDate; }
    public void setMatchDate(LocalDate matchDate) { this.matchDate = matchDate; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public String getOpponentName() { return opponentName; }
    public void setOpponentName(String opponentName) { this.opponentName = opponentName; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getMatchType() { return matchType; }
    public void setMatchType(String matchType) { this.matchType = matchType; }

    public Athlete getAthlete() { return athlete; }
    public void setAthlete(Athlete athlete) { this.athlete = athlete; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
