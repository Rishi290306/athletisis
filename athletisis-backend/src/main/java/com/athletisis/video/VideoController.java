package com.athletisis.video;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping("/upload")
    public ResponseEntity<VideoDTOs.VideoResponse> uploadVideo(
            @RequestParam("matchId") Long matchId,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(videoService.uploadAndAnalyzeVideo(matchId, file));
    }

    @GetMapping("/match/{matchId}")
    public ResponseEntity<VideoDTOs.VideoResponse> getVideoByMatchId(@PathVariable Long matchId) {
        return ResponseEntity.ok(videoService.getVideoByMatchId(matchId));
    }
}
