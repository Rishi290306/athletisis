package com.athletisis.video;

import com.athletisis.match.Match;
import com.athletisis.match.MatchRepository;
import com.athletisis.match.MatchService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final MatchRepository matchRepository;
    private final MatchService matchService;
    private final VideoQualityAnalyzer qualityAnalyzer;

    @Value("${athletisis.upload.dir:./storage/uploads}")
    private String uploadDir;

    public VideoService(VideoRepository videoRepository, MatchRepository matchRepository,
                        MatchService matchService, VideoQualityAnalyzer qualityAnalyzer) {
        this.videoRepository = videoRepository;
        this.matchRepository = matchRepository;
        this.matchService = matchService;
        this.qualityAnalyzer = qualityAnalyzer;
    }

    @Transactional
    public VideoDTOs.VideoResponse uploadAndAnalyzeVideo(Long matchId, MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        if (!qualityAnalyzer.isAllowedExtension(originalFilename)) {
            throw new IllegalArgumentException("Unsupported video format. Please upload MP4, MOV, AVI, or MKV.");
        }

        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with ID: " + matchId));

        Path storageDirectory = Paths.get(uploadDir);
        if (!Files.exists(storageDirectory)) {
            Files.createDirectories(storageDirectory);
        }

        String storedFileName = UUID.randomUUID() + "_" + originalFilename;
        Path targetPath = storageDirectory.resolve(storedFileName);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        File savedFile = targetPath.toFile();
        VideoQualityAnalyzer.QualityAssessmentResult assessment = qualityAnalyzer.analyzeVideoQuality(savedFile, originalFilename);

        Video video = videoRepository.findByMatchId(matchId).orElse(new Video());
        video.setMatch(match);
        video.setOriginalFileName(originalFilename);
        video.setFileUrl(targetPath.toAbsolutePath().toString());
        video.setFileSizeBytes(file.getSize());
        video.setDurationSeconds(assessment.durationSeconds);
        video.setWidth(assessment.width);
        video.setHeight(assessment.height);
        video.setFps(assessment.fps);
        video.setQualityScore(assessment.overallQuality);
        video.setLightingScore(assessment.lightingScore);
        video.setBlurScore(assessment.blurScore);
        video.setCameraAngle(assessment.cameraAngle);
        video.setPlayerVisibilityScore(assessment.playerVisibilityScore);
        video.setBallVisibilityScore(assessment.ballVisibilityScore);
        video.setWarningMessage(assessment.warningMessage);
        video.setStatus("QUALITY_CHECKED");

        Video savedVideo = videoRepository.save(video);
        matchService.updateMatchStatus(matchId, "UPLOADED");

        return new VideoDTOs.VideoResponse(savedVideo);
    }

    public VideoDTOs.VideoResponse getVideoByMatchId(Long matchId) {
        Video video = videoRepository.findByMatchId(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Video not found for match ID: " + matchId));
        return new VideoDTOs.VideoResponse(video);
    }

    public Video getVideoEntityById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Video not found with ID: " + id));
    }
}
