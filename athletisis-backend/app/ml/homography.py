import numpy as np
import cv2
from typing import List, Tuple, Dict, Any

class HomographyTransformer:
    """
    Computes and applies 3D Perspective Homography Transformations 
    mapping camera pixel coordinates (u, v) to normalized 2D field coordinates (x, y) in [0, 100].
    """

    SPORT_FIELD_DIMENSIONS = {
        "Football": {"length_m": 105.0, "width_m": 68.0},
        "Cricket": {"length_m": 22.0, "width_m": 3.05},
        "Volleyball": {"length_m": 18.0, "width_m": 9.0},
    }

    def __init__(self, sport: str = "Football"):
        self.sport = sport if sport in self.SPORT_FIELD_DIMENSIONS else "Football"
        self.dimensions = self.SPORT_FIELD_DIMENSIONS[self.sport]
        self.H_matrix = None
        self._init_default_homography()

    def _init_default_homography(self):
        """Initializes default 4-point camera perspective transformation matrix."""
        # Simulated default camera trapezoid keypoints [top-left, top-right, bottom-right, bottom-left]
        src_points = np.float32([
            [200, 150], [1080, 150],
            [1200, 680], [80, 680]
        ])
        
        # Target normalized 2D top-down field square [0,0] to [100,100]
        dst_points = np.float32([
            [0, 0],   [100, 0],
            [100, 100], [0, 100]
        ])
        
        self.H_matrix, _ = cv2.findHomography(src_points, dst_points)

    def calibrate(self, camera_keypoints: List[Tuple[float, float]], field_keypoints: List[Tuple[float, float]]):
        """Calibrates homography matrix from custom annotated keypoints."""
        if len(camera_keypoints) < 4 or len(field_keypoints) < 4:
            raise ValueError("Homography calibration requires at least 4 point correspondences.")
        
        src_pts = np.float32(camera_keypoints)
        dst_pts = np.float32(field_keypoints)
        self.H_matrix, _ = cv2.findHomography(src_pts, dst_pts)

    def transform_point(self, u: float, v: float) -> Tuple[float, float]:
        """Transforms a single camera pixel coordinate (u, v) into (x, y) normalized field coords [0, 100]."""
        if self.H_matrix is None:
            return (50.0, 50.0)
            
        pt = np.array([u, v, 1.0], dtype=np.float32)
        dst = np.dot(self.H_matrix, pt)
        
        if dst[2] == 0:
            return (50.0, 50.0)
            
        x_norm = float(dst[0] / dst[2])
        y_norm = float(dst[1] / dst[2])
        
        # Clamp values to valid field boundaries [0, 100]
        x_norm = max(0.0, min(100.0, x_norm))
        y_norm = max(0.0, min(100.0, y_norm))
        
        return (x_norm, y_norm)

    def transform_batch(self, points: List[Tuple[float, float]]) -> List[Tuple[float, float]]:
        """Batch transforms a list of camera pixel coordinates."""
        return [self.transform_point(u, v) for u, v in points]
