'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ArrowRight,
  Upload,
  FolderPlus,
  MapPin,
  Trash2,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { SportType } from '@/lib/sportStore';
import { Match } from '@/types';

export default function MatchListPage() {
  const { user } = useAuthStore();
  const { matches, getMatchesForUser, deleteMatch } = useMatchStore();
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [selectedSportFilter, setSelectedSportFilter] = useState<'All' | SportType>('All');
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  useEffect(() => {
    const email = user?.email || '';
    setUserMatches(getMatchesForUser(email));
  }, [user, matches, getMatchesForUser]);

  const filteredMatches =
    selectedSportFilter === 'All'
      ? userMatches
      : userMatches.filter((m) => m.sport === selectedSportFilter);

  const handleDeleteConfirmed = () => {
    if (!matchToDelete) return;
    const deletedName = matchToDelete.matchName;
    deleteMatch(matchToDelete.id);
    setMatchToDelete(null);
    setDeleteNotice(`"${deletedName}" was successfully removed from match history.`);
    setTimeout(() => {
      setDeleteNotice(null);
    }, 4500);
  };

  return (
    <AuthGuard>
      <div className="space-y-6">
        
        {/* Success / Feedback Toast Notification */}
        {deleteNotice && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs animate-in fade-in slide-in-from-top-2 duration-200 shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{deleteNotice}</span>
            </div>
            <button
              onClick={() => setDeleteNotice(null)}
              className="p-1 rounded text-emerald-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-xl bg-[#151C35] border border-[#28334D]">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F3F5FA]">
              Match Library & Video Intelligence
            </h1>
            <p className="text-xs text-[#9AA6BD]">
              Browse recorded matches, manage match history, and inspect calibrated 17-point pose tracks.
            </p>
          </div>
          <Link
            href="/upload"
            className="px-4 py-2 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] font-semibold text-white text-xs flex items-center gap-2 shadow-sm transition active:scale-95 shrink-0 cursor-pointer"
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

        {/* Empty State */}
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] font-semibold text-white text-xs transition active:scale-95 shadow-sm cursor-pointer"
            >
              <Upload className="w-4 h-4" /> Upload Match Footage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Match Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMatches.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-xl bg-[#151C35] border border-[#28334D] hover:border-[#3D4D73] group transition flex flex-col justify-between relative shadow-sm"
              >
                <div>
                  {/* Top Bar: Sport Pill + Date + Delete Button */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#6675E8]/10 text-[#6675E8] border border-[#6675E8]/20">
                      {m.sport || 'Sports'} • {m.matchType || 'Competitive'}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#9AA6BD] font-mono flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#9AA6BD]" /> {m.matchDate}
                      </span>
                      
                      {/* Discrete Delete Icon Button */}
                      <button
                        type="button"
                        onClick={() => setMatchToDelete(m)}
                        className="p-1 rounded-md text-[#9AA6BD] hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
                        title="Delete match from history"
                        aria-label={`Delete ${m.matchName}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Match Name */}
                  <Link
                    href={`/matches/analysis?id=${m.id}`}
                    className="text-sm font-semibold text-[#F3F5FA] group-hover:text-[#55BDEB] transition-colors block"
                  >
                    {m.matchName}
                  </Link>

                  {/* Venue & Teams */}
                  <p className="text-xs text-[#9AA6BD] mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9AA6BD] shrink-0" />
                    <span>
                      {m.teamName} vs {m.opponentName} • {m.venue}
                    </span>
                  </p>
                </div>

                {/* Card Footer: Status + Delete Link + Workstation Link */}
                <div className="mt-4 pt-3 border-t border-[#28334D] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#9AA6BD]">Status:</span>
                    <span className="font-semibold text-emerald-400 text-xs uppercase">
                      {m.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMatchToDelete(m)}
                      className="text-xs text-[#9AA6BD] hover:text-rose-400 transition flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                    
                    <Link
                      href={`/matches/analysis?id=${m.id}`}
                      className="text-xs font-semibold text-[#6675E8] hover:text-[#55BDEB] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Open Telemetry Workstation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal Dialog */}
        {matchToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md rounded-xl bg-[#151C35] border border-[#28334D] p-6 shadow-2xl relative space-y-4">
              {/* Close Button */}
              <button
                onClick={() => setMatchToDelete(null)}
                className="absolute top-4 right-4 p-1.5 rounded-md text-[#9AA6BD] hover:text-[#F3F5FA] hover:bg-[#1A2342] transition cursor-pointer"
                aria-label="Cancel"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F3F5FA]">Delete Match Recording?</h3>
                  <p className="text-xs text-[#9AA6BD]">This action will remove the match from your database.</p>
                </div>
              </div>

              {/* Target Match Summary Card */}
              <div className="p-3.5 rounded-lg bg-[#0B1020] border border-[#28334D] space-y-1.5 text-xs">
                <div className="font-semibold text-[#F3F5FA] text-sm truncate">
                  {matchToDelete.matchName}
                </div>
                <div className="text-[#9AA6BD] flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#151C35] border border-[#28334D] text-[#55BDEB] font-mono text-[10px]">
                    {matchToDelete.sport}
                  </span>
                  <span>•</span>
                  <span>{matchToDelete.matchDate}</span>
                  <span>•</span>
                  <span className="truncate">{matchToDelete.venue}</span>
                </div>
              </div>

              {/* Warning Notice */}
              <p className="text-xs text-[#9AA6BD] leading-relaxed">
                All associated 17-point pose tracks, joint kinematics, tactical heatmaps, and event bookmarks will be permanently erased.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#28334D]">
                <button
                  type="button"
                  onClick={() => setMatchToDelete(null)}
                  className="px-4 py-2 rounded-lg bg-[#151C35] hover:bg-[#1A2342] border border-[#28334D] text-xs font-semibold text-[#F3F5FA] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Match</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AuthGuard>
  );
}
