'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MatchStrategyTrainingHub } from '@/components/MatchStrategyTrainingHub';
import { VideoPlayer } from '@/components/VideoPlayer';
import { InjuryRiskRadar } from '@/components/InjuryRiskRadar';
import { ComparisonWorkbench } from '@/components/ComparisonWorkbench';
import { MatchReportExporter } from '@/components/MatchReportExporter';
import { ClipTagger } from '@/components/ClipTagger';
import { AICoachChatbot } from '@/components/AICoachChatbot';
import {
  Activity,
  Play,
  ShieldAlert,
  Dumbbell,
  FileText,
  Columns,
  Bot,
  Zap,
  CheckCircle2,
  LayoutDashboard,
  ArrowLeft,
  Upload,
  Video as VideoIcon,
} from 'lucide-react';
import { Match, PerformanceScore, VideoClip, StandardizedEvent, Recommendation } from '@/types';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuthStore, useMatchStore, DEFAULT_DEMO_MATCHES } from '@/lib/store';
import { useSportStore, SportType } from '@/lib/sportStore';
import { getVideoObjectUrl, getLatestVideoObjectUrl } from '@/lib/videoStore';
import { generateDynamicAIAnalysis } from '@/lib/aiAnalysisEngine';

interface SportAnalysisData {
  score: PerformanceScore;
  metricCards: {
    title: string;
    value: number;
    unit: string;
    subtitle: string;
    icon: any;
    badge?: string;
    badgeColor?: string;
  }[];
  clips: VideoClip[];
  events: StandardizedEvent[];
  recommendations: Recommendation[];
}

export function MatchDashboardClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const paramId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const rawId = paramId || searchParams?.get('id') || searchParams?.get('matchId') || '101';
  const matchId: number = isNaN(Number(rawId)) ? 101 : Number(rawId);
  
  const { user } = useAuthStore();
  const { matches } = useMatchStore();
  const { setSport } = useSportStore();

  const [match, setMatch] = useState<Match | null>(null);
  const [analysis, setAnalysis] = useState<SportAnalysisData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'drills' | 'injury' | 'report' | 'chat'>('overview');
  const [showComparison, setShowComparison] = useState(false);
  const [activeSeekTimestamp, setActiveSeekTimestamp] = useState<number>(0);

  useEffect(() => {
    let foundMatch = matches.find((m) => m.id === matchId);
    if (!foundMatch) {
      foundMatch = DEFAULT_DEMO_MATCHES.find((m) => m.id === matchId) || DEFAULT_DEMO_MATCHES[0];
    }

    if (foundMatch) {
      const activeSport = (foundMatch.sport as SportType) || 'Cricket';
      setMatch(foundMatch);
      setSport(activeSport);

      const resolveVideo = async () => {
        let videoUrlToUse = foundMatch.videoUrl || '/sample-match.mp4';
        if ((foundMatch as any).videoKey) {
          const storedUrl = await getVideoObjectUrl((foundMatch as any).videoKey);
          if (storedUrl) videoUrlToUse = storedUrl;
        } else if (foundMatch.id > 1000) {
          const matchBlob = await getVideoObjectUrl(foundMatch.id);
          if (matchBlob) {
            videoUrlToUse = matchBlob;
          } else {
            const latestBlob = await getLatestVideoObjectUrl();
            if (latestBlob) videoUrlToUse = latestBlob;
          }
        }

        const dynamicResult = generateDynamicAIAnalysis(
          matchId,
          activeSport,
          foundMatch.athleteName,
          foundMatch.analysisFocus === 'TEAM' ? 'TEAM' : 'PLAYER',
          foundMatch.matchName,
          15.0,
          0.7,
          3.5
        );

        dynamicResult.clips = dynamicResult.clips.map(c => ({ ...c, clipUrl: videoUrlToUse }));

        setAnalysis({
          score: dynamicResult.score,
          metricCards: dynamicResult.metricCards,
          clips: dynamicResult.clips,
          events: dynamicResult.events,
          recommendations: dynamicResult.recommendations,
        });
      };

      resolveVideo();
    }
  }, [matchId, matches]);

  const handleSeek = (secs: number) => {
    setActiveSeekTimestamp(secs);
  };

  if (!match || !analysis) {
    return (
      <AuthGuard>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-300 font-bold">
          Loading Pro Match Telemetry Workbench...
        </div>
      </AuthGuard>
    );
  }

  const activeSportName = (match.sport || 'Cricket') as SportType;

  return (
    <AuthGuard>
      <div className="space-y-5">
        
        {/* Breadcrumb & Instant Back Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium overflow-x-auto py-0.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 transition font-medium shrink-0"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
              <span>Dashboard</span>
            </Link>
            <span className="text-slate-700">/</span>
            <Link
              href="/matches"
              className="text-slate-400 hover:text-sky-400 transition font-medium shrink-0"
            >
              Matches
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-md">{match.matchName}</span>
          </div>

          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg bg-[#0E1424] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>

        {/* Top Workstation Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 pro-card">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {activeSportName} • MATCH #{match.id}
              </span>
              <span className="text-xs font-mono text-slate-400">{match.matchDate}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{match.matchName}</h1>
            <p className="text-xs text-slate-400">
              Athlete: <span className="text-slate-200 font-semibold">{match.athleteName}</span> • Team: <span className="text-slate-300 font-medium">{match.teamName}</span> • Venue: <span className="text-slate-400">{match.venue}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Primary Back to Dashboard Button */}
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>

            {/* All Matches list button */}
            <Link
              href="/matches"
              className="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-[#141D30] text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition"
            >
              <VideoIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>All Matches</span>
            </Link>

            {/* Split Screen Workbench Option */}
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
                showComparison
                  ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                  : 'bg-[#141D30] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{showComparison ? 'Close Dual View' : 'Pro Benchmark Comparison'}</span>
            </button>
          </div>
        </div>

        {/* Split Screen Workbench Option */}
        {showComparison && (
          <ComparisonWorkbench sport={activeSportName} primaryVideoUrl={match.videoUrl} />
        )}

        {/* Main Workstation Dual Pane Grid - 8 cols for Hero Video Workbench, 4 cols for Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT HERO PANE (Video Workbench & Tagging) */}
          <div className="lg:col-span-8 space-y-4">
            <VideoPlayer
              videoUrl={match.videoUrl}
              clips={analysis.clips}
              sport={activeSportName}
              matchId={match.id}
              seekTimestamp={activeSeekTimestamp}
              onCurrentTimeChange={setActiveSeekTimestamp}
              onSeekTimestamp={handleSeek}
            />

            <ClipTagger
              activeTimestamp={activeSeekTimestamp}
              onSeekTimestamp={handleSeek}
            />
          </div>

          {/* RIGHT SUPPORTING PANE (Multi-Tab Intelligence Suite) */}
          <div className="lg:col-span-4 space-y-3.5">
            
            {/* Segmented Tab Navigation Controls */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0E1424] border border-slate-800/90 overflow-x-auto text-xs font-medium">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === 'overview' ? 'bg-sky-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" /> Telemetry
              </button>
              <button
                onClick={() => setActiveTab('drills')}
                className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === 'drills' ? 'bg-sky-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" /> Drills
              </button>
              <button
                onClick={() => setActiveTab('injury')}
                className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === 'injury' ? 'bg-sky-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Strain
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === 'report' ? 'bg-sky-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Report
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === 'chat' ? 'bg-sky-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" /> AI Coach
              </button>
            </div>

            {/* Active Tab Component Render */}
            {activeTab === 'overview' && (
              <div className="space-y-3.5">
                {/* Metric Summary Cards Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {analysis.metricCards.slice(0, 4).map((card, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#0E1424] border border-slate-800">
                      <div className="text-[10px] font-medium text-slate-400">{card.title}</div>
                      <div className="text-base font-bold text-white font-mono mt-0.5">
                        {card.value} <span className="text-[11px] font-normal text-slate-500">{card.unit}</span>
                      </div>
                      <div className="text-[10px] text-sky-400 font-medium truncate mt-0.5">{card.subtitle}</div>
                    </div>
                  ))}
                </div>

                {/* Biomechanical Angle Calibrations */}
                <div className="p-3.5 rounded-xl bg-[#0E1424] border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Live Joint Angles</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      COCO-17
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded bg-[#141D30] border border-slate-800/80">
                      <span className="text-slate-400">Arm Extension Angle</span>
                      <span className="text-amber-400 font-semibold">88° (Target: 85°-95°)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#141D30] border border-slate-800/80">
                      <span className="text-slate-400">Front Knee Brace</span>
                      <span className="text-emerald-400 font-semibold">142° (Strong Leverage)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#141D30] border border-slate-800/80">
                      <span className="text-slate-400">Release Apex</span>
                      <span className="text-sky-400 font-semibold">2.14 m</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#141D30] border border-slate-800/80">
                      <span className="text-slate-400">Trunk Flexion</span>
                      <span className="text-slate-200 font-semibold">18° Forward Lean</span>
                    </div>
                  </div>
                </div>

                {/* Key Delivery Clips & Breakdown */}
                <div className="p-3.5 rounded-xl bg-[#0E1424] border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-xs font-semibold text-white">
                      Action Phase Highlights
                    </span>
                    <span className="text-[10px] text-slate-500">1-click jump</span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { label: 'Run-up & Acceleration Approach', time: 1.0, badge: 'APPROACH', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
                      { label: 'Foot Plant & Loading Coil', time: 2.0, badge: 'COIL', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
                      { label: 'Kinematic Release Apex Point', time: 2.8, badge: 'RELEASE', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                      { label: 'Deceleration Follow-Through', time: 3.5, badge: 'FINISH', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                    ].map((phase, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSeek(phase.time)}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-[#141D30] border border-slate-800 hover:border-sky-500/50 hover:bg-[#18233C] transition group text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded bg-slate-800 group-hover:bg-sky-600 transition text-slate-400 group-hover:text-white">
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-slate-200 group-hover:text-sky-300 transition">
                              {phase.label}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">00:0{Math.floor(phase.time)}s</div>
                          </div>
                        </div>
                        <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border ${phase.color}`}>
                          {phase.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'drills' && (
              <MatchStrategyTrainingHub sport={activeSportName} athleteName={match.athleteName} matchName={match.matchName} />
            )}

            {activeTab === 'injury' && (
              <InjuryRiskRadar sport={activeSportName} fatigueIndex={(match as any).staminaDrainIndex || 62} />
            )}

            {activeTab === 'report' && (
              <MatchReportExporter sport={activeSportName} athleteName={match.athleteName} matchId={match.id.toString()} />
            )}

            {activeTab === 'chat' && (
              <AICoachChatbot sport={activeSportName} athleteName={match.athleteName} />
            )}

          </div>

        </div>

        {/* Bottom Session Completion & Action Bar */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0E1424] border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mx-auto sm:mx-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Analysis Session Active & Calibrated</div>
              <div className="text-[11px] text-slate-400">
                17-point anatomical skeleton keypoints, sprint velocities, and drill recommendations are active.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition active:scale-95 w-full sm:w-auto"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </Link>

            <Link
              href="/upload"
              className="px-3.5 py-2 rounded-lg bg-[#141D30] hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition w-full sm:w-auto"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload New Video</span>
            </Link>
          </div>
        </div>

      </div>
    </AuthGuard>
  );
}
