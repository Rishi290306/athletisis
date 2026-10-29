package com.athletisis.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/coach")
public class AICoachController {

    private final AICoachService aiCoachService;

    public AICoachController(AICoachService aiCoachService) {
        this.aiCoachService = aiCoachService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AICoachService.ChatResponse> chat(@RequestBody Map<String, Object> request) {
        Long athleteId = Long.parseLong(request.getOrDefault("athleteId", "1").toString());
        String message = request.getOrDefault("message", "").toString();
        return ResponseEntity.ok(aiCoachService.processChat(athleteId, message));
    }
}
