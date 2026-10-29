package com.athletisis.match;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class MatchDTOs {

    public static class CreateMatchRequest {
        @NotBlank
        private String matchName;

        private String sport = "Football";

        @NotNull
        private LocalDate matchDate;

        private String teamName;
        private String opponentName;
        private String venue;
        private String matchType;

        @NotNull
        private Long athleteId;

        private String notes;

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

        public Long getAthleteId() { return athleteId; }
        public void setAthleteId(Long athleteId) { this.athleteId = athleteId; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class MatchResponse {
        private Long id;
        private String matchName;
        private String sport;
        private LocalDate matchDate;
        private String teamName;
        private String opponentName;
        private String venue;
        private String matchType;
        private Long athleteId;
        private String athleteName;
        private String notes;
        private String status;

        public MatchResponse(Match match) {
            this.id = match.getId();
            this.matchName = match.getMatchName();
            this.sport = match.getSport();
            this.matchDate = match.getMatchDate();
            this.teamName = match.getTeamName();
            this.opponentName = match.getOpponentName();
            this.venue = match.getVenue();
            this.matchType = match.getMatchType();
            this.athleteId = match.getAthlete().getId();
            this.athleteName = match.getAthlete().getName();
            this.notes = match.getNotes();
            this.status = match.getStatus();
        }

        public Long getId() { return id; }
        public String getMatchName() { return matchName; }
        public String getSport() { return sport; }
        public LocalDate getMatchDate() { return matchDate; }
        public String getTeamName() { return teamName; }
        public String getOpponentName() { return opponentName; }
        public String getVenue() { return venue; }
        public String getMatchType() { return matchType; }
        public Long getAthleteId() { return athleteId; }
        public String getAthleteName() { return athleteName; }
        public String getNotes() { return notes; }
        public String getStatus() { return status; }
    }
}
