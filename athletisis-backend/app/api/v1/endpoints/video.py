from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
import uuid
import time
from typing import Dict, Any

router = APIRouter()

# In-memory Job Tracker
JOBS_DB: Dict[str, Dict[str, Any]] = {}

def _run_cv_processing_job(job_id: str, filename: str, sport: str):
    """Simulates background Computer Vision pipeline processing."""
    JOBS_DB[job_id]["status"] = "EXTRACTING_FRAMES"
    time.sleep(1)
    
    JOBS_DB[job_id]["status"] = "YOLO_TRACKING"
    JOBS_DB[job_id]["progress"] = 35
    time.sleep(1)
    
    JOBS_DB[job_id]["status"] = "HOMOGRAPHY_MAPPING"
    JOBS_DB[job_id]["progress"] = 70
    time.sleep(1)
    
    JOBS_DB[job_id]["status"] = "COMPLETED"
    JOBS_DB[job_id]["progress"] = 100
    JOBS_DB[job_id]["matchId"] = "101" if sport == "Football" else "201" if sport == "Cricket" else "301"


@router.post("/upload")
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    sport: str = Form("Football"),
    matchName: str = Form("New Match Analysis")
):
    """Uploads a match recording and triggers background CV processing."""
    if not file.filename.endswith((".mp4", ".mov", ".avi", ".mkv")):
        raise HTTPException(status_code=400, detail="Invalid video format. Supported: .mp4, .mov, .avi, .mkv")

    job_id = str(uuid.uuid4())[:8]
    
    JOBS_DB[job_id] = {
        "jobId": job_id,
        "filename": file.filename,
        "sport": sport,
        "matchName": matchName,
        "status": "PENDING",
        "progress": 0,
        "createdAt": time.time()
    }

    # Queue background task
    background_tasks.add_task(_run_cv_processing_job, job_id, file.filename, sport)

    return {
        "message": "Video uploaded successfully. ML pipeline processing initiated.",
        "jobId": job_id,
        "status": "PENDING",
        "sport": sport
    }


@router.get("/status/{job_id}")
def get_job_status(job_id: str):
    """Checks the progress of an active computer vision analysis job."""
    if job_id not in JOBS_DB:
        raise HTTPException(status_code=404, detail="Processing job not found")
        
    return JOBS_DB[job_id]
