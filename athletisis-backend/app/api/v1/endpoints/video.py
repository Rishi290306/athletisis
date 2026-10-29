from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Query
import uuid
import time
import os
import json
from typing import Dict, Any, Optional
import cv2
import numpy as np

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


@router.get("/poses/{video_id}")
def get_video_pose_track(video_id: str):
    """
    Returns precomputed MediaPipe 17-point pose track for the specified video.
    Supports 'bumrah2', 'volleyball', 'match2', and 'football'.
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.abspath(os.path.join(base_dir, "..", "..", "..", "..", "..", "athletisis-frontend", "public")),
        os.path.abspath(os.path.join(base_dir, "..", "..", "..", "..", "athletisis-frontend", "public")),
        os.path.abspath(os.path.join(base_dir, "..", "..", "data", "poses")),
    ]
    public_dir = None
    for cand in candidates:
        if os.path.exists(cand):
            public_dir = cand
            break

    if not public_dir:
        raise HTTPException(status_code=500, detail="Public directory not located")
    
    filename_map = {
        "bumrah2": "bumrah2_poses.json",
        "cricket": "bumrah2_poses.json",
        "101": "sample-match_poses.json",
        "football": "sample-match_poses.json",
        "201": "bumrah2_poses.json",
        "301": "sample-volleyball_poses.json",
        "volleyball": "sample-volleyball_poses.json",
    }
    
    target_filename = filename_map.get(video_id.lower(), f"{video_id}_poses.json")
    target_path = os.path.join(public_dir, target_filename)

    if not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail=f"Pose track not found for {video_id}")

    with open(target_path, "r") as f:
        data = json.load(f)

    return data


@router.post("/pose-estimate-frame")
async def estimate_frame_pose(file: UploadFile = File(...)):
    """
    Runs MediaPipe PoseLandmarker inference directly on an uploaded single image frame
    and returns detected anatomical keypoints, person bounding boxes, and confidence.
    """
    from app.ml.pose_engine import PoseEstimationEngine
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image frame encoding")

    engine = PoseEstimationEngine(model_variant="lite", min_confidence=0.3)
    persons = engine.extract_frame_poses(frame)

    return {
        "personsCount": len(persons),
        "persons": persons,
        "frameResolution": [frame.shape[1], frame.shape[0]]
    }
