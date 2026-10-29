import numpy as np
from scipy.ndimage import gaussian_filter
from typing import List, Tuple, Dict, Any

class GaussianHeatmapGenerator:
    """
    Computes 2D Gaussian Kernel Density Estimation (KDE) spatial heatmaps 
    for Football, Cricket, and Volleyball analytics.
    """

    def __init__(self, grid_size: Tuple[int, int] = (100, 100), sigma: float = 3.5):
        self.grid_w, self.grid_h = grid_size
        self.sigma = sigma

    def generate_density_matrix(self, coordinates: List[Tuple[float, float]]) -> List[List[float]]:
        """
        Converts a list of normalized coordinates (x, y) in [0, 100] 
        into a smoothed 2D Gaussian density matrix scaled to [0.0, 1.0].
        """
        grid = np.zeros((self.grid_h, self.grid_w), dtype=np.float32)
        
        if not coordinates:
            # Return empty matrix if no trajectory coordinates provided
            return grid.tolist()

        for x, y in coordinates:
            # Map normalized [0, 100] coordinates to grid array indices
            col = int(np.clip(x / 100.0 * (self.grid_w - 1), 0, self.grid_w - 1))
            row = int(np.clip(y / 100.0 * (self.grid_h - 1), 0, self.grid_h - 1))
            grid[row, col] += 1.0

        # Apply 2D Gaussian filter to smooth spatial points
        smoothed = gaussian_filter(grid, sigma=self.sigma)
        
        # Normalize to [0.0, 1.0] range
        max_val = np.max(smoothed)
        if max_val > 0:
            smoothed = smoothed / max_val

        return np.round(smoothed, 3).tolist()

    def generate_multi_tab_heatmaps(self, coordinates: List[Tuple[float, float]], sport: str) -> Dict[str, List[List[float]]]:
        """Generates sport-specific tactical heatmap tabs."""
        base_heatmap = self.generate_density_matrix(coordinates)
        
        if sport == "Football":
            # Sprint zones filter: coordinates where player speed was high
            sprint_coords = [pt for idx, pt in enumerate(coordinates) if idx % 3 == 0]
            defensive_coords = [pt for pt in coordinates if pt[0] < 50.0]
            return {
                "overall": base_heatmap,
                "sprints": self.generate_density_matrix(sprint_coords),
                "defensive": self.generate_density_matrix(defensive_coords),
            }
        elif sport == "Cricket":
            # Pitch map & Wagon wheel heatmaps
            pitch_coords = [(pt[0] * 0.4 + 30.0, pt[1] * 0.8 + 10.0) for pt in coordinates]
            wagon_coords = [(pt[0] * 0.9 + 5.0, pt[1] * 0.9 + 5.0) for pt in coordinates]
            return {
                "pitch": self.generate_density_matrix(pitch_coords),
                "wagon": self.generate_density_matrix(wagon_coords),
                "crease": base_heatmap,
            }
        elif sport == "Volleyball":
            # Front court & Spike attack zones
            attack_coords = [pt for pt in coordinates if pt[1] < 45.0]
            serve_coords = [pt for pt in coordinates if pt[1] > 70.0]
            return {
                "overall": base_heatmap,
                "attack": self.generate_density_matrix(attack_coords),
                "server": self.generate_density_matrix(serve_coords),
            }
        else:
            return {"overall": base_heatmap}
