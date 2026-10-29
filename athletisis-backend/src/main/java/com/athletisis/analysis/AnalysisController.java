package com.athletisis.analysis;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analysis")
public class AnalysisController {

    private final AsyncAnalysisJobService asyncAnalysisJobService;
    private final AnalysisJobRepository analysisJobRepository;
    private final StandardizedEventRepository eventRepository;

    public AnalysisController(AsyncAnalysisJobService asyncAnalysisJobService,
                              AnalysisJobRepository analysisJobRepository,
                              StandardizedEventRepository eventRepository) {
        this.asyncAnalysisJobService = asyncAnalysisJobService;
        this.analysisJobRepository = analysisJobRepository;
        this.eventRepository = eventRepository;
    }

    @PostMapping("/{matchId}/start")
    public ResponseEntity<AnalysisJob> startAnalysis(
            @PathVariable Long matchId,
            @RequestParam Long videoId,
            @RequestParam Long athleteId) {
        AnalysisJob job = asyncAnalysisJobService.createOrGetJob(matchId, videoId, athleteId);
        asyncAnalysisJobService.executeAnalysisAsync(job.getId());
        return ResponseEntity.ok(job);
    }

    @GetMapping("/{matchId}/status")
    public ResponseEntity<AnalysisJob> getAnalysisStatus(@PathVariable Long matchId) {
        return analysisJobRepository.findByMatchId(matchId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{matchId}/events")
    public ResponseEntity<List<StandardizedEvent>> getEvents(@PathVariable Long matchId) {
        return ResponseEntity.ok(eventRepository.findByMatchId(matchId));
    }
}
