'use client';

import {
  PersonPose,
  VideoDisplayRect,
  projectNormalizedToCanvas,
} from './poseService';

export interface RenderOptions {
  showSkeleton: boolean;
  showBoundingBox: boolean;
  showTelemetry: boolean;
  debugMode: boolean;
  selectedPersonId: number | 'all';
  minConfidenceThreshold: number;
}

const PLAYER_PALETTES = [
  {
    name: 'Primary Athlete',
    stroke: '#38bdf8', // Sky 400
    fill: '#0284c7',   // Sky 600
    joint: '#7dd3fc',  // Sky 300
    boxBorder: 'rgba(56, 189, 248, 0.9)',
    boxBg: 'rgba(56, 189, 248, 0.08)',
  },
  {
    name: 'Player 2',
    stroke: '#34d399', // Emerald 400
    fill: '#059669',   // Emerald 600
    joint: '#6ee7b7',  // Emerald 300
    boxBorder: 'rgba(52, 211, 153, 0.9)',
    boxBg: 'rgba(52, 211, 153, 0.08)',
  },
  {
    name: 'Player 3',
    stroke: '#fbbf24', // Amber 400
    fill: '#d97706',   // Amber 600
    joint: '#fde68a',  // Amber 300
    boxBorder: 'rgba(251, 191, 36, 0.9)',
    boxBg: 'rgba(251, 191, 36, 0.08)',
  },
  {
    name: 'Player 4',
    stroke: '#f472b6', // Pink 400
    fill: '#db2777',   // Pink 600
    joint: '#fbcfe8',  // Pink 300
    boxBorder: 'rgba(244, 114, 182, 0.9)',
    boxBg: 'rgba(244, 114, 182, 0.08)',
  },
];

const COCO_CONNECTIONS: Array<[string, string]> = [
  ['left_ear', 'left_eye'],
  ['left_eye', 'nose'],
  ['nose', 'right_eye'],
  ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
];

/**
 * Clears and renders accurate skeletons, bounding boxes, and debug overlays on an HTML5 Canvas.
 */
export function renderPoseOnCanvas(
  ctx: CanvasRenderingContext2D,
  rect: VideoDisplayRect,
  persons: PersonPose[],
  options: RenderOptions,
  sportName: string = 'ATHLETE'
) {
  // Clear full canvas
  ctx.clearRect(0, 0, rect.containerWidth, rect.containerHeight);

  // If in debug mode, draw the exact active video display rectangle (letterbox inspection)
  if (options.debugMode) {
    ctx.save();
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(rect.offsetX, rect.offsetY, rect.displayedWidth, rect.displayedHeight);
    ctx.fillStyle = 'rgba(234, 179, 8, 0.8)';
    ctx.font = '10px monospace';
    ctx.fillText(
      `VIDEO BOUNDS: ${Math.round(rect.displayedWidth)}x${Math.round(rect.displayedHeight)} [Offset: ${Math.round(rect.offsetX)}, ${Math.round(rect.offsetY)}] Scale: ${rect.scale.toFixed(2)}x`,
      rect.offsetX + 8,
      rect.offsetY + 16
    );
    ctx.restore();
  }

  if (!persons || persons.length === 0) return;

  // Filter persons according to selection
  const targetPersons = options.selectedPersonId === 'all'
    ? persons
    : persons.filter((p) => p.personId === options.selectedPersonId);

  targetPersons.forEach((person, idx) => {
    const palette = PLAYER_PALETTES[(person.personId - 1) % PLAYER_PALETTES.length];
    const kpMap = person.keypoints;

    // 1. Render Bounding Box
    if (options.showBoundingBox && person.box) {
      const boxP1 = projectNormalizedToCanvas(person.box.left, person.box.top, rect);
      const boxW = person.box.width * rect.displayedWidth;
      const boxH = person.box.height * rect.displayedHeight;

      ctx.save();
      ctx.strokeStyle = palette.boxBorder;
      ctx.fillStyle = palette.boxBg;
      ctx.lineWidth = 1.8;
      ctx.strokeRect(boxP1.x, boxP1.y, boxW, boxH);
      ctx.fillRect(boxP1.x, boxP1.y, boxW, boxH);

      // Label Header Badge
      const labelText = `PLAYER #${person.personId} • ${sportName.toUpperCase()} • ${(person.confidence * 100).toFixed(1)}%`;
      ctx.font = 'bold 10px monospace';
      const textMetrics = ctx.measureText(labelText);
      const badgeW = textMetrics.width + 12;
      const badgeH = 18;

      ctx.fillStyle = 'rgba(11, 19, 41, 0.95)';
      ctx.fillRect(boxP1.x, Math.max(0, boxP1.y - badgeH), badgeW, badgeH);
      ctx.strokeStyle = palette.stroke;
      ctx.lineWidth = 1;
      ctx.strokeRect(boxP1.x, Math.max(0, boxP1.y - badgeH), badgeW, badgeH);

      ctx.fillStyle = palette.stroke;
      ctx.fillText(labelText, boxP1.x + 6, Math.max(12, boxP1.y - 5));
      ctx.restore();
    }

    // 2. Render 17-Point COCO Skeleton Connections
    if (options.showSkeleton) {
      ctx.save();
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = palette.stroke;

      COCO_CONNECTIONS.forEach(([startId, endId]) => {
        const startKp = kpMap[startId];
        const endKp = kpMap[endId];

        if (
          startKp &&
          endKp &&
          startKp.confidence >= options.minConfidenceThreshold &&
          endKp.confidence >= options.minConfidenceThreshold
        ) {
          const p1 = projectNormalizedToCanvas(startKp.x, startKp.y, rect);
          const p2 = projectNormalizedToCanvas(endKp.x, endKp.y, rect);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
      ctx.restore();

      // 3. Render Joint Nodes
      Object.values(kpMap).forEach((kp) => {
        if (kp.confidence < options.minConfidenceThreshold) return;

        const p = projectNormalizedToCanvas(kp.x, kp.y, rect);

        ctx.save();
        ctx.beginPath();
        const jointRadius = options.debugMode ? 4.5 : 3.5;
        ctx.arc(p.x, p.y, jointRadius, 0, Math.PI * 2);
        
        // Color coding by confidence in debug mode
        if (options.debugMode) {
          if (kp.confidence >= 0.8) {
            ctx.fillStyle = '#10b981'; // Green
          } else if (kp.confidence >= 0.5) {
            ctx.fillStyle = '#f59e0b'; // Amber
          } else {
            ctx.fillStyle = '#ef4444'; // Red
          }
        } else {
          ctx.fillStyle = palette.joint;
        }

        ctx.fill();
        ctx.strokeStyle = '#0b1329';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Debug mode: Draw joint label & coordinate values
        if (options.debugMode) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '8px monospace';
          const label = `${kp.name} ${(kp.confidence * 100).toFixed(0)}% [${kp.x.toFixed(2)},${kp.y.toFixed(2)}]`;
          ctx.fillText(label, p.x + 6, p.y + 3);
        }

        ctx.restore();
      });
    }

    // 4. Biomechanical Angular HUD Callouts
    if (options.showTelemetry && person.biomechanics) {
      const bio = person.biomechanics;
      const rElbow = kpMap['right_elbow'];
      const rKnee = kpMap['right_knee'];

      ctx.save();
      ctx.font = 'bold 9px monospace';

      if (bio.armAngleDeg && rElbow && rElbow.confidence >= 0.4) {
        const p = projectNormalizedToCanvas(rElbow.x, rElbow.y, rect);
        drawHudTag(ctx, `ARM EXT: ${bio.armAngleDeg}°`, p.x + 10, p.y, '#f59e0b');
      }

      if (bio.kneeAngleDeg && rKnee && rKnee.confidence >= 0.4) {
        const p = projectNormalizedToCanvas(rKnee.x, rKnee.y, rect);
        drawHudTag(ctx, `KNEE BRACE: ${bio.kneeAngleDeg}°`, p.x + 10, p.y, '#10b981');
      }

      ctx.restore();
    }
  });

  // 5. Global Debug Inspector Overlay (Top Right HUD)
  if (options.debugMode) {
    drawDebugInspectorHud(ctx, rect, persons, options);
  }
}

function drawHudTag(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string) {
  const padX = 5;
  const padY = 3;
  const w = ctx.measureText(text).width + padX * 2;
  const h = 14;

  ctx.fillStyle = 'rgba(7, 13, 30, 0.9)';
  ctx.fillRect(x, y - 7, w, h);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y - 7, w, h);
  ctx.fillStyle = color;
  ctx.fillText(text, x + padX, y + 4);
}

function drawDebugInspectorHud(
  ctx: CanvasRenderingContext2D,
  rect: VideoDisplayRect,
  persons: PersonPose[],
  options: RenderOptions
) {
  ctx.save();
  const hudX = rect.containerWidth - 260;
  const hudY = 12;
  const hudW = 248;
  const hudH = 100;

  ctx.fillStyle = 'rgba(11, 19, 41, 0.95)';
  ctx.fillRect(hudX, hudY, hudW, hudH);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.strokeRect(hudX, hudY, hudW, hudH);

  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('⚡ POSE ESTIMATION INSPECTOR', hudX + 8, hudY + 16);

  ctx.font = '9px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`Model: MediaPipe PoseLandmarker (17-COCO)`, hudX + 8, hudY + 32);
  ctx.fillText(`Video Intrinsic: ${rect.videoWidth}x${rect.videoHeight} (${(rect.videoWidth/rect.videoHeight).toFixed(2)}:1)`, hudX + 8, hudY + 46);
  ctx.fillText(`Container: ${rect.containerWidth}x${rect.containerHeight} | Scale: ${rect.scale.toFixed(2)}x`, hudX + 8, hudY + 60);
  ctx.fillText(`Pillarbox Left/Right: ${rect.offsetX.toFixed(1)}px`, hudX + 8, hudY + 74);
  ctx.fillText(`Detected Persons: ${persons.length} | Tracked: ${options.selectedPersonId}`, hudX + 8, hudY + 88);

  ctx.restore();
}
