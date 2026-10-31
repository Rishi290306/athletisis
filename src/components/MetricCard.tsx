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
  badgeColor = 'bg-sky-500/10 text-sky-400 border-sky-500/20'
}: MetricCardProps) {
  return (
    <div className="pro-card p-4 sm:p-5 transition group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="w-7 h-7 rounded-md bg-[#141D30] text-slate-400 flex items-center justify-center border border-slate-800/80 group-hover:text-sky-400 transition-colors">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">{value}</span>
        {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
      </div>

      {(subtitle || badge) && (
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
          {subtitle && <span className="text-[11px] text-slate-500 font-medium truncate">{subtitle}</span>}
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ml-auto shrink-0 ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
