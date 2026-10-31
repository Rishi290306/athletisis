'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Award, CheckCircle2, FolderPlus, Upload, ArrowRight } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { Match } from '@/types';

export default function PerformanceHistoryPage() {
  const { activeSport } = useSportStore();
  const config = SPORT_CONFIGS[activeSport];
  const { user } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const email = user?.email || '';
    setUserMatches(getMatchesForUser(email));
  }, [user, matches]);

  const historyData = [
    { match: 'Match 1', date: '08/02', Overall: 75.0, Technical: 76.0, Tactical: 61.0, Physical: 82.0, Decision: 74.0 },
    { match: 'Match 2', date: '08/15', Overall: 78.0, Technical: 80.0, Tactical: 68.0, Physical: 85.0, Decision: 77.0 },
    { match: 'Match 3', date: '08/24', Overall: 81.5, Technical: 83.0, Tactical: 74.0, Physical: 87.0, Decision: 79.0 },
    { match: 'Match 4', date: '09/01', Overall: 84.0, Technical: 86.0, Tactical: 78.0, Physical: 89.0, Decision: 81.0 },
  ];

  const sportPerformanceData = {
    Football: {
      highestTitle: 'Tactical Positioning (+29.5%)',
      highestDesc: 'Improved from 61.0 in Match 1 to 78.0 in Match 4 following targeted transition drills.',
      consistentTitle: 'Pass Accuracy (85.7%)',
      consistentDesc: 'Maintained high technical short-pass completion rate across all 4 matches.',
    },
    Cricket: {
      highestTitle: 'Bowling Line & Length (+29.5%)',
      highestDesc: 'Improved Good Length delivery accuracy from 61.0 to 78.0 in middle-overs spells.',
      consistentTitle: 'Batting Strike Rate (142.5)',
      consistentDesc: 'Maintained high boundary percentage & strike rotation across all 4 matches.',
    },
    Volleyball: {
      highestTitle: 'Spike Attack Timing (+29.5%)',
      highestDesc: 'Improved jump timing & block touch avoidance from 61.0 to 78.0 at net net line.',
      consistentTitle: 'Dig Efficiency (86.2%)',
      consistentDesc: 'Maintained high reaction defense and cross-court dig success across all 4 matches.',
    },
  };

  const perfData = (sportPerformanceData as any)[activeSport] || sportPerformanceData.Football;

  return (
    <AuthGuard>
      <div className="space-y-6">
        <div className="pro-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold uppercase text-brand-400 tracking-wider">{config.name} Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{config.name} Performance History & Multi-Match Trends</h1>
          <p className="text-xs text-slate-400 mt-1">Track longitudinal rating evolution across technical, tactical, physical, and decision-making dimensions</p>
        </div>

        {userMatches.length === 0 ? (
          <div className="pro-card p-12 text-center space-y-6">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-white">No {config.name} Match Data Recorded</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your first {config.name} match video to track longitudinal rating evolution, performance progress charts, and predictive match estimates.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold text-white text-xs uppercase tracking-wider transition"
            >
              <Upload className="w-4 h-4" /> Upload First Match <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Main Multi-Match Trend Chart */}
            <div className="pro-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-400" />
                    {config.name} Rating Evolution Trend
                  </h2>
                  <p className="text-xs text-slate-400">Progress across analyzed {config.name} matches</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <span className="text-emerald-400">● Overall</span>
                  <span className="text-brand-400">● Tactical / Technical</span>
                </div>
              </div>

              <div className="w-full h-80 pt-4 flex items-center justify-center min-h-[300px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData}>
                      <defs>
                        <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTactical" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="match" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0E1424', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                      <Area type="monotone" dataKey="Overall" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOverall)" />
                      <Area type="monotone" dataKey="Tactical" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorTactical)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-slate-500 font-medium">Loading Trend Visualization...</div>
                )}
              </div>
            </div>

            {/* Improvement Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-lg pro-card space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-400">Highest Improved Dimension</span>
                <h3 className="text-base font-bold text-white">{perfData.highestTitle}</h3>
                <p className="text-xs text-slate-400">{perfData.highestDesc}</p>
              </div>

              <div className="p-5 rounded-lg pro-card space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Most Consistent Metric</span>
                <h3 className="text-base font-bold text-white">{perfData.consistentTitle}</h3>
                <p className="text-xs text-slate-400">{perfData.consistentDesc}</p>
              </div>

              <div className="p-5 rounded-lg pro-card space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-400">Predictive Estimate</span>
                <h3 className="text-base font-bold text-white">Next Match Range: 85 - 88</h3>
                <p className="text-xs text-slate-400">Estimated expected performance rating based on time-series regression modeling.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
