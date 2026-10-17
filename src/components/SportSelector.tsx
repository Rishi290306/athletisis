'use client';

import React from 'react';
import { useSportStore, SPORT_CONFIGS, SportType } from '@/lib/sportStore';

export function SportSelector() {
  const { activeSport, setSport } = useSportStore();

  const sports: SportType[] = ['Cricket', 'Football', 'Volleyball'];

  return (
    <div className="flex items-center gap-1.5 bg-[#0b1329] p-1.5 rounded-xl border border-slate-700/80 shadow-md">
      {sports.map((sportId) => {
        const config = SPORT_CONFIGS[sportId];
        const isActive = activeSport === sportId;

        return (
          <button
            key={sportId}
            onClick={() => setSport(sportId)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              isActive
                ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-400/50 scale-[1.02]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="text-sm">{config?.icon || '🏏'}</span>
            <span>{config?.name.split('/')[0].trim() || sportId}</span>
          </button>
        );
      })}
    </div>
  );
}
