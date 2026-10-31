'use client';

import React, { useEffect, useState } from 'react';
import { AthleteDNA } from '@/types';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface AthleteScoreProps {
  dna?: AthleteDNA;
  athleteName?: string;
  position?: string;
}

export function AthleteScore({ dna, athleteName = 'Athlete', position }: AthleteScoreProps) {
  const { activeSport } = useSportStore();
  const config = SPORT_CONFIGS[activeSport] || SPORT_CONFIGS['Cricket'];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const defaultDNA: AthleteDNA = {
    technicalScore: 86,
    tacticalScore: 78,
    physicalScore: 89,
    decisionMakingScore: 81,
    consistencyScore: 84,
    overallScore: 84,
  };

  const current = dna || defaultDNA;

  const chartData = [
    { subject: config.dnaLabels.technical, value: current.technicalScore },
    { subject: config.dnaLabels.tactical, value: current.tacticalScore },
    { subject: config.dnaLabels.physical, value: current.physicalScore },
    { subject: config.dnaLabels.decision, value: current.decisionMakingScore },
    { subject: config.dnaLabels.consistency, value: current.consistencyScore },
  ];

  const activePosition = position || config.positions[0];

  return (
    <div className="pro-card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded border border-sky-500/20">
              {config.icon} {config.name} DNA Profile
            </span>
            <span className="text-xs text-slate-400">Position: <strong className="text-slate-200">{activePosition}</strong></span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5 tracking-tight">{athleteName} — Performance Radar</h2>
        </div>

        <div className="text-right px-3.5 py-2 rounded-lg bg-[#141D30] border border-slate-800 shrink-0">
          <span className="text-[10px] font-medium text-slate-400 block uppercase tracking-wider">Overall Rating</span>
          <div className="text-2xl font-bold font-mono text-sky-400">{current.overallScore}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Radar Chart */}
        <div className="w-full h-64 flex items-center justify-center min-h-[250px]">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#1E293B" />
                <PolarAngleAxis dataKey="subject" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1E293B" tick={false} />
                <Radar name="Athlete DNA" dataKey="value" stroke="#38BDF8" fill="#0284C7" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-slate-500 font-medium">Loading Radar Visualization...</div>
          )}
        </div>

        {/* Dimension Breakdown Bars */}
        <div className="space-y-3">
          {[
            { label: config.dnaLabels.technical, score: current.technicalScore, color: 'bg-sky-500' },
            { label: config.dnaLabels.tactical, score: current.tacticalScore, color: 'bg-indigo-500' },
            { label: config.dnaLabels.physical, score: current.physicalScore, color: 'bg-emerald-500' },
            { label: config.dnaLabels.decision, score: current.decisionMakingScore, color: 'bg-cyan-500' },
            { label: config.dnaLabels.consistency, score: current.consistencyScore, color: 'bg-amber-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className="text-slate-200 font-mono font-semibold">{item.score} / 100</span>
              </div>
              <div className="w-full h-1.5 bg-[#141D30] rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
