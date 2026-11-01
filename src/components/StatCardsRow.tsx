'use client';

import React from 'react';
import {
  Video,
  Users,
  Award,
  Activity,
  TrendingUp,
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
      unit: 'matches',
      trend: '+12.5% this month',
      icon: Video,
      accentColor: 'text-[#6675E8]',
      iconBg: 'bg-[#6675E8]/10 border-[#6675E8]/30',
    },
    {
      title: 'Players Analyzed',
      value: playersAnalyzed,
      unit: 'athletes',
      trend: '+4 squad additions',
      icon: Users,
      accentColor: 'text-[#55BDEB]',
      iconBg: 'bg-[#55BDEB]/10 border-[#55BDEB]/30',
    },
    {
      title: 'Average Performance',
      value: typeof averagePerformance === 'number' ? `${averagePerformance.toFixed(1)}%` : averagePerformance,
      unit: 'score',
      trend: '+3.2% vs baseline',
      icon: Award,
      accentColor: 'text-[#E8B75A]',
      iconBg: 'bg-[#E8B75A]/10 border-[#E8B75A]/30',
    },
    {
      title: 'Key Actions Detected',
      value: typeof keyActionsDetected === 'number' ? keyActionsDetected.toLocaleString() : keyActionsDetected,
      unit: 'events',
      trend: '98.4% AI accuracy',
      icon: Activity,
      accentColor: 'text-[#6675E8]',
      iconBg: 'bg-[#6675E8]/10 border-[#6675E8]/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.title}
            className="rounded-xl p-4 bg-[#151C35] border border-[#28334D] hover:border-[#3D4D73] transition-colors"
          >
            {/* Top row: Title + Icon */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#9AA6BD]">
                {c.title}
              </span>
              <div className={`p-1.5 rounded-md border ${c.iconBg} ${c.accentColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Value row */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-[#F3F5FA] font-mono tracking-tight tabular-nums">
                {c.value}
              </span>
              <span className="text-xs font-mono text-[#9AA6BD]">
                {c.unit}
              </span>
            </div>

            {/* Bottom trend pill */}
            <div className="mt-3 pt-2.5 border-t border-[#28334D] flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>{c.trend}</span>
              </span>
              <span className="text-[10px] text-[#9AA6BD] font-mono">
                Verified
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
