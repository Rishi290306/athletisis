package com.athletisis.analysis;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AnalysisJobRepository extends JpaRepository<AnalysisJob, Long> {
    Optional<AnalysisJob> findByMatchId(Long matchId);
    Optional<AnalysisJob> findByVideoId(Long videoId);
}
