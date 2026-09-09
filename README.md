# ⚡ Athletisis AI — Full-Stack AI Sports Analytics & Computer Vision Engine

> **Last Updated & Pushed**: `2026-09-09`  
> **Repository**: [https://github.com/Rishi290306/athletisis](https://github.com/Rishi290306/athletisis)

Athletisis AI is a modern full-stack sports analytics application engineered for **Football**, **Cricket**, and **Volleyball**. It delivers frame-by-frame 17-point COCO pose estimation, dynamic joint telemetry, multimodal sport auto-calibration, position-specific biomechanical calculations, and conversational sports science coaching.

---

## 🌟 Key Features

### 🎥 1. Computer Vision (CV) Keypoint Telemetry
* **17-Point COCO Pose Wireframe**: Real-time tracking overlay of head, shoulders, elbows, wrists, hips, knees, and ankles.
* **Full-Canvas Bounding Box Tracking**: Responsive bounding box tracking across the entire screen.
* **Dynamic Action Phase Identification**: Identifies specific motion phases (e.g. *Outswinger Seam Release Apex*, *Spike Takeoff Apex*, *High Sprint Acceleration*).
* **4 CV Visual HUD Themes**: Cyber Cyan, Matrix Emerald, High-Vis Amber, and Tactical Minimal.

### 🤖 2. Multimodal Sport Mismatch & Auto-Calibration
* **Video Stream Scanning**: Automatically inspects video file characteristics, filenames, and video signatures.
* **Auto-Calibration Safeguard**: Automatically auto-calibrates from Cricket to Volleyball if a volleyball video is detected.
* **1-Click Engine Selector**: Quick toggle buttons (`[⚽ Football] [🏏 Cricket] [🏐 Volleyball]`) on the Match Dashboard.

### 🏋️ 3. Position-Specific Biomechanical Scoring
* **Cricket**: Custom metrics for Fast Bowler, Batsman, Spin Bowler, and Wicketkeeper.
* **Volleyball**: Custom metrics for Outside Hitter (Spiker), Setter, Libero, and Middle Blocker.
* **Football**: Custom metrics for Striker, Midfielder, Defender, and Goalkeeper.

### 🗺️ 4. High-DPI Spatial Heatmap Viewer
* **Sport Field Grids**: Renders 105x68m Football pitches, 22-yard Cricket pitches, and 9x18m Volleyball courts.
* **3 Display Modes**: Density Heatmap, Touch Scatter, and Zone Split Percentages.

### 🧠 5. Deep Reasoning AI Coach Chatbot
* **Sports Scientist Assistant**: Answers complex sports science questions on kinetic chain mechanics, velocity protocols, and drill microcycles.

### 🧹 6. System Reset Engine ("Make Website Raw")
* **Factory Reset**: Quick 1-click trigger in navbar and settings to wipe IndexedDB video blobs and local storage data.

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+ 

### Installation & Local Run

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Start local server
npm run start -- -p 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
This project is licensed under the MIT License.
