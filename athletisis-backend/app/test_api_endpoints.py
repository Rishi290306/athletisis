"""
Athletesis Backend API Endpoint Verification Suite.
Validates all FastAPI routes, responses, schemas, and ML integration.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_routes():
    print("=" * 60)
    print("ATHLETESIS BACKEND API INTEGRATION TEST SUITE")
    print("=" * 60)

    # 1. Health and Root
    print("\n[1] Testing Root & Health Check...")
    res_root = client.get("/")
    assert res_root.status_code == 200
    print(f"  [+] GET / -> {res_root.json()['service']} ({res_root.json()['status']})")

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"
    print(f"  [+] GET /health -> status: {res_health.json()['status']}, ML engine: {res_health.json()['ml_engine']}")

    # 2. List Matches
    print("\n[2] Testing List Matches...")
    res_matches = client.get("/api/v1/matches")
    assert res_matches.status_code == 200
    matches_data = res_matches.json()
    print(f"  [+] GET /api/v1/matches -> {matches_data['count']} matches found")
    assert matches_data['count'] >= 3

    # Filter by sport
    res_fb = client.get("/api/v1/matches?sport=Football")
    assert res_fb.status_code == 200
    assert res_fb.json()['count'] == 1
    print(f"  [+] GET /api/v1/matches?sport=Football -> 1 Football match filtered")

    # 3. Match Details with ML Action Classification & Kinematics
    print("\n[3] Testing Match Details with ML Inference...")
    for match_id, sport in [("101", "Football"), ("201", "Cricket"), ("301", "Volleyball")]:
        res_detail = client.get(f"/api/v1/matches/{match_id}")
        assert res_detail.status_code == 200
        detail = res_detail.json()
        print(f"  [+] GET /api/v1/matches/{match_id} ({sport}):")
        print(f"      - Athlete: {detail['match']['athleteName']}")
        print(f"      - Distance: {detail['kinematics']['distance_m']}m, Max Speed: {detail['kinematics']['max_speed_kmh']} km/h")
        print(f"      - Events Detected: {detail['eventCount']}")
        for ev in detail['events'][:2]:
            print(f"        * [{ev['timestamp']}] {ev['type']} (Impact: {ev['impactScore']}, Conf: {ev.get('confidence', 'N/A')})")
        assert detail['kinematics']['max_speed_kmh'] > 0
        assert detail['eventCount'] >= 1

    # 4. Heatmap Generation
    print("\n[4] Testing Heatmap Matrix Generation...")
    res_heatmap = client.get("/api/v1/matches/101/heatmap")
    assert res_heatmap.status_code == 200
    hm = res_heatmap.json()
    print(f"  [+] GET /api/v1/matches/101/heatmap -> Grid: {hm['gridResolution']}, Tabs: {list(hm['heatmaps'].keys())}")
    assert len(hm['heatmaps']['overall']) == 100

    # 5. Radar Analytics
    print("\n[5] Testing Radar Analytics...")
    for sp in ["Football", "Cricket", "Volleyball"]:
        res_radar = client.get(f"/api/v1/analytics/radar?sport={sp}")
        assert res_radar.status_code == 200
        radar_json = res_radar.json()
        print(f"  [+] GET /api/v1/analytics/radar?sport={sp} -> Overall Index: {radar_json['overallIndex']}, Categories: {len(radar_json['radarData'])}")

    # 6. Pose Estimation Endpoint
    print("\n[6] Testing Video Pose Tracking Endpoint...")
    for vid_id in ["bumrah2", "volleyball"]:
        res_pose = client.get(f"/api/v1/video/poses/{vid_id}")
        assert res_pose.status_code == 200
        pose_data = res_pose.json()
        print(f"  [+] GET /api/v1/video/poses/{vid_id} -> Resolution: {pose_data['videoInfo']['width']}x{pose_data['videoInfo']['height']}, Frames: {len(pose_data['timeline'])}, Connections: {len(pose_data['skeletonConnections'])}")
        assert len(pose_data['skeletonConnections']) == 16
        assert len(pose_data['timeline']) > 0

    print("\n" + "=" * 60)
    print("[OK] ALL FASTAPI ENDPOINTS & ML INTEGRATIONS VERIFIED!")
    print("=" * 60)

if __name__ == "__main__":
    test_api_routes()
