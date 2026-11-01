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
      color: 'text-[#55BDEB] bg-[#55BDEB]/10 border-[#55BDEB]/30',
      link: '/matches/analysis?id=101',
    },
    {
      id: 2,
      title: 'High-Intensity Sprint Detected',
      desc: 'Peak burst speed 29.4 km/h in counter-attack phase',
      time: '1h ago',
      icon: Zap,
      color: 'text-[#E8B75A] bg-[#E8B75A]/10 border-[#E8B75A]/30',
      link: '/performance',
    },
    {
      id: 3,
      title: 'Biomechanical Strain Evaluated',
      desc: 'Knee flexion & deceleration force within optimal limits',
      time: '3h ago',
      icon: ShieldAlert,
      color: 'text-[#6675E8] bg-[#6675E8]/10 border-[#6675E8]/30',
      link: '/matches/analysis?id=101',
    },
    {
      id: 4,
      title: 'Tactical Training Drill Assigned',
      desc: 'Defensive Transition Positioning added to squad plan',
      time: 'Yesterday',
      icon: Dumbbell,
      color: 'text-[#6675E8] bg-[#6675E8]/10 border-[#6675E8]/30',
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
    <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] flex flex-col justify-between space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#28334D]">
        <div>
          <h3 className="text-sm font-bold text-[#F3F5FA] tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#55BDEB]" />
            <span>Recent Activity</span>
          </h3>
          <p className="text-xs text-[#9AA6BD] mt-0.5">
            Automated timeline of AI insights & updates
          </p>
        </div>

        <Link
          href="/training"
          className="text-xs font-semibold text-[#6675E8] hover:text-[#55BDEB] flex items-center gap-1 transition"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Activity List */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.id}
              href={act.link}
              className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#0B1020] hover:bg-[#1A2342] border border-[#28334D] hover:border-[#3D4D73] transition group block"
            >
              <div className={`p-1.5 rounded-md border shrink-0 mt-0.5 ${act.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#F3F5FA] group-hover:text-[#55BDEB] transition-colors truncate">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-[#9AA6BD] font-mono shrink-0">
                    {act.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#9AA6BD] leading-snug line-clamp-1 mt-0.5">
                  {act.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="pt-2 border-t border-[#28334D] flex items-center justify-between text-[11px] text-[#9AA6BD]">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Real-time Inference Active</span>
        </span>
        <span className="font-mono text-[10px]">
          Latency: 14ms
        </span>
      </div>

    </div>
  );
}
