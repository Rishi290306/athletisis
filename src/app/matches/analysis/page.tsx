'use client';

import { Suspense } from 'react';
import { MatchDashboardClient } from '../[id]/MatchDashboardClient';

export default function MatchAnalysisPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center animate-spin">
          ⚡
        </div>
        <div className="text-slate-300 font-bold text-xs uppercase tracking-widest animate-pulse">
          Loading AI Biomechanics Match Analysis...
        </div>
      </div>
    }>
      <MatchDashboardClient />
    </Suspense>
  );
}
