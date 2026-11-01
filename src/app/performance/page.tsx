'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  FolderPlus,
  Upload,
  ArrowRight,
  FileText,
  Printer,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { Match } from '@/types';

export default function PerformanceHistoryPage() {
  const { activeSport } = useSportStore();
  const config = SPORT_CONFIGS[activeSport] || SPORT_CONFIGS['Cricket'];
  const { user } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const email = user?.email || '';
    setUserMatches(getMatchesForUser(email));
  }, [user, matches, getMatchesForUser]);

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
      consistentDesc: 'Maintained high technical short-pass completion rate across all 4 analyzed fixtures.',
    },
    Cricket: {
      highestTitle: 'Bowling Line & Length (+29.5%)',
      highestDesc: 'Improved Good Length delivery accuracy from 61.0 to 78.0 in middle-overs spells.',
      consistentTitle: 'Batting Strike Rate (142.5)',
      consistentDesc: 'Maintained high boundary percentage & strike rotation rhythm across analyzed overs.',
    },
    Volleyball: {
      highestTitle: 'Spike Attack Timing (+29.5%)',
      highestDesc: 'Improved jump timing & block touch avoidance from 61.0 to 78.0 at the net line.',
      consistentTitle: 'Dig Efficiency (86.2%)',
      consistentDesc: 'Maintained high reaction defense and cross-court dig success rate across all sets.',
    },
  };

  const perfData = (sportPerformanceData as any)[activeSport] || sportPerformanceData.Cricket;

  return (
    <AuthGuard>
      <div className="space-y-6">
        
        {/* Header with Export Controls */}
        <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0B1020] text-[#6675E8] border border-[#28334D]">
                {config.name} Telemetry Report
              </span>
              <span className="text-xs text-[#9AA6BD]">• Longitudinal Dataset</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5FA] tracking-tight">
              {config.name} Performance History & Longitudinal Trends
            </h1>
            <p className="text-xs text-[#9AA6BD]">
              Track longitudinal rating evolution across technical execution, tactical spatial awareness, physical work-rate, and decision speed.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-[#0B1020] hover:bg-[#1A2342] border border-[#28334D] hover:border-[#3D4D73] text-[#F3F5FA] text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#55BDEB]" />
              <span>Print Executive Report</span>
            </button>

            <Link
              href="/upload"
              className="px-3.5 py-2 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Match</span>
            </Link>
          </div>
        </div>

        {/* Main Multi-Match Longitudinal Trend Chart */}
        <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#28334D]">
            <div>
              <h2 className="text-sm font-bold text-[#F3F5FA] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#6675E8]" />
                <span>{config.name} Rating Evolution Trend</span>
              </h2>
              <p className="text-xs text-[#9AA6BD] mt-0.5">
                Composite scoring curve tracked across consecutive competitive matches
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Overall Rating
              </span>
              <span className="text-[#6675E8] flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#6675E8]" /> Tactical / Technical
              </span>
            </div>
          </div>

          <div className="w-full h-80 pt-2 flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTactical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6675E8" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6675E8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#28334D" vertical={false} />
                  <XAxis
                    dataKey="match"
                    stroke="#9AA6BD"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#28334D' }}
                  />
                  <YAxis
                    domain={[50, 100]}
                    stroke="#9AA6BD"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#28334D' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#151C35] border border-[#28334D] p-3 rounded-lg shadow-xl text-xs space-y-1">
                            <div className="font-bold text-[#F3F5FA]">{data.match} ({data.date})</div>
                            <div className="text-emerald-400 font-mono">Overall Rating: {data.Overall}%</div>
                            <div className="text-[#6675E8] font-mono">Tactical Index: {data.Tactical}%</div>
                            <div className="text-[#55BDEB] font-mono">Technical Accuracy: {data.Technical}%</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="Overall" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOverall)" />
                  <Area type="monotone" dataKey="Tactical" stroke="#6675E8" strokeWidth={2} fillOpacity={1} fill="url(#colorTactical)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#9AA6BD] font-mono">Loading Trend Telemetry...</div>
            )}
          </div>
        </div>

        {/* Performance Driver Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#151C35] border border-[#28334D] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#55BDEB]">
              Highest Improved Dimension
            </span>
            <h3 className="text-sm font-bold text-[#F3F5FA]">{perfData.highestTitle}</h3>
            <p className="text-xs text-[#9AA6BD] leading-relaxed">{perfData.highestDesc}</p>
          </div>

          <div className="p-5 rounded-xl bg-[#151C35] border border-[#28334D] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              Most Consistent Metric
            </span>
            <h3 className="text-sm font-bold text-[#F3F5FA]">{perfData.consistentTitle}</h3>
            <p className="text-xs text-[#9AA6BD] leading-relaxed">{perfData.consistentDesc}</p>
          </div>

          <div className="p-5 rounded-xl bg-[#151C35] border border-[#28334D] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E8B75A]">
              Predictive Rating Model
            </span>
            <h3 className="text-sm font-bold text-[#F3F5FA]">Next Match Target: 85.0 – 88.5%</h3>
            <p className="text-xs text-[#9AA6BD] leading-relaxed">
              Regression estimate based on kinematics trend, workload consistency, and historical fixtures.
            </p>
          </div>
        </div>

      </div>
    </AuthGuard>
  );
}
