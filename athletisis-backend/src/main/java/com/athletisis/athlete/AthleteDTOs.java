package com.athletisis.athlete;

public class AthleteDTOs {

    public static class AthleteResponse {
        private Long id;
        private Long userId;
        private String name;
        private Integer age;
        private String sport;
        private String position;
        private String teamName;
        private String preferredRole;
        private String experienceLevel;
        private String profilePhotoUrl;
        private Integer matchesAnalyzedCount;
        private AthleteDNA dna;

        public AthleteResponse(Athlete athlete) {
            this.id = athlete.getId();
            this.userId = athlete.getUser().getId();
            this.name = athlete.getName();
            this.age = athlete.getAge();
            this.sport = athlete.getSport();
            this.position = athlete.getPosition();
            this.teamName = athlete.getTeamName();
            this.preferredRole = athlete.getPreferredRole();
            this.experienceLevel = athlete.getExperienceLevel();
            this.profilePhotoUrl = athlete.getProfilePhotoUrl();
            this.matchesAnalyzedCount = athlete.getMatchesAnalyzedCount();
            this.dna = athlete.getDna();
        }

        public Long getId() { return id; }
        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public Integer getAge() { return age; }
        public String getSport() { return sport; }
        public String getPosition() { return position; }
        public String getTeamName() { return teamName; }
        public String getPreferredRole() { return preferredRole; }
        public String getExperienceLevel() { return experienceLevel; }
        public String getProfilePhotoUrl() { return profilePhotoUrl; }
        public Integer getMatchesAnalyzedCount() { return matchesAnalyzedCount; }
        public AthleteDNA getDna() { return dna; }
    }

    public static class UpdateAthleteRequest {
        private String name;
        private Integer age;
        private String sport;
        private String position;
        private String teamName;
        private String preferredRole;
        private String experienceLevel;
        private String profilePhotoUrl;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Integer getAge() { return age; }
        public void setAge(Integer age) { this.age = age; }

        public String getSport() { return sport; }
        public void setSport(String sport) { this.sport = sport; }

        public String getPosition() { return position; }
        public void setPosition(String position) { this.position = position; }

        public String getTeamName() { return teamName; }
        public void setTeamName(String teamName) { this.teamName = teamName; }

        public String getPreferredRole() { return preferredRole; }
        public void setPreferredRole(String preferredRole) { this.preferredRole = preferredRole; }

        public String getExperienceLevel() { return experienceLevel; }
        public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

        public String getProfilePhotoUrl() { return profilePhotoUrl; }
        public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }
    }
}
