'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { MatchStrategyTrainingHub } from '@/components/MatchStrategyTrainingHub';
import { VideoPlayer } from '@/components/VideoPlayer';
import { TacticalPitchMap } from '@/components/TacticalPitchMap';
import { InjuryRiskRadar } from '@/components/InjuryRiskRadar';
import { ComparisonWorkbench } from '@/components/ComparisonWorkbench';
import { MatchReportExporter } from '@/components/MatchReportExporter';
import { ClipTagger } from '@/components/ClipTagger';
import { AICoachChatbot } from '@/components/AICoachChatbot';
import { Compass, ShieldAlert, Dumbbell, FileText, Columns, Bot } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'tactical' | 'drills' | 'injury' | 'report' | 'chat'>('tactical');
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
        } else {
          const latestBlob = await getLatestVideoObjectUrl();
          if (latestBlob) videoUrlToUse = latestBlob;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Top Workstation Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#152037] border border-slate-700 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-600/20 text-sky-300 border border-sky-500/40 shadow-sm">
                {activeSportName} • MATCH #{match.id}
              </span>
              <span className="text-xs font-mono text-slate-300">{match.matchDate}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1.5 tracking-tight">{match.matchName}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Athlete: <span className="text-white font-bold">{match.athleteName}</span> • Team: <span className="text-slate-200 font-semibold">{match.teamName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm ${
                showComparison
                  ? 'bg-sky-600 text-white border border-sky-400'
                  : 'bg-[#0b1329] text-slate-200 border border-slate-700 hover:border-slate-500 hover:text-white'
              }`}
            >
              <Columns className="w-4 h-4" />
              {showComparison ? 'Close Dual View' : 'Split-Screen Pro Form Comparison'}
            </button>
          </div>
        </div>

        {/* Split Screen Workbench Option */}
        {showComparison && (
          <ComparisonWorkbench sport={activeSportName} primaryVideoUrl={match.videoUrl} />
        )}

        {/* Main Workstation Dual Pane Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT PANE (Video Workbench & Tagging) */}
          <div className="lg:col-span-7 space-y-6">
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

          {/* RIGHT PANE (Multi-Tab Intelligence Suite) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Tab Navigation Controls */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#152037] border border-slate-700 overflow-x-auto text-xs font-bold shadow-md">
              <button
                onClick={() => setActiveTab('tactical')}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === 'tactical' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> 2D Map
              </button>
              <button
                onClick={() => setActiveTab('drills')}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === 'drills' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" /> Drills
              </button>
              <button
                onClick={() => setActiveTab('injury')}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === 'injury' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Strain
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === 'report' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Report
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition shrink-0 ${
                  activeTab === 'chat' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" /> AI Coach
              </button>
            </div>

            {/* Active Tab Component Render */}
            {activeTab === 'tactical' && (
              <div className="space-y-4">
                <TacticalPitchMap
                  sport={activeSportName}
                  activeTimestamp={activeSeekTimestamp}
                  onSeekTimestamp={handleSeek}
                />
                
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {analysis.metricCards.slice(0, 4).map((card, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#152037] border border-slate-700 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{card.title}</div>
                      <div className="text-lg font-black text-white font-mono mt-1">
                        {card.value} <span className="text-xs font-semibold text-slate-400">{card.unit}</span>
                      </div>
                      <div className="text-[11px] text-sky-400 font-medium mt-0.5">{card.subtitle}</div>
                    </div>
                  ))}
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

      </div>
    </AuthGuard>
  );
}
