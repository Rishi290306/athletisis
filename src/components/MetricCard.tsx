'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'bg-sky-600/20 text-sky-300 border-sky-500/40'
}: MetricCardProps) {
  return (
    <div className="pro-card p-5 shadow-lg relative overflow-hidden group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{title}</span>
        <div className="p-2.5 rounded-xl bg-sky-600/15 text-sky-400 border border-sky-500/30 group-hover:scale-110 group-hover:bg-sky-600/25 transition-all duration-300 shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-black text-white group-hover:text-sky-300 transition-colors">{value}</span>
        {unit && <span className="text-xs font-bold text-slate-400">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/80">
        {subtitle && <span className="text-[11px] text-slate-300 font-medium">{subtitle}</span>}
        {badge && (
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
