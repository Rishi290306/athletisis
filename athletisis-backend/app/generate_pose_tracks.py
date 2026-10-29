"""
Precomputes real MediaPipe pose estimation tracks for all match videos in public/
and outputs calibrated JSON tracks for real-time frontend playback.
"""

import os
import json
import cv2
from app.ml.pose_engine import PoseEstimationEngine

def generate_tracks():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.abspath(os.path.join(base_dir, "..", "..", "athletisis-frontend", "public"))
    
    print("=" * 65)
    print("GENERATING REAL MEDIAPIPE POSE TRACKS FOR ATHLETESIS VIDEOS")
    print("=" * 65)
    print(f"Public Directory: {public_dir}")

    engine = PoseEstimationEngine(model_variant="full", min_confidence=0.30, max_persons=4)

    videos = [
        ("bumrah2.mp4", "bumrah2_poses.json", "Cricket"),
        ("sample-volleyball.mp4", "sample-volleyball_poses.json", "Volleyball"),
        ("sample-match2.mp4", "sample-match2_poses.json", "Cricket"),
        ("sample-match.mp4", "sample-match_poses.json", "Football"),
    ]

    for vid_filename, out_filename, sport in videos:
        vid_path = os.path.join(public_dir, vid_filename)
        out_path = os.path.join(public_dir, out_filename)

        if not os.path.exists(vid_path):
            print(f"[-] Video not found: {vid_path}; skipping.")
            continue

        print(f"\n[*] Processing '{vid_filename}' ({sport})...")
        # Sample at 15 fps for smooth, dense tracking
        result = engine.process_video(vid_path, sample_fps=15.0, max_duration_sec=20.0)
        
        timeline = result.get("timeline", [])
        total_detected = sum(1 for f in timeline if f.get("personsCount", 0) > 0)
        success_rate = (total_detected / len(timeline)) * 100 if timeline else 0

        print(f"  [+] Frames sampled: {len(timeline)}")
        print(f"  [+] Frames with detected poses: {total_detected} ({success_rate:.1f}%)")
        print(f"  [+] Video Resolution: {result['videoInfo']['width']}x{result['videoInfo']['height']} ({result['videoInfo']['aspectRatio']} AR)")

        with open(out_path, "w") as f:
            json.dump(result, f, indent=2)
        print(f"  [+] Saved calibrated pose track to: {out_filename} ({os.path.getsize(out_path) / 1024:.1f} KB)")

    print("\n" + "=" * 65)
    print("[OK] All video pose tracks generated successfully!")
    print("=" * 65)

if __name__ == "__main__":
    generate_tracks()
