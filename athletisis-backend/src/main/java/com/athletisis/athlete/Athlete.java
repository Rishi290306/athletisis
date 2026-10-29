package com.athletisis.athlete;

import com.athletisis.auth.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "athletes")
public class Athlete {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;
    private Integer age;
    private String sport;
    private String position;
    private String teamName;
    private String preferredRole;
    private String experienceLevel;
    private String profilePhotoUrl;
    private Integer matchesAnalyzedCount = 0;

    @Embedded
    private AthleteDNA dna = new AthleteDNA();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Athlete() {}

    public Athlete(User user, String name, Integer age, String sport, String position, String teamName, String preferredRole, String experienceLevel) {
        this.user = user;
        this.name = name;
        this.age = age;
        this.sport = sport != null ? sport : "Football";
        this.position = position != null ? position : "Midfielder";
        this.teamName = teamName;
        this.preferredRole = preferredRole;
        this.experienceLevel = experienceLevel != null ? experienceLevel : "Amateur";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public Integer getMatchesAnalyzedCount() { return matchesAnalyzedCount; }
    public void setMatchesAnalyzedCount(Integer matchesAnalyzedCount) { this.matchesAnalyzedCount = matchesAnalyzedCount; }

    public AthleteDNA getDna() { return dna; }
    public void setDna(AthleteDNA dna) { this.dna = dna; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
