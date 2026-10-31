'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Activity, Heart, Info } from 'lucide-react';

interface InjuryRiskRadarProps {
  sport?: string;
  fatigueIndex?: number; // 0 - 100
}

interface MuscleRiskItem {
  muscleGroup: string;
  riskLevel: 'low' | 'moderate' | 'high';
  stressScore: number; // 0 - 100
  cause: string;
  recommendation: string;
}

export function InjuryRiskRadar({ sport = 'soccer', fatigueIndex = 62 }: InjuryRiskRadarProps) {
  const getMuscleRiskData = (sportType: string): MuscleRiskItem[] => {
    switch (sportType.toLowerCase()) {
      case 'cricket':
        return [
          { muscleGroup: 'Lower Back / Lumbar', riskLevel: 'high', stressScore: 79, cause: 'Bowler Crease Delivery Extension', recommendation: 'Core rotation stability & lumbar decompression' },
          { muscleGroup: 'Shoulder Rotator Cuff', riskLevel: 'moderate', stressScore: 61, cause: 'High-Velocity Throwing Reps', recommendation: 'Band Y-T-W mobility routines' },
          { muscleGroup: 'Hamstrings', riskLevel: 'moderate', stressScore: 52, cause: 'Between-Wicket Sprint Decelerations', recommendation: 'Nordic hamstring curls' },
          { muscleGroup: 'Calf & Achilles', riskLevel: 'low', stressScore: 30, cause: 'Fielding Boundary Chases', recommendation: 'Calf eccentric drops' },
        ];
      case 'volleyball':
        return [
          { muscleGroup: 'Patellar Tendon (Jumper’s Knee)', riskLevel: 'high', stressScore: 86, cause: '34 High-Impact Spike Landings', recommendation: 'Isometric wall sits & jump load management' },
          { muscleGroup: 'Shoulder Rotator Cuff', riskLevel: 'high', stressScore: 82, cause: 'Overhead Spike Whiplash Deceleration', recommendation: 'Sleeper stretches & rotator cuff band external rotation' },
          { muscleGroup: 'Ankle Stabilizers', riskLevel: 'moderate', stressScore: 56, cause: 'Net Block Lateral Rebounds', recommendation: 'Proprioceptive single-leg balance drills' },
          { muscleGroup: 'Lumbar Spine', riskLevel: 'low', stressScore: 34, cause: 'Approach Hyperextension', recommendation: 'Core anti-extension planks & posterior chain activation' },
        ];
      case 'football':
      case 'soccer':
      default:
        return [
          { muscleGroup: 'Hamstring Biceps Femoris', riskLevel: 'high', stressScore: 81, cause: 'High-Speed Sprint Decelerations', recommendation: 'Eccentric Nordic curls + load reduction next 48h' },
          { muscleGroup: 'ACL / Quadriceps', riskLevel: 'moderate', stressScore: 59, cause: 'Lateral Cut Direction Changes', recommendation: 'Single-leg stability squats' },
          { muscleGroup: 'Groin & Adductors', riskLevel: 'moderate', stressScore: 48, cause: 'Long Passing Extensions', recommendation: 'Copenhagen adductor isometric holds' },
          { muscleGroup: 'Soleus & Calf', riskLevel: 'low', stressScore: 29, cause: 'Aerobic Jogging Workload', recommendation: 'Standard post-match stretching' },
        ];
    }
  };

  const riskData = getMuscleRiskData(sport);
  const overallRisk = fatigueIndex > 75 ? 'HIGH' : fatigueIndex > 45 ? 'MODERATE' : 'LOW';

  return (
    <div className="pro-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Biomechanical Strain & Injury Risk Radar
          </h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
          overallRisk === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
          overallRisk === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
        }`}>
          Overall Strain: {overallRisk}
        </span>
      </div>

      {/* Muscle Group Strain Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {riskData.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-lg bg-[#090D16] border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">{item.muscleGroup}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                item.riskLevel === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                item.riskLevel === 'moderate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {item.riskLevel} Risk ({item.stressScore}%)
              </span>
            </div>

            {/* Stress Level Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  item.stressScore > 75 ? 'bg-red-500' :
                  item.stressScore > 45 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${item.stressScore}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Cause: <span className="text-slate-300 font-medium">{item.cause}</span></span>
            </div>

            <div className="text-[11px] text-brand-400/90 font-medium bg-brand-500/10 p-2 rounded-lg border border-brand-500/20">
              {item.recommendation}
            </div>
          </div>
        ))}
      </div>

      {/* Proactive Recovery Advisory */}
      <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-amber-300">Coach Load Management Directive</div>
          <p className="text-slate-300 leading-relaxed">
            Telemetry indicates elevated deceleration force on high-speed sprints. Maintain 48-hour recovery before next high-intensity training session to prevent hamstring strain.
          </p>
        </div>
      </div>
    </div>
  );
}
