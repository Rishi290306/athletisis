'use client';

import React, { useState } from 'react';
import { Columns, Play, Pause, RotateCcw, ShieldCheck, Activity, Maximize2 } from 'lucide-react';

interface ComparisonWorkbenchProps {
  sport?: string;
  primaryVideoUrl?: string;
  secondaryVideoUrl?: string;
}

export function ComparisonWorkbench({ sport = 'soccer', primaryVideoUrl, secondaryVideoUrl }: ComparisonWorkbenchProps) {
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
    <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#28334D]">
        <div className="flex items-center gap-2">
          <Columns className="w-4 h-4 text-[#6675E8]" />
          <h3 className="text-xs font-bold text-[#F3F5FA] uppercase tracking-wider">
            Split-Screen Dual Video Comparison & Kinematic Benchmark
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset comparison mode toggle */}
          <div className="flex items-center gap-1 bg-[#0B1020] p-1 rounded-lg border border-[#28334D] text-xs">
            <button
              onClick={() => setActiveTab('pro')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                activeTab === 'pro' ? 'bg-[#151C35] text-[#F3F5FA] font-semibold border border-[#28334D]' : 'text-[#9AA6BD] hover:text-[#F3F5FA]'
              }`}
            >
              vs Pro Reference
            </button>
            <button
              onClick={() => setActiveTab('previous')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                activeTab === 'previous' ? 'bg-[#151C35] text-[#F3F5FA] font-semibold border border-[#28334D]' : 'text-[#9AA6BD] hover:text-[#F3F5FA]'
              }`}
            >
              vs Previous Attempt
            </button>
          </div>

          {/* Speed selector */}
          <div className="flex items-center gap-1 bg-[#0B1020] px-2 py-1 rounded-lg border border-[#28334D] text-xs font-mono">
            {[0.25, 0.5, 1].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-2 py-0.5 rounded text-xs transition cursor-pointer ${
                  playbackSpeed === s ? 'bg-[#6675E8] text-white font-semibold' : 'text-[#9AA6BD] hover:text-[#F3F5FA]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Video Player Canvas Containers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Clip A: Athlete Current */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#F3F5FA] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6675E8]" /> {compData.clipA}
            </span>
            <span className="text-[#9AA6BD] font-mono text-[10px]">CLIP A • ATTEMPT</span>
          </div>
          <div className="relative aspect-video bg-[#0B1020] rounded-lg border border-[#28334D] flex items-center justify-center overflow-hidden">
            {primaryVideoUrl ? (
              <video src={primaryVideoUrl} className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-4 space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-[#6675E8]/10 border border-[#6675E8]/20 text-[#6675E8] flex items-center justify-center mx-auto font-bold text-xs font-mono">
                  A
                </div>
                <div className="text-xs font-semibold text-[#F3F5FA]">Athlete Video Stream</div>
                <div className="text-[10px] text-[#9AA6BD]">Pose Skeleton Calibrated</div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#0B1020]/90 text-[10px] font-mono text-[#55BDEB] border border-[#28334D]">
              SPEED: {playbackSpeed}x
            </div>
          </div>
        </div>

        {/* Clip B: Pro Benchmark Reference */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#F3F5FA] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> {activeTab === 'pro' ? compData.clipB : 'Previous Match Attempt'}
            </span>
            <span className="text-[#9AA6BD] font-mono text-[10px]">CLIP B • BENCHMARK</span>
          </div>
          <div className="relative aspect-video bg-[#0B1020] rounded-lg border border-[#28334D] flex items-center justify-center overflow-hidden">
            {secondaryVideoUrl ? (
              <video src={secondaryVideoUrl} className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-4 space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto font-bold text-xs font-mono">
                  B
                </div>
                <div className="text-xs font-semibold text-[#F3F5FA]">{activeTab === 'pro' ? 'Elite Pro Benchmark Stream' : 'Previous Best Clip'}</div>
                <div className="text-[10px] text-[#9AA6BD]">Gold Standard Pose Reference</div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#0B1020]/90 text-[10px] font-mono text-emerald-400 border border-[#28334D]">
              TARGET SPEC
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Biomechanical Metrics Differential Table */}
      <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#28334D] space-y-2">
        <div className="text-xs font-bold text-[#F3F5FA] uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#55BDEB]" />
          <span>Synchronized Kinematic Differential Analysis</span>
        </div>

        <div className="space-y-2 divide-y divide-[#28334D]">
          {compData.metrics.map((m, idx) => (
            <div key={idx} className="pt-2 flex items-center justify-between text-xs gap-3">
              <div className="font-medium text-[#F3F5FA] w-1/3">{m.label}</div>
              <div className="font-mono font-bold text-[#6675E8]">{m.athlete}</div>
              <div className="font-mono font-bold text-emerald-400">{m.pro}</div>
              <div className="font-mono text-[11px] text-[#E8B75A] bg-[#E8B75A]/10 px-2 py-0.5 rounded border border-[#E8B75A]/20">
                {m.diff}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
