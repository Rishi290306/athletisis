'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';

interface HeatmapViewerProps {
  heatmapsData?: Record<string, number[][]>;
}

export function HeatmapViewer({ heatmapsData }: HeatmapViewerProps) {
  const { activeSport } = useSportStore();
  const config = SPORT_CONFIGS[activeSport];
  const [activeTab, setActiveTab] = useState<string>(config.heatmapTabs[0].id);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanlineRef = useRef<number>(0);

  // Sync tab when sport changes
  useEffect(() => {
    setActiveTab(config.heatmapTabs[0].id);
  }, [activeSport, config]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      ctx.fillStyle = '#060810';
      ctx.fillRect(0, 0, width, height);

      if (activeSport === 'Football') {
        renderFootballPitch(ctx, width, height);
      } else if (activeSport === 'Cricket') {
        renderCricketPitchOrWagonWheel(ctx, width, height, activeTab);
      } else if (activeSport === 'Volleyball') {
        renderVolleyballCourt(ctx, width, height);
      }

      // Animated Scanline overlay
      scanlineRef.current = (scanlineRef.current + 2.5) % width;
      const scanX = scanlineRef.current;

      const scanColor = activeSport === 'Football' ? '#ffc700' : activeSport === 'Cricket' ? '#00f0ff' : '#ff007f';
      const scanGrad = ctx.createLinearGradient(scanX - 35, 0, scanX, 0);
      scanGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      scanGrad.addColorStop(1, `${scanColor}33`);

      ctx.fillStyle = scanGrad;
      ctx.fillRect(scanX - 35, 0, 35, height);

      ctx.strokeStyle = scanColor;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, height);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeSport, activeTab]);

  return (
    <div className="glass-panel border border-slate-800/80 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            {config.name} Spatial Radar HUD
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400">Positioning density & touch distribution with live radar scanline</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-dark-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner w-full sm:w-auto">
          {config.heatmapTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-[11px] sm:text-xs font-black rounded-xl capitalize transition-all duration-200 flex-1 sm:flex-none text-center ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-brand-500/20 via-amber-400/20 to-cyan-500/20 text-white border border-brand-500/50 shadow-[0_0_15px_rgba(255,199,0,0.35)] scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full flex justify-center overflow-hidden rounded-2xl border border-slate-800/90 bg-black shadow-[0_0_35px_rgba(0,0,0,0.8)] p-2">
        <canvas ref={canvasRef} width={640} height={360} className="w-full max-w-2xl h-auto aspect-video rounded-xl" />
      </div>
    </div>
  );
}

function renderFootballPitch(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  ctx.beginPath();
  ctx.moveTo(width / 2, 12);
  ctx.lineTo(width / 2, height - 12);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeRect(12, height / 2 - 55, 65, 110);
  ctx.strokeRect(width - 77, height / 2 - 55, 65, 110);

  // Sample Heatmap Nodes
  const nodes = [
    { x: width * 0.45, y: height * 0.5, r: 65, color: 'rgba(255, 199, 0, 0.7)' },
    { x: width * 0.6, y: height * 0.4, r: 50, color: 'rgba(0, 240, 255, 0.6)' },
    { x: width * 0.3, y: height * 0.6, r: 45, color: 'rgba(139, 92, 246, 0.5)' },
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

function renderCricketPitchOrWagonWheel(ctx: CanvasRenderingContext2D, width: number, height: number, tab: string) {
  const cx = width / 2;
  const cy = height / 2;

  if (tab === 'wagonWheel' || tab === 'boundary') {
    // 360° Wagon Wheel Outfield
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * 140, cy + Math.sin(angle) * 140);
      ctx.stroke();
    }

    // 22-Yard Pitch Infield Rectangle
    ctx.fillStyle = 'rgba(255, 199, 0, 0.25)';
    ctx.fillRect(cx - 15, cy - 35, 30, 70);
    ctx.strokeStyle = '#ffc700';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 15, cy - 35, 30, 70);

    // Shot Trajectory Rays
    const shots = [
      { angle: -Math.PI / 4, length: 130, color: '#00f0ff', label: 'Cover Drive' },
      { angle: -Math.PI / 2, length: 135, color: '#ffc700', label: 'Straight Drive' },
      { angle: Math.PI / 3, length: 120, color: '#ff007f', label: 'Pull Shot' },
      { angle: Math.PI * 0.8, length: 110, color: '#10b981', label: 'Fine Leg' },
    ];

    shots.forEach((s) => {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(s.angle) * s.length, cy + Math.sin(s.angle) * s.length);
      ctx.stroke();

      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(s.angle) * s.length, cy + Math.sin(s.angle) * s.length, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    // 22-Yard Pitch Map
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(width * 0.3, 25, width * 0.4, height - 50);

    // Crease Lines
    ctx.beginPath();
    ctx.moveTo(width * 0.3, 75);
    ctx.lineTo(width * 0.7, 75);
    ctx.moveTo(width * 0.3, height - 75);
    ctx.lineTo(width * 0.7, height - 75);
    ctx.stroke();

    // Pitch Length Zones
    ctx.fillStyle = 'rgba(16, 185, 129, 0.3)'; // Good Length
    ctx.fillRect(width * 0.3, 125, width * 0.4, 65);

    ctx.fillStyle = 'rgba(0, 240, 255, 0.3)'; // Full Length
    ctx.fillRect(width * 0.3, 75, width * 0.4, 50);

    ctx.fillStyle = 'rgba(255, 0, 127, 0.3)'; // Short Length
    ctx.fillRect(width * 0.3, 190, width * 0.4, 75);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('🎯 Good Length (84% Precision)', width * 0.32, 160);
  }
}

function renderVolleyballCourt(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(60, 30, width - 120, height - 60);

  // Center Net Line
  ctx.strokeStyle = '#ff007f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2, 30);
  ctx.lineTo(width / 2, height - 30);
  ctx.stroke();

  // 3m Attack Lines
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 70, 30);
  ctx.lineTo(width / 2 - 70, height - 30);
  ctx.moveTo(width / 2 + 70, 30);
  ctx.lineTo(width / 2 + 70, height - 30);
  ctx.stroke();

  const spikes = [
    { x: width / 2 + 90, y: height * 0.35, r: 55, color: 'rgba(255, 0, 127, 0.65)' },
    { x: width / 2 + 110, y: height * 0.65, r: 45, color: 'rgba(255, 199, 0, 0.6)' },
    { x: width / 2 - 90, y: height * 0.5, r: 50, color: 'rgba(0, 240, 255, 0.55)' },
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
