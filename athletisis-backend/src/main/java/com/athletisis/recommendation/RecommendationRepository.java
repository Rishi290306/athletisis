package com.athletisis.recommendation;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByAthleteIdOrderByCreatedAtDesc(Long athleteId);
}
