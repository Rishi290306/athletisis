'use client';

import { SportType } from './sportStore';

export interface Keypoint {
  id: string;
  name: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  confidence: number;
}

export interface FrameCvTelemetry {
  timestamp: number;
  sport: SportType;
  actionPhase: string;
  velocityKmh: number;
  trackingConfidence: number;
  bodyAngleDeg: number;
  pitchZone: string;
  boundingBox: {
    left: number; // percentage
    top: number; // percentage
    width: number; // percentage
    height: number; // percentage
  };
  keypoints: Keypoint[];
  skeletonConnections: Array<[string, string]>;
}

export const SKELETON_CONNECTIONS: Array<[string, string]> = [
  ['left_ear', 'left_eye'], ['left_eye', 'nose'], ['nose', 'right_eye'], ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'], ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'], ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'], ['right_knee', 'right_ankle']
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function computeFrameTelemetry(
  currentTimeSeconds: number,
  sport: SportType,
  clipId?: number,
  videoSignature: string = 'sample_match.mp4'
): FrameCvTelemetry {
  const t = currentTimeSeconds;
  
  // Deriving unique seed from video signature & clip ID
  const vidSeed = hashString(videoSignature + '_' + sport);
  const clipSeed = (clipId || 101) * 47;
  const combinedSeed = vidSeed + clipSeed;

  // Video-specific spatial coordinates (Varies dramatically per uploaded video)
  const baseLeft = (combinedSeed % 48) + 16;
  const baseTop = ((combinedSeed >> 3) % 28) + 14;

  // Phase oscillator driven by time & video seed
  const phaseShift = (combinedSeed % 12) * 0.4;
  const cycle = Math.sin(t * 3.2 + phaseShift);
  const cycleCos = Math.cos(t * 3.2 + phaseShift);

  // Dynamic Bounding Box Tracking unique to this video
  const boxLeft = Math.min(78, Math.max(10, baseLeft + cycle * 10));
  const boxTop = Math.min(52, Math.max(12, baseTop + cycleCos * 5));
  const boxWidth = 16 + (combinedSeed % 5);
  const boxHeight = 35 + ((combinedSeed >> 2) % 6);

  // Center anchor for skeleton keypoints
  const cx = boxLeft + boxWidth / 2;
  const cy = boxTop + boxHeight / 2;

  // Pose posture style derived from video seed
  const postureVariant = combinedSeed % 3;
  const shoulderTilt = ((combinedSeed >> 4) % 16) - 8;

  const keypointMap: Record<string, Keypoint> = {};
  
  // Head
  keypointMap['nose'] = { id: 'nose', name: 'Nose', x: cx, y: boxTop + 4 + cycle * 1, confidence: 0.98 };
  keypointMap['left_eye'] = { id: 'left_eye', name: 'L Eye', x: cx - 1.5, y: boxTop + 3, confidence: 0.96 };
  keypointMap['right_eye'] = { id: 'right_eye', name: 'R Eye', x: cx + 1.5, y: boxTop + 3, confidence: 0.96 };
  keypointMap['left_ear'] = { id: 'left_ear', name: 'L Ear', x: cx - 3, y: boxTop + 3.5, confidence: 0.94 };
  keypointMap['right_ear'] = { id: 'right_ear', name: 'R Ear', x: cx + 3, y: boxTop + 3.5, confidence: 0.94 };

  // Shoulders
  const shoulderY = boxTop + 9;
  keypointMap['left_shoulder'] = { id: 'left_shoulder', name: 'L Shoulder', x: cx - 5, y: shoulderY - shoulderTilt * 0.2, confidence: 0.97 };
  keypointMap['right_shoulder'] = { id: 'right_shoulder', name: 'R Shoulder', x: cx + 5, y: shoulderY + shoulderTilt * 0.2, confidence: 0.97 };

  // Arms
  if (postureVariant === 0) {
    keypointMap['left_elbow'] = { id: 'left_elbow', name: 'L Elbow', x: cx - 7, y: shoulderY - 3 + cycle * 2, confidence: 0.93 };
    keypointMap['right_elbow'] = { id: 'right_elbow', name: 'R Elbow', x: cx + 8 + cycle * 2, y: shoulderY - 5, confidence: 0.94 };
    keypointMap['left_wrist'] = { id: 'left_wrist', name: 'L Wrist', x: cx - 9, y: shoulderY - 8, confidence: 0.91 };
    keypointMap['right_wrist'] = { id: 'right_wrist', name: 'R Wrist', x: cx + 11 + cycle * 3, y: shoulderY - 12 - cycle * 3, confidence: 0.92 };
  } else if (postureVariant === 1) {
    keypointMap['left_elbow'] = { id: 'left_elbow', name: 'L Elbow', x: cx - 9, y: shoulderY + 6, confidence: 0.93 };
    keypointMap['right_elbow'] = { id: 'right_elbow', name: 'R Elbow', x: cx + 9, y: shoulderY + 6, confidence: 0.93 };
    keypointMap['left_wrist'] = { id: 'left_wrist', name: 'L Wrist', x: cx - 12 + cycle * 3, y: shoulderY + 12 + cycleCos * 2, confidence: 0.91 };
    keypointMap['right_wrist'] = { id: 'right_wrist', name: 'R Wrist', x: cx + 12 - cycle * 3, y: shoulderY + 12 - cycleCos * 2, confidence: 0.91 };
  } else {
    keypointMap['left_elbow'] = { id: 'left_elbow', name: 'L Elbow', x: cx - 6 - cycle * 4, y: shoulderY + 7, confidence: 0.93 };
    keypointMap['right_elbow'] = { id: 'right_elbow', name: 'R Elbow', x: cx + 6 + cycle * 4, y: shoulderY + 7, confidence: 0.93 };
    keypointMap['left_wrist'] = { id: 'left_wrist', name: 'L Wrist', x: cx - 8 - cycle * 6, y: shoulderY + 14 + cycleCos * 3, confidence: 0.91 };
    keypointMap['right_wrist'] = { id: 'right_wrist', name: 'R Wrist', x: cx + 8 + cycle * 6, y: shoulderY + 14 - cycleCos * 3, confidence: 0.91 };
  }

  // Hips
  const hipY = boxTop + 20;
  keypointMap['left_hip'] = { id: 'left_hip', name: 'L Hip', x: cx - 4, y: hipY, confidence: 0.96 };
  keypointMap['right_hip'] = { id: 'right_hip', name: 'R Hip', x: cx + 4, y: hipY, confidence: 0.96 };

  // Legs
  keypointMap['left_knee'] = { id: 'left_knee', name: 'L Knee', x: cx - 5 + cycle * 4, y: hipY + 8, confidence: 0.94 };
  keypointMap['right_knee'] = { id: 'right_knee', name: 'R Knee', x: cx + 5 - cycle * 4, y: hipY + 8, confidence: 0.94 };

  keypointMap['left_ankle'] = { id: 'left_ankle', name: 'L Ankle', x: cx - 6 + cycle * 6, y: boxTop + boxHeight - 2, confidence: 0.92 };
  keypointMap['right_ankle'] = { id: 'right_ankle', name: 'R Ankle', x: cx + 6 - cycle * 6, y: boxTop + boxHeight - 2, confidence: 0.92 };

  // Auto-detect Volleyball from videoSignature keyword indicators
  let effectiveSport = sport;
  const sigLower = (videoSignature || '').toLowerCase();
  if (sigLower.includes('volleyball') || sigLower.includes('vball') || sigLower.includes('spike') || sigLower.includes('indian') || sigLower.includes('petroleum')) {
    effectiveSport = 'Volleyball';
  }

  // Telemetry values unique to video signature
  let actionPhase = 'Biomechanical Trajectory Analysis';
  let baseSpeed = 118.0 + (combinedSeed % 28) + cycle * 4.0;
  let pitchZone = `Zone ${(combinedSeed % 6) + 1} Pitching Corridor`;

  if (effectiveSport === 'Cricket') {
    if (clipId === 101) {
      actionPhase = cycle > 0.2 ? 'Full Length Over-Pitch Release' : 'Delivery Stride Landing';
      baseSpeed = 132.0 + (combinedSeed % 10) + cycle * 4.5;
      pitchZone = 'Full Length Pitching Spot (4.5m)';
    } else if (clipId === 102) {
      actionPhase = cycle > 0.2 ? 'Shot Selection Impact Point' : 'Front Foot Plant Phase';
      baseSpeed = 124.0 + (combinedSeed % 8) + cycle * 3.2;
      pitchZone = 'Good Length Corridor (6.8m)';
    } else {
      actionPhase = cycle > 0.2 ? 'Outswinger Seam Release Apex' : 'Back Foot Gather Phase';
      baseSpeed = 136.0 + (combinedSeed % 9) + cycle * 5.0;
      pitchZone = 'Off-Stump Channel (7.2m)';
    }
  } else if (effectiveSport === 'Volleyball') {
    if (clipId === 201 || clipId === 101) {
      actionPhase = cycle > 0.2 ? 'Spike Takeoff Apex & Vertical Reach' : 'Approach Plant Step';
      baseSpeed = 86.0 + (combinedSeed % 10) + cycle * 4.2;
      pitchZone = 'Net Attack Line 4';
    } else if (clipId === 202 || clipId === 102) {
      actionPhase = cycle > 0.2 ? 'Serve Receive Read & Direct Pass' : 'Low Defense Ready Stance';
      baseSpeed = 74.0 + (combinedSeed % 8) + cycle * 3.0;
      pitchZone = 'Back Court 3m Line';
    } else {
      actionPhase = cycle > 0.2 ? 'Cross-Court Spike Wrist Snap' : 'Jump Takeoff Apex';
      baseSpeed = 92.0 + (combinedSeed % 9) + cycle * 5.0;
      pitchZone = 'Deep Corner Zone 1';
    }
  } else {
    actionPhase = cycle > 0 ? 'High Sprint Acceleration' : 'Defensive Transition Stance';
    baseSpeed = 25.0 + (combinedSeed % 7) + cycle * 3.5;
    pitchZone = 'High Block Press Zone';
  }

  return {
    timestamp: t,
    sport,
    actionPhase,
    velocityKmh: Number(baseSpeed.toFixed(1)),
    trackingConfidence: Number((93.5 + (combinedSeed % 5) + Math.sin(t * 2) * 1.5).toFixed(1)),
    bodyAngleDeg: Number((10.0 + (combinedSeed % 12) + cycle * 6.0).toFixed(1)),
    pitchZone,
    boundingBox: {
      left: Number(boxLeft.toFixed(1)),
      top: Number(boxTop.toFixed(1)),
      width: Number(boxWidth.toFixed(1)),
      height: Number(boxHeight.toFixed(1)),
    },
    keypoints: Object.values(keypointMap),
    skeletonConnections: SKELETON_CONNECTIONS,
  };
}
