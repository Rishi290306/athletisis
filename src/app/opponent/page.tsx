'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight, CheckCircle2, FolderPlus, Upload } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { Match } from '@/types';

export default function OpponentAnalysisPage() {
  const { activeSport } = useSportStore();
  const config = SPORT_CONFIGS[activeSport];
  const { user } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const [userMatches, setUserMatches] = useState<Match[]>([]);

  useEffect(() => {
    const email = user?.email || '';
    setUserMatches(getMatchesForUser(email));
  }, [user, matches]);

  const sportOpponentData = {
    Football: {
      opponent: 'Opponent FC',
      obs1Title: 'Observation #1: Flank Buildup Bias',
      obs1Desc: '"Opponent frequently initiates attack buildup through their left flank (62% volume)."',
      obs2Title: 'Observation #2: Slow Central Transition',
      obs2Desc: '"Their defensive transition is slow after losing possession in the central third."',
      recTitle: 'Recommended Tactical Approach',
      recDesc: '"Exploit space behind their left wing-back during defensive transition with quick diagonal passes."',
    },
    Cricket: {
      opponent: 'Opponent XI',
      obs1Title: 'Observation #1: Short Ball Vulnerability',
      obs1Desc: '"Opponent top-order batsmen struggle against back-of-length seam deliveries outside off-stump (58% dot ball rate)."',
      obs2Title: 'Observation #2: High Spin Vulnerability in Overs 7-15',
      obs2Desc: '"Their middle order concedes high wicket probability against right-arm off-spin on dry surfaces."',
      recTitle: 'Recommended Bowling Strategy',
      recDesc: '"Deploy aggressive Good Length seam bowling in powerplay and introduce dual spin choke from over 7."',
    },
    Volleyball: {
      opponent: 'Opponent Spikers',
      obs1Title: 'Observation #1: Cross-Court Attack Bias',
      obs1Desc: '"Opponent primary Outside Hitter hits 71% of spikes cross-court toward zone 4."',
      obs2Title: 'Observation #2: Block Seam Gap',
      obs2Desc: '"Their middle blockers leave a 30cm gap when shifting laterally against quick middle sets."',
      recTitle: 'Recommended Block & Defense Grid',
      recDesc: '"Set double block on zone 4 spike angle and position Libero 1.5m deeper for cross-court digs."',
    },
  };

  const oppData = sportOpponentData[activeSport] || sportOpponentData.Football;

  return (
    <AuthGuard>
      <div className="space-y-8">
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{config.icon}</span>
            <span className="text-[10px] font-black uppercase text-brand-400 tracking-widest">{config.name} Scouting Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white">Opponent Analysis & Pre-Match AI Strategy</h1>
          <p className="text-xs text-slate-400">Analyze opponent video footage to uncover attack patterns, defensive gaps, and tactical tendencies for {config.name}</p>
        </div>

        {userMatches.length === 0 ? (
          <div className="glass-panel border border-brand-500/30 rounded-3xl p-12 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto shadow-xl">
              <FolderPlus className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-black text-white">No Opponent Video Analyzed Yet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your opponent's {config.name} game video to generate automated pre-match AI strategies, weakness observations, and defensive tactical recommendations!
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 font-black text-black text-xs uppercase tracking-wider shadow-xl shadow-brand-500/25 transition hover:scale-105"
            >
              <Upload className="w-4 h-4" /> Upload Opponent Video <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-dark-900 border border-brand-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              Pre-Match AI Game Plan vs {oppData.opponent} ({config.name})
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-xs text-slate-200">
                <strong className="text-brand-400 font-bold block mb-1">{oppData.obs1Title}</strong>
                {oppData.obs1Desc}
              </div>

              <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-xs text-slate-200">
                <strong className="text-amber-400 font-bold block mb-1">{oppData.obs2Title}</strong>
                {oppData.obs2Desc}
              </div>

              <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-xs text-slate-200">
                <strong className="text-emerald-400 font-bold block mb-1">{oppData.recTitle}</strong>
                {oppData.recDesc}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
