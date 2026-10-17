'use client';

import React, { useState } from 'react';
import { Target, CheckCircle2, Dumbbell, Zap, Flame, ShieldAlert, Award, ArrowUpRight, Clock, RefreshCw, FileText, Check } from 'lucide-react';
import { SportType, SPORT_CONFIGS } from '@/lib/sportStore';

interface MatchStrategyTrainingHubProps {
  sport?: SportType;
  athleteName?: string;
  matchName?: string;
}

interface DrillItem {
  id: number;
  title: string;
  focusArea: string;
  priority: 'HIGH' | 'MEDIUM';
  prescribedSets: string;
  durationMins: number;
  equipment: string;
  currentScore: number;
  targetScore: number;
  description: string;
  instructions: string[];
}

export function MatchStrategyTrainingHub({ sport = 'Cricket', athleteName = 'Rishi Tiwari', matchName = 'Match Analysis' }: MatchStrategyTrainingHubProps) {
  const config = SPORT_CONFIGS[sport] || SPORT_CONFIGS['Cricket'];
  const [completedDrills, setCompletedDrills] = useState<Record<number, boolean>>({});

  const toggleDrillCompletion = (id: number) => {
    setCompletedDrills((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getDrillsForSport = (): DrillItem[] => {
    if (sport === 'Cricket') {
      return [
        {
          id: 1,
          title: 'Target Pitch Spot & Seam Alignment Drill',
          focusArea: 'Good Length Control (6-8m from Stumps)',
          priority: 'HIGH',
          prescribedSets: '4 Sets x 12 Deliveries',
          durationMins: 20,
          equipment: 'Spot Target Marker & Leather Ball',
          currentScore: 74.0,
          targetScore: 88.0,
          description: 'Video analysis detected 28% over-pitched deliveries outside off-stump under pressure.',
          instructions: [
            'Place a 1-meter target cone on good length (6.5m from stumps).',
            'Focus on upright wrist release and upright seam orientation.',
            'Aim for 10 out of 12 deliveries landing within the cone zone.',
          ],
        },
        {
          id: 2,
          title: 'Front-Foot Crease Drive & Balance Drill',
          focusArea: 'Weight Transfer & Lead Foot Alignment',
          priority: 'HIGH',
          prescribedSets: '3 Sets x 15 Reps',
          durationMins: 15,
          equipment: 'Side-arm Ball Thrower / Heavy Bat',
          currentScore: 78.5,
          targetScore: 90.0,
          description: 'Lead toe was angled 15° outward during cover drive downswing at 04:12 timestamp.',
          instructions: [
            'Plant lead foot pointing directly down the target drive line.',
            'Initiate downswing only after lead toe makes solid contact.',
            'Hold high finish stance for 2 seconds to reinforce core balance.',
          ],
        },
      ];
    } else if (sport === 'Volleyball') {
      return [
        {
          id: 201,
          title: '3-Step Spike Approach & Vertical Explosion Drill',
          focusArea: 'Penultimate Foot Plant & Vertical Lift',
          priority: 'HIGH',
          prescribedSets: '4 Sets x 10 Approaches',
          durationMins: 20,
          equipment: 'Vertec Vertical Jump Tester / Attack Line Marker',
          currentScore: 76.0,
          targetScore: 91.0,
          description: 'Penultimate foot plant angle leaked horizontal momentum into the net during set 2.',
          instructions: [
            'Initiate 3-step explosive approach starting behind the 3-meter attack line.',
            'Plant penultimate right foot hard at a 30° brake angle to convert forward velocity.',
            'Swing both arms explosively backward to forward-overhead for maximum vertical apex.',
          ],
        },
        {
          id: 202,
          title: 'Overhead Block Penetration & Lateral Shuffling Drill',
          focusArea: 'Hand Positioning Across Net Plane',
          priority: 'HIGH',
          prescribedSets: '3 Sets x 12 Blocks',
          durationMins: 15,
          equipment: 'Volleyball Net & Elastic Resistance Bands',
          currentScore: 79.0,
          targetScore: 88.0,
          description: 'Hands were positioned 8cm behind the tape on quick middle attacks.',
          instructions: [
            'Execute two-step lateral shuffle along the net band.',
            'Press shoulders and reach hands actively over the tape into opponent space.',
            'Keep core engaged and eyes focused on setter ball contact.',
          ],
        },
      ];
    } else { // Football & default
      return [
        {
          id: 301,
          title: 'High-Press Recovery & Closing Speed Drill',
          focusArea: 'Deceleration Control & Low Body Stance',
          priority: 'HIGH',
          prescribedSets: '4 Sets x 8 Sprints',
          durationMins: 18,
          equipment: 'Agility Cones & Resistance Band',
          currentScore: 75.5,
          targetScore: 88.5,
          description: 'Footwork decelerated 1.2s too early when pressing opponent wingers at min 14:20.',
          instructions: [
            'Sprint 15 meters towards target cone at maximum velocity.',
            'Shorten stride 3 meters before cone to drop center of gravity.',
            'Maintain low 45° defensive stance to force opponent wide.',
          ],
        },
        {
          id: 302,
          title: 'Box-to-Box Transition & First-Touch Acceleration',
          focusArea: 'Directional Ball Control & Half-Turn',
          priority: 'HIGH',
          prescribedSets: '3 Sets x 10 Reps',
          durationMins: 15,
          equipment: 'Football & Rebounder Board',
          currentScore: 78.0,
          targetScore: 90.0,
          description: 'First touch under defensive pressure yielded a 0.6s delay before distribution.',
          instructions: [
            'Receive pass on the back foot while scanning shoulder.',
            'Push ball into open channel in a single fluid motion.',
            'Accelerate immediately into passing lane within 2 touches.',
          ],
        },
      ];
    }
  };

  const drills = getDrillsForSport();

  return (
    <div className="pro-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            AI Strategy & Actionable Training Drill Generator
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Tailored for: <span className="text-white font-bold">{athleteName}</span>
        </span>
      </div>

      {/* Drill Cards List */}
      <div className="space-y-3">
        {drills.map((drill) => {
          const isDone = completedDrills[drill.id] || false;
          return (
            <div
              key={drill.id}
              className={`p-4 rounded-lg border transition ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40 opacity-75'
                  : 'bg-[#090a0f] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      {drill.focusArea}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{drill.prescribedSets} • {drill.durationMins} min</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{drill.title}</h4>
                </div>

                <button
                  onClick={() => toggleDrillCompletion(drill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isDone ? 'Drill Completed' : 'Mark as Complete'}
                </button>
              </div>

              <p className="text-xs text-slate-300 mt-2">{drill.description}</p>

              {/* Score Target Bar */}
              <div className="mt-3 p-2.5 rounded bg-[#12151e] border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400">Target Score Improvement:</span>
                <span className="font-mono font-bold text-sky-400">
                  {drill.currentScore.toFixed(1)} → <span className="text-emerald-400">{drill.targetScore.toFixed(1)} / 100</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
