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
  const config = SPORT_CONFIGS[activeSport];
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
    <div className="glass-panel border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded border border-brand-500/30">
            {config.icon} {config.name} DNA Profile
          </span>
          <h2 className="text-2xl font-black text-white mt-1.5">{athleteName} — Athlete DNA</h2>
          <p className="text-xs text-slate-400">Position: {activePosition}</p>
        </div>

        <div className="text-right p-3 rounded-2xl bg-dark-950/80 border border-slate-800 shadow-inner">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Rating</span>
          <div className="text-3xl font-black text-gradient-gold">{current.overallScore}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Radar Chart */}
        <div className="w-full h-72 flex items-center justify-center min-h-[280px]">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1e293b" />
                <Radar name="Athlete DNA" dataKey="value" stroke={config.themeColor} fill={config.themeColor} fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-slate-500 font-bold animate-pulse">Loading Radar Visualization...</div>
          )}
        </div>

        {/* Dimension Breakdown Bars */}
        <div className="space-y-4">
          {[
            { label: config.dnaLabels.technical, score: current.technicalScore, color: 'from-brand-400 to-amber-500' },
            { label: config.dnaLabels.tactical, score: current.tacticalScore, color: 'from-cyan-400 to-sky-500' },
            { label: config.dnaLabels.physical, score: current.physicalScore, color: 'from-violet-500 to-purple-600' },
            { label: config.dnaLabels.decision, score: current.decisionMakingScore, color: 'from-emerald-400 to-teal-500' },
            { label: config.dnaLabels.consistency, score: current.consistencyScore, color: 'from-pink-500 to-rose-600' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-white font-black">{item.score} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-dark-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(255,199,0,0.3)]`}
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
