'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Activity, Award, TrendingUp, FolderPlus, Upload, ArrowRight } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { Match } from '@/types';

export default function TeamAnalyticsPage() {
  const { activeSport } = useSportStore();
  const config = SPORT_CONFIGS[activeSport];
  const { user, athlete } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const activeUser = user?.fullName || 'Athlete User';

  useEffect(() => {
    const email = user?.email || '';
    setUserMatches(getMatchesForUser(email));
  }, [user, matches]);

  const sportTeamData = {
    Football: {
      bg: 'bg-[#062012]',
      networkTitle: 'Tactical Passing Network & Player Combinations',
      nodes: [
        { id: 'P7', name: `${activeUser} (CM)`, x: 50, y: 55, passes: 42 },
        { id: 'P10', name: 'Alex Hunter (LW)', x: 25, y: 75, passes: 35 },
        { id: 'P9', name: 'Marcus Rashford (ST)', x: 50, y: 85, passes: 28 },
        { id: 'P4', name: 'Virgil van Dijk (CB)', x: 50, y: 25, passes: 48 },
      ],
      strengths: [
        '● High Midfield Buildup Volume (42 passes/match through central corridor)',
        '● Strong Central Defense Overload (94.4% pass accuracy out from backline)',
      ],
      improved: `${activeUser} (Center Midfielder)`,
      improvedDesc: '+29.5% improvement in defensive transition positioning score across last 4 matches.',
    },
    Cricket: {
      bg: 'bg-[#0e3818]',
      networkTitle: '22-Yard Pitch Bowling & Batting Partnership Map',
      nodes: [
        { id: 'B1', name: `${activeUser} (All-Rounder)`, x: 50, y: 40, passes: 84 },
        { id: 'B2', name: 'Rohit Sharma (Opener)', x: 30, y: 75, passes: 62 },
        { id: 'B3', name: 'Virat Kohli (Middle-Order)', x: 70, y: 75, passes: 78 },
        { id: 'P1', name: 'Jasprit Bumrah (Fast Bowler)', x: 50, y: 20, passes: 92 },
      ],
      strengths: [
        '● Tight Middle-Overs Bowling Economy (6.4 RPO in overs 11-40)',
        '● Strong Powerplay Boundary Rate (88.2% contact quality off front foot)',
      ],
      improved: `${activeUser} (All-Rounder / Bowler)`,
      improvedDesc: '+29.5% improvement in Good Length landing accuracy across last 4 matches.',
    },
    Volleyball: {
      bg: 'bg-[#1e1b4b]',
      networkTitle: 'Court Rotation & Spiker-Setter Pass Distribution',
      nodes: [
        { id: 'V1', name: `${activeUser} (Setter)`, x: 50, y: 60, passes: 65 },
        { id: 'V2', name: 'Karch Kiraly (Spiker)', x: 25, y: 80, passes: 44 },
        { id: 'V3', name: 'Giba (Outside Hitter)', x: 75, y: 80, passes: 51 },
        { id: 'V4', name: 'Sérgio Santos (Libero)', x: 50, y: 20, passes: 70 },
      ],
      strengths: [
        '● High Net Spike Efficiency (48.2% kill rate on quick tempo sets)',
        '● Balanced Setter Distribution (89.5% unblockable set accuracy)',
      ],
      improved: `${activeUser} (Setter / Spiker)`,
      improvedDesc: '+29.5% improvement in spike jump timing & block touch avoidance.',
    },
  };

  const teamData = sportTeamData[activeSport] || sportTeamData.Football;

  return (
    <AuthGuard>
      <div className="space-y-8">
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{config.icon}</span>
              <span className="text-[10px] font-black uppercase text-brand-400 tracking-widest">{config.name} Team Engine</span>
            </div>
            <h1 className="text-2xl font-black text-white">{athlete?.teamName || 'My Team'} — {config.name} Team Analytics</h1>
            <p className="text-xs text-slate-400">Tactical positioning networks, player combinations, and team efficiency metrics</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Team Rating</span>
            <span className="text-3xl font-black text-brand-400">{userMatches.length > 0 ? '82.5' : '0.0'}</span>
          </div>
        </div>

        {userMatches.length === 0 ? (
          <div className="glass-panel border border-brand-500/30 rounded-3xl p-12 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto shadow-xl">
              <FolderPlus className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-black text-white">No Team Match Video Analyzed Yet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your first {config.name} match video to calculate tactical passing networks, team combination nodes, and player chemistry ratings!
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 font-black text-black text-xs uppercase tracking-wider shadow-xl shadow-brand-500/25 transition hover:scale-105"
            >
              <Upload className="w-4 h-4" /> Upload First Match <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Network Diagram Visualization */}
            <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-400" />
                {teamData.networkTitle}
              </h2>

              <div className={`relative aspect-video max-h-96 ${teamData.bg} rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden transition-colors duration-300`}>
                {/* Field/Pitch Markings */}
                <div className="absolute inset-4 border border-white/20 rounded">
                  <div className="absolute left-1/2 inset-y-0 border-r border-white/20" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/20" />
                </div>

                {/* Node Connections */}
                <svg className="absolute inset-0 w-full h-full">
                  <line x1="50%" y1="75%" x2="50%" y2="45%" stroke="#22c55e" strokeWidth="4" strokeOpacity="0.7" />
                  <line x1="50%" y1="45%" x2="25%" y2="25%" stroke="#22c55e" strokeWidth="3" strokeOpacity="0.7" />
                  <line x1="50%" y1="45%" x2="70%" y2="25%" stroke="#22c55e" strokeWidth="3" strokeOpacity="0.7" />
                  <line x1="50%" y1="45%" x2="50%" y2="15%" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.7" />
                </svg>

                {/* Player Nodes */}
                {teamData.nodes.map((n) => (
                  <div
                    key={n.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                    style={{ left: `${n.x}%`, top: `${100 - n.y}%` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-500 text-black font-extrabold text-xs flex items-center justify-center shadow-lg shadow-brand-500/40 group-hover:scale-110 transition-transform">
                      {n.id}
                    </div>
                    <span className="block text-[10px] font-bold text-white bg-black/90 px-2 py-0.5 rounded mt-1 shadow text-center whitespace-nowrap border border-slate-700">
                      {n.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Strengths & Most Improved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">{config.name} Team Strengths</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {teamData.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-2">{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-dark-900 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Most Improved Player</h3>
                <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 text-xs">
                  <span className="font-bold text-brand-400 block text-sm">{teamData.improved}</span>
                  <p className="text-slate-300 mt-1">{teamData.improvedDesc}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
