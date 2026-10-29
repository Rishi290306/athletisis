package com.athletisis.video;

public class VideoDTOs {

    public static class VideoResponse {
        private Long id;
        private Long matchId;
        private String originalFileName;
        private String fileUrl;
        private Long fileSizeBytes;
        private Double durationSeconds;
        private Integer width;
        private Integer height;
        private Double fps;
        private Integer qualityScore;
        private Integer lightingScore;
        private Integer blurScore;
        private String cameraAngle;
        private Integer playerVisibilityScore;
        private Integer ballVisibilityScore;
        private String warningMessage;
        private String status;

        public VideoResponse(Video video) {
            this.id = video.getId();
            this.matchId = video.getMatch().getId();
            this.originalFileName = video.getOriginalFileName();
            this.fileUrl = video.getFileUrl();
            this.fileSizeBytes = video.getFileSizeBytes();
            this.durationSeconds = video.getDurationSeconds();
            this.width = video.getWidth();
            this.height = video.getHeight();
            this.fps = video.getFps();
            this.qualityScore = video.getQualityScore();
            this.lightingScore = video.getLightingScore();
            this.blurScore = video.getBlurScore();
            this.cameraAngle = video.getCameraAngle();
            this.playerVisibilityScore = video.getPlayerVisibilityScore();
            this.ballVisibilityScore = video.getBallVisibilityScore();
            this.warningMessage = video.getWarningMessage();
            this.status = video.getStatus();
        }

        public Long getId() { return id; }
        public Long getMatchId() { return matchId; }
        public String getOriginalFileName() { return originalFileName; }
        public String getFileUrl() { return fileUrl; }
        public Long getFileSizeBytes() { return fileSizeBytes; }
        public Double getDurationSeconds() { return durationSeconds; }
        public Integer getWidth() { return width; }
        public Integer getHeight() { return height; }
        public Double getFps() { return fps; }
        public Integer getQualityScore() { return qualityScore; }
        public Integer getLightingScore() { return lightingScore; }
        public Integer getBlurScore() { return blurScore; }
        public String getCameraAngle() { return cameraAngle; }
        public Integer getPlayerVisibilityScore() { return playerVisibilityScore; }
        public Integer getBallVisibilityScore() { return ballVisibilityScore; }
        public String getWarningMessage() { return warningMessage; }
        public String getStatus() { return status; }
    }
}
