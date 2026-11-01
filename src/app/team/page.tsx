'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Activity, Award, TrendingUp, FolderPlus, Upload, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { Match } from '@/types';

export default function TeamAnalyticsPage() {
  const { activeSport } = useSportStore();
  const config = SPORT_CONFIGS[activeSport] || SPORT_CONFIGS['Cricket'];
  const { user, athlete } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const activeUser = user?.fullName || 'Rishi Tiwari';

  useEffect(() => {
    const email = user?.email || '';
    setUserMatches(getMatchesForUser(email));
  }, [user, matches, getMatchesForUser]);

  const sportTeamData = {
    Football: {
      networkTitle: 'Tactical Passing Network & Field Spatial Combinations',
      nodes: [
        { id: 'P7', name: `${activeUser} (CM)`, x: 50, y: 55, passes: 42, role: 'Central Midfielder', rating: 88.4 },
        { id: 'P10', name: 'Alex Hunter (LW)', x: 25, y: 75, passes: 35, role: 'Left Winger', rating: 84.1 },
        { id: 'P9', name: 'Marcus Rashford (ST)', x: 50, y: 85, passes: 28, role: 'Striker', rating: 86.7 },
        { id: 'P4', name: 'Virgil van Dijk (CB)', x: 50, y: 25, passes: 48, role: 'Center Back', rating: 89.2 },
      ],
      strengths: [
        'High Midfield Buildup Volume: 42 passes/match through central corridor',
        'Strong Central Defense Overload: 94.4% pass accuracy out from backline',
        'Counter-Press Recovery: 4.2s average ball recovery in offensive third',
      ],
      improved: `${activeUser} (Center Midfielder)`,
      improvedDesc: '+29.5% improvement in defensive transition positioning score across recent fixtures.',
    },
    Cricket: {
      networkTitle: '22-Yard Pitch Bowling & Batting Partnership Map',
      nodes: [
        { id: 'B1', name: `${activeUser} (All-Rounder)`, x: 50, y: 40, passes: 84, role: 'Fast Bowler & Finisher', rating: 89.5 },
        { id: 'B2', name: 'Rohit Sharma (Opener)', x: 30, y: 75, passes: 62, role: 'Opening Batsman', rating: 87.0 },
        { id: 'B3', name: 'Virat Kohli (Middle-Order)', x: 70, y: 75, passes: 78, role: 'Anchor Batsman', rating: 91.2 },
        { id: 'P1', name: 'Jasprit Bumrah (Fast Bowler)', x: 50, y: 20, passes: 92, role: 'Strike Bowler', rating: 94.8 },
      ],
      strengths: [
        'Tight Middle-Overs Bowling Economy: 6.4 RPO maintained in overs 11–40',
        'Strong Powerplay Boundary Rate: 88.2% contact quality off front foot',
        'Wicket-to-Wicket Accuracy: 78.4% deliveries pitched in good-length channel',
      ],
      improved: `${activeUser} (All-Rounder / Bowler)`,
      improvedDesc: '+29.5% improvement in Good Length landing accuracy across recent match deliveries.',
    },
    Volleyball: {
      networkTitle: 'Court Rotation & Spiker-Setter Pass Distribution',
      nodes: [
        { id: 'V1', name: `${activeUser} (Setter)`, x: 50, y: 60, passes: 65, role: 'Primary Setter', rating: 86.8 },
        { id: 'V2', name: 'Karch Kiraly (Spiker)', x: 25, y: 80, passes: 44, role: 'Outside Hitter', rating: 88.5 },
        { id: 'V3', name: 'Giba (Outside Hitter)', x: 75, y: 80, passes: 51, role: 'Opposite Spiker', rating: 85.9 },
        { id: 'V4', name: 'Sérgio Santos (Libero)', x: 50, y: 20, passes: 70, role: 'Defensive Specialist', rating: 90.1 },
      ],
      strengths: [
        'High Net Spike Efficiency: 48.2% kill rate on quick tempo sets',
        'Balanced Setter Distribution: 89.5% unblockable set accuracy',
        'Second-Touch Transition: 1.8s average setter release under receive pressure',
      ],
      improved: `${activeUser} (Setter / Spiker)`,
      improvedDesc: '+29.5% improvement in spike jump timing & block touch avoidance.',
    },
  };

  const teamData = (sportTeamData as any)[activeSport] || sportTeamData.Cricket;

  return (
    <AuthGuard>
      <div className="space-y-6">
        
        {/* Squad Overview Header */}
        <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0B1020] text-[#55BDEB] border border-[#28334D]">
                {config.name} Squad Engine
              </span>
              <span className="text-xs text-[#9AA6BD]">• 18 Athletes Calibrated</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5FA] tracking-tight">
              {athlete?.teamName || 'National Squad'} — Player Analytics & Combinations
            </h1>
            <p className="text-xs text-[#9AA6BD]">
              Tactical positioning networks, player chemistry combinations, and athlete performance ratings.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0B1020] px-4 py-2.5 rounded-lg border border-[#28334D] shrink-0">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#9AA6BD] block">Squad Efficiency</span>
              <span className="text-xl font-bold font-mono text-[#6675E8]">
                {userMatches.length > 0 ? '84.6%' : '82.0%'}
              </span>
            </div>
            <div className="h-8 w-px bg-[#28334D]" />
            <div>
              <span className="text-[10px] font-mono uppercase text-[#9AA6BD] block">Injury Risk</span>
              <span className="text-xs font-semibold text-emerald-400 block mt-1">Low / Optimal</span>
            </div>
          </div>
        </div>

        {/* Tactical Spatial Combination Map */}
        <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#28334D]">
            <div>
              <h2 className="text-sm font-bold text-[#F3F5FA] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#55BDEB]" />
                <span>{teamData.networkTitle}</span>
              </h2>
              <p className="text-xs text-[#9AA6BD] mt-0.5">
                Spatial passing frequency and partnership nodes mapped to 2D pitch coordinates
              </p>
            </div>
            <span className="text-[10px] font-mono text-[#55BDEB] px-2 py-0.5 rounded bg-[#0B1020] border border-[#28334D]">
              Real-time Coordinates
            </span>
          </div>

          <div className="relative aspect-video max-h-96 bg-[#0B1020] rounded-lg border border-[#28334D] flex items-center justify-center overflow-hidden">
            {/* Tactical Coordinate Grid Markings */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#28334D_1px,transparent_1px),linear-gradient(to_bottom,#28334D_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            {/* Field Boundary Outline */}
            <div className="absolute inset-4 rounded border border-[#28334D]/60 pointer-events-none">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-[#28334D]/40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-[#28334D]/40" />
            </div>

            {/* Dynamic Node Connections SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="50%" y1="75%" x2="50%" y2="45%" stroke="#6675E8" strokeWidth="2" strokeOpacity="0.6" strokeDasharray="4 2" />
              <line x1="50%" y1="45%" x2="25%" y2="25%" stroke="#6675E8" strokeWidth="2" strokeOpacity="0.6" strokeDasharray="4 2" />
              <line x1="50%" y1="45%" x2="70%" y2="25%" stroke="#6675E8" strokeWidth="2" strokeOpacity="0.6" strokeDasharray="4 2" />
              <line x1="50%" y1="45%" x2="50%" y2="15%" stroke="#55BDEB" strokeWidth="2" strokeOpacity="0.7" />
            </svg>

            {/* Player Nodes with Telemetry Badges */}
            {teamData.nodes.map((n: any) => (
              <div
                key={n.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                style={{ left: `${n.x}%`, top: `${100 - n.y}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-[#6675E8] text-white font-bold text-xs flex items-center justify-center shadow-md group-hover:bg-[#5463D6] group-hover:scale-105 transition-all">
                  {n.id}
                </div>
                <div className="text-[10px] font-medium text-[#F3F5FA] bg-[#151C35] px-2 py-0.5 rounded mt-1 shadow-md text-center whitespace-nowrap border border-[#28334D] group-hover:border-[#55BDEB] transition-colors">
                  <div>{n.name}</div>
                  <div className="text-[9px] font-mono text-[#55BDEB]">{n.passes} interactions • {n.rating}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Squad Athlete Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamData.nodes.map((n: any) => (
            <div
              key={n.id}
              className="p-4 rounded-xl bg-[#151C35] border border-[#28334D] hover:border-[#3D4D73] transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#55BDEB] font-bold text-xs flex items-center justify-center font-mono">
                  {n.id}
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#0B1020] text-emerald-400 border border-[#28334D]">
                  {n.rating}% RTG
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#F3F5FA] truncate">{n.name}</h4>
                <p className="text-[11px] text-[#9AA6BD] truncate">{n.role}</p>
              </div>

              <div className="pt-2 border-t border-[#28334D] text-xs flex items-center justify-between text-[#9AA6BD]">
                <span className="text-[10px] font-mono">{n.passes} Phase Events</span>
                <span className="text-[10px] text-emerald-400 font-medium">Optimal Strain</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Strengths & Most Improved Player Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-[#151C35] border border-[#28334D] space-y-3">
            <h3 className="text-xs font-bold text-[#F3F5FA] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#55BDEB]" />
              <span>{config.name} Tactical Strengths</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#9AA6BD]">
              {teamData.strengths.map((s: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#55BDEB] mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl bg-[#151C35] border border-[#28334D] space-y-3">
            <h3 className="text-xs font-bold text-[#F3F5FA] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#E8B75A]" />
              <span>Key Progression Athlete</span>
            </h3>
            <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#28334D] space-y-1">
              <span className="font-bold text-[#E8B75A] block text-xs">{teamData.improved}</span>
              <p className="text-[#9AA6BD] text-xs leading-relaxed">{teamData.improvedDesc}</p>
            </div>
          </div>
        </div>

      </div>
    </AuthGuard>
  );
}
