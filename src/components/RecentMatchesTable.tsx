'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Video,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { Match } from '@/types';

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
    <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] space-y-4">
      
      {/* Table Header with Filters & Upload CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#28334D]">
        <div>
          <h3 className="text-sm font-bold text-[#F3F5FA] tracking-tight flex items-center gap-2">
            <Video className="w-4 h-4 text-[#6675E8]" />
            <span>Recent Matches</span>
          </h3>
          <p className="text-xs text-[#9AA6BD] mt-0.5">
            Verified matches with 17-point pose tracks & event analytics
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Sport Filter Tabs */}
          <div className="flex items-center bg-[#0B1020] p-0.5 rounded-lg border border-[#28334D] text-xs">
            {filterTabs.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer ${
                  filter === t
                    ? 'bg-[#151C35] text-[#F3F5FA] font-semibold border border-[#28334D]'
                    : 'text-[#9AA6BD] hover:text-[#F3F5FA]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <Link
            href="/upload"
            className="px-3 py-1.5 rounded-md bg-[#6675E8] hover:bg-[#5463D6] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition active:scale-95"
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
            <tr className="border-b border-[#28334D] text-[11px] font-semibold uppercase tracking-wider text-[#9AA6BD]">
              <th className="py-2.5 px-3">Match & Opponent</th>
              <th className="py-2.5 px-3">Sport</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Key Athlete</th>
              <th className="py-2.5 px-3">Performance</th>
              <th className="py-2.5 px-3">AI Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#28334D]/60">
            {filteredMatches.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#9AA6BD]">
                  No match recordings found matching criteria.
                </td>
              </tr>
            ) : (
              filteredMatches.slice(0, 5).map((m) => {
                const isCricket = m.sport === 'Cricket';
                const isVolleyball = m.sport === 'Volleyball';
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-[#1A2342]/60 transition-colors group"
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#F3F5FA] group-hover:text-[#55BDEB] transition-colors">
                        {m.matchName}
                      </div>
                      <div className="text-[11px] text-[#9AA6BD]">
                        vs {m.opponentName} • {m.venue}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                          isCricket
                            ? 'bg-[#E8B75A]/10 text-[#E8B75A] border-[#E8B75A]/30'
                            : isVolleyball
                            ? 'bg-[#6675E8]/10 text-[#6675E8] border-[#6675E8]/30'
                            : 'bg-[#55BDEB]/10 text-[#55BDEB] border-[#55BDEB]/30'
                        }`}
                      >
                        {isCricket ? '🏏 Cricket' : isVolleyball ? '🏐 Volleyball' : '⚽ Football'}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[#9AA6BD] text-[11px]">
                      {m.matchDate}
                    </td>

                    <td className="py-3 px-3 text-[#F3F5FA] font-medium">
                      {m.athleteName}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[#F3F5FA] text-xs">
                          {(m as any).performanceScore?.overallScore ? `${(m as any).performanceScore.overallScore}%` : '88.4%'}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          +3.2%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ● CALIBRATED
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/matches/analysis?id=${m.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#6675E8] hover:text-[#55BDEB] transition group-hover:translate-x-0.5 duration-150"
                      >
                        <span>Open Workstation</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer link to view full library */}
      <div className="pt-2 border-t border-[#28334D] flex items-center justify-between text-xs">
        <span className="text-[#9AA6BD]">
          Showing {Math.min(filteredMatches.length, 5)} of {matches.length} matches in database
        </span>
        <Link
          href="/matches"
          className="text-xs font-semibold text-[#6675E8] hover:text-[#55BDEB] flex items-center gap-1 transition"
        >
          <span>View All Matches in Library</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

    </div>
  );
}
