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

export function MetricCard({ title, value, unit, subtitle, icon: Icon, badge, badgeColor = 'bg-brand-500/10 text-brand-400 border-brand-500/20' }: MetricCardProps) {
  return (
    <div className="glass-panel glass-panel-gold-hover border border-slate-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/30 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(255,199,0,0.15)]">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-black text-white group-hover:text-brand-300 transition-colors">{value}</span>
        {unit && <span className="text-xs font-extrabold text-slate-400">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80">
        {subtitle && <span className="text-[11px] text-slate-400 font-medium">{subtitle}</span>}
        {badge && (
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shadow-sm ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
