package com.athletisis.performance;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PerformanceScoreRepository extends JpaRepository<PerformanceScore, Long> {
    Optional<PerformanceScore> findByMatchId(Long matchId);
    List<PerformanceScore> findByAthleteIdOrderByCreatedAtAsc(Long athleteId);
}
