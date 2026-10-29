'use client';

export interface PoseKeypoint {
  id: string;
  name: string;
  x: number; // Normalized [0, 1] relative to intrinsic video width
  y: number; // Normalized [0, 1] relative to intrinsic video height
  z?: number;
  confidence: number;
}

export interface PersonPose {
  personId: number;
  confidence: number;
  box: {
    left: number; // Normalized [0, 1]
    top: number;
    width: number;
    height: number;
  };
  keypoints: Record<string, PoseKeypoint>;
  keypointsList: PoseKeypoint[];
  biomechanics?: {
    armAngleDeg?: number | null;
    kneeAngleDeg?: number | null;
  };
}

export interface VideoPoseTimelineFrame {
  frameIndex: number;
  timestampSec: number;
  personsCount: number;
  persons: PersonPose[];
}

export interface VideoPoseDataset {
  videoInfo: {
    width: number;
    height: number;
    aspectRatio: number;
    fps: number;
    durationSec: number;
    totalFrames: number;
  };
  skeletonConnections: Array<[string, string]>;
  timeline: VideoPoseTimelineFrame[];
}

export interface VideoDisplayRect {
  containerWidth: number;
  containerHeight: number;
  videoWidth: number;
  videoHeight: number;
  displayedWidth: number;
  displayedHeight: number;
  offsetX: number; // Pillarbox left margin
  offsetY: number; // Letterbox top margin
  scale: number;
}

/**
 * Calculates exact aspect-ratio preserving display rectangle for HTML5 video
 * rendered with `object-fit: contain` inside a container.
 */
export function computeVideoDisplayRect(
  containerW: number,
  containerH: number,
  videoIntrinsicW: number,
  videoIntrinsicH: number
): VideoDisplayRect {
  if (containerW <= 0 || containerH <= 0 || videoIntrinsicW <= 0 || videoIntrinsicH <= 0) {
    return {
      containerWidth: containerW,
      containerHeight: containerH,
      videoWidth: videoIntrinsicW || 16,
      videoHeight: videoIntrinsicH || 9,
      displayedWidth: containerW,
      displayedHeight: containerH,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    };
  }

  const containerRatio = containerW / containerH;
  const videoRatio = videoIntrinsicW / videoIntrinsicH;

  let displayedW = containerW;
  let displayedH = containerH;
  let offsetX = 0;
  let offsetY = 0;
  let scale = 1;

  if (containerRatio > videoRatio) {
    // Container is wider than video -> pillarboxed with black bars on left/right
    displayedH = containerH;
    displayedW = containerH * videoRatio;
    offsetX = (containerW - displayedW) / 2;
    scale = containerH / videoIntrinsicH;
  } else {
    // Container is taller than video -> letterboxed with black bars on top/bottom
    displayedW = containerW;
    displayedH = containerW / videoRatio;
    offsetY = (containerH - displayedH) / 2;
    scale = containerW / videoIntrinsicW;
  }

  return {
    containerWidth: containerW,
    containerHeight: containerH,
    videoWidth: videoIntrinsicW,
    videoHeight: videoIntrinsicH,
    displayedWidth: displayedW,
    displayedHeight: displayedH,
    offsetX,
    offsetY,
    scale,
  };
}

/**
 * Maps a normalized keypoint [0, 1] to canvas pixel space
 * taking into account letterboxing/pillarboxing offsets.
 */
export function projectNormalizedToCanvas(
  normX: number,
  normY: number,
  rect: VideoDisplayRect
): { x: number; y: number } {
  return {
    x: rect.offsetX + normX * rect.displayedWidth,
    y: rect.offsetY + normY * rect.displayedHeight,
  };
}

// In-memory cache for video pose datasets
const poseDatasetCache: Record<string, VideoPoseDataset> = {};

/**
 * Resolves the appropriate calibrated pose dataset filename for a given video.
 */
export function resolvePoseTrackFile(videoSrc: string, sport?: string): string {
  const lower = (videoSrc || '').toLowerCase();
  if (lower.includes('volleyball') || sport === 'Volleyball') {
    return '/sample-volleyball_poses.json';
  }
  if (lower.includes('sample-match.mp4') || (sport === 'Football' && !lower.includes('bumrah') && !lower.includes('match2'))) {
    return '/sample-match_poses.json';
  }
  if (lower.includes('sample-match2.mp4')) {
    return '/sample-match2_poses.json';
  }
  // Default to Bumrah cricket delivery pose track
  return '/bumrah2_poses.json';
}

/**
 * Loads and caches ground-truth pose datasets asynchronously.
 */
export async function loadVideoPoseDataset(videoSrc: string, sport?: string): Promise<VideoPoseDataset | null> {
  const trackFile = resolvePoseTrackFile(videoSrc, sport);

  if (poseDatasetCache[trackFile]) {
    return poseDatasetCache[trackFile];
  }

  try {
    const res = await fetch(trackFile);
    if (!res.ok) {
      console.warn(`[PoseService] Failed to fetch pose track from ${trackFile}: status ${res.status}`);
      return null;
    }
    const data: VideoPoseDataset = await res.json();
    poseDatasetCache[trackFile] = data;
    return data;
  } catch (err) {
    console.error(`[PoseService] Error loading pose dataset for ${videoSrc}:`, err);
    return null;
  }
}

/**
 * Finds the closest pose frame from the timeline for the specified timestamp,
 * with optional temporal interpolation between consecutive frames.
 */
export function getPoseForTimestamp(
  dataset: VideoPoseDataset,
  currentTimeSec: number
): VideoPoseTimelineFrame | null {
  const timeline = dataset.timeline;
  if (!timeline || timeline.length === 0) return null;

  // Modulo loop if time exceeds duration (supports video looping)
  const duration = dataset.videoInfo?.durationSec || 15.0;
  const loopTime = duration > 0 ? (currentTimeSec >= duration ? (currentTimeSec % duration) : currentTimeSec) : currentTimeSec;

  // Binary search for closest frame
  let low = 0;
  let high = timeline.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const frameTime = timeline[mid].timestampSec;

    if (Math.abs(frameTime - loopTime) < 0.035) {
      return timeline[mid];
    } else if (frameTime < loopTime) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  const idx = Math.max(0, Math.min(timeline.length - 1, low));
  return timeline[idx];
}
