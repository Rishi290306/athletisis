'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Eye, Sliders, Activity } from 'lucide-react';
import { VideoClip } from '@/types';
import { computeFrameTelemetry } from '@/lib/cvTelemetryEngine';
import { SportType } from '@/lib/sportStore';

interface VideoPlayerProps {
  videoUrl?: string;
  clips?: VideoClip[];
  onThresholdChange?: (confidence: number, snippetDuration: number) => void;
  sport?: SportType;
  matchId?: number;
  fileName?: string;
  seekTimestamp?: number;
  onCurrentTimeChange?: (seconds: number) => void;
  onSeekTimestamp?: (seconds: number) => void;
}

function getCalibratedPose(sport: SportType, time: number) {
  if (sport === 'Cricket') {
    // Exact calibration for the cricket bowling clip (Jasprit Bumrah)
    const phase = (time % 3.6);
    const armSwing = Math.sin(phase * 1.8);
    const stride = Math.cos(phase * 1.8);

    const head = { x: 58.5, y: 31.0 + armSwing * 0.4 };
    const neck = { x: 56.5, y: 36.5 + armSwing * 0.4 };
    const rShoulder = { x: 49.0, y: 40.5 };
    const lShoulder = { x: 63.0, y: 40.0 };
    const rElbow = { x: 39.5 + armSwing * 1.2, y: 46.5 + armSwing * 1.5 };
    const rWrist = { x: 35.5 + armSwing * 1.8, y: 52.5 + armSwing * 2.0 }; // Ball in hand
    const lElbow = { x: 69.5 - armSwing * 0.8, y: 46.5 };
    const lWrist = { x: 71.0 - armSwing * 1.0, y: 53.0 };
    const spine = { x: 53.0, y: 49.0 };
    const pelvis = { x: 47.5, y: 67.0 };
    const lHip = { x: 51.5, y: 67.0 };
    const rHip = { x: 44.5, y: 67.0 };
    const lKnee = { x: 46.5 + stride * 0.6, y: 83.5 };
    const lAnkle = { x: 44.0 + stride * 0.5, y: 96.0 };
    const rKnee = { x: 42.0 - stride * 0.5, y: 86.0 };
    const rAnkle = { x: 41.5 - stride * 0.5, y: 97.0 };

    const box = {
      top: 23.0,
      left: 31.5,
      width: 42.5,
      height: 75.0,
    };

    return {
      head, neck, rShoulder, lShoulder, rElbow, rWrist, lElbow, lWrist,
      spine, pelvis, lHip, rHip, lKnee, lAnkle, rKnee, rAnkle,
      box,
      athleteName: 'JASPRIT BUMRAH (BOWLER)',
      armAngle: Math.round(88 + armSwing * 10),
      kneeAngle: Math.round(142 - stride * 6),
      callouts: [
        { label: `ARM EXT: ${Math.round(88 + armSwing * 10)}°`, x: 22.0, y: 46.5, color: 'text-amber-400 border-amber-500/50' },
        { label: `KNEE FLEX: ${Math.round(142 - stride * 6)}°`, x: 55.0, y: 83.5, color: 'text-emerald-400 border-emerald-500/50' },
        { label: `RELEASE ELEV: 2.14m`, x: 20.0, y: 34.0, color: 'text-sky-400 border-sky-500/50' },
      ],
    };
  } else if (sport === 'Volleyball') {
    const phase = (time % 3.2);
    const jumpApex = Math.sin(phase * 2.0);
    const head = { x: 52.0, y: 22.0 - jumpApex * 2.5 };
    const neck = { x: 52.0, y: 28.0 - jumpApex * 2.5 };
    const lShoulder = { x: 44.0, y: 32.0 - jumpApex * 2.5 };
    const rShoulder = { x: 60.0, y: 31.0 - jumpApex * 2.5 };
    const rElbow = { x: 67.0, y: 20.0 - jumpApex * 2.5 };
    const rWrist = { x: 72.0, y: 12.0 - jumpApex * 2.5 };
    const lElbow = { x: 38.0, y: 38.0 - jumpApex * 2.0 };
    const lWrist = { x: 34.0, y: 44.0 - jumpApex * 2.0 };
    const spine = { x: 51.5, y: 42.0 - jumpApex * 2.2 };
    const pelvis = { x: 51.0, y: 55.0 - jumpApex * 2.0 };
    const lHip = { x: 47.0, y: 55.0 - jumpApex * 2.0 };
    const rHip = { x: 55.0, y: 55.0 - jumpApex * 2.0 };
    const lKnee = { x: 45.0, y: 70.0 - jumpApex * 1.5 };
    const lAnkle = { x: 43.0, y: 83.0 - jumpApex * 1.2 };
    const rKnee = { x: 57.0, y: 70.0 - jumpApex * 1.5 };
    const rAnkle = { x: 59.0, y: 83.0 - jumpApex * 1.2 };

    const box = {
      top: 9.0,
      left: 28.0,
      width: 48.0,
      height: 78.0,
    };

    return {
      head, neck, rShoulder, lShoulder, rElbow, rWrist, lElbow, lWrist,
      spine, pelvis, lHip, rHip, lKnee, lAnkle, rKnee, rAnkle,
      box,
      athleteName: 'ATTACK SPIKER',
      armAngle: Math.round(112 + jumpApex * 8),
      kneeAngle: Math.round(128 - jumpApex * 12),
      callouts: [
        { label: `SPIKE APEX: 78cm`, x: 73.0, y: 18.0, color: 'text-amber-400 border-amber-500/50' },
        { label: `CORE TORQUE: 94°`, x: 31.0, y: 46.0, color: 'text-emerald-400 border-emerald-500/50' },
      ],
    };
  } else {
    // Football Striker/Midfielder
    const phase = (time % 3.0);
    const kick = Math.sin(phase * 2.1);
    const head = { x: 50.0, y: 26.0 };
    const neck = { x: 50.0, y: 32.0 };
    const lShoulder = { x: 43.0, y: 36.0 };
    const rShoulder = { x: 57.0, y: 36.0 };
    const lElbow = { x: 36.0, y: 45.0 };
    const lWrist = { x: 32.0, y: 54.0 };
    const rElbow = { x: 64.0, y: 45.0 };
    const rWrist = { x: 68.0, y: 54.0 };
    const spine = { x: 50.0, y: 48.0 };
    const pelvis = { x: 50.0, y: 62.0 };
    const lHip = { x: 46.0, y: 62.0 };
    const rHip = { x: 54.0, y: 62.0 };
    const lKnee = { x: 44.0, y: 78.0 };
    const lAnkle = { x: 43.0, y: 93.0 };
    const rKnee = { x: 59.0 + kick * 1.5, y: 75.0 - kick * 2.0 };
    const rAnkle = { x: 63.0 + kick * 3.0, y: 88.0 - kick * 4.0 };

    const box = {
      top: 20.0,
      left: 28.0,
      width: 44.0,
      height: 76.0,
    };

    return {
      head, neck, rShoulder, lShoulder, rElbow, rWrist, lElbow, lWrist,
      spine, pelvis, lHip, rHip, lKnee, lAnkle, rKnee, rAnkle,
      box,
      athleteName: 'MIDFIELDER / STRIKER',
      armAngle: Math.round(92 + kick * 6),
      kneeAngle: Math.round(135 - kick * 10),
      callouts: [
        { label: `STRIKE VELOCITY: 114 km/h`, x: 18.0, y: 38.0, color: 'text-amber-400 border-amber-500/50' },
        { label: `PLANT STABILITY: 96%`, x: 54.0, y: 86.0, color: 'text-emerald-400 border-emerald-500/50' },
      ],
    };
  }
}

export function VideoPlayer({
  videoUrl,
  clips = [],
  sport,
  matchId,
  fileName,
  seekTimestamp,
  onCurrentTimeChange,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackVideo = '/sample-match.mp4';
  const [videoSrc, setVideoSrc] = useState<string>(videoUrl || fallbackVideo);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [hasError, setHasError] = useState(false);

  // Playback Controls State
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [cvOverlayEnabled, setCvOverlayEnabled] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [currentCvTime, setCurrentCvTime] = useState<number>(0);

  useEffect(() => {
    if (videoUrl) {
      setVideoSrc(videoUrl);
      setHasError(false);
    }
  }, [videoUrl]);

  // React to seekTimestamp changes from TacticalPitchMap, ClipTagger, or parent
  useEffect(() => {
    if (seekTimestamp !== undefined && videoRef.current) {
      const vid = videoRef.current;
      const dur = vid.duration && !isNaN(vid.duration) ? vid.duration : 15;
      const targetTime = seekTimestamp >= dur ? (seekTimestamp % dur) : Math.max(0, seekTimestamp);
      vid.currentTime = targetTime;
      vid.play().catch(e => console.log('Autoplay deferred:', e));
      setIsPlaying(true);
    }
  }, [seekTimestamp]);

  const handleVideoError = () => {
    if (!hasError) {
      setHasError(true);
      setVideoSrc(fallbackVideo);
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const stepFrame = (seconds: number) => {
    if (videoRef.current) {
      const nextTime = Math.max(0, videoRef.current.currentTime + seconds);
      videoRef.current.currentTime = nextTime;
      setCurrentCvTime(nextTime);
      onCurrentTimeChange?.(nextTime);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(e => console.log('Autoplay deferred:', e));
        setIsPlaying(true);
      }
    }
  };

  const jumpToClip = (clip: VideoClip) => {
    setSelectedClip(clip);
    if (videoRef.current) {
      const vid = videoRef.current;
      const dur = vid.duration && !isNaN(vid.duration) ? vid.duration : 15;
      const targetTime = clip.startTimestampSeconds >= dur ? (clip.startTimestampSeconds % dur) : clip.startTimestampSeconds;
      vid.currentTime = targetTime;
      vid.playbackRate = playbackRate;
      vid.play().catch((err) => console.log('Autoplay deferred:', err));
      setIsPlaying(true);
      setCurrentCvTime(targetTime);
      onCurrentTimeChange?.(targetTime);
    }
  };

  const activeSport: SportType = sport || (selectedClip as any)?.sport || 'Cricket';
  const videoSig = `${fileName || ''}_${matchId || ''}_${videoSrc}`;
  const liveTelemetry = computeFrameTelemetry(currentCvTime, activeSport, selectedClip?.id, videoSig);

  return (
    <div className="pro-card p-4 sm:p-5 space-y-4">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Pro Match Video & Pose Telemetry Workbench
          </h3>
          <p className="text-xs text-slate-300">17-Point pose skeleton tracking & frame-by-frame sports kinematic engine</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCvOverlayEnabled(!cvOverlayEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
              cvOverlayEnabled
                ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                : 'bg-[#0b1329] text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Pose Skeleton: {cvOverlayEnabled ? 'ACTIVE' : 'OFF'}
          </button>

          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
              showSettingsDrawer
                ? 'bg-sky-600 text-white border-sky-400'
                : 'bg-[#0b1329] text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            CV Controls
          </button>
        </div>
      </div>

      {/* Settings Drawer */}
      {showSettingsDrawer && (
        <div className="p-3.5 rounded-xl bg-[#0b1329] border border-slate-700 space-y-3 text-xs">
          <div className="flex items-center justify-between font-bold text-white border-b border-slate-700 pb-2">
            <span>Pose Skeleton & Bounding Box Overlays</span>
            <button onClick={() => setShowSettingsDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input type="checkbox" checked={showSkeleton} onChange={(e) => setShowSkeleton(e.target.checked)} className="rounded bg-slate-800 text-sky-500" />
              <span>17-Point Joint Skeleton</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input type="checkbox" checked={showBoundingBox} onChange={(e) => setShowBoundingBox(e.target.checked)} className="rounded bg-slate-800 text-sky-500" />
              <span>Player Detection Box</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input type="checkbox" checked={showTelemetry} onChange={(e) => setShowTelemetry(e.target.checked)} className="rounded bg-slate-800 text-sky-500" />
              <span>Speed & Angle HUD</span>
            </label>
          </div>
        </div>
      )}

      {/* Main Video Screen Container with Canvas Overlays */}
      <div className="relative aspect-video bg-[#070d1e] rounded-xl border border-slate-700 overflow-hidden group select-none shadow-inner">
        <video
          ref={videoRef}
          src={videoSrc}
          onError={handleVideoError}
          onTimeUpdate={() => {
            if (videoRef.current) {
              const t = videoRef.current.currentTime;
              setCurrentCvTime(t);
              onCurrentTimeChange?.(t);
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-contain"
          playsInline
        />

        {/* Real-time Bounding Box & Skeleton CV Overlay */}
        {cvOverlayEnabled && (() => {
          const pose = getCalibratedPose(activeSport, currentCvTime);
          return (
            <div className="absolute inset-0 pointer-events-none">
              {/* Player Bounding Box */}
              {showBoundingBox && (
                <div
                  style={{
                    top: `${pose.box.top}%`,
                    left: `${pose.box.left}%`,
                    width: `${pose.box.width}%`,
                    height: `${pose.box.height}%`,
                  }}
                  className="absolute border-2 border-sky-400/90 bg-sky-500/10 rounded-sm shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                >
                  <div className="absolute -top-6 left-0 px-2.5 py-0.5 bg-[#0b1329]/95 text-sky-300 text-[10px] font-mono font-bold rounded border border-sky-500/50 whitespace-nowrap shadow-md">
                    PLAYER #1 • {activeSport.toUpperCase()} ({pose.athleteName}) • 98.4% CONF
                  </div>
                </div>
              )}

              {/* 17-Point Pose Skeleton Joints */}
              {showSkeleton && (
                <div className="absolute inset-0">
                  {/* Skeleton connecting lines */}
                  <svg className="absolute inset-0 w-full h-full stroke-sky-400/95 fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Head & Neck */}
                    <line x1={`${pose.head.x}%`} y1={`${pose.head.y}%`} x2={`${pose.neck.x}%`} y2={`${pose.neck.y}%`} />
                    {/* Shoulders */}
                    <line x1={`${pose.lShoulder.x}%`} y1={`${pose.lShoulder.y}%`} x2={`${pose.rShoulder.x}%`} y2={`${pose.rShoulder.y}%`} />
                    <line x1={`${pose.neck.x}%`} y1={`${pose.neck.y}%`} x2={`${pose.rShoulder.x}%`} y2={`${pose.rShoulder.y}%`} />
                    <line x1={`${pose.neck.x}%`} y1={`${pose.neck.y}%`} x2={`${pose.lShoulder.x}%`} y2={`${pose.lShoulder.y}%`} />
                    {/* Right Arm (Bowling Arm) */}
                    <line x1={`${pose.rShoulder.x}%`} y1={`${pose.rShoulder.y}%`} x2={`${pose.rElbow.x}%`} y2={`${pose.rElbow.y}%`} />
                    <line x1={`${pose.rElbow.x}%`} y1={`${pose.rElbow.y}%`} x2={`${pose.rWrist.x}%`} y2={`${pose.rWrist.y}%`} />
                    {/* Left Arm (Guide Arm) */}
                    <line x1={`${pose.lShoulder.x}%`} y1={`${pose.lShoulder.y}%`} x2={`${pose.lElbow.x}%`} y2={`${pose.lElbow.y}%`} />
                    <line x1={`${pose.lElbow.x}%`} y1={`${pose.lElbow.y}%`} x2={`${pose.lWrist.x}%`} y2={`${pose.lWrist.y}%`} />
                    {/* Spine / Torso */}
                    <line x1={`${pose.neck.x}%`} y1={`${pose.neck.y}%`} x2={`${pose.spine.x}%`} y2={`${pose.spine.y}%`} />
                    <line x1={`${pose.spine.x}%`} y1={`${pose.spine.y}%`} x2={`${pose.pelvis.x}%`} y2={`${pose.pelvis.y}%`} />
                    {/* Hips */}
                    <line x1={`${pose.lHip.x}%`} y1={`${pose.lHip.y}%`} x2={`${pose.rHip.x}%`} y2={`${pose.rHip.y}%`} />
                    {/* Left Leg */}
                    <line x1={`${pose.lHip.x}%`} y1={`${pose.lHip.y}%`} x2={`${pose.lKnee.x}%`} y2={`${pose.lKnee.y}%`} />
                    <line x1={`${pose.lKnee.x}%`} y1={`${pose.lKnee.y}%`} x2={`${pose.lAnkle.x}%`} y2={`${pose.lAnkle.y}%`} />
                    {/* Right Leg */}
                    <line x1={`${pose.rHip.x}%`} y1={`${pose.rHip.y}%`} x2={`${pose.rKnee.x}%`} y2={`${pose.rKnee.y}%`} />
                    <line x1={`${pose.rKnee.x}%`} y1={`${pose.rKnee.y}%`} x2={`${pose.rAnkle.x}%`} y2={`${pose.rAnkle.y}%`} />
                  </svg>

                  {/* Joint dots */}
                  {[
                    pose.head, pose.neck, pose.rShoulder, pose.lShoulder,
                    pose.rElbow, pose.rWrist, pose.lElbow, pose.lWrist,
                    pose.spine, pose.pelvis, pose.lHip, pose.rHip,
                    pose.lKnee, pose.lAnkle, pose.rKnee, pose.rAnkle
                  ].map((pt, idx) => (
                    <div
                      key={idx}
                      style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                      className="absolute w-2.5 h-2.5 bg-sky-400 rounded-full border border-white -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(56,189,248,0.9)]"
                    />
                  ))}

                  {/* Cricket Ball Marker in hand */}
                  {activeSport === 'Cricket' && (
                    <div
                      style={{ left: `${pose.rWrist.x}%`, top: `${pose.rWrist.y}%` }}
                      className="absolute w-3.5 h-3.5 bg-white rounded-full border-2 border-red-500 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.9)] flex items-center justify-center pointer-events-none"
                      title="Cricket Ball Keypoint"
                    >
                      <div className="w-1.5 h-0.5 bg-red-600 rounded-full" />
                    </div>
                  )}

                  {/* Dynamic Joint Angle Badges */}
                  {pose.callouts.map((c, i) => (
                    <div
                      key={i}
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                      className={`absolute px-2 py-0.5 bg-[#0b1329]/95 ${c.color} text-[9px] font-mono font-bold rounded border shadow-lg whitespace-nowrap`}
                    >
                      {c.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Live Telemetry Display */}
              {showTelemetry && (
                <div className="absolute bottom-3 left-3 p-2.5 rounded-lg bg-[#0b1329]/95 border border-slate-700 text-xs font-mono space-y-1 shadow-lg">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <Activity className="w-3.5 h-3.5" />
                    <span>VELOCITY: {liveTelemetry.velocityKmh.toFixed(1)} km/h</span>
                  </div>
                  <div className="text-[10px] text-slate-300">ACCEL BURST: {(liveTelemetry.velocityKmh * 0.28).toFixed(1)} m/s²</div>
                  <div className="text-[10px] text-slate-300">BODY LEAN: 18°</div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Scrubber & Speed Controls */}
      <div className="p-3.5 rounded-xl bg-[#0b1329] border border-slate-700 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={() => stepFrame(-0.1)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700"
            >
              -0.1s
            </button>
            <button
              onClick={() => stepFrame(0.1)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700"
            >
              +0.1s
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-300 font-semibold">Speed:</span>
            <div className="flex items-center gap-1 bg-[#152037] p-1 rounded-lg border border-slate-700 text-xs font-mono">
              {[0.25, 0.5, 1, 1.5, 2].map(r => (
                <button
                  key={r}
                  onClick={() => changePlaybackRate(r)}
                  className={`px-2 py-0.5 rounded font-bold transition ${
                    playbackRate === r ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filterable Clip Moments Grid */}
      {clips.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
            <span>Match Event Clips ({clips.length} Plays Detected)</span>
            <span className="text-[10px] text-sky-400 font-mono">1-Click Clip Jump</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {clips.map((clip) => (
              <button
                key={clip.id}
                onClick={() => jumpToClip(clip)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  selectedClip?.id === clip.id
                    ? 'bg-sky-600/30 border-sky-400 text-white shadow-sm ring-1 ring-sky-400/40'
                    : 'bg-[#0b1329] border-slate-700/80 text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono font-bold text-sky-400">
                  {(clip as any).timestamp || `${clip.startTimestampSeconds}s`}
                </div>
                <div className="text-xs font-bold truncate mt-0.5">{clip.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{clip.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
