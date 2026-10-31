'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AthleteScore } from '@/components/AthleteScore';
import { MetricCard } from '@/components/MetricCard';
import { AuthGuard } from '@/components/AuthGuard';
import { Activity, Upload, Video, Dumbbell, Award, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight, UserCheck, FolderPlus } from 'lucide-react';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { Athlete, Match } from '@/types';

export default function DashboardPage() {
  const { activeSport } = useSportStore();
  const { user, athlete: storeAthlete } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const config = SPORT_CONFIGS[activeSport] || SPORT_CONFIGS['Cricket'];

  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [athlete, setAthlete] = useState<Athlete | null>(null);

  useEffect(() => {
    const email = user?.email || 'user@athletisis.com';
    const accountMatches = getMatchesForUser(email);
    setUserMatches(accountMatches);

    const currentName = user?.fullName || 'Athlete User';
    const currentTeam = storeAthlete?.teamName || 'My Team';
    const isCoach = user?.role === 'COACH';

    const hasMatches = accountMatches.length > 0;

    setAthlete({
      id: user?.id || Date.now(),
      userId: user?.id || Date.now(),
      name: currentName,
      age: isCoach ? 32 : 21,
      sport: activeSport,
      position: isCoach ? 'Head Tactical Coach' : config.positions[0],
      teamName: currentTeam,
      preferredRole: isCoach ? 'Tactician' : 'Playmaker',
      experienceLevel: isCoach ? 'Head Coach' : 'Semi-Pro',
      matchesAnalyzedCount: accountMatches.length,
      dna: {
        technicalScore: hasMatches ? 86.0 : 0,
        tacticalScore: hasMatches ? 78.0 : 0,
        physicalScore: hasMatches ? 89.0 : 0,
        decisionMakingScore: hasMatches ? 81.0 : 0,
        consistencyScore: hasMatches ? 84.0 : 0,
        overallScore: hasMatches ? 84.0 : 0,
      },
    });
  }, [activeSport, config, user, storeAthlete, matches]);

  return (
    <AuthGuard>
      <div className="space-y-6">
        
        {/* Modern Clean Header Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pro-card p-5 sm:p-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {config.icon} {config.name} Workstation
              </span>
              <span className="text-xs text-slate-400">Team: <strong className="text-slate-200">{storeAthlete?.teamName || 'My Team'}</strong></span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Welcome, {user?.fullName || 'Athlete'}
            </h1>
            <p className="text-xs text-slate-400">
              Overview of your recent performance telemetry, computer vision pose evaluations, and tactical drills.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/upload"
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Upload className="w-4 h-4" /> Upload {config.name} Video
            </Link>
          </div>
        </div>

        {/* Dynamic Sport Metrics KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Overall Rating"
            value={userMatches.length > 0 ? (athlete?.dna.overallScore || 84.0) : '0.0'}
            unit="/ 100"
            subtitle={userMatches.length > 0 ? 'Verified Match Evaluation' : 'Pending First Upload'}
            icon={Award}
            badge={userMatches.length > 0 ? 'Evaluated' : 'New'}
            badgeColor={userMatches.length > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}
          />
          <MetricCard
            title={config.sampleMetrics.primaryStatLabel}
            value={userMatches.length > 0 ? config.sampleMetrics.primaryStatValue : '—'}
            subtitle="Primary Efficiency KPI"
            icon={Activity}
          />
          <MetricCard
            title={config.sampleMetrics.secondaryStatLabel}
            value={userMatches.length > 0 ? config.sampleMetrics.secondaryStatValue : '—'}
            subtitle="Peak Kinematic Speed"
            icon={TrendingUp}
          />
          <MetricCard
            title="Matches Analyzed"
            value={userMatches.length}
            unit="Matches"
            subtitle="Total Account Uploads"
            icon={Video}
          />
        </div>

        {/* Empty State Banner or Athlete DNA Radar */}
        {userMatches.length === 0 ? (
          <div className="pro-card p-8 sm:p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto shadow-sm">
              <FolderPlus className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h2 className="text-xl font-bold text-white">No Match Video Analyzed Yet</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your game video to generate your 5-Dimensional Athlete DNA radar, 2D tactical maps, speed telemetry, and coaching drills.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition active:scale-95 shadow-sm"
            >
              <Upload className="w-4 h-4" /> Upload First Match <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <AthleteScore dna={athlete?.dna} athleteName={athlete?.name} position={athlete?.position} />
            </div>

            {/* Strengths & Weaknesses Panel */}
            <div className="pro-card p-5 space-y-4">
              <div className="border-b border-slate-800/80 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" /> Key Biomechanical Insights
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated kinematic recommendations</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-[#141D30] border border-slate-800 border-l-2 border-l-emerald-500 text-xs space-y-1">
                  <div className="font-semibold text-emerald-300 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{user?.role === 'COACH' ? 'Tactical System Design' : activeSport === 'Cricket' ? 'Cover Drive & Good Length Execution' : activeSport === 'Football' ? 'Passing Precision & Distribution' : 'Spike Elevation & Net Reading'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    High consistency score with 85%+ execution in primary game moments.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#141D30] border border-slate-800 border-l-2 border-l-amber-500 text-xs space-y-1">
                  <div className="font-semibold text-amber-300 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{activeSport === 'Football'
                      ? 'Defensive Transition Positioning'
                      : activeSport === 'Cricket'
                      ? 'Bowling Good-Length Control'
                      : 'Spike Approach Jump Timing'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {activeSport === 'Football'
                      ? 'Over-commitments during fast defensive transitions.'
                      : activeSport === 'Cricket'
                      ? 'Inconsistent pitch landing zone under pressure.'
                      : 'Early jump approach reducing spike contact height.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/training"
                  className="w-full py-2.5 rounded-lg bg-[#141D30] hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition border border-slate-800 hover:border-slate-700"
                >
                  <Dumbbell className="w-4 h-4 text-sky-400" /> View Personalized Drills
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Account Matches Grid */}
        {userMatches.length > 0 && (
          <div className="pro-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-sky-400" /> Account Matches — {storeAthlete?.teamName || 'My Team'}
              </h3>
              <Link href="/matches" className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1">
                View All Matches <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {userMatches.map((m) => (
                <Link
                  key={m.id}
                  href={`/matches/analysis?id=${m.id}`}
                  className="p-4 rounded-xl bg-[#141D30] border border-slate-800 hover:border-sky-500/50 transition group block"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {m.matchType || 'Competitive'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{m.matchDate}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">{m.matchName}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{m.teamName} vs {m.opponentName} • {m.venue}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Status: <strong className="text-emerald-400 font-semibold">{m.status}</strong></span>
                    <span className="text-sky-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Open Workstation →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
