package com.athletisis.video;

import com.athletisis.match.Match;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "videos")
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    private String originalFileName;
    private String fileUrl;
    private Long fileSizeBytes;
    private Double durationSeconds;

    private Integer width;
    private Integer height;
    private Double fps;

    private Integer qualityScore; // 0-100%
    private Integer lightingScore;
    private Integer blurScore;
    private String cameraAngle; // Tactical Wide, Broadcast, Sideline High, Low Angle
    private Integer playerVisibilityScore;
    private Integer ballVisibilityScore;

    @Column(length = 1000)
    private String warningMessage;

    private String status = "UPLOADED"; // UPLOADED, QUALITY_CHECKED, PROCESSING, COMPLETED, FAILED

    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }

    public Video() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Match getMatch() { return match; }
    public void setMatch(Match match) { this.match = match; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public Double getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Double durationSeconds) { this.durationSeconds = durationSeconds; }

    public Integer getWidth() { return width; }
    public void setWidth(Integer width) { this.width = width; }

    public Integer getHeight() { return height; }
    public void setHeight(Integer height) { this.height = height; }

    public Double getFps() { return fps; }
    public void setFps(Double fps) { this.fps = fps; }

    public Integer getQualityScore() { return qualityScore; }
    public void setQualityScore(Integer qualityScore) { this.qualityScore = qualityScore; }

    public Integer getLightingScore() { return lightingScore; }
    public void setLightingScore(Integer lightingScore) { this.lightingScore = lightingScore; }

    public Integer getBlurScore() { return blurScore; }
    public void setBlurScore(Integer blurScore) { this.blurScore = blurScore; }

    public String getCameraAngle() { return cameraAngle; }
    public void setCameraAngle(String cameraAngle) { this.cameraAngle = cameraAngle; }

    public Integer getPlayerVisibilityScore() { return playerVisibilityScore; }
    public void setPlayerVisibilityScore(Integer playerVisibilityScore) { this.playerVisibilityScore = playerVisibilityScore; }

    public Integer getBallVisibilityScore() { return ballVisibilityScore; }
    public void setBallVisibilityScore(Integer ballVisibilityScore) { this.ballVisibilityScore = ballVisibilityScore; }

    public String getWarningMessage() { return warningMessage; }
    public void setWarningMessage(String warningMessage) { this.warningMessage = warningMessage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
