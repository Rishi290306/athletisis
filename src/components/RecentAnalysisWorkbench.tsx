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

  // Load calibrated pose track for the video
  useEffect(() => {
    let isMounted = true;
    const fetchPoses = async () => {
      const data = await loadVideoPoseDataset(videoUrl, sport, match?.id, videoRef.current);
      if (isMounted && data) {
        setPoseDataset(data);
      }
    };
    fetchPoses();
    return () => {
      isMounted = false;
    };
  }, [videoUrl, sport, match?.id]);

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
          { label: 'Bowling Release Speed', value: '144.8', unit: 'km/h', change: '+2.4 km/h', icon: Gauge, color: 'text-[#E8B75A] bg-[#E8B75A]/10 border-[#E8B75A]/30' },
          { label: 'Good Length Control', value: '88.4', unit: '%', change: '+4.1%', icon: Zap, color: 'text-[#55BDEB] bg-[#55BDEB]/10 border-[#55BDEB]/30' },
          { label: 'Shoulder Trunk Load', value: 'Low Risk', unit: '• 16%', change: 'Optimal', icon: ShieldAlert, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
          { label: 'Kinematic Extension', value: '88.0', unit: '°', change: 'Legal Arch', icon: Flame, color: 'text-[#6675E8] bg-[#6675E8]/10 border-[#6675E8]/30' },
        ]
      : sport === 'Volleyball'
      ? [
          { label: 'Vertical Jump Peak', value: '78.5', unit: 'cm', change: '+3.2 cm', icon: Gauge, color: 'text-[#6675E8] bg-[#6675E8]/10 border-[#6675E8]/30' },
          { label: 'Spike Velocity', value: '98.2', unit: 'km/h', change: '+5.1 km/h', icon: Zap, color: 'text-[#E8B75A] bg-[#E8B75A]/10 border-[#E8B75A]/30' },
          { label: 'Patellar Strain Index', value: 'Low Risk', unit: '• 19%', change: 'Safe Range', icon: ShieldAlert, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
          { label: 'Net Reach Elevation', value: '315', unit: 'cm', change: 'Peak Touch', icon: Flame, color: 'text-[#55BDEB] bg-[#55BDEB]/10 border-[#55BDEB]/30' },
        ]
      : [
          { label: 'Peak Sprint Speed', value: '29.4', unit: 'km/h', change: '+1.8 km/h', icon: Gauge, color: 'text-[#6675E8] bg-[#6675E8]/10 border-[#6675E8]/30' },
          { label: 'Biomechanical Strain', value: 'Low Risk', unit: '• 18%', change: 'Safe Tier', icon: ShieldAlert, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
          { label: 'Passing Precision', value: '89.2', unit: '%', change: '+3.5%', icon: Zap, color: 'text-[#55BDEB] bg-[#55BDEB]/10 border-[#55BDEB]/30' },
          { label: 'Acceleration Burst', value: '3.8', unit: 'm/s²', change: 'High Work Rate', icon: Flame, color: 'text-[#6675E8] bg-[#6675E8]/10 border-[#6675E8]/30' },
        ];

  return (
    <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] space-y-4">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#28334D]">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#55BDEB]" />
            <h3 className="text-sm font-bold text-[#F3F5FA] tracking-tight">Recent Analysis</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B1020] text-[#55BDEB] border border-[#28334D] font-medium uppercase">
              {sport} • #{match.id}
            </span>
          </div>
          <p className="text-xs text-[#9AA6BD]">
            {match.matchName} • Athlete: <strong className="text-[#F3F5FA] font-medium">{match.athleteName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSkeleton(!showSkeleton)}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 border transition cursor-pointer ${
              showSkeleton
                ? 'bg-[#0B1020] text-[#55BDEB] border-[#55BDEB]/40'
                : 'bg-[#0B1020] text-[#9AA6BD] border-[#28334D] hover:text-[#F3F5FA]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Skeleton: {showSkeleton ? 'ON' : 'OFF'}</span>
          </button>

          <Link
            href={`/matches/analysis?id=${match.id}`}
            className="px-3 py-1.5 rounded-md bg-[#6675E8] hover:bg-[#5463D6] text-white text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <span>View Full Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Analysis Layout: Large Video Preview + Key Metrics Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Video Player Container (7 cols) */}
        <div className="xl:col-span-7 flex flex-col space-y-2">
          <div
            ref={containerRef}
            className="relative w-full aspect-video rounded-lg bg-[#0B1020] overflow-hidden border border-[#28334D] group"
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
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1.5 rounded-md bg-[#0B1020]/90 backdrop-blur-md border border-[#28334D] text-xs font-mono shadow-md pointer-events-none space-y-0.5">
                <div className="flex items-center gap-1.5 text-[#55BDEB] font-semibold text-xs">
                  <Activity className="w-3 h-3" />
                  <span>VELOCITY: 28.4 km/h</span>
                </div>
                <div className="text-[10px] text-[#9AA6BD]">
                  ARM EXT: 88° • KNEE FLEX: 142°
                </div>
                <div className="text-[9px] font-semibold text-emerald-400">
                  TRACK: MEDIAPIPE-17 (ACTIVE)
                </div>
              </div>
            )}

            {/* Center Play Overlay on Hover / Pause */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#6675E8]/90 hover:bg-[#6675E8] text-white flex items-center justify-center backdrop-blur-sm shadow-md transition transform hover:scale-105 cursor-pointer"
                aria-label="Play match video"
              >
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </button>
            )}
          </div>

          {/* Mini Video Controls Scrubber */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#0B1020] border border-[#28334D] text-xs">
            <button
              onClick={togglePlay}
              className="p-1 rounded bg-[#6675E8] hover:bg-[#5463D6] text-white transition cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white" />}
            </button>

            <span className="text-[11px] font-mono text-[#9AA6BD]">
              {Math.floor(currentTime)}s / {Math.floor(duration)}s
            </span>

            <input
              type="range"
              min="0"
              max={duration || 15}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-[#6675E8] cursor-pointer h-1 bg-[#151C35] rounded"
            />
          </div>
        </div>

        {/* Right Key Metrics Panel (5 cols) */}
        <div className="xl:col-span-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#28334D]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA6BD]">
              Key Biomechanical Metrics
            </span>
            <span className="text-[10px] font-mono text-[#55BDEB]">AI Validated</span>
          </div>

          <div className="grid grid-cols-2 gap-2 flex-1">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="p-3 rounded-lg bg-[#0B1020] border border-[#28334D] hover:border-[#3D4D73] transition flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#9AA6BD] font-medium line-clamp-1">{m.label}</span>
                    <div className={`p-1 rounded border ${m.color}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-[#F3F5FA] font-mono tracking-tight tabular-nums">{m.value}</span>
                      <span className="text-xs text-[#9AA6BD] font-mono">{m.unit}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium">{m.change}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href={`/matches/analysis?id=${match.id}`}
            className="w-full py-2 px-3 rounded-md bg-[#0B1020] hover:bg-[#1A2342] border border-[#28334D] hover:border-[#3D4D73] text-[#F3F5FA] text-xs font-semibold flex items-center justify-center gap-2 transition text-center shadow-sm"
          >
            <span>Open Telemetry Workbench & Clips</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#55BDEB]" />
          </Link>
        </div>

      </div>

    </div>
  );
}

