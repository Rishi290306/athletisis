'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Dumbbell,
  TrendingUp,
  CheckCircle2,
  Target,
  ArrowRight,
  FolderPlus,
  Upload,
  Clock,
  Flame,
  Check,
} from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { Match } from '@/types';

interface TrainingDrill {
  id: number;
  title: string;
  desc: string;
  priority: string;
  priorityColor: string;
  targetScore: string;
  sets: string;
  duration: string;
}

export default function TrainingPage() {
  const { activeSport } = useSportStore();
  const config = SPORT_CONFIGS[activeSport] || SPORT_CONFIGS['Cricket'];
  const { user } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [completedDrills, setCompletedDrills] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const email = user?.email || '';
    setUserMatches(getMatchesForUser(email));
  }, [user, matches, getMatchesForUser]);

  const toggleDrill = (id: number) => {
    setCompletedDrills((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sportTrainingData = {
    Football: {
      feedbackTitle: 'Positioning Score Progression: 61.0 → 79.0',
      feedbackText: 'Defensive transition positioning improved by +29.5% across last 4 fixtures following the targeted counter-press transition drills.',
      drills: [
        {
          id: 1,
          title: 'Defensive Transition & Compact Midfield Positioning',
          desc: 'Targeted drill focused on immediate 15m drop-back upon ball turnover in opposition half to seal central passing lanes.',
          priority: 'HIGH PRIORITY',
          priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          targetScore: '85.0 Target',
          sets: '4 Sets × 8 Reps',
          duration: '25 Mins',
        },
        {
          id: 2,
          title: 'Press-Resistance & Quick Option Pre-Orientation Scan',
          desc: 'Simulated central press drill training rapid pre-orientation scan to lay off passes to open wide players under high pressure.',
          priority: 'TECHNICAL',
          priorityColor: 'text-[#E8B75A] bg-[#E8B75A]/10 border-[#E8B75A]/30',
          targetScore: '88.0 Target',
          sets: '5 Sets × 6 Reps',
          duration: '30 Mins',
        },
      ],
    },
    Cricket: {
      feedbackTitle: 'Bowling Line & Length Accuracy: 61.0 → 79.0',
      feedbackText: 'Good Length delivery consistency and middle-overs shot selection improved by +29.5% across analyzed bowling spells.',
      drills: [
        {
          id: 1,
          title: 'Good Length Seam Consistency & Top-of-Off Channel',
          desc: 'Targeted seam/spin delivery drill focusing on top of off-stump 6–8 meter pitch landing zone with varying crease angles.',
          priority: 'HIGH PRIORITY',
          priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          targetScore: '85.0 Target',
          sets: '6 Overs × 6 Deliveries',
          duration: '35 Mins',
        },
        {
          id: 2,
          title: 'Middle-Overs Gap Placement & Wrist Rotation Work',
          desc: 'Simulated spin rotation training rapid footwork, wrist rotation, and 360° gap scanning against turning deliveries.',
          priority: 'TECHNICAL',
          priorityColor: 'text-[#E8B75A] bg-[#E8B75A]/10 border-[#E8B75A]/30',
          targetScore: '88.0 Target',
          sets: '5 Sets × 12 Balls',
          duration: '30 Mins',
        },
      ],
    },
    Volleyball: {
      feedbackTitle: 'Spike Timing & Vertical Peak: 61.0 → 79.0',
      feedbackText: 'Spike approach jump timing and setter-to-spiker transition reading improved by +29.5% across recent competitive sets.',
      drills: [
        {
          id: 1,
          title: 'Explosive Spike Approach & Double-Block Touch Avoidance',
          desc: 'High-intensity jump approach timing drill focusing on 78cm vertical peak and wrist snap to beat outside double blocks.',
          priority: 'HIGH PRIORITY',
          priorityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          targetScore: '85.0 Target',
          sets: '5 Sets × 10 Jumps',
          duration: '30 Mins',
        },
        {
          id: 2,
          title: 'Setter Option Reading & Rapid Dig Floor Defense',
          desc: 'Simulated fast-tempo setting & digging drill to read opponent spiker shoulder angle and seal cross-court platform digs.',
          priority: 'TECHNICAL',
          priorityColor: 'text-[#E8B75A] bg-[#E8B75A]/10 border-[#E8B75A]/30',
          targetScore: '88.0 Target',
          sets: '4 Sets × 15 Digs',
          duration: '25 Mins',
        },
      ],
    },
  };

  const data = (sportTrainingData as any)[activeSport] || sportTrainingData.Cricket;

  return (
    <AuthGuard>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0B1020] text-[#6675E8] border border-[#28334D]">
                {config.name} Training Curriculum
              </span>
              <span className="text-xs text-[#9AA6BD]">• Biomechanical Feedback Loop</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5FA] tracking-tight">
              Personalized Drills & Corrective Training Hub
            </h1>
            <p className="text-xs text-[#9AA6BD]">
              Targeted exercise curriculum automatically generated from kinematic flaws and movement patterns detected in match footage.
            </p>
          </div>

          <Link
            href="/upload"
            className="px-3.5 py-2 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95 shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Match</span>
          </Link>
        </div>

        {/* Progress Feedback Loop Card */}
        <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#28334D]">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#55BDEB]">
                AI Performance Feedback
              </span>
              <h2 className="text-sm font-bold text-[#F3F5FA] mt-0.5">{data.feedbackTitle}</h2>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +29.5% Net Progress
            </span>
          </div>

          <p className="text-xs text-[#9AA6BD] leading-relaxed">
            {data.feedbackText}
          </p>

          <div className="grid grid-cols-4 gap-3 text-center pt-1">
            <div className="p-3 rounded-lg bg-[#0B1020] border border-[#28334D]">
              <span className="text-[10px] text-[#9AA6BD] block font-mono">Match 1</span>
              <span className="font-mono font-bold text-[#F3F5FA] text-sm">61.0%</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0B1020] border border-[#28334D]">
              <span className="text-[10px] text-[#9AA6BD] block font-mono">Match 2</span>
              <span className="font-mono font-bold text-[#F3F5FA] text-sm">68.0%</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0B1020] border border-[#28334D]">
              <span className="text-[10px] text-[#9AA6BD] block font-mono">Match 3</span>
              <span className="font-mono font-bold text-[#F3F5FA] text-sm">74.0%</span>
            </div>
            <div className="p-3 rounded-lg bg-[#0B1020] border border-[#6675E8]/40 shadow-sm">
              <span className="text-[10px] text-[#55BDEB] block font-mono font-semibold">Match 4 (Current)</span>
              <span className="font-mono font-bold text-[#55BDEB] text-sm">79.0%</span>
            </div>
          </div>
        </div>

        {/* Active Corrective Drills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#9AA6BD]">
              Active {config.name} Corrective Drills
            </h2>
            <span className="text-xs text-[#9AA6BD] font-mono">
              {Object.values(completedDrills).filter(Boolean).length} of {data.drills.length} Completed Today
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.drills as TrainingDrill[]).map((drill: TrainingDrill) => {
              const isDone = !!completedDrills[drill.id];
              return (
                <div
                  key={drill.id}
                  className={`p-5 rounded-xl bg-[#151C35] border transition-all space-y-3.5 ${
                    isDone ? 'border-emerald-500/40 opacity-85' : 'border-[#28334D] hover:border-[#3D4D73]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border ${drill.priorityColor}`}>
                      {drill.priority}
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#55BDEB]">
                      {drill.targetScore}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-sm font-bold text-[#F3F5FA] ${isDone ? 'line-through text-[#9AA6BD]' : ''}`}>
                      {drill.title}
                    </h3>
                    <p className="text-xs text-[#9AA6BD] leading-relaxed mt-1">
                      {drill.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#28334D] flex items-center justify-between text-xs text-[#9AA6BD] font-mono">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#9AA6BD]" /> {drill.duration} • {drill.sets}
                    </span>

                    <button
                      onClick={() => toggleDrill(drill.id)}
                      className={`px-3 py-1.5 rounded-md font-sans text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#0B1020] text-[#F3F5FA] border border-[#28334D] hover:border-[#6675E8]'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <span>Mark Done</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </AuthGuard>
  );
}
