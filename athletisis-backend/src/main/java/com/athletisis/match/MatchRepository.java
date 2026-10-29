package com.athletisis.match;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByAthleteIdOrderByMatchDateDesc(Long athleteId);
    List<Match> findByTeamName(String teamName);
}
