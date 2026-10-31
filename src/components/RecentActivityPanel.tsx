'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Zap,
  ShieldAlert,
  Dumbbell,
  Video,
  Clock,
  ArrowRight,
} from 'lucide-react';

export function RecentActivityPanel() {
  const activities = [
    {
      id: 1,
      title: 'AI Pose Calibration Completed',
      desc: '17-point skeletal mesh calibrated with 96.8% confidence',
      time: '12m ago',
      icon: Activity,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      link: '/matches/analysis?id=101',
    },
    {
      id: 2,
      title: 'High-Intensity Sprint Detected',
      desc: 'Peak burst speed 29.4 km/h in counter-attack phase',
      time: '1h ago',
      icon: Zap,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      link: '/performance',
    },
    {
      id: 3,
      title: 'Biomechanical Strain Evaluated',
      desc: 'Knee flexion & deceleration force within optimal limits',
      time: '3h ago',
      icon: ShieldAlert,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      link: '/matches/analysis?id=101',
    },
    {
      id: 4,
      title: 'Tactical Training Drill Assigned',
      desc: 'Defensive Transition Positioning added to plan',
      time: 'Yesterday',
      icon: Dumbbell,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      link: '/training',
    },
    {
      id: 5,
      title: 'Match Footage Ingested',
      desc: 'El Clasico 2026 footage processed for tracking',
      time: '2d ago',
      icon: Video,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      link: '/matches',
    },
  ];

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-[#0C132E]/90 border border-indigo-950/80 shadow-2xl flex flex-col justify-between space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-indigo-950/60">
        <div>
          <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Recent Activity</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated timeline of AI insights & updates
          </p>
        </div>

        <Link
          href="/training"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Activity List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.id}
              href={act.link}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#0E1638]/60 hover:bg-[#121B42] border border-indigo-950/80 hover:border-indigo-500/30 transition group block"
            >
              <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${act.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-200 text-xs truncate group-hover:text-cyan-300 transition-colors">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {act.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {act.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Live System Engine Status Footer */}
      <div className="p-3 rounded-xl bg-[#090E26] border border-indigo-950 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">Kinematic Engine Status:</span>
        </div>
        <span className="text-emerald-400 font-mono font-bold">100% OPERATIONAL</span>
      </div>

    </div>
  );
}
