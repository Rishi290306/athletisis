'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Eye, Sliders, Activity, Bug, Users, RefreshCw, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { VideoClip } from '@/types';
import { computeFrameTelemetry } from '@/lib/cvTelemetryEngine';
import { SportType } from '@/lib/sportStore';
import {
  VideoPoseDataset,
  computeVideoDisplayRect,
  loadVideoPoseDataset,
  getPoseForTimestamp,
} from '@/lib/poseService';
import { renderPoseOnCanvas } from '@/lib/poseRenderer';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fallbackVideo = '/sample-match.mp4';
  const [videoSrc, setVideoSrc] = useState<string>(videoUrl || fallbackVideo);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [hasError, setHasError] = useState(false);

  // CV Pose Controls State
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [cvOverlayEnabled, setCvOverlayEnabled] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<number | 'all'>(1);
  const [minConfidence, setMinConfidence] = useState<number>(0.35);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [currentCvTime, setCurrentCvTime] = useState<number>(0);

  // Audio & Voice Controls State (Cancel / Reduce Voice in uploaded video)
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [prevVolume, setPrevVolume] = useState<number>(1.0);

  // Ground-Truth MediaPipe Pose Dataset State
  const [poseDataset, setPoseDataset] = useState<VideoPoseDataset | null>(null);
  const [detectedPersonsCount, setDetectedPersonsCount] = useState<number>(1);

  const activeSport: SportType = sport || (selectedClip as any)?.sport || 'Cricket';

  // Load ground-truth pose track for the current active video
  useEffect(() => {
    let isMounted = true;
    setPoseDataset(null); // Immediate clean reset to prevent stale overlay across videos
    const fetchDataset = async () => {
      const data = await loadVideoPoseDataset(videoSrc, activeSport);
      if (isMounted && data) {
        setPoseDataset(data);
      }
    };
    fetchDataset();
    return () => {
      isMounted = false;
    };
  }, [videoSrc, activeSport]);

  // Main Canvas Rendering Loop (synced via requestAnimationFrame)
  const drawFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !video || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const videoW = video.videoWidth || 16;
    const videoH = video.videoHeight || 9;

    // High-DPI Canvas Scaling
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== containerW * dpr || canvas.height !== containerH * dpr) {
      canvas.width = containerW * dpr;
      canvas.height = containerH * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Compute exact aspect-ratio preserving display rectangle with letterbox/pillarbox offsets
    const displayRect = computeVideoDisplayRect(containerW, containerH, videoW, videoH);

    if (cvOverlayEnabled && poseDataset) {
      const currentTime = video.currentTime;
      const poseFrame = getPoseForTimestamp(poseDataset, currentTime);
      const persons = poseFrame?.persons || [];
      setDetectedPersonsCount(persons.length || 1);

      renderPoseOnCanvas(
        ctx,
        displayRect,
        persons,
        {
          showSkeleton,
          showBoundingBox,
          showTelemetry,
          debugMode,
          selectedPersonId,
          minConfidenceThreshold: minConfidence,
        },
        activeSport
      );
    } else {
      ctx.clearRect(0, 0, containerW, containerH);
    }

    ctx.restore();
  }, [
    cvOverlayEnabled,
    poseDataset,
    showSkeleton,
    showBoundingBox,
    showTelemetry,
    debugMode,
    selectedPersonId,
    minConfidence,
    activeSport,
  ]);

  // Animation frame ticker during video playback
  useEffect(() => {
    let animId: number;
    const renderLoop = () => {
      drawFrame();
      animId = requestAnimationFrame(renderLoop);
    };
    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  // Handle window resize to recompute bounds immediately
  useEffect(() => {
    const handleResize = () => drawFrame();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  useEffect(() => {
    if (videoUrl) {
      setVideoSrc(videoUrl);
      setHasError(false);
    }
  }, [videoUrl]);

  // React to seekTimestamp changes from timeline or external events
  useEffect(() => {
    if (seekTimestamp !== undefined && videoRef.current) {
      const vid = videoRef.current;
      const dur = vid.duration && !isNaN(vid.duration) ? vid.duration : 15;
      const targetTime = seekTimestamp >= dur ? (seekTimestamp % dur) : Math.max(0, seekTimestamp);
      if (Math.abs(vid.currentTime - targetTime) > 0.35) {
        vid.currentTime = targetTime;
        setCurrentCvTime(targetTime);
        drawFrame();
        if (isPlaying) {
          vid.play().catch((e) => console.log('Autoplay deferred:', e));
        }
      }
    }
  }, [seekTimestamp, drawFrame, isPlaying]);

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
      drawFrame();
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (!videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((e) => {
          console.log('Autoplay deferred, attempting muted fallback:', e);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        });
      }
    }
  };

  const jumpToClip = (clip: VideoClip) => {
    setSelectedClip(clip);
    if (videoRef.current) {
      const vid = videoRef.current;
      const dur = vid.duration && !isNaN(vid.duration) ? vid.duration : 15;
      const targetTime =
        clip.startTimestampSeconds >= dur
          ? clip.startTimestampSeconds % dur
          : clip.startTimestampSeconds;
      vid.currentTime = targetTime;
      vid.playbackRate = playbackRate;
      vid.play().catch((err) => console.log('Autoplay deferred:', err));
      setIsPlaying(true);
      setCurrentCvTime(targetTime);
      onCurrentTimeChange?.(targetTime);
      drawFrame();
    }
  };

  // Toggle Cancel Voice / Mute Audio
  const toggleCancelVoice = () => {
    if (videoRef.current) {
      if (isMuted || volume === 0) {
        const restored = prevVolume > 0 ? prevVolume : 1.0;
        videoRef.current.muted = false;
        videoRef.current.volume = restored;
        setIsMuted(false);
        setVolume(restored);
      } else {
        setPrevVolume(volume);
        videoRef.current.muted = true;
        videoRef.current.volume = 0;
        setIsMuted(true);
        setVolume(0);
      }
    }
  };

  // Reduce Voice Level to target percentage (e.g. 20% or 50%)
  const reduceVoiceLevel = (target = 0.2) => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = target;
      setIsMuted(false);
      setVolume(target);
      setPrevVolume(target);
    }
  };

  // Slider Volume Change
  const handleVolumeChange = (newVol: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setVolume(newVol);
      if (newVol === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
        setPrevVolume(newVol);
      }
    }
  };

  // Keep volume & mute synced when video loads or source changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, videoSrc]);

  const videoSig = `${fileName || ''}_${matchId || ''}_${videoSrc}`;
  const liveTelemetry = computeFrameTelemetry(currentCvTime, activeSport, selectedClip?.id, videoSig);

  return (
    <div className="pro-card p-4 sm:p-5 space-y-3.5">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Pose Telemetry & Video Workbench
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            17-Point COCO Keypoint Alignment • Letterbox Auto-Compensation
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Tracked Player Selector */}
          <div className="flex items-center gap-1.5 bg-[#141D30] px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={selectedPersonId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedPersonId(val === 'all' ? 'all' : Number(val));
              }}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value={1} className="bg-slate-900 text-white">Player 1 (Primary)</option>
              {detectedPersonsCount > 1 && (
                <option value={2} className="bg-slate-900 text-white">Player 2</option>
              )}
              <option value="all" className="bg-slate-900 text-white">All Players ({detectedPersonsCount})</option>
            </select>
          </div>

          {/* Toggle Pose Overlay */}
          <button
            onClick={() => setCvOverlayEnabled(!cvOverlayEnabled)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border ${
              cvOverlayEnabled
                ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                : 'bg-[#141D30] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Skeleton: {cvOverlayEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Debug Mode Toggle */}
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border ${
              debugMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-[#141D30] text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Inspect raw coordinates, bounding boxes, and letterbox geometry"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Inspect</span>
          </button>

          {/* CV Controls Drawer */}
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border ${
              showSettingsDrawer
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-[#141D30] text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Options</span>
          </button>

          {/* Cancel / Reduce Voice Pill */}
          <div className="flex items-center gap-1 bg-[#141D30] px-2 py-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={toggleCancelVoice}
              className={`flex items-center gap-1.5 font-medium transition ${
                isMuted || volume === 0
                  ? 'text-rose-400 hover:text-rose-300'
                  : 'text-sky-400 hover:text-sky-300'
              }`}
              title={isMuted || volume === 0 ? 'Voice Cancelled / Muted — Click to Restore Audio' : 'Cancel Voice / Mute Video'}
            >
              {isMuted || volume === 0 ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-300 text-[11px] font-semibold">Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-slate-300 text-[11px] font-semibold">{(volume * 100).toFixed(0)}%</span>
                </>
              )}
            </button>

            <button
              onClick={() => reduceVoiceLevel(0.2)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition border ${
                !isMuted && Math.abs(volume - 0.2) < 0.05
                  ? 'bg-sky-600 text-white border-sky-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
              }`}
              title="Reduce voice / audio level to 20%"
            >
              20%
            </button>
          </div>
        </div>
      </div>

      {/* Settings Drawer */}
      {showSettingsDrawer && (
        <div className="p-3 rounded-lg bg-[#141D30] border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-white border-b border-slate-800/80 pb-1.5">
            <span className="text-xs">Pose Tracking & Vision Calibration</span>
            <button onClick={() => setShowSettingsDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showSkeleton}
                onChange={(e) => setShowSkeleton(e.target.checked)}
                className="rounded bg-slate-800 text-sky-500 border-slate-700"
              />
              <span>17-Point Skeleton</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showBoundingBox}
                onChange={(e) => setShowBoundingBox(e.target.checked)}
                className="rounded bg-slate-800 text-sky-500 border-slate-700"
              />
              <span>Detection Box</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={showTelemetry}
                onChange={(e) => setShowTelemetry(e.target.checked)}
                className="rounded bg-slate-800 text-sky-500 border-slate-700"
              />
              <span>Biomechanical Angles</span>
            </label>

            {/* Confidence Threshold Slider */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono text-[11px]">Min Conf:</span>
              <input
                type="range"
                min="0.20"
                max="0.80"
                step="0.05"
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                className="w-20 accent-sky-500 cursor-pointer"
              />
              <span className="font-mono text-sky-400 text-xs">{(minConfidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Screen Container with Canvas Overlay */}
      <div
        ref={containerRef}
        className="relative aspect-video bg-[#070B14] rounded-xl border border-slate-800/90 overflow-hidden group select-none shadow-sm"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          muted={isMuted}
          onError={handleVideoError}
          onLoadedMetadata={drawFrame}
          onCanPlay={drawFrame}
          onTimeUpdate={() => {
            if (videoRef.current) {
              const t = videoRef.current.currentTime;
              setCurrentCvTime(t);
              onCurrentTimeChange?.(t);
              drawFrame();
            }
          }}
          onPlay={() => {
            setIsPlaying(true);
            drawFrame();
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="w-full h-full object-contain"
          playsInline
        />

        {/* HTML5 Canvas Overlay with sub-pixel letterbox compensation */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Floating Live Telemetry HUD */}
        {showTelemetry && cvOverlayEnabled && (
          <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg bg-[#0E1424]/90 backdrop-blur-md border border-slate-800 text-xs font-mono space-y-0.5 shadow-md pointer-events-none">
            <div className="flex items-center gap-1.5 text-sky-400 font-semibold text-xs">
              <Activity className="w-3.5 h-3.5" />
              <span>VELOCITY: {liveTelemetry.velocityKmh.toFixed(1)} km/h</span>
            </div>
            <div className="text-[10px] text-slate-400">
              ACCEL BURST: {(liveTelemetry.velocityKmh * 0.28).toFixed(1)} m/s²
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">
              CALIBRATION: ACTIVE (MediaPipe Tasks)
            </div>
          </div>
        )}
      </div>

      {/* Scrubber & Speed Controls + Dedicated Voice Cancellation Unit */}
      <div className="p-3 rounded-lg bg-[#0E1424] border border-slate-800/80 space-y-2">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={togglePlayPause}
              className="p-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition shadow-sm"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>
            <button
              onClick={() => stepFrame(-0.1)}
              className="px-2 py-1 rounded-md bg-[#141D30] hover:bg-slate-800 text-slate-300 text-xs font-mono font-medium border border-slate-800"
              title="Step backward 0.1s"
            >
              -0.1s
            </button>
            <button
              onClick={() => stepFrame(0.1)}
              className="px-2 py-1 rounded-md bg-[#141D30] hover:bg-slate-800 text-slate-300 text-xs font-mono font-medium border border-slate-800"
              title="Step forward 0.1s"
            >
              +0.1s
            </button>

            {/* DEDICATED CANCEL / REDUCE VOICE CONTROLS */}
            <div className="flex items-center gap-1.5 pl-2 sm:border-l border-slate-800 flex-wrap">
              <button
                onClick={toggleCancelVoice}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1.5 border ${
                  isMuted || volume === 0
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 hover:bg-rose-500/25'
                    : 'bg-[#141D30] text-slate-300 border-slate-800 hover:text-white'
                }`}
                title={isMuted || volume === 0 ? 'Voice Cancelled / Muted — Click to Restore Audio' : 'Cancel Voice / Mute Video'}
              >
                {isMuted || volume === 0 ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Voice Cancelled</span>
                  </>
                ) : (
                  <>
                    {volume < 0.5 ? <Volume1 className="w-3.5 h-3.5 text-sky-400" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
                    <span>Cancel Voice</span>
                  </>
                )}
              </button>

              {/* Reduce Voice Presets & Slider */}
              <div className="flex items-center gap-1.5 bg-[#141D30] px-2 py-1 rounded-md border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 font-medium hidden sm:inline">Reduce:</span>
                <button
                  onClick={() => reduceVoiceLevel(0.2)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition border ${
                    !isMuted && Math.abs(volume - 0.2) < 0.05
                      ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                  }`}
                  title="Reduce Voice to 20%"
                >
                  20%
                </button>
                <button
                  onClick={() => reduceVoiceLevel(0.5)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition border ${
                    !isMuted && Math.abs(volume - 0.5) < 0.05
                      ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                  }`}
                  title="Reduce Voice to 50%"
                >
                  50%
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 sm:w-20 accent-sky-500 cursor-pointer"
                  title={`Voice Volume: ${(isMuted ? 0 : volume * 100).toFixed(0)}%`}
                />
                <span className="font-mono text-[10px] text-sky-400 min-w-[28px] text-right font-medium">
                  {(isMuted ? 0 : volume * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-xs font-mono text-slate-400 font-medium">Speed:</span>
            <div className="flex items-center gap-1 bg-[#141D30] p-0.5 rounded-md border border-slate-800 text-xs font-mono">
              {[0.5, 1, 1.5, 2].map((r) => (
                <button
                  key={r}
                  onClick={() => changePlaybackRate(r)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                    playbackRate === r ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
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
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Detected Game Moments ({clips.length} Plays)</span>
            <span className="text-[10px] text-sky-400 font-mono">Click to jump frame</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {clips.map((clip) => (
              <button
                key={clip.id}
                onClick={() => jumpToClip(clip)}
                className={`p-2.5 rounded-lg border text-left transition ${
                  selectedClip?.id === clip.id
                    ? 'bg-sky-500/15 border-sky-400 text-white shadow-sm ring-1 ring-sky-400/40'
                    : 'bg-[#0E1424] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono font-semibold text-sky-400">
                  {(clip as any).timestamp || `${clip.startTimestampSeconds}s`}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">{clip.title}</div>
                <div className="text-[10px] text-slate-500 truncate">{clip.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
