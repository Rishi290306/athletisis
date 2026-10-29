package com.athletisis.analysis;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StandardizedEventRepository extends JpaRepository<StandardizedEvent, Long> {
    List<StandardizedEvent> findByMatchId(Long matchId);
    List<StandardizedEvent> findByMatchIdAndEventType(Long matchId, String eventType);
}
