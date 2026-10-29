package com.athletisis.athlete;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AthleteService {

    private final AthleteRepository athleteRepository;

    public AthleteService(AthleteRepository athleteRepository) {
        this.athleteRepository = athleteRepository;
    }

    public AthleteDTOs.AthleteResponse getAthleteById(Long id) {
        Athlete athlete = athleteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Athlete not found with ID: " + id));
        return new AthleteDTOs.AthleteResponse(athlete);
    }

    public AthleteDTOs.AthleteResponse getAthleteByUserId(Long userId) {
        Athlete athlete = athleteRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Athlete not found for User ID: " + userId));
        return new AthleteDTOs.AthleteResponse(athlete);
    }

    public List<AthleteDTOs.AthleteResponse> getAllAthletes() {
        return athleteRepository.findAll().stream()
                .map(AthleteDTOs.AthleteResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public AthleteDTOs.AthleteResponse updateAthlete(Long id, AthleteDTOs.UpdateAthleteRequest request) {
        Athlete athlete = athleteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Athlete not found with ID: " + id));

        if (request.getName() != null) athlete.setName(request.getName());
        if (request.getAge() != null) athlete.setAge(request.getAge());
        if (request.getSport() != null) athlete.setSport(request.getSport());
        if (request.getPosition() != null) athlete.setPosition(request.getPosition());
        if (request.getTeamName() != null) athlete.setTeamName(request.getTeamName());
        if (request.getPreferredRole() != null) athlete.setPreferredRole(request.getPreferredRole());
        if (request.getExperienceLevel() != null) athlete.setExperienceLevel(request.getExperienceLevel());
        if (request.getProfilePhotoUrl() != null) athlete.setProfilePhotoUrl(request.getProfilePhotoUrl());

        Athlete updated = athleteRepository.save(athlete);
        return new AthleteDTOs.AthleteResponse(updated);
    }

    @Transactional
    public void updateAthleteDNA(Long athleteId, AthleteDNA newDNA) {
        Athlete athlete = athleteRepository.findById(athleteId)
                .orElseThrow(() -> new IllegalArgumentException("Athlete not found with ID: " + athleteId));

        int count = athlete.getMatchesAnalyzedCount() + 1;
        AthleteDNA currentDNA = athlete.getDna();

        // Moving average update for Athlete DNA as matches are analyzed
        double weightPrev = (count - 1.0) / count;
        double weightNew = 1.0 / count;

        double tech = currentDNA.getTechnicalScore() * weightPrev + newDNA.getTechnicalScore() * weightNew;
        double tact = currentDNA.getTacticalScore() * weightPrev + newDNA.getTacticalScore() * weightNew;
        double phys = currentDNA.getPhysicalScore() * weightPrev + newDNA.getPhysicalScore() * weightNew;
        double dec = currentDNA.getDecisionMakingScore() * weightPrev + newDNA.getDecisionMakingScore() * weightNew;
        double cons = currentDNA.getConsistencyScore() * weightPrev + newDNA.getConsistencyScore() * weightNew;
        double overall = (tech + tact + phys + dec + cons) / 5.0;

        AthleteDNA updatedDNA = new AthleteDNA(tech, tact, phys, dec, cons, overall);
        athlete.setDna(updatedDNA);
        athlete.setMatchesAnalyzedCount(count);

        athleteRepository.save(athlete);
    }
}
