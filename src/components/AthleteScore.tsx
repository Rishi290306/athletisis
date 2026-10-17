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
    <div className="pro-card p-6 sm:p-8 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-700/80">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 bg-sky-600/20 px-2.5 py-1 rounded-full border border-sky-500/40">
            {config.icon} {config.name} DNA Profile
          </span>
          <h2 className="text-2xl font-black text-white mt-1.5">{athleteName} — Athlete DNA</h2>
          <p className="text-xs text-slate-300">Position: <strong className="text-white">{activePosition}</strong></p>
        </div>

        <div className="text-right p-3 rounded-xl bg-[#0b1329] border border-slate-700 shadow-sm shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Rating</span>
          <div className="text-3xl font-black text-sky-400">{current.overallScore}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Radar Chart */}
        <div className="w-full h-72 flex items-center justify-center min-h-[280px]">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#e2e8f0', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1e293b" />
                <Radar name="Athlete DNA" dataKey="value" stroke="#38bdf8" fill="#0284c7" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-slate-400 font-bold animate-pulse">Loading Radar Visualization...</div>
          )}
        </div>

        {/* Dimension Breakdown Bars */}
        <div className="space-y-3.5">
          {[
            { label: config.dnaLabels.technical, score: current.technicalScore, color: 'bg-sky-500' },
            { label: config.dnaLabels.tactical, score: current.tacticalScore, color: 'bg-indigo-500' },
            { label: config.dnaLabels.physical, score: current.physicalScore, color: 'bg-emerald-500' },
            { label: config.dnaLabels.decision, score: current.decisionMakingScore, color: 'bg-cyan-500' },
            { label: config.dnaLabels.consistency, score: current.consistencyScore, color: 'bg-amber-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-white font-mono">{item.score} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-[#0b1329] rounded-full overflow-hidden border border-slate-700/80 p-0.5">
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
