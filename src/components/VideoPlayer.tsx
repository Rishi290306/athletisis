'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, AlertTriangle, CheckCircle, Info, RotateCcw, X, Eye, Video, Settings, Sliders, Repeat, SkipBack, SkipForward, Layers, Gauge } from 'lucide-react';
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
}

export type CvTheme = 'CYBER_CYAN' | 'MATRIX_EMERALD' | 'HIGH_VIS_AMBER' | 'TACTICAL_MINIMAL';
export type SpeedUnit = 'KMH' | 'MPH';

export function VideoPlayer({ videoUrl, clips = [], onThresholdChange, sport, matchId, fileName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const fallbackVideo = '/sample-match.mp4';
  const [videoSrc, setVideoSrc] = useState<string>(videoUrl || fallbackVideo);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [modalClip, setModalClip] = useState<VideoClip | null>(null);
  const [hasError, setHasError] = useState(false);

  // Playback Controls State
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isLoopingMoment, setIsLoopingMoment] = useState<boolean>(false);
  const [snippetDuration, setSnippetDuration] = useState<number>(3.5);
  const [minConfidence, setMinConfidence] = useState<number>(70);

  // CV Settings & Style State
  const [cvOverlayEnabled, setCvOverlayEnabled] = useState(true);
  const [cvTheme, setCvTheme] = useState<CvTheme>('CYBER_CYAN');
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showVectorRay, setShowVectorRay] = useState(true);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('KMH');

  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  useEffect(() => {
    if (videoUrl) {
      setVideoSrc(videoUrl);
      setHasError(false);
    }
  }, [videoUrl]);

  const handleVideoError = () => {
    if (!hasError) {
      console.warn('Primary video source failed to load, falling back to sample video.');
      setHasError(true);
      setVideoSrc(fallbackVideo);
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    if (modalVideoRef.current) {
      modalVideoRef.current.playbackRate = rate;
    }
  };

  const stepFrame = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + seconds);
    }
  };

  const jumpToClip = (clip: VideoClip) => {
    setSelectedClip(clip);
    if (videoRef.current) {
      try {
        const vid = videoRef.current;
        const dur = vid.duration && !isNaN(vid.duration) ? vid.duration : 15;
        const targetTime = clip.startTimestampSeconds >= dur ? (clip.startTimestampSeconds % dur) : clip.startTimestampSeconds;
        vid.currentTime = targetTime;
        vid.playbackRate = playbackRate;
        vid.play().catch((err) => console.log('Autoplay deferred:', err));
        setIsPlaying(true);
        vid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {
        console.error('Seek error:', e);
      }
    }
  };

  const openClipModal = (e: React.MouseEvent, clip: VideoClip) => {
    e.stopPropagation();
    setSelectedClip(clip);
    setModalClip(clip);
  };

  const closeClipModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setModalClip(null);
  };

  // Unit conversion helper
  const formatSpeed = (speedKmh: number) => {
    if (speedUnit === 'MPH') {
      return `${(speedKmh * 0.621371).toFixed(1)} mph`;
    }
    return `${speedKmh.toFixed(1)} km/h`;
  };

  // CV Theme styling classes
  const getThemeClasses = () => {
    switch (cvTheme) {
      case 'MATRIX_EMERALD':
        return {
          boxBorder: 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
          badgeBg: 'bg-black/90 text-emerald-300 border-emerald-500/50',
          rayGradient: 'from-emerald-400 via-teal-300 to-transparent shadow-[0_0_12px_#10b981]',
          telemetryBorder: 'border-emerald-500/40 text-emerald-300',
          skeletonColor: 'border-emerald-400 bg-emerald-400',
        };
      case 'HIGH_VIS_AMBER':
        return {
          boxBorder: 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
          badgeBg: 'bg-black/90 text-amber-300 border-amber-500/50',
          rayGradient: 'from-amber-400 via-orange-400 to-transparent shadow-[0_0_12px_#f59e0b]',
          telemetryBorder: 'border-amber-500/40 text-amber-300',
          skeletonColor: 'border-amber-400 bg-amber-400',
        };
      case 'TACTICAL_MINIMAL':
        return {
          boxBorder: 'border-slate-300 bg-slate-100/10 shadow-lg',
          badgeBg: 'bg-slate-900 text-white border-slate-700',
          rayGradient: 'from-white via-slate-300 to-transparent shadow-md',
          telemetryBorder: 'border-slate-700 text-slate-200',
          skeletonColor: 'border-white bg-white',
        };
      case 'CYBER_CYAN':
      default:
        return {
          boxBorder: 'border-brand-400 bg-brand-500/10 shadow-[0_0_20px_rgba(255,199,0,0.4)]',
          badgeBg: 'bg-black/90 text-cyan-300 border-cyan-500/50',
          rayGradient: 'from-brand-400 via-cyan-400 to-transparent shadow-[0_0_12px_#00f0ff]',
          telemetryBorder: 'border-cyan-500/40 text-cyan-300',
          skeletonColor: 'border-cyan-400 bg-cyan-400',
        };
    }
  };

  const themeStyle = getThemeClasses();

  // Filter clips based on minConfidence
  const filteredClips = clips.filter(c => ((c as any).confidence ? (c as any).confidence * 100 : 85) >= minConfidence);

  // Real-time CV Frame Telemetry computation
  const [currentCvTime, setCurrentCvTime] = useState<number>(0);
  const activeSport: SportType = sport || (selectedClip as any)?.sport || 'Cricket';
  const videoSig = `${fileName || ''}_${matchId || ''}_${videoSrc}`;
  const liveTelemetry = computeFrameTelemetry(currentCvTime, activeSport, selectedClip?.id, videoSig);

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Match Video Footage & AI CV Tracking
          </h3>
          <p className="text-xs text-slate-400">Interactive clip moments with dynamic CV keypoint telemetry & playback speed</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCvOverlayEnabled(!cvOverlayEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border ${
              cvOverlayEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            CV HUD: {cvOverlayEnabled ? 'ACTIVE' : 'OFF'}
          </button>

          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border ${
              showSettingsDrawer
                ? 'bg-brand-500 text-black border-brand-400 shadow-[0_0_15px_rgba(255,199,0,0.4)]'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            CV & Threshold Tuning
          </button>
        </div>
      </div>

      {/* CV & THRESHOLD FINE-TUNING DRAWER */}
      {showSettingsDrawer && (
        <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-black text-brand-400 uppercase tracking-wider">
              <Sliders className="w-4 h-4" /> CV Visual Theme & Moment Threshold Control Panel
            </div>
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              Close Panel ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* CV HUD Theme Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block uppercase">CV HUD Visual Preset</label>
              <select
                value={cvTheme}
                onChange={(e) => setCvTheme(e.target.value as CvTheme)}
                className="w-full px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-700 text-white font-semibold text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="CYBER_CYAN">🩵 Neon Cyber Cyan (Default)</option>
                <option value="MATRIX_EMERALD">💚 Matrix Emerald</option>
                <option value="HIGH_VIS_AMBER">🧡 High-Vis Amber</option>
                <option value="TACTICAL_MINIMAL">🤍 Tactical Minimal</option>
              </select>
            </div>

            {/* Velocity Speed Unit Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block uppercase">Telemetry Speed Unit</label>
              <div className="flex rounded-lg bg-dark-900 border border-slate-700 p-0.5">
                <button
                  type="button"
                  onClick={() => setSpeedUnit('KMH')}
                  className={`flex-1 py-1 text-center font-bold rounded text-xs transition ${
                    speedUnit === 'KMH' ? 'bg-brand-500 text-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  km/h (Metric)
                </button>
                <button
                  type="button"
                  onClick={() => setSpeedUnit('MPH')}
                  className={`flex-1 py-1 text-center font-bold rounded text-xs transition ${
                    speedUnit === 'MPH' ? 'bg-brand-500 text-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  mph (Imperial)
                </button>
              </div>
            </div>

            {/* Confidence Threshold Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-[11px]">
                <span className="text-slate-300 uppercase">Min Detection Confidence</span>
                <span className="text-brand-400 font-mono">{minConfidence}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="98"
                value={minConfidence}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMinConfidence(val);
                  if (onThresholdChange) onThresholdChange(val, snippetDuration);
                }}
                className="w-full accent-brand-500 cursor-pointer"
              />
            </div>

            {/* Snippet Moment Duration Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-[11px]">
                <span className="text-slate-300 uppercase">Snippet Duration Clamp</span>
                <span className="text-cyan-400 font-mono">{snippetDuration.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.5"
                value={snippetDuration}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSnippetDuration(val);
                  if (onThresholdChange) onThresholdChange(minConfidence, val);
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Overlay Elements Toggles */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 block uppercase">CV Visual Elements</label>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowSkeleton(!showSkeleton)}
                  className={`px-2.5 py-1 rounded-md border font-extrabold transition ${
                    showSkeleton ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Skeleton Wireframe
                </button>

                <button
                  type="button"
                  onClick={() => setShowVectorRay(!showVectorRay)}
                  className={`px-2.5 py-1 rounded-md border font-extrabold transition ${
                    showVectorRay ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Ball Vector Ray
                </button>

                <button
                  type="button"
                  onClick={() => setShowBoundingBox(!showBoundingBox)}
                  className={`px-2.5 py-1 rounded-md border font-extrabold transition ${
                    showBoundingBox ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Bounding Box
                </button>

                <button
                  type="button"
                  onClick={() => setShowTelemetry(!showTelemetry)}
                  className={`px-2.5 py-1 rounded-md border font-extrabold transition ${
                    showTelemetry ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Telemetry Box
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Container */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 group shadow-2xl">
        <video
          ref={videoRef}
          src={videoSrc}
          controls
          onError={handleVideoError}
          className="w-full h-full object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={(e) => {
            const vid = e.target as HTMLVideoElement;
            setCurrentCvTime(vid.currentTime);
            if (isLoopingMoment && selectedClip) {
              const dur = vid.duration && !isNaN(vid.duration) ? vid.duration : 15;
              const start = selectedClip.startTimestampSeconds >= dur ? (selectedClip.startTimestampSeconds % dur) : selectedClip.startTimestampSeconds;
              const maxEnd = start + snippetDuration;
              if (vid.currentTime >= maxEnd || vid.currentTime < start) {
                vid.currentTime = start;
                vid.play().catch(() => {});
              }
            }
          }}
        />

        {/* AI COMPUTER VISION OVERLAY HUD */}
        {cvOverlayEnabled && isPlaying && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Dynamic Player Tracking Bounding Box */}
            {showBoundingBox && (
              <div
                className={`absolute border-2 rounded-lg transition-all duration-75 flex flex-col justify-between p-1.5 ${themeStyle.boxBorder}`}
                style={{
                  left: `${liveTelemetry.boundingBox.left}%`,
                  top: `${liveTelemetry.boundingBox.top}%`,
                  width: `${liveTelemetry.boundingBox.width}%`,
                  height: `${liveTelemetry.boundingBox.height}%`,
                }}
              >
                <div className={`flex items-center justify-between text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow ${themeStyle.badgeBg}`}>
                  <span>TRACKED PLAYER</span>
                  <span>{formatSpeed(liveTelemetry.velocityKmh)}</span>
                </div>

                <div className="text-[8px] font-mono text-white bg-black/85 px-1 py-0.5 rounded border border-slate-700">
                  {liveTelemetry.pitchZone}
                </div>
              </div>
            )}

            {/* Dynamic Pose Skeleton SVG Wireframe Overlay */}
            {showSkeleton && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Connections */}
                {liveTelemetry.skeletonConnections.map(([kp1, kp2], idx) => {
                  const p1 = liveTelemetry.keypoints.find((k) => k.id === kp1);
                  const p2 = liveTelemetry.keypoints.find((k) => k.id === kp2);
                  if (!p1 || !p2) return null;
                  return (
                    <line
                      key={idx}
                      x1={`${p1.x}%`}
                      y1={`${p1.y}%`}
                      x2={`${p2.x}%`}
                      y2={`${p2.y}%`}
                      stroke="cyan"
                      strokeWidth="2"
                      strokeOpacity="0.8"
                    />
                  );
                })}

                {/* Keypoint Joint Nodes */}
                {liveTelemetry.keypoints.map((kp) => (
                  <circle
                    key={kp.id}
                    cx={`${kp.x}%`}
                    cy={`${kp.y}%`}
                    r="3.5"
                    fill="#00f0ff"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
            )}

            {/* Dynamic Ball Trajectory Ray */}
            {showVectorRay && (
              <div
                className={`absolute h-0.5 bg-gradient-to-r ${themeStyle.rayGradient} rotate-12 transition-all`}
                style={{
                  left: `${liveTelemetry.boundingBox.left + 5}%`,
                  top: `${liveTelemetry.boundingBox.top + 10}%`,
                  width: '35%',
                }}
              ></div>
            )}

            {/* Live Synchronized Telemetry Box */}
            {showTelemetry && (
              <div className={`absolute bottom-16 right-4 bg-black/90 backdrop-blur-md border px-3.5 py-2 rounded-xl text-[10px] font-mono space-y-1 shadow-2xl ${themeStyle.telemetryBorder}`}>
                <div className="flex justify-between gap-4"><span>ACTION PHASE</span><span className="text-brand-300 font-bold">{liveTelemetry.actionPhase}</span></div>
                <div className="flex justify-between gap-4"><span>VELOCITY</span><span className="text-brand-400 font-bold">{formatSpeed(liveTelemetry.velocityKmh)}</span></div>
                <div className="flex justify-between gap-4"><span>CONFIDENCE</span><span className="text-emerald-400 font-bold">{liveTelemetry.trackingConfidence}%</span></div>
                <div className="flex justify-between gap-4"><span>BODY ANGLE</span><span className="text-cyan-300 font-bold">{liveTelemetry.bodyAngleDeg}° Tilt</span></div>
              </div>
            )}
          </div>
        )}

        {/* Selected Clip Badge Overlay */}
        {selectedClip && (
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-brand-500/50 text-brand-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Active Moment: <strong>{selectedClip.title}</strong> ({selectedClip.formattedTimestamp})</span>
          </div>
        )}
      </div>

      {/* ADVANCED VIDEO PLAYBACK CONTROLS BAR */}
      <div className="p-3 rounded-xl bg-dark-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Step frame & Play rate */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => stepFrame(-0.1)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition text-[11px]"
            title="Step Back 0.1s"
          >
            <SkipBack className="w-3.5 h-3.5" /> -0.1s
          </button>

          <button
            onClick={() => stepFrame(0.1)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition text-[11px]"
            title="Step Forward 0.1s"
          >
            <SkipForward className="w-3.5 h-3.5" /> +0.1s
          </button>

          {/* Loop Moment Toggle */}
          <button
            onClick={() => setIsLoopingMoment(!isLoopingMoment)}
            className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition text-[11px] border ${
              isLoopingMoment
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            Loop Moment: {isLoopingMoment ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Speed Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-dark-900 p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 px-1 uppercase flex items-center gap-1">
            <Gauge className="w-3 h-3 text-brand-400" /> Speed:
          </span>
          {[0.5, 1.0, 1.25, 1.5, 2.0].map((rate) => (
            <button
              key={rate}
              onClick={() => changePlaybackRate(rate)}
              className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] transition ${
                playbackRate === rate
                  ? 'bg-brand-500 text-black shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Tactical Decision Analysis Overlay Card */}
      {selectedClip?.decisionAnalysis && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-slate-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
            <Info className="w-4 h-4" />
            "What Should I Have Done?" — Tactical Decision Analysis
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedClip.decisionAnalysis}
          </p>
        </div>
      )}

      {/* Detected Moments & Mistake Clips Selector Grid */}
      {filteredClips.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Video className="w-4 h-4 text-brand-400" />
              Detected Match Moments & Clips ({filteredClips.length})
            </h4>
            <span className="text-[11px] text-slate-400">Click card to play moment</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredClips.map((clip) => {
              const isMistake = clip.clipType === 'MISTAKE';
              const isSelected = selectedClip?.id === clip.id;
              return (
                <div
                  key={clip.id}
                  onClick={() => jumpToClip(clip)}
                  className={`p-3.5 rounded-xl border text-left transition duration-200 cursor-pointer relative group flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-brand-500/20 border-brand-500 shadow-[0_0_20px_rgba(255,199,0,0.3)]'
                      : isMistake
                      ? 'bg-red-500/5 hover:bg-red-500/10 border-red-500/20 text-slate-300'
                      : 'bg-dark-950/90 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isMistake ? (
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors">
                          {clip.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                        {clip.formattedTimestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {clip.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                    <span className="text-brand-400 font-extrabold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <Play className="w-3 h-3 fill-brand-400" /> Play Moment
                    </span>

                    <button
                      onClick={(e) => openClipModal(e, clip)}
                      className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-brand-500 hover:text-black text-[10px] font-bold text-slate-300 transition flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Preview Clip
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* POP-OUT INSTANT CLIP VISUALIZER MODAL */}
      {modalClip && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-2xl w-full bg-dark-900 border border-brand-500/40 rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-brand-400" />
                <h3 className="text-base font-black text-white">{modalClip.title}</h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  {modalClip.formattedTimestamp}
                </span>
              </div>
              <button
                onClick={closeClipModal}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-500/20 hover:text-red-300 text-slate-400 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Video Player */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 group">
              <video
                ref={modalVideoRef}
                src={videoSrc}
                autoPlay
                controls
                onError={handleVideoError}
                className="w-full h-full object-contain"
                onLoadedData={(e) => {
                  const vid = e.target as HTMLVideoElement;
                  const dur = vid.duration && !isNaN(vid.duration) ? vid.duration : 15;
                  const start = modalClip.startTimestampSeconds >= dur ? (modalClip.startTimestampSeconds % dur) : modalClip.startTimestampSeconds;
                  vid.currentTime = start;
                  vid.playbackRate = playbackRate;
                  vid.play().catch(() => {});
                }}
                onTimeUpdate={(e) => {
                  const vid = e.target as HTMLVideoElement;
                  const dur = vid.duration && !isNaN(vid.duration) ? vid.duration : 15;
                  const start = modalClip.startTimestampSeconds >= dur ? (modalClip.startTimestampSeconds % dur) : modalClip.startTimestampSeconds;
                  const maxEnd = start + snippetDuration;
                  if (vid.currentTime >= maxEnd) {
                    vid.pause();
                  }
                }}
              />

              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-brand-500/50 text-brand-300 px-3 py-1 rounded-xl text-xs font-mono font-bold">
                🎯 {snippetDuration.toFixed(1)}s Snippet ({modalClip.formattedTimestamp})
              </div>
            </div>

            {/* Modal Guidance Analysis */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
              <span className="font-extrabold text-amber-400 block uppercase tracking-wider">
                Clip Analysis & Tactical Recommendation
              </span>
              <p className="text-slate-300 leading-relaxed">{modalClip.description}</p>
              {modalClip.decisionAnalysis && (
                <p className="text-slate-300 font-semibold pt-1 border-t border-slate-800/80 mt-1">
                  💡 {modalClip.decisionAnalysis}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


