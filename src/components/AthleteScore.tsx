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
    <div className="rounded-xl p-5 sm:p-6 bg-[#151C35] border border-[#28334D]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#28334D]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#55BDEB] bg-[#0B1020] px-2.5 py-0.5 rounded border border-[#28334D]">
              {config.icon} {config.name} DNA Profile
            </span>
            <span className="text-xs text-[#9AA6BD]">• Tactical Position: {activePosition}</span>
          </div>
          <h2 className="text-lg font-bold text-[#F3F5FA] mt-1">{athleteName} — Biomechanical DNA</h2>
        </div>

        <div className="flex items-baseline gap-2 bg-[#0B1020] px-4 py-2 rounded-lg border border-[#28334D]">
          <span className="text-xs text-[#9AA6BD] font-mono">Overall Rating</span>
          <span className="text-2xl font-bold font-mono text-[#6675E8] tabular-nums">{current.overallScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Chart */}
        <div className="lg:col-span-6 h-64 flex items-center justify-center">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#28334D" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9AA6BD', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#28334D" tick={{ fill: '#9AA6BD', fontSize: 9 }} />
                <Radar name="Performance" dataKey="value" stroke="#6675E8" fill="#6675E8" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-xs text-[#9AA6BD] font-mono">Loading Biometric Radar...</div>
          )}
        </div>

        {/* Detailed Category Bars */}
        <div className="lg:col-span-6 space-y-3">
          {chartData.map((d) => (
            <div key={d.subject} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#9AA6BD] font-medium">{d.subject}</span>
                <span className="font-mono font-bold text-[#F3F5FA] tabular-nums">{d.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#0B1020] rounded-full overflow-hidden border border-[#28334D]">
                <div
                  className="h-full bg-[#6675E8] rounded-full transition-all duration-500"
                  style={{ width: `${d.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
