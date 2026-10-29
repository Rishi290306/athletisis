from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()

@router.get("/radar")
def get_radar_analytics(sport: Optional[str] = Query("Football")):
    """Returns 6-axis radar performance metrics for the selected sport."""
    if sport == "Football":
        categories = [
            {"subject": "Speed", "A": 92, "fullMark": 100},
            {"subject": "Passing", "A": 88, "fullMark": 100},
            {"subject": "Stamina", "A": 85, "fullMark": 100},
            {"subject": "Tackling", "A": 78, "fullMark": 100},
            {"subject": "Shooting", "A": 84, "fullMark": 100},
            {"subject": "Tactics", "A": 90, "fullMark": 100},
        ]
    elif sport == "Cricket":
        categories = [
            {"subject": "Batting Impact", "A": 94, "fullMark": 100},
            {"subject": "Shot Placement", "A": 91, "fullMark": 100},
            {"subject": "Running Between Wickets", "A": 88, "fullMark": 100},
            {"subject": "Bowling Economy", "A": 76, "fullMark": 100},
            {"subject": "Fielding Agility", "A": 85, "fullMark": 100},
            {"subject": "Match Awareness", "A": 92, "fullMark": 100},
        ]
    else:  # Volleyball
        categories = [
            {"subject": "Spike Power", "A": 95, "fullMark": 100},
            {"subject": "Block Reach", "A": 89, "fullMark": 100},
            {"subject": "Serve Accuracy", "A": 87, "fullMark": 100},
            {"subject": "Dig Reaction", "A": 82, "fullMark": 100},
            {"subject": "Vertical Jump", "A": 93, "fullMark": 100},
            {"subject": "Court Coverage", "A": 90, "fullMark": 100},
        ]

    return {
        "sport": sport,
        "radarData": categories,
        "overallIndex": 89.5
    }
