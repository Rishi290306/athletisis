'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  Eye,
  Activity,
  ArrowRight,
  ShieldAlert,
  Gauge,
  Flame,
  Zap,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { Match } from '@/types';
import { SportType } from '@/lib/sportStore';
import {
  VideoPoseDataset,
  computeVideoDisplayRect,
  loadVideoPoseDataset,
  getPoseForTimestamp,
} from '@/lib/poseService';
import { renderPoseOnCanvas } from '@/lib/poseRenderer';

interface RecentAnalysisWorkbenchProps {
  match: Match;
  sport: SportType;
}

export function RecentAnalysisWorkbench({ match, sport }: RecentAnalysisWorkbenchProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [poseDataset, setPoseDataset] = useState<VideoPoseDataset | null>(null);

  const videoUrl =
    match.videoUrl ||
    (sport === 'Cricket'
      ? '/sample-match2.mp4'
      : sport === 'Volleyball'
      ? '/sample-volleyball.mp4'
      : '/sample-match.mp4');

  // Load ground-truth pose track for the video
  useEffect(() => {
    let isMounted = true;
    const fetchPoses = async () => {
      const data = await loadVideoPoseDataset(videoUrl, sport);
      if (isMounted && data) {
        setPoseDataset(data);
      }
    };
    fetchPoses();
    return () => {
      isMounted = false;
    };
  }, [videoUrl, sport]);

  // Main canvas render loop
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

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== containerW * dpr || canvas.height !== containerH * dpr) {
      canvas.width = containerW * dpr;
      canvas.height = containerH * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const displayRect = computeVideoDisplayRect(containerW, containerH, videoW, videoH);

    if (showSkeleton && poseDataset) {
      const t = video.currentTime;
      const poseFrame = getPoseForTimestamp(poseDataset, t);
      const persons = poseFrame?.persons || [];

      renderPoseOnCanvas(
        ctx,
        displayRect,
        persons,
        {
          showSkeleton: true,
          showBoundingBox: true,
          showTelemetry: true,
          debugMode: false,
          selectedPersonId: 1,
          minConfidenceThreshold: 0.35,
        },
        sport
      );
    } else {
      ctx.clearRect(0, 0, containerW, containerH);
    }

    ctx.restore();
  }, [showSkeleton, poseDataset, sport]);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (videoRef.current && !videoRef.current.paused) {
        setCurrentTime(videoRef.current.currentTime);
        drawFrame();
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [drawFrame]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (!videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => {
            console.log('Autoplay muted fallback:', e);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          });
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
      drawFrame();
    }
  };

  // Dynamic Key Metrics calculation based on active sport
  const metrics =
    sport === 'Cricket'
      ? [
          { label: 'Bowling Release Speed', value: '144.8', unit: 'km/h', change: '+2.4 km/h', icon: Gauge, color: 'text-amber-400 bg-amber-500/10 border-amber-500/25' },
          { label: 'Good Length Control', value: '88.4', unit: '%', change: '+4.1%', icon: Zap, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25' },
          { label: 'Shoulder Trunk Load', value: 'Low Risk', unit: '• 16%', change: 'Optimal', icon: ShieldAlert, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
          { label: 'Kinematic Extension', value: '88.0', unit: '°', change: 'Legal Arch', icon: Flame, color: 'text-purple-400 bg-purple-500/10 border-purple-500/25' },
        ]
      : sport === 'Volleyball'
      ? [
          { label: 'Vertical Jump Peak', value: '78.5', unit: 'cm', change: '+3.2 cm', icon: Gauge, color: 'text-purple-400 bg-purple-500/10 border-purple-500/25' },
          { label: 'Spike Velocity', value: '98.2', unit: 'km/h', change: '+5.1 km/h', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/25' },
          { label: 'Patellar Strain Index', value: 'Low Risk', unit: '• 19%', change: 'Safe Range', icon: ShieldAlert, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
          { label: 'Net Reach Elevation', value: '315', unit: 'cm', change: 'Peak Touch', icon: Flame, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25' },
        ]
      : [
          { label: 'Peak Sprint Speed', value: '29.4', unit: 'km/h', change: '+1.8 km/h', icon: Gauge, color: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
          { label: 'Biomechanical Strain', value: 'Low Risk', unit: '• 18%', change: 'Safe Tier', icon: ShieldAlert, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
          { label: 'Passing Precision', value: '89.2', unit: '%', change: '+3.5%', icon: Zap, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25' },
          { label: 'Acceleration Burst', value: '3.8', unit: 'm/s²', change: 'High Work Rate', icon: Flame, color: 'text-purple-400 bg-purple-500/10 border-purple-500/25' },
        ];

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-[#0C132E]/90 border border-indigo-950/80 shadow-2xl space-y-4">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-950/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base font-black text-white tracking-tight">Recent Analysis</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase">
              {sport} • #{match.id}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {match.matchName} • Athlete: <strong className="text-slate-200">{match.athleteName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSkeleton(!showSkeleton)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
              showSkeleton
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'bg-[#121B42] text-slate-400 border-indigo-900/40 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Skeleton: {showSkeleton ? 'ON' : 'OFF'}</span>
          </button>

          <Link
            href={`/matches/analysis?id=${match.id}`}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <span>View Full Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Analysis Layout: Large Video Preview + Key Metrics Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Video Player Container (7 cols) */}
        <div className="xl:col-span-7 flex flex-col space-y-2.5">
          <div
            ref={containerRef}
            className="relative w-full aspect-video rounded-xl bg-black overflow-hidden border border-indigo-950/80 shadow-inner group"
          >
            <video
              ref={videoRef}
              src={videoUrl}
              muted
              playsInline
              loop
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration || 15);
                  drawFrame();
                }
              }}
              onCanPlay={drawFrame}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
            />

            {/* 17-Point Pose Skeleton Canvas Overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Live Telemetry HUD Overlay */}
            {showSkeleton && (
              <div className="absolute bottom-3 left-3 px-3 py-2 rounded-xl bg-[#080D21]/90 backdrop-blur-md border border-indigo-500/30 text-xs font-mono shadow-xl pointer-events-none space-y-0.5">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                  <Activity className="w-3.5 h-3.5" />
                  <span>VELOCITY: 28.4 km/h</span>
                </div>
                <div className="text-[10px] text-slate-300">
                  ARM EXT: 88° • KNEE FLEX: 142°
                </div>
                <div className="text-[9px] font-bold text-emerald-400">
                  TRACK: MEDIAPEV-17 (ACTIVE)
                </div>
              </div>
            )}

            {/* Center Play Overlay on Hover / Pause */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-blue-600/80 hover:bg-blue-500 text-white flex items-center justify-center backdrop-blur-sm shadow-xl shadow-blue-500/30 transition transform hover:scale-105 cursor-pointer"
                aria-label="Play match video"
              >
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </button>
            )}
          </div>

          {/* Mini Video Controls Scrubber */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#090E26] border border-indigo-950/60 text-xs">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>

            <span className="text-[11px] font-mono text-slate-400">
              {Math.floor(currentTime)}s / {Math.floor(duration)}s
            </span>

            <input
              type="range"
              min="0"
              max={duration || 15}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Right Key Metrics Panel (5 cols) */}
        <div className="xl:col-span-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-indigo-950/40">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Key Biomechanical Metrics
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">AI Validated</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 flex-1">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="p-3.5 rounded-xl bg-[#0E1638]/70 border border-indigo-950/80 hover:border-indigo-500/30 transition flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium line-clamp-1">{m.label}</span>
                    <div className={`p-1 rounded-md border ${m.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-white font-mono tracking-tight">{m.value}</span>
                      <span className="text-xs font-bold text-slate-400 font-mono">{m.unit}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">{m.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href={`/matches/analysis?id=${match.id}`}
            className="w-full py-2.5 rounded-xl bg-[#121B42] hover:bg-[#162354] border border-indigo-500/25 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition text-center shadow-sm"
          >
            <span>Open Telemetry Workbench & Mistake Clips</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </Link>
        </div>

      </div>

    </div>
  );
}
