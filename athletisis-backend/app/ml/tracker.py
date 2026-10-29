import math
import numpy as np
from typing import List, Tuple, Dict, Any

class PlayerTrajectoryTracker:
    """
    Tracks multi-object player spatial trajectories over time 
    and computes kinematic metrics (Distance, Max Speed, Avg Speed, High-Intensity Sprints).
    Features robust trajectory smoothing and physiological outlier winsorization.
    """

    def __init__(self, fps: float = 30.0, meters_per_field_unit: float = 1.05):
        self.fps = fps
        self.meters_per_unit = meters_per_field_unit  # 100 units = 105 meters for Football

    def smooth_trajectory(self, trajectory: List[Tuple[float, float]], window_size: int = 3) -> List[Tuple[float, float]]:
        """
        Applies a moving average filter across coordinates to remove sub-pixel tracking jitter.
        """
        if len(trajectory) < window_size:
            return trajectory

        smoothed = []
        half_w = window_size // 2
        n = len(trajectory)

        for i in range(n):
            start_idx = max(0, i - half_w)
            end_idx = min(n, i + half_w + 1)
            xs = [trajectory[j][0] for j in range(start_idx, end_idx)]
            ys = [trajectory[j][1] for j in range(start_idx, end_idx)]
            smoothed.append((float(np.mean(xs)), float(np.mean(ys))))

        return smoothed

    def compute_kinematics(self, trajectory: List[Tuple[float, float]]) -> Dict[str, Any]:
        """
        Computes physical metrics from a series of (x, y) coordinates over time.
        Uses smoothed coordinate deltas and physiological winsorization (capped at 36.0 km/h).
        """
        if len(trajectory) < 2:
            return {
                "distance_km": 0.0,
                "distance_m": 0.0,
                "max_speed_kmh": 0.0,
                "avg_speed_kmh": 0.0,
                "high_intensity_sprints": 0,
                "total_frames": len(trajectory),
            }

        # Apply spatial smoothing to mitigate sensor/detection jitter
        smoothed_coords = self.smooth_trajectory(trajectory, window_size=3)
        
        total_distance_m = 0.0
        speeds_kmh = []
        high_intensity_sprints = 0
        in_sprint = False

        time_delta_sec = 1.0 / self.fps

        for i in range(1, len(smoothed_coords)):
            dx = (smoothed_coords[i][0] - smoothed_coords[i-1][0]) * self.meters_per_unit
            dy = (smoothed_coords[i][1] - smoothed_coords[i-1][1]) * self.meters_per_unit
            
            dist_step_m = math.sqrt(dx * dx + dy * dy)
            total_distance_m += dist_step_m

            # Speed = distance / time (m/s) -> Convert to km/h (* 3.6)
            speed_m_s = dist_step_m / time_delta_sec
            raw_speed_kmh = speed_m_s * 3.6
            
            # Physiological winsorization: cap at realistic human maximum (36.0 km/h)
            # rather than dropping samples, which previously resulted in empty speed arrays
            speed_kmh = min(raw_speed_kmh, 36.0)
            speeds_kmh.append(speed_kmh)

            # High Intensity Sprint Threshold (> 22.0 km/h) with hysteresis
            if speed_kmh >= 22.0:
                if not in_sprint:
                    high_intensity_sprints += 1
                    in_sprint = True
            elif speed_kmh < 18.0:
                in_sprint = False

        max_speed = max(speeds_kmh) if speeds_kmh else 0.0
        avg_speed = float(np.mean(speeds_kmh)) if speeds_kmh else 0.0

        return {
            "distance_km": round(total_distance_m / 1000.0, 2),
            "distance_m": round(total_distance_m, 1),
            "max_speed_kmh": round(max_speed, 1),
            "avg_speed_kmh": round(avg_speed, 1),
            "high_intensity_sprints": high_intensity_sprints,
            "total_frames": len(trajectory),
        }
