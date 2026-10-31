'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Video, Calendar, ArrowRight, Upload, FolderPlus, MapPin, Activity } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { SportType } from '@/lib/sportStore';
import { Match } from '@/types';

export default function MatchListPage() {
  const { user } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [selectedSportFilter, setSelectedSportFilter] = useState<'All' | SportType>('All');

  useEffect(() => {
    const email = user?.email || '';
    setUserMatches(getMatchesForUser(email));
  }, [user, matches]);

  const filteredMatches = selectedSportFilter === 'All'
    ? userMatches
    : userMatches.filter((m) => m.sport === selectedSportFilter);

  return (
    <AuthGuard>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pro-card p-5 sm:p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white">Match Library & Video Intelligence</h1>
            <p className="text-xs text-slate-400">
              Browse recorded matches, calibrated 17-point pose tracks, and tactical performance breakdowns.
            </p>
          </div>
          <Link
            href="/upload"
            className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 font-semibold text-white text-xs flex items-center gap-2 shadow-sm transition active:scale-95 shrink-0"
          >
            <Upload className="w-4 h-4" /> Upload New Match
          </Link>
        </div>

        {/* Sport Filters Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['All', 'Cricket', 'Football', 'Volleyball'] as const).map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSportFilter(sport)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedSportFilter === sport
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-[#0E1424] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sport}
            </button>
          ))}
          <span className="text-xs text-slate-500 ml-auto font-mono">
            {filteredMatches.length} {filteredMatches.length === 1 ? 'Match' : 'Matches'}
          </span>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="pro-card p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto shadow-sm">
              <FolderPlus className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-lg font-bold text-white">No Matches Found</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No analyzed matches found for the selected filter. Upload match video to generate kinematic event logs and AI biomechanics telemetry.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 font-semibold text-white text-xs transition active:scale-95 shadow-sm"
            >
              <Upload className="w-4 h-4" /> Upload Match Footage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMatches.map((m) => (
              <Link
                key={m.id}
                href={`/matches/analysis?id=${m.id}`}
                className="pro-card p-5 group block transition hover:border-sky-500/50"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {m.sport || 'Sports'} • {m.matchType || 'Competitive'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> {m.matchDate}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
                  {m.matchName}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{m.teamName} vs {m.opponentName} • {m.venue}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-semibold text-emerald-400 text-xs uppercase">{m.status}</span>
                  </div>
                  <span className="text-xs font-semibold text-sky-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Open Telemetry Workstation <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
