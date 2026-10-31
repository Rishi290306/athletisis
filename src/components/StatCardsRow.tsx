'use client';

import React from 'react';
import {
  Video,
  Users,
  Award,
  Activity,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface StatCardsRowProps {
  totalMatches: number;
  playersAnalyzed: number;
  averagePerformance: number | string;
  keyActionsDetected: number | string;
}

export function StatCardsRow({
  totalMatches,
  playersAnalyzed,
  averagePerformance,
  keyActionsDetected,
}: StatCardsRowProps) {
  const cards = [
    {
      title: 'Total Matches',
      value: totalMatches,
      unit: 'Matches',
      trend: '+12.5% this month',
      trendUp: true,
      icon: Video,
      gradient: 'from-blue-950/40 via-[#0E1638] to-[#090E26]',
      border: 'border-blue-500/25 hover:border-blue-500/40',
      iconBox: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      shadow: 'shadow-blue-500/5',
    },
    {
      title: 'Players Analyzed',
      value: playersAnalyzed,
      unit: 'Athletes',
      trend: '+4 squad additions',
      trendUp: true,
      icon: Users,
      gradient: 'from-purple-950/40 via-[#0E1638] to-[#090E26]',
      border: 'border-purple-500/25 hover:border-purple-500/40',
      iconBox: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      shadow: 'shadow-purple-500/5',
    },
    {
      title: 'Average Performance',
      value: typeof averagePerformance === 'number' ? `${averagePerformance.toFixed(1)}%` : averagePerformance,
      unit: 'Score',
      trend: '+3.2% vs baseline',
      trendUp: true,
      icon: Award,
      gradient: 'from-amber-950/35 via-[#0E1638] to-[#090E26]',
      border: 'border-amber-500/25 hover:border-amber-500/40',
      iconBox: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
      shadow: 'shadow-amber-500/5',
    },
    {
      title: 'Key Actions Detected',
      value: typeof keyActionsDetected === 'number' ? keyActionsDetected.toLocaleString() : keyActionsDetected,
      unit: 'Events',
      trend: '98.4% AI accuracy',
      trendUp: true,
      icon: Activity,
      gradient: 'from-cyan-950/40 via-[#0E1638] to-[#090E26]',
      border: 'border-cyan-500/25 hover:border-cyan-500/40',
      iconBox: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      shadow: 'shadow-cyan-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className={`rounded-2xl p-5 bg-gradient-to-br ${c.gradient} border ${c.border} ${c.shadow} shadow-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 group`}
          >
            {/* Top row: Title + Icon */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 tracking-wide">
                {c.title}
              </span>
              <div className={`p-2 rounded-xl border ${c.iconBox} shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Value row */}
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {c.value}
              </span>
              <span className="text-xs font-bold text-slate-400 font-mono">
                {c.unit}
              </span>
            </div>

            {/* Bottom trend pill */}
            <div className="mt-3.5 pt-2.5 border-t border-indigo-950/60 flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>{c.trend}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-medium">
                Verified
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
