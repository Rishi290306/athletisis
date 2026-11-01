'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Upload, FolderPlus, MapPin } from 'lucide-react';
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
  }, [user, matches, getMatchesForUser]);

  const filteredMatches = selectedSportFilter === 'All'
    ? userMatches
    : userMatches.filter((m) => m.sport === selectedSportFilter);

  return (
    <AuthGuard>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-xl bg-[#151C35] border border-[#28334D]">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F3F5FA]">Match Library & Video Intelligence</h1>
            <p className="text-xs text-[#9AA6BD]">
              Browse recorded matches, calibrated 17-point pose tracks, and tactical performance breakdowns.
            </p>
          </div>
          <Link
            href="/upload"
            className="px-4 py-2 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] font-semibold text-white text-xs flex items-center gap-2 shadow-sm transition active:scale-95 shrink-0"
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedSportFilter === sport
                  ? 'bg-[#6675E8] text-white shadow-sm'
                  : 'bg-[#151C35] text-[#9AA6BD] hover:text-[#F3F5FA] border border-[#28334D]'
              }`}
            >
              {sport}
            </button>
          ))}
          <span className="text-xs text-[#9AA6BD] ml-auto font-mono">
            {filteredMatches.length} {filteredMatches.length === 1 ? 'Match' : 'Matches'}
          </span>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="rounded-xl p-10 text-center space-y-4 bg-[#151C35] border border-[#28334D]">
            <div className="w-12 h-12 rounded-xl bg-[#6675E8]/10 border border-[#6675E8]/20 text-[#6675E8] flex items-center justify-center mx-auto shadow-sm">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-base font-bold text-[#F3F5FA]">No Matches Found</h3>
              <p className="text-xs text-[#9AA6BD] leading-relaxed">
                No analyzed matches found for the selected filter. Upload match video to generate kinematic event logs and AI biomechanics telemetry.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] font-semibold text-white text-xs transition active:scale-95 shadow-sm"
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
                className="p-5 rounded-xl bg-[#151C35] border border-[#28334D] hover:border-[#3D4D73] group block transition"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#6675E8]/10 text-[#6675E8] border border-[#6675E8]/20">
                    {m.sport || 'Sports'} • {m.matchType || 'Competitive'}
                  </span>
                  <span className="text-xs text-[#9AA6BD] font-mono flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#9AA6BD]" /> {m.matchDate}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[#F3F5FA] group-hover:text-[#55BDEB] transition-colors">
                  {m.matchName}
                </h3>
                <p className="text-xs text-[#9AA6BD] mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9AA6BD] shrink-0" />
                  <span>{m.teamName} vs {m.opponentName} • {m.venue}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-[#28334D] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#9AA6BD]">Status:</span>
                    <span className="font-semibold text-emerald-400 text-xs uppercase">{m.status}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#6675E8] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
