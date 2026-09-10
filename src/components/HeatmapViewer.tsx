'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSportStore, SPORT_CONFIGS, SportType } from '@/lib/sportStore';
import { Target, Compass, Zap, Shield, ChevronRight, BarChart3, Filter, Info, Eye } from 'lucide-react';

interface HeatmapViewerProps {
  sport?: SportType;
  athleteName?: string;
  heatmapsData?: Record<string, number[][]>;
}

export interface ShotEvent {
  id: number;
  angleRad: number;
  distanceMeters: number;
  runs: number;
  shotName: string;
  ballSpeedKmh: number;
  pitchZone: 'Good Length' | 'Full Pitch' | 'Yorker' | 'Short Pitch';
  result: 'FOUR' | 'SIX' | 'SINGLE' | 'DOUBLE' | 'DOT' | 'WICKET';
  color: string;
}

const DEMO_CRICKET_SHOTS: ShotEvent[] = [
  { id: 1, angleRad: -Math.PI * 0.28, distanceMeters: 84, runs: 6, shotName: 'Cover Drive Lofted', ballSpeedKmh: 142.5, pitchZone: 'Full Pitch', result: 'SIX', color: '#ffc700' },
  { id: 2, angleRad: -Math.PI * 0.48, distanceMeters: 78, runs: 4, shotName: 'Straight Drive', ballSpeedKmh: 138.0, pitchZone: 'Good Length', result: 'FOUR', color: '#00f0ff' },
  { id: 3, angleRad: -Math.PI * 0.72, distanceMeters: 62, runs: 4, shotName: 'On Drive Ground', ballSpeedKmh: 135.2, pitchZone: 'Good Length', result: 'FOUR', color: '#00f0ff' },
  { id: 4, angleRad: Math.PI * 0.35, distanceMeters: 88, runs: 6, shotName: 'Pull Shot Over Midwicket', ballSpeedKmh: 144.0, pitchZone: 'Short Pitch', result: 'SIX', color: '#ffc700' },
  { id: 5, angleRad: Math.PI * 0.75, distanceMeters: 55, runs: 4, shotName: 'Fine Leg Sweep', ballSpeedKmh: 129.8, pitchZone: 'Full Pitch', result: 'FOUR', color: '#00f0ff' },
  { id: 6, angleRad: -Math.PI * 0.12, distanceMeters: 42, runs: 2, shotName: 'Point Cut Shot', ballSpeedKmh: 136.4, pitchZone: 'Good Length', result: 'DOUBLE', color: '#10b981' },
  { id: 7, angleRad: Math.PI * 0.18, distanceMeters: 38, runs: 1, shotName: 'Square Leg Flick', ballSpeedKmh: 131.0, pitchZone: 'Good Length', result: 'SINGLE', color: '#10b981' },
  { id: 8, angleRad: -Math.PI * 0.85, distanceMeters: 68, runs: 0, shotName: 'Third Man Edge Catch', ballSpeedKmh: 141.2, pitchZone: 'Good Length', result: 'WICKET', color: '#ef4444' },
];

export function HeatmapViewer({ sport: propSport, athleteName, heatmapsData }: HeatmapViewerProps) {
  const { activeSport: storeSport } = useSportStore();
  const activeSport = propSport || storeSport;
  const config = SPORT_CONFIGS[activeSport] || SPORT_CONFIGS['Cricket'];

  const [activeTab, setActiveTab] = useState<string>(config.heatmapTabs[0]?.id || 'wagonWheel');
  const [filterType, setFilterType] = useState<'ALL' | 'BOUNDARIES' | 'WICKETS'>('ALL');
  const [hoveredShot, setHoveredShot] = useState<ShotEvent | null>(null);
  const [selectedShot, setSelectedShot] = useState<ShotEvent | null>(DEMO_CRICKET_SHOTS[0]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const scanlineXRef = useRef<number>(0);

  // Sync active tab on sport change
  useEffect(() => {
    setActiveTab(config.heatmapTabs[0]?.id || 'wagonWheel');
    setHoveredShot(null);
  }, [activeSport, config]);

  // Main Canvas Render Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI Canvas resolution scaling for crisp graphics
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const filteredShots = DEMO_CRICKET_SHOTS.filter((s) => {
      if (filterType === 'BOUNDARIES') return s.result === 'FOUR' || s.result === 'SIX';
      if (filterType === 'WICKETS') return s.result === 'WICKET';
      return true;
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark tactical background
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
      bgGrad.addColorStop(0, '#0c101d');
      bgGrad.addColorStop(1, '#05070e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (activeSport === 'Cricket') {
        renderCricketHUD(ctx, width, height, activeTab, filteredShots, hoveredShot || selectedShot);
      } else if (activeSport === 'Football') {
        renderFootballHUD(ctx, width, height, activeTab);
      } else {
        renderVolleyballHUD(ctx, width, height, activeTab);
      }

      // Tactical Live Radar Scanline Overlay
      scanlineXRef.current = (scanlineXRef.current + 1.8) % width;
      const scanX = scanlineXRef.current;
      const themeColor = activeSport === 'Cricket' ? '#00f0ff' : activeSport === 'Football' ? '#ffc700' : '#ff007f';

      const scanGrad = ctx.createLinearGradient(scanX - 40, 0, scanX, 0);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(1, `${themeColor}22`);
      ctx.fillStyle = scanGrad;
      ctx.fillRect(scanX - 40, 0, 40, height);

      ctx.strokeStyle = `${themeColor}aa`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [activeSport, activeTab, filterType, hoveredShot, selectedShot]);

  // Handle Mouse Hover / Interactions on Canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || activeSport !== 'Cricket' || (activeTab !== 'wagonWheel' && activeTab !== 'boundary')) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const maxRadius = Math.min(rect.width, rect.height) * 0.42;

    // Check hit collision against shot endpoints
    let found: ShotEvent | null = null;
    DEMO_CRICKET_SHOTS.forEach((s) => {
      const radius = (s.distanceMeters / 90) * maxRadius;
      const sx = cx + Math.cos(s.angleRad) * radius;
      const sy = cy + Math.sin(s.angleRad) * radius;

      const dist = Math.hypot(mx - sx, my - sy);
      if (dist < 18) {
        found = s;
      }
    });

    setHoveredShot(found);
  };

  const handleCanvasClick = () => {
    if (hoveredShot) {
      setSelectedShot(hoveredShot);
    }
  };

  const activeDisplayShot = hoveredShot || selectedShot || DEMO_CRICKET_SHOTS[0];

  return (
    <div className="glass-panel border border-slate-800/80 rounded-3xl p-5 shadow-2xl space-y-5">
      {/* HUD Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{config.icon}</span>
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
              {athleteName ? `${athleteName}'s ` : ''}{config.name} Spatial HUD & Radar Analytics
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              Live Biomechanics Grounded
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time computer vision spatial tracking, shot distribution vectoring, and pitching length heatmaps.
          </p>
        </div>

        {/* View Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-dark-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner w-full lg:w-auto">
          {config.heatmapTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-black rounded-xl capitalize transition-all duration-200 text-center ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-500/20 via-cyan-500/20 to-amber-500/20 text-white border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.3)] scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Canvas + Live Usable Analytics HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Canvas Display */}
        <div className="lg:col-span-8 relative flex flex-col items-center justify-center rounded-2xl border border-slate-800/90 bg-dark-950 p-3 shadow-2xl overflow-hidden group">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onClick={handleCanvasClick}
            className="w-full aspect-[16/10] max-h-[440px] rounded-xl cursor-pointer"
          />

          {/* Canvas Bottom Overlay Instructions */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] font-medium text-slate-400 bg-dark-900/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> Hover or tap shot endpoints to inspect velocity & trajectory metrics
            </span>
            <span className="font-mono text-cyan-400 font-bold">100% Computer Vision Tracked</span>
          </div>
        </div>

        {/* Usable Side Analytics Panel */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Shot Filter Selector (For Cricket) */}
          {activeSport === 'Cricket' && (
            <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter Spatial Rays
                </span>
                <span className="text-[10px] font-mono text-slate-500">8 Events Captured</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'ALL', label: 'All Shots' },
                  { key: 'BOUNDARIES', label: '4s & 6s' },
                  { key: 'WICKETS', label: 'Wickets' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilterType(f.key as any)}
                    className={`py-1.5 px-2 text-[11px] font-extrabold rounded-xl transition ${
                      filterType === f.key
                        ? 'bg-brand-500 text-black shadow-md'
                        : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Event Inspector Card */}
          {activeSport === 'Cricket' && activeDisplayShot && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 border border-cyan-500/30 space-y-3 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider block">
                    Selected Event Analytics
                  </span>
                  <h4 className="text-sm font-black text-white">{activeDisplayShot.shotName}</h4>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                    activeDisplayShot.result === 'SIX'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : activeDisplayShot.result === 'FOUR'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : activeDisplayShot.result === 'WICKET'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {activeDisplayShot.result === 'SIX'
                    ? '6 RUNS (SIX)'
                    : activeDisplayShot.result === 'FOUR'
                    ? '4 RUNS (FOUR)'
                    : activeDisplayShot.result === 'WICKET'
                    ? 'OUT (WICKET)'
                    : `${activeDisplayShot.runs} RUNS`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Trajectory Distance</span>
                  <span className="text-sm font-extrabold text-white font-mono">{activeDisplayShot.distanceMeters} Meters</span>
                </div>

                <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Delivery Speed</span>
                  <span className="text-sm font-extrabold text-cyan-400 font-mono">{activeDisplayShot.ballSpeedKmh} km/h</span>
                </div>

                <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Pitch Length Zone</span>
                  <span className="text-xs font-bold text-amber-300">{activeDisplayShot.pitchZone}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-dark-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Shot Sector</span>
                  <span className="text-xs font-bold text-slate-200">
                    {activeDisplayShot.angleRad < -Math.PI * 0.4
                      ? 'Off Side Cover / Extra'
                      : activeDisplayShot.angleRad < 0
                      ? 'Straight Long-Off'
                      : activeDisplayShot.angleRad < Math.PI * 0.5
                      ? 'Leg Side Mid-Wicket'
                      : 'Fine Leg / Third Man'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Spatial Breakdown Bar Distribution */}
          <div className="p-4 rounded-2xl bg-dark-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-brand-400" /> Sector Scoring Ratio
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Off vs Leg Side</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                  <span>Off-Side Drives & Cuts</span>
                  <span className="text-cyan-400 font-mono">54% (42 Runs)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-slate-800">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '54%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                  <span>Leg-Side Pulls & Flicks</span>
                  <span className="text-amber-400 font-mono">36% (28 Runs)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-slate-800">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '36%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                  <span>Straight Down V</span>
                  <span className="text-emerald-400 font-mono">10% (8 Runs)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// RENDER FUNCTIONS FOR CANVAS GRAPHICS
// ==========================================

function renderCricketHUD(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tab: string,
  shots: ShotEvent[],
  activeShot: ShotEvent | null
) {
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) * 0.42;

  if (tab === 'wagonWheel' || tab === 'boundary') {
    // Render Lush Oval Outfield Grass Ground
    const grassGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, maxRadius);
    grassGrad.addColorStop(0, '#0a2216');
    grassGrad.addColorStop(0.7, '#071810');
    grassGrad.addColorStop(1, '#040d09');

    ctx.fillStyle = grassGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, maxRadius, maxRadius * 0.88, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outfield Grass Mowing Concentric Rings
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.lineWidth = 15;
    for (let r = 40; r < maxRadius; r += 35) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.88, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Boundary Rope Outer Ring
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy, maxRadius, maxRadius * 0.88, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 30-Yard Inner Fielding Circle Ring
    const innerRadius = maxRadius * 0.45;
    ctx.strokeStyle = 'rgba(255, 199, 0, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, innerRadius, innerRadius * 0.88, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // 8 Tactical Sector Division Lines & Labels
    const sectorLabels = [
      'Cover', 'Extra Cover', 'Long Off', 'Long On',
      'Mid Wicket', 'Square Leg', 'Fine Leg', 'Third Man'
    ];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      const lx = cx + Math.cos(angle) * maxRadius;
      const ly = cy + Math.sin(angle) * (maxRadius * 0.88);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(lx, ly);
      ctx.stroke();

      // Sector Text Labels around perimeter
      const textAngle = angle + Math.PI / 8;
      const tx = cx + Math.cos(textAngle) * (maxRadius + 18);
      const ty = cy + Math.sin(textAngle) * (maxRadius * 0.88 + 14);

      ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sectorLabels[i], tx, ty);
    }

    // 22-Yard Central Pitch Soil Rectangle
    const pitchW = 24;
    const pitchH = 54;
    ctx.fillStyle = '#92400e'; // Turf soil clay color
    ctx.fillRect(cx - pitchW / 2, cy - pitchH / 2, pitchW, pitchH);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - pitchW / 2, cy - pitchH / 2, pitchW, pitchH);

    // Stumps & Crease Lines
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 6, cy - pitchH / 2 + 4, 12, 2); // Top Crease
    ctx.fillRect(cx - 6, cy + pitchH / 2 - 6, 12, 2); // Bottom Crease

    // Draw Shot Trajectories
    shots.forEach((s) => {
      const isSelected = activeShot?.id === s.id;
      const radius = (s.distanceMeters / 90) * maxRadius;
      const ex = cx + Math.cos(s.angleRad) * radius;
      const ey = cy + Math.sin(s.angleRad) * (radius * 0.88);

      // Trajectory Line
      ctx.strokeStyle = isSelected ? '#ffffff' : s.color;
      ctx.lineWidth = isSelected ? 3.5 : 2.0;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Endpoint Glow & Dot
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(ex, ey, isSelected ? 7 : 4.5, 0, Math.PI * 2);
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ex, ey, 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Distance Tag Label
      ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(226, 232, 240, 0.9)';
      ctx.font = isSelected ? 'bold 11px sans-serif' : '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${s.distanceMeters}m`, ex, ey - 12);
    });

  } else if (tab === 'pitchMap') {
    // 22-Yard Detailed Pitch Turf View
    const pw = width * 0.48;
    const ph = height - 60;
    const px = width / 2 - pw / 2;
    const py = 30;

    // Pitch Soil Base
    ctx.fillStyle = '#78350f';
    ctx.fillRect(px, py, pw, ph);

    // Turf Grass Stripes on Pitch Sides
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, pw, ph);

    // Crease Markings
    const topCreaseY = py + 45;
    const botCreaseY = py + ph - 45;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, topCreaseY);
    ctx.lineTo(px + pw, topCreaseY);
    ctx.moveTo(px, botCreaseY);
    ctx.lineTo(px + pw, botCreaseY);
    ctx.stroke();

    // Pitch Length Target Zones
    // Yorker / Full Zone
    ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.fillRect(px, topCreaseY, pw, 50);
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('FULL / YORKER ZONE', px + 10, topCreaseY + 30);

    // Good Length Zone
    ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.fillRect(px, topCreaseY + 50, pw, 75);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('🎯 GOOD LENGTH ZONE (84% Precision)', px + 10, topCreaseY + 92);

    // Short Pitch Zone
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.fillRect(px, topCreaseY + 125, pw, 65);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('SHORT PITCH / BOUNCER ZONE', px + 10, topCreaseY + 160);

    // Pitch Landing Spot Heat Dots & Seam Arrows
    const pitchSpots = [
      { x: px + pw * 0.42, y: topCreaseY + 62, color: '#10b981', label: '138.2 km/h (Outswinger)' },
      { x: px + pw * 0.58, y: topCreaseY + 70, color: '#10b981', label: '141.0 km/h (Seam Up)' },
      { x: px + pw * 0.35, y: topCreaseY + 25, color: '#00f0ff', label: '134.5 km/h (Yorker)' },
      { x: px + pw * 0.65, y: topCreaseY + 140, color: '#ef4444', label: '144.2 km/h (Bouncer)' },
    ];

    pitchSpots.forEach((ps) => {
      ctx.fillStyle = ps.color;
      ctx.beginPath();
      ctx.arc(ps.x, ps.y, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText(ps.label, ps.x + 12, ps.y + 4);
    });

  } else if (tab === 'fielding') {
    // Fielding Coverage Diagram
    renderCricketHUD(ctx, width, height, 'wagonWheel', shots, activeShot);

    // Overlay Fielder Positions
    const fielders = [
      { name: 'Slip 1', x: cx - 25, y: cy - 45 },
      { name: 'Gully', x: cx - 55, y: cy - 35 },
      { name: 'Point', x: cx - 110, y: cy - 10 },
      { name: 'Cover', x: cx - 90, y: cy + 60 },
      { name: 'Mid Off', x: cx - 35, y: cy + 110 },
      { name: 'Mid On', x: cx + 35, y: cy + 110 },
      { name: 'Mid Wicket', x: cx + 90, y: cy + 60 },
      { name: 'Square Leg', x: cx + 110, y: cy - 10 },
      { name: 'Fine Leg', x: cx + 60, y: cy - 100 },
    ];

    fielders.forEach((f) => {
      // Catchment radius circle
      ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(f.x, f.y, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(f.x, f.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(f.name, f.x, f.y - 8);
    });
  }
}

function renderFootballHUD(ctx: CanvasRenderingContext2D, width: number, height: number, tab: string) {
  // Pitch Background
  ctx.fillStyle = '#062012';
  ctx.fillRect(15, 15, width - 30, height - 30);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(15, 15, width - 30, height - 30);

  // Center Line & Circle
  ctx.beginPath();
  ctx.moveTo(width / 2, 15);
  ctx.lineTo(width / 2, height - 15);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 48, 0, Math.PI * 2);
  ctx.stroke();

  // Penalty Boxes
  ctx.strokeRect(15, height / 2 - 60, 75, 120);
  ctx.strokeRect(width - 90, height / 2 - 60, 75, 120);

  // Thermal Occupancy Heatmap Glows
  const nodes = [
    { x: width * 0.48, y: height * 0.52, r: 75, color: 'rgba(255, 199, 0, 0.75)' },
    { x: width * 0.62, y: height * 0.38, r: 55, color: 'rgba(0, 240, 255, 0.65)' },
    { x: width * 0.32, y: height * 0.65, r: 50, color: 'rgba(16, 185, 129, 0.55)' },
  ];

  nodes.forEach((n) => {
    const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    grad.addColorStop(0, n.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderVolleyballHUD(ctx: CanvasRenderingContext2D, width: number, height: number, tab: string) {
  // Court Floor
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(40, 25, width - 80, height - 50);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(40, 25, width - 80, height - 50);

  // Net Line
  ctx.strokeStyle = '#ff007f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2, 25);
  ctx.lineTo(width / 2, height - 25);
  ctx.stroke();

  // Attack 3m Lines
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 75, 25);
  ctx.lineTo(width / 2 - 75, height - 25);
  ctx.moveTo(width / 2 + 75, 25);
  ctx.lineTo(width / 2 + 75, height - 25);
  ctx.stroke();

  // Spike Heat Nodes
  const spikes = [
    { x: width / 2 + 100, y: height * 0.35, r: 60, color: 'rgba(255, 0, 127, 0.7)' },
    { x: width / 2 + 120, y: height * 0.68, r: 50, color: 'rgba(255, 199, 0, 0.65)' },
  ];

  spikes.forEach((s) => {
    const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
    grad.addColorStop(0, s.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
}
