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
      <div className="space-y-8">
        {/* Header Banner Card */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pro-card p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-600/20 text-sky-300 border border-sky-500/40 shadow-sm flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> Account: {user?.email} ({user?.role})
              </span>
              <span className="text-xs font-semibold text-slate-300">Team: <strong className="text-white">{storeAthlete?.teamName || 'My Team'}</strong></span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome, {user?.fullName || 'Athlete'}</h1>
            <p className="text-xs text-slate-300">AI-analyzed {config.name} performance dashboard & telemetry.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/upload"
              className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all hover:scale-105"
            >
              <Upload className="w-4 h-4" /> Upload {config.name} Match
            </Link>
          </div>
        </div>

        {/* Dynamic Sport Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Overall Rating"
            value={userMatches.length > 0 ? (athlete?.dna.overallScore || 84.0) : '0.0'}
            unit="/ 100"
            subtitle={userMatches.length > 0 ? 'Verified Match Evaluation' : 'Pending First Match Upload'}
            icon={Award}
            badge={userMatches.length > 0 ? 'Evaluated' : 'Raw Account'}
            badgeColor={userMatches.length > 0 ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}
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
            subtitle="Speed & Acceleration Peak"
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
          <div className="pro-card p-10 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-600/20 border border-sky-500/40 text-sky-400 flex items-center justify-center mx-auto shadow-md">
              <FolderPlus className="w-8 h-8" />
            </div>
            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-extrabold text-white">No Match Video Analyzed Yet</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upload your first game footage to generate your personalized 5-Dimensional Athlete DNA radar, 2D tactical maps, speed telemetry, and tactical coaching drills!
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-sky-600/30 transition hover:scale-105"
            >
              <Upload className="w-4 h-4" /> Upload First Match Footage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AthleteScore dna={athlete?.dna} athleteName={athlete?.name} position={athlete?.position} />
            </div>

            {/* Strengths & Weaknesses Panel */}
            <div className="pro-card p-6 shadow-xl space-y-5">
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Grounded Strengths
                </h3>
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs space-y-1.5 shadow-sm">
                  <div className="font-bold text-emerald-300 text-sm">
                    {user?.role === 'COACH' ? 'Tactical System Design' : activeSport === 'Cricket' ? 'Cover Drive & Good Length Execution' : activeSport === 'Football' ? 'Passing Precision & Distribution' : 'Spike Elevation & Net Reading'}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    High consistency score with 85%+ execution in primary game moments.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Improvement Target
                </h3>
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs space-y-1.5 shadow-sm">
                  <div className="font-bold text-amber-300 text-sm">
                    {activeSport === 'Football'
                      ? 'Defensive Transition Positioning'
                      : activeSport === 'Cricket'
                      ? 'Bowling Good-Length Control'
                      : 'Spike Approach Jump Timing'}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
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
                  className="w-full py-3 rounded-xl bg-[#0b1329] hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition border border-slate-700 hover:border-slate-500"
                >
                  <Dumbbell className="w-4 h-4 text-sky-400" /> View Personalized Drills
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Account Matches */}
        {userMatches.length > 0 && (
          <div className="pro-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-700/80">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-sky-400" /> Account Matches — {storeAthlete?.teamName || 'My Team'}
              </h3>
              <Link href="/matches" className="text-xs font-bold text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1.5">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userMatches.map((m) => (
                <Link
                  key={m.id}
                  href={`/matches/analysis?id=${m.id}`}
                  className="p-5 rounded-xl bg-[#0b1329] border border-slate-700 hover:border-sky-400 transition group block shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-sky-600/20 text-sky-300 border border-sky-500/40">
                      {m.matchType}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{m.matchDate}</span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">{m.matchName}</h4>
                  <p className="text-xs text-slate-400 mt-1">{m.teamName} vs {m.opponentName} • {m.venue}</p>

                  <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Match Status: <strong className="text-emerald-400 font-bold">{m.status}</strong></span>
                    <span className="text-sky-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Full Report →
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
