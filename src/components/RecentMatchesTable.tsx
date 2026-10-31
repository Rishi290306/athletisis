'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Video,
  Upload,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';
import { Match } from '@/types';
import { SportType } from '@/lib/sportStore';

interface RecentMatchesTableProps {
  matches: Match[];
  searchQuery?: string;
  onSelectSportFilter?: (sport: string) => void;
  selectedSportFilter?: string;
}

export function RecentMatchesTable({
  matches,
  searchQuery = '',
  selectedSportFilter = 'ALL',
}: RecentMatchesTableProps) {
  const [filter, setFilter] = useState<string>(selectedSportFilter);

  const filterTabs = ['ALL', 'Football', 'Cricket', 'Volleyball'];

  const filteredMatches = matches.filter((m) => {
    const matchesFilter = filter === 'ALL' || m.sport?.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      m.matchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.opponentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.athleteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sport.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-[#0C132E]/90 border border-indigo-950/80 shadow-2xl space-y-4">
      
      {/* Table Header with Filters & Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-950/60">
        <div>
          <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-400" />
            <span>Recent Matches</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified matches with 17-point pose tracks & event analytics
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Sport Filter Tabs */}
          <div className="flex items-center bg-[#090E26] p-1 rounded-xl border border-indigo-950 text-xs">
            {filterTabs.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  filter === t
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Link
            href="/upload"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Match</span>
          </Link>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-indigo-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-3">Match & Opponent</th>
              <th className="py-3 px-3">Sport</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Key Athlete</th>
              <th className="py-3 px-3">Performance</th>
              <th className="py-3 px-3">AI Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-950/40">
            {filteredMatches.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                  No matches found matching your filters.
                </td>
              </tr>
            ) : (
              filteredMatches.map((m) => {
                const score = 80 + (m.id % 16);
                const isCricket = m.sport === 'Cricket';
                const isVolleyball = m.sport === 'Volleyball';

                return (
                  <tr
                    key={m.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Match & Opponent */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-xs group-hover:text-blue-300 transition-colors">
                        {m.matchName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        vs {m.opponentName} • {m.venue}
                      </div>
                    </td>

                    {/* Sport Badge */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                          isCricket
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                            : isVolleyball
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/25'
                            : 'bg-blue-500/10 text-blue-300 border-blue-500/25'
                        }`}
                      >
                        {isCricket ? '🏏 Cricket' : isVolleyball ? '🏐 Volleyball' : '⚽ Football'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300">
                      {m.matchDate}
                    </td>

                    {/* Key Athlete */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200">{m.athleteName}</div>
                      <div className="text-[10px] text-slate-400">{m.teamName}</div>
                    </td>

                    {/* Performance Score with Mini Progress Bar */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs min-w-[32px]">
                          {score}%
                        </span>
                        <div className="w-16 h-1.5 bg-[#080D21] rounded-full overflow-hidden border border-indigo-950">
                          <div
                            className={`h-full rounded-full ${
                              score >= 88
                                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-400'
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* AI Status */}
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Completed
                      </span>
                    </td>

                    {/* Action Link */}
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/matches/analysis?id=${m.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#121B42] hover:bg-blue-600 text-slate-200 hover:text-white border border-indigo-900/50 hover:border-blue-400 text-xs font-semibold transition active:scale-95 shadow-sm"
                      >
                        <span>View Analysis</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
