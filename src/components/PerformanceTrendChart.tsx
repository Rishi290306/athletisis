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
import { TrendingUp } from 'lucide-react';
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
    <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] flex flex-col justify-between space-y-4">
      
      {/* Header with Timeframe Pills */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#28334D]">
        <div>
          <h3 className="text-sm font-semibold text-[#F3F5FA] tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#6675E8]" />
            <span>Performance Trend</span>
          </h3>
          <p className="text-[11px] text-[#9AA6BD] mt-0.5">
            Biomechanical index & consistency curve
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-[#0B1020] p-0.5 rounded-lg border border-[#28334D] text-xs">
          {(['7D', '1M', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#151C35] text-[#F3F5FA] font-semibold border border-[#28334D]'
                  : 'text-[#9AA6BD] hover:text-[#F3F5FA]'
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
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6675E8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6675E8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#28334D" vertical={false} />

            <XAxis
              dataKey="label"
              stroke="#9AA6BD"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#28334D' }}
            />

            <YAxis
              stroke="#9AA6BD"
              fontSize={11}
              domain={[60, 100]}
              tickLine={false}
              axisLine={{ stroke: '#28334D' }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#151C35] border border-[#28334D] p-2.5 rounded-lg shadow-lg text-xs space-y-1">
                      <div className="font-semibold text-[#F3F5FA]">{data.label}</div>
                      <div className="text-[11px] text-[#6675E8] font-mono">Overall Score: {data.score}%</div>
                      <div className="text-[10px] text-[#9AA6BD] font-mono">Technical: {data.technical}% • Tactical: {data.tactical}%</div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#6675E8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#trendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics */}
      <div className="pt-2 border-t border-[#28334D] flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-[#9AA6BD] uppercase font-mono">Current Peak</span>
          <div className="text-sm font-bold text-[#F3F5FA] font-mono">89.5%</div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[#9AA6BD] uppercase font-mono">Trajectory</span>
          <div className="text-xs font-semibold text-emerald-400 font-mono">+13.0% Net Growth</div>
        </div>
      </div>

    </div>
  );
}
