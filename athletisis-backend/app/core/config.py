import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Athletisis AI Backend Engine"
    API_V1_STR: str = "/api/v1"
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://rishi290306.github.io",
    ]
    
    # Model & Storage Config
    MODEL_CONFIDENCE_THRESHOLD: float = 0.45
    GRID_RESOLUTION_X: int = 100
    GRID_RESOLUTION_Y: int = 100
    
    class Config:
        case_sensitive = True

settings = Settings()
