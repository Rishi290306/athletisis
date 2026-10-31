'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Dumbbell, TrendingUp, CheckCircle2, Target, ArrowRight, FolderPlus, Upload } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { Match } from '@/types';

export default function TrainingPage() {
  const { activeSport } = useSportStore();
  const config = SPORT_CONFIGS[activeSport];
  const { user } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const [userMatches, setUserMatches] = useState<Match[]>([]);

  useEffect(() => {
    const email = user?.email || '';
    setUserMatches(getMatchesForUser(email));
  }, [user, matches]);

  const sportTrainingData = {
    Football: {
      feedbackTitle: 'Positioning Score Progress: 61.0 → 79.0',
      feedbackText: '"Your defensive transition positioning improved by 29.5% across your last 4 matches following the targeted transition drills!"',
      drill1Title: 'Defensive Transition & Compact Midfield Positioning',
      drill1Desc: 'Targeted drill focused on immediate 15m drop-back upon ball turnover in opposition half to seal central passing lanes.',
      drill2Title: 'Press-Resistance & Quick Option Scan',
      drill2Desc: 'Simulated central press drill training rapid pre-orientation scan to lay off passes to open wide players under high pressure.',
    },
    Cricket: {
      feedbackTitle: 'Bowling Line & Length Accuracy: 61.0 → 79.0',
      feedbackText: '"Your Good Length delivery consistency and middle-overs shot selection improved by 29.5% across your last 4 matches!"',
      drill1Title: 'Good Length Consistency & Line Control',
      drill1Desc: 'Targeted seam/spin delivery drill focusing on top of off-stump 6-8 meter pitch landing zone under pressure.',
      drill2Title: 'Spin Power-Hitting & Gap Placement',
      drill2Desc: 'Simulated middle-overs spin press training rapid footwork, wrist rotation, and 360° gap scanning against turning deliveries.',
    },
    Volleyball: {
      feedbackTitle: 'Spike Timing & Vertical Peak: 61.0 → 79.0',
      feedbackText: '"Your spike jump timing and setter-to-spiker transition reading improved by 29.5% across your last 4 matches!"',
      drill1Title: 'Explosive Spike Approach & Block Touch Avoidance',
      drill1Desc: 'High-intensity jump approach timing drill focusing on 78cm vertical peak and wrist snap to beat double blocks.',
      drill2Title: 'Setter Option Reading & Rapid Dig Defense',
      drill2Desc: 'Simulated fast-tempo setting & digging drill to read opponent spiker shoulder angle and seal cross-court digs.',
    },
  };

  const data = (sportTrainingData as any)[activeSport] || sportTrainingData.Football;

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="pro-card p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase text-brand-400 tracking-wider">{config.name} Training Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Personalized Training & Feedback Loop</h1>
            <p className="text-xs text-slate-400">Targeted drills derived from detected {config.name} weaknesses with measurable performance goals</p>
          </div>
        </div>

        {userMatches.length === 0 ? (
          <div className="pro-card p-12 text-center space-y-6">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-white">No {config.name} Video Analyzed Yet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your first {config.name} game to calculate technique weaknesses, performance goals, and personalized drills.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold text-white text-xs uppercase tracking-wider transition"
            >
              <Upload className="w-4 h-4" /> Upload First Match <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Progress Feedback Loop Component */}
            <div className="pro-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-brand-400 tracking-wider">
                    {config.name} Feedback Loop
                  </span>
                  <h2 className="text-base font-bold text-white">{data.feedbackTitle}</h2>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  +29.5% Improvement
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {data.feedbackText}
              </p>

              <div className="grid grid-cols-4 gap-2 text-center pt-2">
                <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800"><span className="text-[10px] text-slate-500 block">Match 1</span><span className="font-semibold text-slate-300 text-xs">61.0</span></div>
                <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800"><span className="text-[10px] text-slate-500 block">Match 2</span><span className="font-semibold text-slate-300 text-xs">68.0</span></div>
                <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800"><span className="text-[10px] text-slate-500 block">Match 3</span><span className="font-semibold text-slate-300 text-xs">74.0</span></div>
                <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/30"><span className="text-[10px] text-brand-400 block font-semibold">Match 4</span><span className="font-bold text-brand-400 text-sm">79.0</span></div>
              </div>
            </div>

            {/* Active Priority Drills */}
            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Active {config.name} Training Drills</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-lg pro-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                      Priority: HIGH
                    </span>
                    <span className="text-xs font-medium text-slate-400">Target: 85.0</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{data.drill1Title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {data.drill1Desc}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-slate-400">
                    <span>Frequency: 3 sessions/week</span>
                    <span className="text-brand-400">Status: Active</span>
                  </div>
                </div>

                <div className="p-5 rounded-lg pro-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Priority: MEDIUM
                    </span>
                    <span className="text-xs font-medium text-slate-400">Target: 88.0</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{data.drill2Title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {data.drill2Desc}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-slate-400">
                    <span>Frequency: 2 sessions/week</span>
                    <span className="text-brand-400">Status: Active</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
