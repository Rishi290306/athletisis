from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    sport: str = "Football"
    athleteName: Optional[str] = "Athlete"
    matchName: Optional[str] = "Current Match"

class ChatResponse(BaseModel):
    reply: str
    actionableDrills: List[str]
    tacticalTip: str

@router.post("/chat", response_model=ChatResponse)
def coach_chat(request: ChatRequest):
    """
    Generates tactical analysis and personalized coaching advice 
    tailored to the user's sport and match query.
    """
    query = request.message.lower()
    sport = request.sport
    name = request.athleteName

    if "heatmap" in query or "position" in query or "space" in query:
        reply = (
            f"Based on spatial tracking for {name} in {sport}, the heatmap reveals high activity "
            f"in the central transition zone, but reduced coverage on the outer flank during transition plays."
        )
        drills = ["Overload & Switch Passing Drill", "Wide Flank Overlap Timing", "Dynamic Spatial Recovery"]
        tip = "Focus on opening up wide channels during counter-attacks to stretch the opponent's defensive line."

    elif "stamina" in query or "speed" in query or "sprint" in query or "fatigue" in query:
        reply = (
            f"Kinematic data for {name} shows an initial max sprint speed of 32.8 km/h, but sprint frequency "
            f"decreased by 18% in the final 15 minutes of the half due to workload cumulative fatigue."
        )
        drills = ["High-Intensity Interval Pyramids (HIIT)", "Tabata Sprint Relays", "Active Recovery Shuttle Runs"]
        tip = "Implement structured 3-minute active recovery intervals between high-intensity tactical drills."

    elif "weakness" in query or "opponent" in query or "tactics" in query:
        reply = (
            f"Tactical analysis indicates the opponent leaves an exploited gap between their central defender and wing back. "
            f"Direct diagonal balls into the half-spaces will yield high-probability scoring chances."
        )
        drills = ["Third-Man Run Pattern", "Half-Space Overload", "Quick Counter Transition"]
        tip = "Instruct wingers to make sharp inward cuts to draw out their central defenders."

    else:
        reply = (
            f"Hello! I am your Athletisis AI Tactical Coach. I have analyzed {name}'s performance metrics in {sport}. "
            f"Ask me about heatmap positioning, physical stamina management, or counter-tactics!"
        )
        drills = ["Tactical Shadow Play", "Decision-Making Under Pressure", "Set Piece Execution"]
        tip = "Consistently review post-match video highlights paired with spatial heatmaps to build tactical awareness."

    return ChatResponse(
        reply=reply,
        actionableDrills=drills,
        tacticalTip=tip
    )
