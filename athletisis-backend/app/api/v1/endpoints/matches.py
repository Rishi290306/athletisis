from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
import numpy as np

from app.ml.homography import HomographyTransformer
from app.ml.heatmap_generator import GaussianHeatmapGenerator
from app.ml.tracker import PlayerTrajectoryTracker
from app.ml.action_classifier import KinematicActionClassifier

router = APIRouter()

# Mock Match Database
MATCHES_DB = {
    "101": {
        "id": "101",
        "matchName": "FC Barcelona vs Real Madrid - El Clasico 2026",
        "sport": "Football",
        "date": "2026-09-08",
        "athleteName": "Pedri Gonzalez",
        "opponent": "Real Madrid CF",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "status": "COMPLETED",
        "stats": {
            "distanceKm": 11.4,
            "maxSpeedKmh": 32.8,
            "highIntensitySprints": 28,
            "passAccuracy": 89.4,
            "staminaRating": 88
        }
    },
    "201": {
        "id": "201",
        "matchName": "India vs Australia - T20 World Cup Final 2026",
        "sport": "Cricket",
        "date": "2026-09-05",
        "athleteName": "Virat Kohli",
        "opponent": "Australia",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        "status": "COMPLETED",
        "stats": {
            "runs": 82,
            "strikeRate": 154.7,
            "boundaries": 9,
            "staminaRating": 94
        }
    },
    "301": {
        "id": "301",
        "matchName": "Poland vs Italy - FIVB Volleyball Nations League",
        "sport": "Volleyball",
        "date": "2026-09-02",
        "athleteName": "Wilfredo Leon",
        "opponent": "Italy",
        "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        "status": "COMPLETED",
        "stats": {
            "spikes": 18,
            "blocks": 5,
            "serveAces": 3,
            "staminaRating": 91
        }
    }
}

def _generate_synthetic_trajectory(sport: str, count: int = 150) -> List[tuple]:
    """Generates realistic continuous spatial trajectories based on sport tactical movements."""
    coords = []
    np.random.seed(42)
    
    if sport == "Football":
        # Phase 1: Midfield tactical positioning
        curr_x, curr_y = 48.0, 52.0
        coords.append((curr_x, curr_y))
        for _ in range(40):
            curr_x = float(np.clip(curr_x + np.random.normal(0.2, 0.3), 5.0, 95.0))
            curr_y = float(np.clip(curr_y + np.random.normal(-0.1, 0.4), 10.0, 90.0))
            coords.append((curr_x, curr_y))
        # Phase 2: High intensity sprint down the wing
        for _ in range(25):
            curr_x = float(np.clip(curr_x + np.random.normal(1.6, 0.2), 5.0, 95.0))
            curr_y = float(np.clip(curr_y + np.random.normal(0.3, 0.2), 10.0, 90.0))
            coords.append((curr_x, curr_y))
        # Phase 3: Cut into penalty box and take shot (x > 80, y ~ 50)
        curr_x, curr_y = 84.0, 48.0
        coords.append((curr_x, curr_y))
        for _ in range(25):
            curr_x = float(np.clip(curr_x + np.random.normal(0.3, 0.15), 5.0, 95.0))
            curr_y = float(np.clip(curr_y + np.random.normal(0.1, 0.15), 10.0, 90.0))
            coords.append((curr_x, curr_y))
        # Phase 4: Defensive transition recovery run
        for _ in range(40):
            curr_x = float(np.clip(curr_x - np.random.normal(0.8, 0.3), 5.0, 95.0))
            curr_y = float(np.clip(curr_y + np.random.normal(-0.2, 0.3), 10.0, 90.0))
            coords.append((curr_x, curr_y))

    elif sport == "Cricket":
        # Phase 1: Crease batting stance
        curr_x, curr_y = 52.0, 48.0
        coords.append((curr_x, curr_y))
        for _ in range(35):
            curr_x = float(np.clip(curr_x + np.random.normal(0.0, 0.1), 30.0, 70.0))
            curr_y = float(np.clip(curr_y + np.random.normal(0.0, 0.1), 30.0, 70.0))
            coords.append((curr_x, curr_y))
        # Phase 2: Cover drive off-side stroke & exit burst
        for _ in range(25):
            curr_x = float(np.clip(curr_x + np.random.normal(1.2, 0.2), 10.0, 90.0))
            curr_y = float(np.clip(curr_y + np.random.normal(1.0, 0.2), 10.0, 90.0))
            coords.append((curr_x, curr_y))
        # Phase 3: Running between wickets sprint
        for _ in range(40):
            curr_x = float(np.clip(curr_x + np.random.normal(0.8, 0.2), 10.0, 90.0))
            curr_y = float(np.clip(curr_y + np.random.normal(-0.6, 0.2), 10.0, 90.0))
            coords.append((curr_x, curr_y))
        # Phase 4: Post-delivery resetting
        for _ in range(30):
            curr_x = float(np.clip(curr_x + np.random.normal(-0.2, 0.15), 10.0, 90.0))
            curr_y = float(np.clip(curr_y + np.random.normal(0.1, 0.15), 10.0, 90.0))
            coords.append((curr_x, curr_y))

    else:  # Volleyball
        # Phase 1: Backcourt receive & set preparation
        curr_x, curr_y = 48.0, 65.0
        coords.append((curr_x, curr_y))
        for _ in range(35):
            curr_x = float(np.clip(curr_x + np.random.normal(0.0, 0.2), 10.0, 90.0))
            curr_y = float(np.clip(curr_y + np.random.normal(-0.3, 0.2), 10.0, 90.0))
            coords.append((curr_x, curr_y))
        # Phase 2: Run-up approach towards net (y < 40)
        for _ in range(20):
            curr_x = float(np.clip(curr_x + np.random.normal(0.2, 0.2), 10.0, 90.0))
            curr_y = float(np.clip(curr_y - np.random.normal(1.2, 0.2), 5.0, 90.0))
            coords.append((curr_x, curr_y))
        # Phase 3: Vertical plant & spike attack at the net
        for _ in range(25):
            curr_x = float(np.clip(curr_x + np.random.normal(0.05, 0.1), 10.0, 90.0))
            curr_y = float(np.clip(curr_y + np.random.normal(0.05, 0.1), 5.0, 90.0))
            coords.append((curr_x, curr_y))
        # Phase 4: Landing & defensive transition block coverage
        for _ in range(40):
            curr_x = float(np.clip(curr_x + np.random.normal(-0.4, 0.2), 10.0, 90.0))
            curr_y = float(np.clip(curr_y + np.random.normal(0.6, 0.2), 10.0, 90.0))
            coords.append((curr_x, curr_y))

    return coords[:count]


@router.get("")
def list_matches(sport: Optional[str] = Query(None, description="Filter matches by sport")):
    """Retrieves list of matches with optional sport filtering."""
    results = list(MATCHES_DB.values())
    if sport:
        results = [m for m in results if m["sport"].lower() == sport.lower()]
    return {"matches": results, "count": len(results)}


@router.get("/{match_id}")
def get_match_detail(match_id: str):
    """Retrieves detailed match metadata and telemetry summary."""
    if match_id not in MATCHES_DB:
        raise HTTPException(status_code=404, detail="Match not found")
    
    match_data = MATCHES_DB[match_id]
    sport = match_data["sport"]
    
    # Run ML Trajectory Kinematics & Event Classification
    trajectory = _generate_synthetic_trajectory(sport)
    tracker = PlayerTrajectoryTracker(meters_per_field_unit=1.05)
    kinematics = tracker.compute_kinematics(trajectory)
    
    classifier = KinematicActionClassifier(sport=sport)
    events = classifier.detect_events(trajectory)

    return {
        "match": match_data,
        "kinematics": kinematics,
        "events": events,
        "eventCount": len(events)
    }


@router.get("/{match_id}/heatmap")
def get_match_heatmap(match_id: str):
    """
    Computes 2D Gaussian Kernel Density Estimation (KDE) 
    spatial heatmap matrices for the specified match.
    """
    if match_id not in MATCHES_DB:
        raise HTTPException(status_code=404, detail="Match not found")

    sport = MATCHES_DB[match_id]["sport"]
    trajectory = _generate_synthetic_trajectory(sport)
    
    generator = GaussianHeatmapGenerator(grid_size=(100, 100), sigma=3.5)
    tab_heatmaps = generator.generate_multi_tab_heatmaps(trajectory, sport=sport)

    return {
        "matchId": match_id,
        "sport": sport,
        "heatmaps": tab_heatmaps,
        "gridResolution": [100, 100]
    }
