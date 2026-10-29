package com.athletisis.match;

import com.athletisis.athlete.Athlete;
import com.athletisis.athlete.AthleteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final AthleteRepository athleteRepository;

    public MatchService(MatchRepository matchRepository, AthleteRepository athleteRepository) {
        this.matchRepository = matchRepository;
        this.athleteRepository = athleteRepository;
    }

    @Transactional
    public MatchDTOs.MatchResponse createMatch(MatchDTOs.CreateMatchRequest request) {
        Athlete athlete = athleteRepository.findById(request.getAthleteId())
                .orElseThrow(() -> new IllegalArgumentException("Athlete not found with ID: " + request.getAthleteId()));

        Match match = new Match(
                request.getMatchName(),
                request.getSport(),
                request.getMatchDate(),
                request.getTeamName(),
                request.getOpponentName(),
                request.getVenue(),
                request.getMatchType(),
                athlete,
                request.getNotes()
        );

        Match saved = matchRepository.save(match);
        return new MatchDTOs.MatchResponse(saved);
    }

    public MatchDTOs.MatchResponse getMatchById(Long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with ID: " + id));
        return new MatchDTOs.MatchResponse(match);
    }

    public List<MatchDTOs.MatchResponse> getMatchesByAthlete(Long athleteId) {
        return matchRepository.findByAthleteIdOrderByMatchDateDesc(athleteId).stream()
                .map(MatchDTOs.MatchResponse::new)
                .collect(Collectors.toList());
    }

    public List<MatchDTOs.MatchResponse> getAllMatches() {
        return matchRepository.findAll().stream()
                .map(MatchDTOs.MatchResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateMatchStatus(Long id, String status) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Match not found with ID: " + id));
        match.setStatus(status);
        matchRepository.save(match);
    }
}
