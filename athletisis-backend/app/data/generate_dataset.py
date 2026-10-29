"""
Sports Kinematics Benchmark Dataset Generator for Athletesis ML Pipeline.
Generates realistic multi-sport trajectory and biomechanical feature observations
grounded in physical motion dynamics for Football, Cricket, and Volleyball.
"""

import os
import math
import numpy as np
import pandas as pd

def generate_sports_dataset(n_samples: int = 2400, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)
    records = []
    
    sports = ["Football", "Cricket", "Volleyball"]
    # Class proportions reflecting realistic match play
    # Normal movement is most frequent, sprints & specialized actions occur intermittently
    class_types = [
        "Normal_Movement",
        "High_Intensity_Sprint",
        "Shot_Attack",
        "Cover_Drive",
        "Spike_Attack",
        "Defensive_Transition"
    ]
    
    for i in range(n_samples):
        sport = np.random.choice(sports, p=[0.45, 0.35, 0.20])
        
        # Determine likely action type based on sport
        if sport == "Football":
            action = np.random.choice(
                ["Normal_Movement", "High_Intensity_Sprint", "Shot_Attack", "Defensive_Transition"],
                p=[0.55, 0.20, 0.12, 0.13]
            )
        elif sport == "Cricket":
            action = np.random.choice(
                ["Normal_Movement", "High_Intensity_Sprint", "Cover_Drive", "Defensive_Transition"],
                p=[0.58, 0.18, 0.14, 0.10]
            )
        else: # Volleyball
            action = np.random.choice(
                ["Normal_Movement", "Spike_Attack", "Defensive_Transition"],
                p=[0.50, 0.30, 0.20]
            )
            
        # Physical kinematics parameters depending on action
        if action == "Normal_Movement":
            speed_kmh = float(np.clip(np.random.normal(9.5, 3.2), 0.5, 18.0))
            speed_in = float(np.clip(speed_kmh / 3.6 + np.random.normal(0, 0.4), 0.2, 5.0))
            speed_out = float(np.clip(speed_kmh / 3.6 + np.random.normal(0, 0.4), 0.2, 5.0))
            accel_mag = float(np.clip(abs(speed_out - speed_in) / 0.166 + np.random.exponential(0.4), 0.0, 3.5))
            jerk_mag = float(np.clip(np.random.normal(1.2, 0.8), 0.0, 4.0))
            heading_change = float(np.random.normal(0, 18.0))
            angular_velocity = float(abs(heading_change) / 0.33)
            
            x_pos = float(np.random.uniform(15.0, 85.0))
            y_pos = float(np.random.uniform(15.0, 85.0))
            impact_score = float(np.clip(np.random.normal(35.0, 8.0), 15.0, 55.0))
            
        elif action == "High_Intensity_Sprint":
            speed_kmh = float(np.clip(np.random.normal(26.5, 3.0), 22.1, 35.8))
            speed_in = float(np.clip(speed_kmh / 3.6 - np.random.uniform(1.5, 3.5), 2.0, 8.5))
            speed_out = float(np.clip(speed_kmh / 3.6 + np.random.normal(0.5, 0.5), 6.0, 10.0))
            accel_mag = float(np.clip(np.random.normal(4.8, 1.2), 2.8, 8.5))
            jerk_mag = float(np.clip(np.random.normal(3.8, 1.2), 1.0, 7.0))
            heading_change = float(np.random.normal(0, 10.0)) # linear trajectory
            angular_velocity = float(abs(heading_change) / 0.33)
            
            x_pos = float(np.random.uniform(20.0, 80.0))
            y_pos = float(np.random.uniform(20.0, 80.0))
            impact_score = float(np.clip(70.0 + (speed_kmh - 22.0) * 1.5 + np.random.normal(0, 3.0), 65.0, 95.0))
            
        elif action == "Shot_Attack":
            speed_kmh = float(np.clip(np.random.normal(21.0, 4.0), 12.0, 29.0))
            speed_in = float(np.clip(speed_kmh / 3.6 + np.random.uniform(0.5, 2.0), 3.5, 8.5))
            speed_out = float(np.clip(speed_in * 0.45 + np.random.normal(0, 0.3), 0.5, 3.5)) # deceleration after shot
            accel_mag = float(np.clip(np.random.normal(5.5, 1.5), 3.0, 9.0))
            jerk_mag = float(np.clip(np.random.normal(6.2, 1.8), 2.5, 10.0)) # sudden impact jerk
            heading_change = float(np.random.normal(25.0, 12.0))
            angular_velocity = float(abs(heading_change) / 0.33)
            
            # Attacking zone near goal
            x_pos = float(np.clip(np.random.normal(82.0, 7.0), 65.0, 98.0))
            y_pos = float(np.clip(np.random.normal(50.0, 12.0), 20.0, 80.0))
            impact_score = float(np.clip(84.0 + (speed_kmh / 30.0) * 10.0 + np.random.normal(0, 3.0), 75.0, 98.0))
            
        elif action == "Cover_Drive":
            speed_kmh = float(np.clip(np.random.normal(16.5, 3.5), 8.0, 24.0))
            speed_in = float(np.clip(speed_kmh / 3.6 - 1.0, 1.5, 6.0))
            speed_out = float(np.clip(speed_kmh / 3.6 + np.random.uniform(1.8, 3.8), 3.5, 9.0)) # exit burst
            accel_mag = float(np.clip(np.random.normal(4.2, 1.1), 2.2, 7.5))
            jerk_mag = float(np.clip(np.random.normal(5.0, 1.4), 1.8, 8.5))
            heading_change = float(np.clip(np.random.normal(42.0, 14.0), 15.0, 75.0)) # off-side angle
            angular_velocity = float(abs(heading_change) / 0.33)
            
            # Crease / off-stump area
            x_pos = float(np.clip(np.random.normal(52.0, 8.0), 35.0, 68.0))
            y_pos = float(np.clip(np.random.normal(48.0, 10.0), 30.0, 70.0))
            impact_score = float(np.clip(80.0 + speed_out * 2.0 + np.random.normal(0, 3.5), 70.0, 96.0))
            
        elif action == "Spike_Attack":
            speed_kmh = float(np.clip(np.random.normal(19.0, 3.8), 11.0, 27.0))
            speed_in = float(np.clip(speed_kmh / 3.6 + np.random.uniform(1.0, 2.5), 3.5, 8.0)) # run-up
            speed_out = float(np.clip(np.random.uniform(0.5, 2.0), 0.2, 2.5)) # airborne plant & strike
            accel_mag = float(np.clip(np.random.normal(6.2, 1.6), 3.5, 9.8))
            jerk_mag = float(np.clip(np.random.normal(7.1, 2.0), 3.0, 12.0)) # vertical jump plant jerk
            heading_change = float(np.random.normal(18.0, 10.0))
            angular_velocity = float(abs(heading_change) / 0.33)
            
            # Net attack line area
            x_pos = float(np.clip(np.random.normal(48.0, 18.0), 15.0, 85.0))
            y_pos = float(np.clip(np.random.normal(32.0, 7.0), 10.0, 45.0)) # close to net (y < 40)
            impact_score = float(np.clip(86.0 + accel_mag * 1.8 + np.random.normal(0, 3.0), 78.0, 99.0))
            
        else: # Defensive_Transition
            speed_kmh = float(np.clip(np.random.normal(17.5, 3.8), 9.0, 25.0))
            speed_in = float(np.clip(speed_kmh / 3.6 + np.random.uniform(1.0, 2.5), 3.0, 7.5))
            speed_out = float(np.clip(speed_in * 0.4 + np.random.normal(0, 0.4), 0.5, 3.5)) # rapid deceleration
            accel_mag = float(np.clip(np.random.normal(5.0, 1.4), 2.5, 8.5))
            jerk_mag = float(np.clip(np.random.normal(5.5, 1.6), 2.0, 9.5))
            heading_change = float(np.clip(abs(np.random.normal(75.0, 25.0)), 30.0, 160.0)) # sharp pivot
            angular_velocity = float(heading_change / 0.33)
            
            x_pos = float(np.random.uniform(20.0, 80.0))
            y_pos = float(np.random.uniform(20.0, 80.0))
            impact_score = float(np.clip(62.0 + (accel_mag + angular_velocity * 0.05) * 2.0 + np.random.normal(0, 4.0), 50.0, 85.0))

        # Rolling window features with realistic sensor/tracking noise
        rolling_mean_speed = float(np.clip(speed_kmh + np.random.normal(0, 1.2), 0.5, 36.0))
        rolling_std_speed = float(np.clip(abs(speed_out - speed_in) * 1.8 + np.random.exponential(0.6), 0.1, 8.0))
        rolling_max_speed = float(np.clip(max(speed_kmh, rolling_mean_speed + rolling_std_speed), 1.0, 36.5))
        
        disp_5frame = float(np.clip(speed_kmh * 0.166 * (1.05 / 3.6) * 5.0 + np.random.normal(0, 0.2), 0.05, 18.0))
        disp_10frame = float(np.clip(disp_5frame * 1.9 + np.random.normal(0, 0.4), 0.1, 35.0))
        
        # Spatial target distance (e.g. distance to attacking goal / target area [100, 50])
        pitch_zone_dist_goal = float(math.sqrt((100.0 - x_pos)**2 + (50.0 - y_pos)**2))
        
        # Add a small proportion of realistic edge noise/outliers to be cleaned by preprocessing
        if i % 120 == 0:
            speed_kmh = 48.5 # sensor tracking jitter spike (impossible human speed > 36)
        if i % 150 == 0:
            accel_mag = 18.2 # sensor jump spike (> 12 m/s²)
            
        record = {
            "sport": sport,
            "x_pos": round(x_pos, 2),
            "y_pos": round(y_pos, 2),
            "speed_kmh": round(speed_kmh, 2),
            "speed_in": round(speed_in, 2),
            "speed_out": round(speed_out, 2),
            "accel_mag": round(accel_mag, 2),
            "jerk_mag": round(jerk_mag, 2),
            "heading_change": round(heading_change, 2),
            "angular_velocity": round(angular_velocity, 2),
            "disp_5frame": round(disp_5frame, 2),
            "disp_10frame": round(disp_10frame, 2),
            "rolling_mean_speed": round(rolling_mean_speed, 2),
            "rolling_std_speed": round(rolling_std_speed, 2),
            "rolling_max_speed": round(rolling_max_speed, 2),
            "pitch_zone_dist_goal": round(pitch_zone_dist_goal, 2),
            "action_type": action,
            "impact_score": round(impact_score, 1)
        }
        records.append(record)
        
    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    out_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "sports_kinematics_dataset.csv")
    df = generate_sports_dataset(n_samples=2400, random_state=42)
    df.to_csv(out_file, index=False)
    print(f"Dataset generated with {len(df)} records at {out_file}")
    print("\nClass Distribution:")
    print(df["action_type"].value_counts())
    print("\nSport Distribution:")
    print(df["sport"].value_counts())
