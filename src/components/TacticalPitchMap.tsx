'use client';

import React, { useState } from 'react';
import { Compass, Play, Activity } from 'lucide-react';

interface TacticalPitchMapProps {
  sport?: string;
  onSeekTimestamp?: (seconds: number) => void;
  activeTimestamp?: number;
}

interface SpatialNode {
  id: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  timestamp: number;
  timeFormatted: string;
  type: 'sprint' | 'shot' | 'pass' | 'tackle';
  speed: string;
  label: string;
}

export function TacticalPitchMap({
  sport = 'Cricket',
  onSeekTimestamp,
  activeTimestamp = 0
}: TacticalPitchMapProps) {
  const [selectedNode, setSelectedNode] = useState<SpatialNode | null>(null);
  const [viewMode, setViewMode] = useState<'positions' | 'heatmap' | 'trajectories'>('positions');

  const getSpatialData = (sportType: string): SpatialNode[] => {
    switch (sportType.toLowerCase()) {
      case 'cricket':
        return [
          { id: '1', x: 50, y: 36, timestamp: 1, timeFormatted: '00:01', type: 'sprint', speed: '24.1 km/h', label: 'Bowler Approach Runup' },
          { id: '2', x: 50, y: 64, timestamp: 4, timeFormatted: '00:04', type: 'shot', speed: '138.5 km/h', label: 'Crease Stance & Delivery Stride' },
          { id: '3', x: 72, y: 32, timestamp: 7, timeFormatted: '00:07', type: 'pass', speed: '19.8 km/h', label: 'Mid-Off Boundary Deep Cover' },
          { id: '4', x: 30, y: 68, timestamp: 11, timeFormatted: '00:11', type: 'sprint', speed: '28.4 km/h', label: 'Crease Between-Wickets Turn' },
        ];
      case 'volleyball':
        return [
          { id: '1', x: 25, y: 30, timestamp: 1, timeFormatted: '00:01', type: 'shot', speed: '92.4 km/h', label: 'Zone 4 Outside Hitter Spike' },
          { id: '2', x: 50, y: 50, timestamp: 4, timeFormatted: '00:04', type: 'pass', speed: '18.2 km/h', label: 'Mid-Court Setter Quick Assist' },
          { id: '3', x: 75, y: 70, timestamp: 7, timeFormatted: '00:07', type: 'tackle', speed: '22.0 km/h', label: 'Backcourt Libero Defensive Dig' },
          { id: '4', x: 50, y: 25, timestamp: 10, timeFormatted: '00:10', type: 'tackle', speed: '14.5 km/h', label: 'Middle Blocker Lateral Net Shift' },
        ];
      default: // football / soccer
        return [
          { id: '1', x: 22, y: 45, timestamp: 1, timeFormatted: '00:01', type: 'pass', speed: '19.2 km/h', label: 'Defensive Line Build-Up' },
          { id: '2', x: 48, y: 65, timestamp: 4, timeFormatted: '00:04', type: 'sprint', speed: '31.4 km/h', label: 'Wing Overlap Sprint' },
          { id: '3', x: 68, y: 35, timestamp: 8, timeFormatted: '00:08', type: 'pass', speed: '24.0 km/h', label: 'Penetrative Key Through-Ball' },
          { id: '4', x: 84, y: 50, timestamp: 12, timeFormatted: '00:12', type: 'shot', speed: '98.5 km/h', label: 'Penalty Area Strike on Target' },
        ];
    }
  };

  const nodes = getSpatialData(sport);

  // Determine closest node based on activeTimestamp
  const closestNode = nodes.reduce((prev, curr) => 
    Math.abs(curr.timestamp - activeTimestamp) < Math.abs(prev.timestamp - activeTimestamp) ? curr : prev
  , nodes[0]);

  const handleNodeClick = (node: SpatialNode) => {
    setSelectedNode(node);
    if (onSeekTimestamp) {
      onSeekTimestamp(node.timestamp);
    }
  };

  const getNodeColor = (type: SpatialNode['type']) => {
    switch (type) {
      case 'shot': return 'bg-emerald-500 border-emerald-300 text-emerald-950';
      case 'sprint': return 'bg-sky-500 border-sky-300 text-sky-950';
      case 'pass': return 'bg-purple-500 border-purple-300 text-purple-950';
      case 'tackle': return 'bg-amber-500 border-amber-300 text-amber-950';
      default: return 'bg-slate-400 border-slate-200 text-slate-950';
    }
  };

  const currentSportNormalized = sport.toLowerCase();

  return (
    <div className="pro-card p-4 space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            2D Tactical {sport.toUpperCase()} Spatial Map
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('positions')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              viewMode === 'positions' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Nodes
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              viewMode === 'heatmap' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setViewMode('trajectories')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              viewMode === 'trajectories' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Path
          </button>
        </div>
      </div>

      {/* Pitch SVG Graphic Canvas */}
      <div className="relative w-full aspect-[16/10] bg-[#090D16] rounded-lg border border-slate-800 overflow-hidden select-none">
        
        <svg className="absolute inset-0 w-full h-full stroke-slate-600/40 fill-none" strokeWidth="1.5">
          {/* Football pitch vector */}
          {(currentSportNormalized === 'football' || currentSportNormalized === 'soccer') && (
            <g>
              <rect x="5%" y="5%" width="90%" height="90%" rx="4" strokeWidth="1.5" stroke="rgba(255,255,255,0.2)" />
              <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="rgba(255,255,255,0.2)" />
              <circle cx="50%" cy="50%" r="14%" stroke="rgba(255,255,255,0.2)" />
              <rect x="5%" y="25%" width="15%" height="50%" stroke="rgba(255,255,255,0.2)" />
              <rect x="80%" y="25%" width="15%" height="50%" stroke="rgba(255,255,255,0.2)" />
            </g>
          )}

          {/* Cricket oval vector */}
          {currentSportNormalized === 'cricket' && (
            <g>
              <ellipse cx="50%" cy="50%" rx="42%" ry="42%" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <ellipse cx="50%" cy="50%" rx="28%" ry="28%" stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />
              <rect x="46%" y="28%" width="8%" height="44%" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" rx="2" />
              <line x1="46%" y1="36%" x2="54%" y2="36%" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <line x1="46%" y1="64%" x2="54%" y2="64%" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            </g>
          )}

          {/* Volleyball court vector */}
          {currentSportNormalized === 'volleyball' && (
            <g>
              <rect x="8%" y="10%" width="84%" height="80%" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="rgba(14,165,233,0.6)" strokeWidth="2" />
              <line x1="36%" y1="10%" x2="36%" y2="90%" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
              <line x1="64%" y1="10%" x2="64%" y2="90%" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
            </g>
          )}
        </svg>

        {/* Heatmap Overlay */}
        {viewMode === 'heatmap' && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-[32%] left-[48%] w-32 h-32 bg-rose-500 rounded-full blur-2xl" />
            <div className="absolute top-[50%] left-[55%] w-24 h-24 bg-amber-500 rounded-full blur-2xl" />
            <div className="absolute top-[20%] left-[30%] w-28 h-28 bg-brand-500 rounded-full blur-2xl" />
          </div>
        )}

        {/* Trajectory Path */}
        {viewMode === 'trajectories' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d={`M ${nodes[0]?.x}% ${nodes[0]?.y}% L ${nodes[1]?.x}% ${nodes[1]?.y}% L ${nodes[2]?.x}% ${nodes[2]?.y}% L ${nodes[3]?.x}% ${nodes[3]?.y}%`}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
        )}

        {/* Spatial Node Points */}
        {nodes.map((node) => {
          const isSelected = (selectedNode?.id === node.id) || (closestNode?.id === node.id);
          return (
            <div
              key={node.id}
              onClick={() => handleNodeClick(node)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-bold text-[9px] transition-all hover:scale-125 shadow-md ${getNodeColor(node.type)} ${isSelected ? 'ring-2 ring-brand-400 scale-125' : ''}`}>
                {node.timeFormatted.split(':')[1]}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 w-48 p-2.5 rounded-lg bg-[#0E1424] border border-slate-800 shadow-xl text-left pointer-events-none">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-400 flex items-center justify-between">
                  <span>{node.type}</span>
                  <span className="text-slate-400 font-mono">{node.timeFormatted}</span>
                </div>
                <div className="text-xs font-semibold text-white truncate mt-0.5">{node.label}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Speed: {node.speed}</div>
                <div className="text-[9px] text-brand-400 mt-1 font-medium flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-brand-400" /> Click to sync video
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Details Box */}
      {selectedNode && (
        <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {selectedNode.type}
              </span>
              <span className="text-xs font-mono font-medium text-slate-300">Timestamp: {selectedNode.timeFormatted}</span>
            </div>
            <div className="text-xs font-semibold text-white">{selectedNode.label}</div>
            <div className="text-[11px] text-slate-400 font-mono">Recorded Velocity: <span className="text-emerald-400 font-semibold">{selectedNode.speed}</span></div>
          </div>
          <button
            onClick={() => onSeekTimestamp && onSeekTimestamp(selectedNode.timestamp)}
            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 transition shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Seek Video
          </button>
        </div>
      )}

      {/* Legend & Help */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Shot</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> Sprint</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Pass</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Tackle/Dig</span>
        </div>
        <span className="text-slate-400 font-medium">Click node on field to sync video</span>
      </div>
    </div>
  );
}
