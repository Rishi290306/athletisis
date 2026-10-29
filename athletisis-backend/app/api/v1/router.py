from fastapi import APIRouter
from app.api.v1.endpoints import matches, video, coach, analytics

api_router = APIRouter()

api_router.include_router(matches.router, prefix="/matches", tags=["Matches"])
api_router.include_router(video.router, prefix="/video", tags=["Video Pipeline"])
api_router.include_router(coach.router, prefix="/coach", tags=["AI Coach"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Performance Analytics"])
