'use client';

import React, { useState } from 'react';
import { Columns, Play, Pause, RotateCcw, ShieldCheck, Activity, Maximize2 } from 'lucide-react';

interface ComparisonWorkbenchProps {
  sport?: string;
  primaryVideoUrl?: string;
  secondaryVideoUrl?: string;
}

export function ComparisonWorkbench({ sport = 'soccer', primaryVideoUrl, secondaryVideoUrl }: ComparisonWorkbenchProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'pro' | 'previous'>('pro');

  const getComparisonData = (sportType: string) => {
    switch (sportType.toLowerCase()) {
      case 'cricket':
        return {
          clipA: 'Athlete Bowling Action',
          clipB: 'Pro Reference (Jasprit Bumrah Form)',
          metrics: [
            { label: 'Crease Bound Alignment', athlete: '12° Off-Center', pro: '2° Parallel', diff: 'Excessive Lateral Drift' },
            { label: 'Release Arm Height', athlete: '1.92m', pro: '2.10m', diff: '-0.18m (Lower Release Point)' },
            { label: 'Front Foot Flexion', athlete: '162° (Stiff)', pro: '145° (Cushioned)', diff: 'High Knee Impact' },
          ]
        };
      case 'volleyball':
        return {
          clipA: 'Athlete Spike Approach & Jump',
          clipB: 'Pro Reference (Yuji Nishida Form)',
          metrics: [
            { label: 'Penultimate Stride Brake', athlete: '18° Angle', pro: '28° Firm', diff: 'Incomplete Forward-to-Vertical Transfer' },
            { label: 'Bow-and-Arrow Draw Angle', athlete: '74° Shoulder', pro: '95° Deep', diff: '-21° Shoulder Torque Deficit' },
            { label: 'Core Snap Velocity', athlete: '188 rad/s', pro: '242 rad/s', diff: '-54 rad/s Kinetic Chain Leak' },
          ]
        };
      case 'football':
      case 'soccer':
      default:
        return {
          clipA: 'Athlete Strike Technique',
          clipB: 'Pro Reference (Kevin De Bruyne Form)',
          metrics: [
            { label: 'Plant Foot Placement', athlete: '24cm Side', pro: '12cm Compact', diff: 'Over-extended Stride' },
            { label: 'Knee Over Ball Angle', athlete: '102°', pro: '118° Forward', diff: '-16° (Shooting High)' },
            { label: 'Follow-Through Swing', athlete: 'Truncated', pro: 'Full Arc', diff: 'Power Loss' },
          ]
        };
    }
  };

  const compData = getComparisonData(sport);

  return (
    <div className="pro-card p-4 space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Columns className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Split-Screen Dual Video Comparison
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset comparison mode toggle */}
          <div className="flex items-center gap-1 bg-[#090a0f] p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('pro')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                activeTab === 'pro' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              vs Pro Reference
            </button>
            <button
              onClick={() => setActiveTab('previous')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                activeTab === 'previous' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              vs Previous Attempt
            </button>
          </div>

          {/* Speed selector */}
          <div className="flex items-center gap-1 bg-[#090a0f] px-2 py-1 rounded-lg border border-slate-800 text-xs font-mono">
            {[0.25, 0.5, 1].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2 py-0.5 rounded font-bold transition ${
                  playbackSpeed === s ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Video Player Canvas Containers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Clip A: Athlete Current */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> {compData.clipA}
            </span>
            <span className="text-slate-400 font-mono">CLIP A • YOUR ATTEMPT</span>
          </div>
          <div className="relative aspect-video bg-[#0c1017] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
            {primaryVideoUrl ? (
              <video src={primaryVideoUrl} className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-sky-950/60 border border-sky-800/40 text-sky-400 flex items-center justify-center mx-auto font-bold">
                  A
                </div>
                <div className="text-xs font-bold text-slate-300">Athlete Video Stream</div>
                <div className="text-[10px] text-slate-500">Pose Skeleton Analyzed</div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#090a0f]/80 text-[10px] font-mono text-sky-400 border border-slate-700">
              SPEED: {playbackSpeed}x
            </div>
          </div>
        </div>

        {/* Clip B: Pro Benchmark Reference */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {activeTab === 'pro' ? compData.clipB : 'Previous Match Attempt'}
            </span>
            <span className="text-slate-400 font-mono">CLIP B • BENCHMARK</span>
          </div>
          <div className="relative aspect-video bg-[#0c1017] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
            {secondaryVideoUrl ? (
              <video src={secondaryVideoUrl} className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mx-auto font-bold">
                  B
                </div>
                <div className="text-xs font-bold text-slate-300">{activeTab === 'pro' ? 'Elite Pro Benchmark Stream' : 'Previous Best Clip'}</div>
                <div className="text-[10px] text-slate-500">Gold Standard Pose Reference</div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#090a0f]/80 text-[10px] font-mono text-emerald-400 border border-slate-700">
              TARGET SPEC
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Biomechanical Metrics Differential Table */}
      <div className="p-3 rounded-lg bg-[#090a0f] border border-slate-800 space-y-2">
        <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          Synchronized Kinematic Differential Analysis
        </div>

        <div className="space-y-2 divide-y divide-slate-800/60">
          {compData.metrics.map((m, idx) => (
            <div key={idx} className="pt-2 flex items-center justify-between text-xs gap-3">
              <div className="font-semibold text-slate-300 w-1/3">{m.label}</div>
              <div className="font-mono font-bold text-sky-400">{m.athlete}</div>
              <div className="font-mono font-bold text-emerald-400">{m.pro}</div>
              <div className="font-mono text-[11px] text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/40">
                {m.diff}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
