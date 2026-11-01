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
  badgeColor = 'bg-[#6675E8]/10 text-[#6675E8] border-[#6675E8]/20'
}: MetricCardProps) {
  return (
    <div className="rounded-xl p-4 bg-[#151C35] border border-[#28334D] hover:border-[#3D4D73] transition group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#9AA6BD]">{title}</span>
        <div className="w-7 h-7 rounded-md bg-[#0B1020] text-[#9AA6BD] flex items-center justify-center border border-[#28334D] group-hover:text-[#55BDEB] transition-colors">
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#F3F5FA] font-mono tabular-nums">{value}</span>
        {unit && <span className="text-xs font-mono text-[#9AA6BD]">{unit}</span>}
      </div>

      {(subtitle || badge) && (
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#28334D] text-xs">
          {subtitle && <span className="text-[11px] text-[#9AA6BD] font-medium truncate">{subtitle}</span>}
          {badge && (
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ml-auto shrink-0 ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
