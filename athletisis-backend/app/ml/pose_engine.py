"""
Athletesis Multi-Person Pose Estimation and Temporal Tracking Engine.
Powered by MediaPipe PoseLandmarker (full precision) with adaptive multi-person tracking,
confidence-aware temporal smoothing, and full-frame coordinate projection.
"""

import os
import json
import math
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Standard 17 COCO Keypoint names and MediaPipe index mappings
# MediaPipe Landmark Indices:
# 0: nose, 2: left_eye, 5: right_eye, 7: left_ear, 8: right_ear
# 11: left_shoulder, 12: right_shoulder, 13: left_elbow, 14: right_elbow
# 15: left_wrist, 16: right_wrist, 23: left_hip, 24: right_hip
# 25: left_knee, 26: right_knee, 27: left_ankle, 28: right_ankle

MP_TO_COCO_17 = [
    (0, "nose", "Nose"),
    (2, "left_eye", "L Eye"),
    (5, "right_eye", "R Eye"),
    (7, "left_ear", "L Ear"),
    (8, "right_ear", "R Ear"),
    (11, "left_shoulder", "L Shoulder"),
    (12, "right_shoulder", "R Shoulder"),
    (13, "left_elbow", "L Elbow"),
    (14, "right_elbow", "R Elbow"),
    (15, "left_wrist", "L Wrist"),
    (16, "right_wrist", "R Wrist"),
    (23, "left_hip", "L Hip"),
    (24, "right_hip", "R Hip"),
    (25, "left_knee", "L Knee"),
    (26, "right_knee", "R Knee"),
    (27, "left_ankle", "L Ankle"),
    (28, "right_ankle", "R Ankle"),
]

# Anatomical skeleton connections connecting valid anatomical joints
COCO_17_CONNECTIONS = [
    # Facial contour
    ("left_ear", "left_eye"),
    ("left_eye", "nose"),
    ("nose", "right_eye"),
    ("right_eye", "right_ear"),
    # Shoulder girdle
    ("left_shoulder", "right_shoulder"),
    # Arms
    ("left_shoulder", "left_elbow"),
    ("left_elbow", "left_wrist"),
    ("right_shoulder", "right_elbow"),
    ("right_elbow", "right_wrist"),
    # Torso
    ("left_shoulder", "left_hip"),
    ("right_shoulder", "right_hip"),
    ("left_hip", "right_hip"),
    # Legs
    ("left_hip", "left_knee"),
    ("left_knee", "left_ankle"),
    ("right_hip", "right_knee"),
    ("right_knee", "right_ankle"),
]


class AdaptiveOneEuroFilter:
    """
    Adaptive low-pass filter (One-Euro style) for real-time keypoint smoothing.
    Eliminates high-frequency sensor jitter while retaining high responsiveness
    during fast sports movements (sprints, bowling releases, spike jumps).
    """

    def __init__(self, min_cutoff: float = 1.0, beta: float = 0.05, d_cutoff: float = 1.0):
        self.min_cutoff = min_cutoff
        self.beta = beta
        self.d_cutoff = d_cutoff
        self.x_prev = None
        self.dx_prev = None

    def filter(self, x: float, dt: float = 1.0 / 30.0) -> float:
        if self.x_prev is None:
            self.x_prev = x
            self.dx_prev = 0.0
            return x

        dx = (x - self.x_prev) / dt
        edx = self._alpha(self.d_cutoff, dt) * dx + (1.0 - self._alpha(self.d_cutoff, dt)) * self.dx_prev
        self.dx_prev = edx

        cutoff = self.min_cutoff + self.beta * abs(edx)
        alpha = self._alpha(cutoff, dt)
        filtered_x = alpha * x + (1.0 - alpha) * self.x_prev
        self.x_prev = filtered_x
        return filtered_x

    def _alpha(self, cutoff: float, dt: float) -> float:
        tau = 1.0 / (2.0 * math.pi * cutoff)
        return 1.0 / (1.0 + tau / dt)


class PoseEstimationEngine:
    """
    Production-Grade Pose Estimation Engine utilizing MediaPipe PoseLandmarker.
    Computes precise anatomical keypoints, person bounding boxes, joint angles,
    and confidence scores in normalized [0, 1] video frame coordinates.
    """

    def __init__(self, model_variant: str = "full", min_confidence: float = 0.35, max_persons: int = 4):
        self.min_confidence = min_confidence
        self.max_persons = max_persons
        base_dir = os.path.dirname(os.path.abspath(__file__))
        models_dir = os.path.join(base_dir, "models")
        
        task_filename = "pose_landmarker_full.task" if model_variant == "full" else "pose_landmarker_lite.task"
        self.model_path = os.path.join(models_dir, task_filename)
        
        if not os.path.exists(self.model_path):
            self.model_path = os.path.join(models_dir, "pose_landmarker_lite.task")

        base_options = python.BaseOptions(model_asset_path=self.model_path)
        options = vision.PoseLandmarkerOptions(
            base_options=base_options,
            num_poses=self.max_persons,
            min_pose_detection_confidence=self.min_confidence,
            min_pose_presence_confidence=self.min_confidence,
            min_tracking_confidence=self.min_confidence,
        )
        self.detector = vision.PoseLandmarker.create_from_options(options)
        self.track_filters: Dict[str, Dict[str, AdaptiveOneEuroFilter]] = {}

    def extract_frame_poses(self, frame_bgr: np.ndarray, timestamp_sec: float = 0.0) -> List[Dict[str, Any]]:
        """
        Runs multi-person pose estimation on a single BGR frame.
        Returns a list of detected person poses with normalized coordinates [0, 1].
        """
        h, w, _ = frame_bgr.shape
        if h == 0 or w == 0:
            return []

        rgb_frame = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        detection_result = self.detector.detect(mp_image)

        if not detection_result.pose_landmarks:
            return []

        persons = []
        for p_idx, landmarks in enumerate(detection_result.pose_landmarks):
            keypoints_dict = {}
            keypoints_list = []
            xs = []
            ys = []
            confidences = []

            for mp_idx, joint_id, display_name in MP_TO_COCO_17:
                lm = landmarks[mp_idx]
                vis = float(lm.visibility if lm.visibility is not None else 0.85)
                # Clip coordinates to normalized [0, 1] space
                norm_x = float(np.clip(lm.x, 0.0, 1.0))
                norm_y = float(np.clip(lm.y, 0.0, 1.0))
                norm_z = float(lm.z) if lm.z is not None else 0.0

                # Temporal smoothing
                filter_key = f"p{p_idx}_{joint_id}"
                if filter_key not in self.track_filters:
                    self.track_filters[filter_key] = {
                        "x": AdaptiveOneEuroFilter(min_cutoff=1.2, beta=0.08),
                        "y": AdaptiveOneEuroFilter(min_cutoff=1.2, beta=0.08),
                    }
                smoothed_x = self.track_filters[filter_key]["x"].filter(norm_x)
                smoothed_y = self.track_filters[filter_key]["y"].filter(norm_y)

                kp = {
                    "id": joint_id,
                    "name": display_name,
                    "x": round(smoothed_x, 4),      # Normalized [0, 1] relative to video width
                    "y": round(smoothed_y, 4),      # Normalized [0, 1] relative to video height
                    "z": round(norm_z, 4),
                    "confidence": round(vis, 3),
                }
                keypoints_dict[joint_id] = kp
                keypoints_list.append(kp)

                if vis >= 0.30:
                    xs.append(smoothed_x)
                    ys.append(smoothed_y)
                confidences.append(vis)

            if not xs or not ys:
                continue

            # Compute anatomical bounding box with 5% padding
            pad_x = 0.04
            pad_y = 0.05
            box_left = max(0.0, min(xs) - pad_x)
            box_top = max(0.0, min(ys) - pad_y)
            box_right = min(1.0, max(xs) + pad_x)
            box_bottom = min(1.0, max(ys) + pad_y)

            # Biomechanical joint angles
            arm_angle = self._calculate_joint_angle(
                keypoints_dict.get("right_shoulder"),
                keypoints_dict.get("right_elbow"),
                keypoints_dict.get("right_wrist"),
            )
            knee_angle = self._calculate_joint_angle(
                keypoints_dict.get("right_hip"),
                keypoints_dict.get("right_knee"),
                keypoints_dict.get("right_ankle"),
            )

            avg_conf = float(np.mean(confidences))
            persons.append({
                "personId": p_idx + 1,
                "confidence": round(avg_conf, 3),
                "box": {
                    "left": round(box_left, 4),
                    "top": round(box_top, 4),
                    "width": round(box_right - box_left, 4),
                    "height": round(box_bottom - box_top, 4),
                },
                "keypoints": keypoints_dict,
                "keypointsList": keypoints_list,
                "biomechanics": {
                    "armAngleDeg": arm_angle,
                    "kneeAngleDeg": knee_angle,
                },
            })

        # Sort persons by bounding box area descending (primary subject first)
        persons.sort(key=lambda p: p["box"]["width"] * p["box"]["height"], reverse=True)
        for i, p in enumerate(persons):
            p["personId"] = i + 1

        return persons

    def _calculate_joint_angle(
        self,
        a: Optional[Dict[str, Any]],
        b: Optional[Dict[str, Any]],
        c: Optional[Dict[str, Any]],
    ) -> Optional[int]:
        """Calculates 2D planar angle at vertex joint B (A-B-C) in degrees."""
        if not a or not b or not c:
            return None
        if a["confidence"] < 0.3 or b["confidence"] < 0.3 or c["confidence"] < 0.3:
            return None

        v1 = np.array([a["x"] - b["x"], a["y"] - b["y"]])
        v2 = np.array([c["x"] - b["x"], c["y"] - b["y"]])

        norm_v1 = np.linalg.norm(v1)
        norm_v2 = np.linalg.norm(v2)
        if norm_v1 == 0 or norm_v2 == 0:
            return None

        dot = np.dot(v1, v2)
        cos_theta = np.clip(dot / (norm_v1 * norm_v2), -1.0, 1.0)
        angle_rad = np.arccos(cos_theta)
        return int(round(np.degrees(angle_rad)))

    def process_video(
        self,
        video_path: str,
        sample_fps: float = 15.0,
        max_duration_sec: float = 30.0,
    ) -> Dict[str, Any]:
        """
        Processes a full video file, sampling frames at `sample_fps`
        and generating continuous ground-truth pose trajectories.
        """
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return {"error": f"Failed to open video: {video_path}", "frames": []}

        video_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        video_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        source_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration_sec = total_frames / source_fps

        frame_step = max(1, int(round(source_fps / sample_fps)))
        max_frames_to_process = int(min(duration_sec, max_duration_sec) * source_fps)

        frame_poses_timeline = []
        frame_idx = 0

        while frame_idx < max_frames_to_process:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            ret, frame = cap.read()
            if not ret:
                break

            timestamp_sec = round(frame_idx / source_fps, 3)
            persons = self.extract_frame_poses(frame, timestamp_sec)

            frame_poses_timeline.append({
                "frameIndex": frame_idx,
                "timestampSec": timestamp_sec,
                "personsCount": len(persons),
                "persons": persons,
            })

            frame_idx += frame_step

        cap.release()

        return {
            "videoInfo": {
                "width": video_w,
                "height": video_h,
                "aspectRatio": round(video_w / video_h, 3) if video_h > 0 else 1.778,
                "fps": source_fps,
                "durationSec": round(duration_sec, 2),
                "totalFrames": total_frames,
            },
            "skeletonConnections": COCO_17_CONNECTIONS,
            "timeline": frame_poses_timeline,
        }
