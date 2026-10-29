import sys
import os

from app.ml.homography import HomographyTransformer
from app.ml.heatmap_generator import GaussianHeatmapGenerator
from app.ml.tracker import PlayerTrajectoryTracker
from app.ml.action_classifier import KinematicActionClassifier
from app.ml.detector import ObjectDetector

def run_tests():
    print("==================================================")
    print("[*] Running Athletisis AI ML Engine Verification Suite")
    print("==================================================")

    # 1. Test Homography 2D Mapping
    print("\n[1/5] Testing 3D-to-2D Perspective Homography Transformer...")
    transformer = HomographyTransformer(sport="Football")
    test_u, test_v = 400.0, 300.0
    norm_x, norm_y = transformer.transform_point(test_u, test_v)
    print(f"  [+] Camera Pixel ({test_u}, {test_v}) -> Normalized Field Coordinate ({norm_x:.2f}, {norm_y:.2f})")
    assert 0.0 <= norm_x <= 100.0 and 0.0 <= norm_y <= 100.0, "Homography out of bounds!"

    # 2. Test Player Trajectory Kinematics
    print("\n[2/5] Testing Trajectory Kinematics & Velocity Calculation...")
    trajectory = [(10.0 + i*0.5, 20.0 + (i%5)*1.2) for i in range(60)]
    tracker = PlayerTrajectoryTracker(fps=30.0, meters_per_field_unit=1.05)
    kinematics = tracker.compute_kinematics(trajectory)
    print(f"  [+] Distance: {kinematics['distance_m']}m ({kinematics['distance_km']}km)")
    print(f"  [+] Max Speed: {kinematics['max_speed_kmh']} km/h")
    print(f"  [+] High Intensity Sprints Detected: {kinematics['high_intensity_sprints']}")
    assert kinematics["distance_m"] > 0, "Distance calculation failed!"

    # 3. Test 2D Gaussian Kernel Density Estimation (KDE) Heatmaps
    print("\n[3/5] Testing 2D Gaussian KDE Heatmap Generator...")
    heatmap_gen = GaussianHeatmapGenerator(grid_size=(100, 100), sigma=3.5)
    tabs = heatmap_gen.generate_multi_tab_heatmaps(trajectory, sport="Football")
    print(f"  [+] Heatmap Tabs Generated: {list(tabs.keys())}")
    print(f"  [+] Density Matrix Shape: {len(tabs['overall'])}x{len(tabs['overall'][0])}")
    assert len(tabs["overall"]) == 100 and len(tabs["overall"][0]) == 100, "Heatmap grid resolution mismatch!"

    # 4. Test Kinematic Action Classifier
    print("\n[4/5] Testing Kinematic Action Classifier...")
    classifier = KinematicActionClassifier(sport="Football")
    event_trajectory = [(30.0 + i*0.4, 40.0) for i in range(25)] + [(40.0 + i*2.2, 40.0 + i*0.5) for i in range(20)] + [(84.0 + i*0.3, 50.0 - i*0.2) for i in range(20)]
    events = classifier.detect_events(event_trajectory)
    print(f"  [+] Key Moments Detected: {len(events)}")
    for evt in events[:2]:
        print(f"     * [{evt['timestamp']}] {evt['type']} ({evt.get('actionClass', 'N/A')}): {evt['description']} (Impact: {evt['impactScore']}, Conf: {evt.get('confidence', 0):.2f})")
    assert len(events) > 0, "Expected at least 1 tactical event to be classified"

    # 5. Test Synthetic Object Detector
    print("\n[5/5] Testing Object Detector Frame Parsing...")
    import numpy as np
    dummy_frame = np.zeros((720, 1280, 3), dtype=np.uint8)
    detector = ObjectDetector()
    detections = detector.detect_frame(dummy_frame)
    print(f"  [+] Detected Players: {len(detections['players'])}")
    print(f"  [+] Ball Position: {detections['ball']['field_coord']}")

    print("\n==================================================")
    print("[OK] All ML Engine Core Tests PASSED Cleanly!")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
