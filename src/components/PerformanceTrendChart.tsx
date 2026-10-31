'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Sparkles, Activity } from 'lucide-react';
import { SportType } from '@/lib/sportStore';

interface PerformanceTrendChartProps {
  sport?: SportType;
}

export function PerformanceTrendChart({ sport = 'Football' }: PerformanceTrendChartProps) {
  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '3M' | '1Y'>('1M');

  const trendDataMap: Record<string, { label: string; score: number; technical: number; tactical: number }[]> = {
    '7D': [
      { label: 'Mon', score: 82.0, technical: 84.0, tactical: 80.0 },
      { label: 'Tue', score: 83.5, technical: 85.0, tactical: 81.0 },
      { label: 'Wed', score: 84.0, technical: 86.0, tactical: 82.0 },
      { label: 'Thu', score: 86.2, technical: 88.0, tactical: 84.0 },
      { label: 'Fri', score: 85.8, technical: 87.0, tactical: 84.5 },
      { label: 'Sat', score: 88.0, technical: 89.5, tactical: 86.0 },
      { label: 'Sun', score: 89.4, technical: 91.0, tactical: 87.5 },
    ],
    '1M': [
      { label: 'W1', score: 76.5, technical: 78.0, tactical: 74.0 },
      { label: 'W2', score: 79.2, technical: 81.0, tactical: 77.0 },
      { label: 'W3', score: 83.0, technical: 85.0, tactical: 80.5 },
      { label: 'W4', score: 86.8, technical: 88.5, tactical: 84.0 },
      { label: 'W5', score: 89.5, technical: 91.0, tactical: 87.0 },
    ],
    '3M': [
      { label: 'Aug', score: 74.0, technical: 75.0, tactical: 71.0 },
      { label: 'Sep', score: 81.5, technical: 83.0, tactical: 78.5 },
      { label: 'Oct', score: 87.0, technical: 89.0, tactical: 84.5 },
    ],
    '1Y': [
      { label: 'Q1', score: 68.0, technical: 70.0, tactical: 65.0 },
      { label: 'Q2', score: 74.5, technical: 76.0, tactical: 72.0 },
      { label: 'Q3', score: 82.0, technical: 84.0, tactical: 79.0 },
      { label: 'Q4', score: 88.5, technical: 90.0, tactical: 86.0 },
    ],
  };

  const activeData = trendDataMap[timeframe] || trendDataMap['1M'];

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-[#0C132E]/90 border border-indigo-950/80 shadow-2xl flex flex-col justify-between space-y-4">
      
      {/* Header with Timeframe Pills */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-indigo-950/60">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Performance Trend</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Biomechanical index & consistency curve
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-[#090E26] p-1 rounded-xl border border-indigo-950 text-xs">
          {(['7D', '1M', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer ${
                timeframe === tf
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Recharts Area Chart */}
      <div className="w-full h-56 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Lavender / Cyan Gradient Fill */}
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818CF8" stopOpacity={0.4} />
                <stop offset="60%" stopColor="#06B6D4" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#162045" vertical={false} />

            <XAxis
              dataKey="label"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
            />
            <YAxis
              domain={[60, 100]}
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1E293B' }}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 rounded-xl bg-[#090F28] border border-indigo-500/40 shadow-2xl text-xs space-y-1">
                      <div className="font-bold text-white font-mono">{label} Telemetry</div>
                      <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                        <Activity className="w-3 h-3" />
                        <span>Overall Score: {payload[0].value}%</span>
                      </div>
                      <div className="text-[10px] text-purple-300">
                        Technical: {(payload[0].payload as any).technical}% • Tactical: {(payload[0].payload as any).tactical}%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#818CF8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#trendGradient)"
              activeDot={{ r: 6, fill: '#06B6D4', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Stat Badges Below Chart */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-950/60">
        <div className="p-2.5 rounded-xl bg-[#0E1638]/70 border border-indigo-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Peak Rating</span>
          <span className="text-xs font-black text-amber-300 font-mono">92.4%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0E1638]/70 border border-indigo-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Consistency</span>
          <span className="text-xs font-black text-emerald-400 font-mono">88.5%</span>
        </div>
      </div>

    </div>
  );
}
