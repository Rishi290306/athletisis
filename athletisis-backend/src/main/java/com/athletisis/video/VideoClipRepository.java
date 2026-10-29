package com.athletisis.video;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VideoClipRepository extends JpaRepository<VideoClip, Long> {
    List<VideoClip> findByMatchId(Long matchId);
    List<VideoClip> findByMatchIdAndClipType(Long matchId, String clipType);
}
