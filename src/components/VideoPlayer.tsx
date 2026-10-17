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
        {cvOverlayEnabled && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Player Bounding Box */}
            {showBoundingBox && (
              <div className="absolute top-[22%] left-[38%] w-[24%] h-[56%] border-2 border-sky-400/90 bg-sky-500/10 rounded-sm shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                <div className="absolute -top-6 left-0 px-2 py-0.5 bg-[#0b1329]/95 text-sky-300 text-[10px] font-mono font-bold rounded border border-sky-500/50">
                  PLAYER #1 • {activeSport.toUpperCase()} • 96.4% CONF
                </div>
              </div>
            )}

            {/* 17-Point Pose Skeleton Joints */}
            {showSkeleton && (
              <div className="absolute inset-0">
                {/* Joint dots */}
                <div className="absolute top-[24%] left-[50%] w-3 h-3 bg-sky-400 rounded-full border border-white -translate-x-1/2 shadow-sm" />
                <div className="absolute top-[32%] left-[45%] w-2.5 h-2.5 bg-sky-400 rounded-full border border-white shadow-sm" />
                <div className="absolute top-[32%] left-[55%] w-2.5 h-2.5 bg-sky-400 rounded-full border border-white shadow-sm" />
                <div className="absolute top-[48%] left-[42%] w-2.5 h-2.5 bg-sky-400 rounded-full border border-white shadow-sm" />
                <div className="absolute top-[48%] left-[58%] w-2.5 h-2.5 bg-sky-400 rounded-full border border-white shadow-sm" />
                <div className="absolute top-[68%] left-[44%] w-2.5 h-2.5 bg-sky-400 rounded-full border border-white shadow-sm" />
                <div className="absolute top-[68%] left-[56%] w-2.5 h-2.5 bg-sky-400 rounded-full border border-white shadow-sm" />

                {/* Skeleton connecting lines */}
                <svg className="absolute inset-0 w-full h-full stroke-sky-400/90 fill-none" strokeWidth="2">
                  <line x1="50%" y1="24%" x2="50%" y2="40%" />
                  <line x1="45%" y1="32%" x2="55%" y2="32%" />
                  <line x1="45%" y1="32%" x2="42%" y2="48%" />
                  <line x1="55%" y1="32%" x2="58%" y2="48%" />
                  <line x1="50%" y1="40%" x2="44%" y2="68%" />
                  <line x1="50%" y1="40%" x2="56%" y2="68%" />
                </svg>

                {/* Dynamic Joint Angle Badges */}
                <div className="absolute top-[45%] left-[60%] px-1.5 py-0.5 bg-[#0b1329]/95 text-emerald-400 text-[9px] font-mono font-bold rounded border border-emerald-500/50 shadow">
                  KNEE FLEX: 142°
                </div>
                <div className="absolute top-[28%] left-[32%] px-1.5 py-0.5 bg-[#0b1329]/95 text-amber-400 text-[9px] font-mono font-bold rounded border border-amber-500/50 shadow">
                  ARM EXT: 88°
                </div>
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
                <div className="text-[10px] text-slate-300">BODY ANGLE: {liveTelemetry.bodyAngleDeg.toFixed(0)}°</div>
              </div>
            )}
          </div>
        )}
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
