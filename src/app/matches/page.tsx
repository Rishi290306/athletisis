'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Video, Calendar, ArrowRight, Upload, FolderPlus } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { Match } from '@/types';

export default function MatchListPage() {
  const { user } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const [userMatches, setUserMatches] = useState<Match[]>([]);

  useEffect(() => {
    const email = user?.email || '';
    setUserMatches(getMatchesForUser(email));
  }, [user, matches]);

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pro-card p-6 shadow-xl">
          <div>
            <h1 className="text-2xl font-black text-white">Match History & Video Analytics</h1>
            <p className="text-xs text-slate-400">All analyzed match footage, AI reports, and tactical game state logs</p>
          </div>
          <Link
            href="/upload"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 font-bold text-white text-xs flex items-center gap-2 shadow-lg shadow-sky-500/25 transition active:scale-95"
          >
            <Upload className="w-4 h-4" /> Upload New Match
          </Link>
        </div>

        {userMatches.length === 0 ? (
          <div className="pro-card p-12 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto shadow-xl">
              <FolderPlus className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-black text-white">No Analyzed Matches Found</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your account does not have any analyzed games yet. Upload your match video to generate tactical heatmaps, event timelines, and AI performance reports!
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 font-bold text-white text-xs uppercase tracking-wider shadow-xl shadow-sky-500/25 transition active:scale-95"
            >
              <Upload className="w-4 h-4" /> Upload First Match <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userMatches.map((m) => (
              <Link
                key={m.id}
                href={`/matches/analysis?id=${m.id}`}
                className="pro-card p-5 group block shadow-lg hover:border-sky-500/60 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {m.matchType || 'Competitive'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> {m.matchDate}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">{m.matchName}</h3>
                <p className="text-xs text-slate-400 mt-1">{m.teamName} vs {m.opponentName} • {m.venue}</p>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400">Match Status: </span>
                    <span className="font-extrabold text-emerald-400 text-xs ml-1 uppercase">{m.status}</span>
                  </div>
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Analysis <ArrowRight className="w-3.5 h-3.5" />
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
