'use client';

import React from 'react';
import { useSportStore, SPORT_CONFIGS, SportType } from '@/lib/sportStore';

export function SportSelector() {
  const { activeSport, setSport } = useSportStore();

  const sports: SportType[] = ['Football', 'Cricket', 'Volleyball'];

  return (
    <div className="flex items-center gap-1.5 bg-dark-950/90 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner">
      {sports.map((sportId) => {
        const config = SPORT_CONFIGS[sportId];
        const isActive = activeSport === sportId;

        return (
          <button
            key={sportId}
            onClick={() => setSport(sportId)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all duration-300 ${
              isActive
                ? sportId === 'Football'
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/50 shadow-[0_0_15px_rgba(255,199,0,0.35)] scale-[1.03]'
                  : sportId === 'Cricket'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.35)] scale-[1.03]'
                  : 'bg-pink-500/20 text-pink-300 border border-pink-500/50 shadow-[0_0_15px_rgba(255,0,127,0.35)] scale-[1.03]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span className="text-sm">{config.icon}</span>
            <span>{config.name}</span>
          </button>
        );
      })}
    </div>
  );
}
