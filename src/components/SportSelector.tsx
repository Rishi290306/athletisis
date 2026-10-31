'use client';

import React from 'react';
import { useSportStore, SPORT_CONFIGS, SportType } from '@/lib/sportStore';

export function SportSelector() {
  const { activeSport, setSport } = useSportStore();

  const sports: SportType[] = ['Cricket', 'Football', 'Volleyball'];

  return (
    <div className="flex items-center gap-1 bg-[#0E1424] p-1 rounded-lg border border-slate-800/80">
      {sports.map((sportId) => {
        const config = SPORT_CONFIGS[sportId];
        const isActive = activeSport === sportId;

        return (
          <button
            key={sportId}
            onClick={() => setSport(sportId)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className="text-xs">{config?.icon || '•'}</span>
            <span>{config?.name.split('/')[0].trim() || sportId}</span>
          </button>
        );
      })}
    </div>
  );
}
