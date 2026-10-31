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

  const teamData = (sportTeamData as any)[activeSport] || sportTeamData.Football;

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="pro-card p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase text-brand-400 tracking-wider">{config.name} Team Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{athlete?.teamName || 'My Team'} — {config.name} Team Analytics</h1>
            <p className="text-xs text-slate-400">Tactical positioning networks, player combinations, and team efficiency metrics</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Team Rating</span>
            <span className="text-2xl font-bold text-brand-400">{userMatches.length > 0 ? '82.5' : '0.0'}</span>
          </div>
        </div>

        {userMatches.length === 0 ? (
          <div className="pro-card p-12 text-center space-y-6">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-white">No Team Match Video Analyzed Yet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your first {config.name} match video to calculate tactical passing networks, team combination nodes, and player chemistry ratings.
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
            {/* Network Diagram Visualization */}
            <div className="pro-card p-6 space-y-4">
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-400" />
                {teamData.networkTitle}
              </h2>

              <div className="relative aspect-video max-h-96 bg-[#090D16] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* Tactical Formation Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />

                {/* Node Connections */}
                <svg className="absolute inset-0 w-full h-full">
                  <line x1="50%" y1="75%" x2="50%" y2="45%" stroke="#0ea5e9" strokeWidth="2" strokeOpacity="0.7" />
                  <line x1="50%" y1="45%" x2="25%" y2="25%" stroke="#0ea5e9" strokeWidth="2" strokeOpacity="0.7" />
                  <line x1="50%" y1="45%" x2="70%" y2="25%" stroke="#0ea5e9" strokeWidth="2" strokeOpacity="0.7" />
                  <line x1="50%" y1="45%" x2="50%" y2="15%" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.7" />
                </svg>

                {/* Player Nodes */}
                {teamData.nodes.map((n: any) => (
                  <div
                    key={n.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                    style={{ left: `${n.x}%`, top: `${100 - n.y}%` }}
                  >
                    <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      {n.id}
                    </div>
                    <span className="block text-[10px] font-medium text-slate-200 bg-[#0E1424]/95 px-2 py-0.5 rounded mt-1 shadow text-center whitespace-nowrap border border-slate-800">
                      {n.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Strengths & Most Improved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg pro-card space-y-3">
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">{config.name} Team Strengths</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  {teamData.strengths.map((s: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-lg pro-card space-y-3">
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Most Improved Player</h3>
                <div className="p-3.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-xs">
                  <span className="font-semibold text-brand-400 block text-xs">{teamData.improved}</span>
                  <p className="text-slate-300 mt-1 text-xs">{teamData.improvedDesc}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
