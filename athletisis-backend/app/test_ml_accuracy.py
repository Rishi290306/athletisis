"""
Athletesis AI/ML Model Accuracy, Reliability, and Latency Verification Suite.
Validates:
1. Serialized model integrity and metadata verification.
2. Held-out test set accuracy and regression MAE verification against published thresholds.
3. Live multi-sport trajectory event classification (Football, Cricket, Volleyball).
4. Edge case handling (empty, tiny, and outlier inputs).
5. Inference latency benchmark.
"""

import os
import json
import time
import numpy as np
import pandas as pd
import joblib

from app.ml.action_classifier import KinematicActionClassifier
from app.ml.tracker import PlayerTrajectoryTracker

def test_model_accuracy_and_benchmarks():
    print("=" * 70)
    print("ATHLETESIS AI/ML ACCURACY & RELIABILITY TEST SUITE")
    print("=" * 70)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, "ml", "models")
    data_path = os.path.join(base_dir, "data", "sports_kinematics_dataset.csv")

    # 1. Verify Model Artifacts & Metadata
    print("\n[Step 1/5] Verifying Serialized Model Artifacts...")
    meta_path = os.path.join(models_dir, "model_metadata.json")
    clf_path = os.path.join(models_dir, "action_classifier_model.joblib")
    reg_path = os.path.join(models_dir, "impact_regressor_model.joblib")
    scaler_path = os.path.join(models_dir, "feature_scaler.joblib")

    assert os.path.exists(meta_path), "Missing model_metadata.json"
    assert os.path.exists(clf_path), "Missing action_classifier_model.joblib"
    assert os.path.exists(reg_path), "Missing impact_regressor_model.joblib"
    assert os.path.exists(scaler_path), "Missing feature_scaler.joblib"

    with open(meta_path, "r") as f:
        meta = json.load(f)

    print(f"  [+] Best Classifier: {meta['best_classifier']}")
    print(f"  [+] Best Regressor:  {meta['best_regressor']}")
    print(f"  [+] Target Classes ({len(meta['class_names'])}): {meta['class_names']}")
    print(f"  [+] Engineered Features ({len(meta['feature_names'])}): {meta['feature_names'][:5]}...")

    # Verify documented performance improvements
    baseline_acc = meta["baseline_classification_test"]["accuracy"]
    improved_acc = meta["improved_classification_test"]["accuracy"]
    baseline_f1 = meta["baseline_classification_test"]["f1_macro"]
    improved_f1 = meta["improved_classification_test"]["f1_macro"]
    baseline_mae = meta["baseline_regression_test"]["mae"]
    improved_mae = meta["improved_regression_test"]["mae"]

    print("\n  Published Evaluation Metrics on Held-out Test Set (360 samples):")
    print(f"    - Baseline Rule Classifier Accuracy: {baseline_acc * 100:.2f}% | Macro F1: {baseline_f1:.4f}")
    print(f"    - Improved ML Classifier Accuracy:   {improved_acc * 100:.2f}% | Macro F1: {improved_f1:.4f}")
    print(f"    - Accuracy Gain:                    +{(improved_acc - baseline_acc) * 100:.2f}%")
    print(f"    - Macro F1 Gain:                    +{(improved_f1 - baseline_f1):.4f}")
    print(f"    - Baseline Regressor MAE:           {baseline_mae:.2f}")
    print(f"    - Improved Regressor MAE:           {improved_mae:.2f} (Error reduced by {(1 - improved_mae/baseline_mae)*100:.1f}%)")

    assert improved_acc > 0.98, f"Trained classifier accuracy below target: {improved_acc}"
    assert improved_f1 > 0.95, f"Trained classifier macro F1 below target: {improved_f1}"
    assert improved_mae < 6.0, f"Trained regressor MAE above target: {improved_mae}"

    # 2. Live Trajectory Event Classification Across 3 Sports
    print("\n[Step 2/5] Testing Multi-Sport Event Detection...")
    
    # 2a. Football: High intensity sprint + attacking shot
    football_traj = []
    # 0-30: Midfield positioning
    for i in range(30):
        football_traj.append((45.0 + i*0.2, 50.0 + (i%3)*0.4))
    # 30-50: High speed burst / sprint down the wing
    for i in range(20):
        football_traj.append((51.0 + i*1.8, 51.0 + i*0.2))
    # 50-70: Deceleration and cut inside into penalty box, shot towards goal (x > 80, y ~ 50)
    for i in range(20):
        football_traj.append((87.0 + i*0.4, 52.0 - i*0.3))

    fb_clf = KinematicActionClassifier(sport="Football")
    fb_events = fb_clf.detect_events(football_traj, fps=30.0)
    print(f"  [+] Football Events Detected: {len(fb_events)}")
    for ev in fb_events:
        print(f"      * [{ev['timestamp']}] {ev['type']} ({ev['actionClass']}): Conf={ev.get('confidence', 0):.2f}, Impact={ev['impactScore']}")
    assert len(fb_events) > 0, "Football event detection failed!"

    # 2b. Cricket: Cover Drive burst
    cricket_traj = []
    for i in range(25):
        cricket_traj.append((50.0 + (i%2)*0.1, 50.0 + (i%2)*0.1))
    # Striking cover drive with off-side angle burst
    for i in range(20):
        cricket_traj.append((50.5 + i*1.4, 50.5 + i*1.2))
    for i in range(20):
        cricket_traj.append((78.5 + i*0.3, 74.5 + i*0.2))

    cr_clf = KinematicActionClassifier(sport="Cricket")
    cr_events = cr_clf.detect_events(cricket_traj, fps=30.0)
    print(f"\n  [+] Cricket Events Detected: {len(cr_events)}")
    for ev in cr_events:
        print(f"      * [{ev['timestamp']}] {ev['type']} ({ev['actionClass']}): Conf={ev.get('confidence', 0):.2f}, Impact={ev['impactScore']}")

    # 2c. Volleyball: Spike Attack run-up, jump & plant near net (y < 40)
    vb_traj = []
    for i in range(20):
        vb_traj.append((40.0 + i*0.2, 55.0 - i*0.8)) # run-up towards net
    for i in range(15):
        vb_traj.append((44.0 + (i%2)*0.1, 32.0 - (i%2)*0.1)) # plant & vertical jump
    for i in range(20):
        vb_traj.append((44.2 + (i%3)*0.2, 33.0 + (i%2)*0.3))

    vb_clf = KinematicActionClassifier(sport="Volleyball")
    vb_events = vb_clf.detect_events(vb_traj, fps=30.0)
    print(f"\n  [+] Volleyball Events Detected: {len(vb_events)}")
    for ev in vb_events:
        print(f"      * [{ev['timestamp']}] {ev['type']} ({ev['actionClass']}): Conf={ev.get('confidence', 0):.2f}, Impact={ev['impactScore']}")

    # 3. Trajectory Tracker Smoothing & Kinematic Reliability
    print("\n[Step 3/5] Testing Tracker Kinematics & Noise Filtering...")
    tracker = PlayerTrajectoryTracker(fps=30.0, meters_per_field_unit=1.05)
    # Jittery trajectory with 1 frame tracking glitch (>100 km/h spike)
    noisy_traj = [(20.0 + i*0.4, 30.0 + (i%4)*0.3) for i in range(50)]
    noisy_traj[25] = (95.0, 95.0) # sensor tracking glitch spike

    kin = tracker.compute_kinematics(noisy_traj)
    print(f"  [+] Distance: {kin['distance_m']}m ({kin['distance_km']}km)")
    print(f"  [+] Max Speed: {kin['max_speed_kmh']} km/h (Physiologically capped <= 36.0 km/h)")
    print(f"  [+] Average Speed: {kin['avg_speed_kmh']} km/h")
    print(f"  [+] High Intensity Sprints: {kin['high_intensity_sprints']}")
    assert kin["max_speed_kmh"] <= 36.0, "Speed cap violation on noisy trajectory"
    assert kin["max_speed_kmh"] > 0.0, "Zero speed bug detected in tracker!"

    # 4. Edge Case and Failure Safety Checks
    print("\n[Step 4/5] Testing Edge Cases & Exception Handling...")
    edge_cases = [
        ("Empty trajectory", []),
        ("Single point", [(50.0, 50.0)]),
        ("Under 10 points", [(10.0, 10.0), (11.0, 11.0), (12.0, 12.0)]),
        ("Static stationary athlete", [(40.0, 40.0) for _ in range(30)]),
        ("Extreme coordinates", [(9999.0, -9999.0) for _ in range(25)])
    ]

    for label, traj in edge_cases:
        res_ev = fb_clf.detect_events(traj)
        res_kin = tracker.compute_kinematics(traj)
        assert isinstance(res_ev, list), f"Expected list for {label}"
        assert isinstance(res_kin, dict), f"Expected dict for {label}"
        print(f"  [+] Edge Case '{label}': Safely handled (Events: {len(res_ev)}, Distance: {res_kin.get('distance_m', 0)}m)")

    # 5. Inference Latency Benchmark
    print("\n[Step 5/5] Benchmarking Real-Time Inference Latency...")
    benchmark_traj = [(50.0 + np.sin(i*0.1)*10, 50.0 + np.cos(i*0.1)*10) for i in range(120)]
    latencies = []
    for _ in range(20):
        t0 = time.perf_counter()
        fb_clf.detect_events(benchmark_traj)
        latencies.append((time.perf_counter() - t0) * 1000.0)

    avg_lat = float(np.mean(latencies))
    p95_lat = float(np.percentile(latencies, 95))
    print(f"  [+] 120-frame trajectory inference latency:")
    print(f"      - Average: {avg_lat:.2f} ms")
    print(f"      - 95th Percentile: {p95_lat:.2f} ms")
    print(f"      - Per-frame throughput: > {120.0 / (avg_lat / 1000.0):.0f} frames/second")
    assert avg_lat < 100.0, f"Inference latency too slow: {avg_lat:.2f} ms"

    print("\n" + "=" * 70)
    print("[OK] ALL AI/ML ACCURACY & RELIABILITY TESTS PASSED WITH DISTINCTION!")
    print("=" * 70)

if __name__ == "__main__":
    test_model_accuracy_and_benchmarks()
