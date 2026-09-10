'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { HeatmapViewer } from '@/components/HeatmapViewer';
import { VideoPlayer } from '@/components/VideoPlayer';
import { EventTimeline } from '@/components/EventTimeline';
import { MetricCard } from '@/components/MetricCard';
import { Activity, Award, TrendingUp, ShieldCheck, CheckCircle2, Info, Users, User, ArrowUpRight } from 'lucide-react';
import { Match, PerformanceScore, VideoClip, StandardizedEvent, Recommendation } from '@/types';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { useSportStore, SportType } from '@/lib/sportStore';
import { getVideoObjectUrl, getLatestVideoObjectUrl } from '@/lib/videoStore';
import { AICoachChatbot } from '@/components/AICoachChatbot';
import { detectSportFromVideo, SportDetectionResult } from '@/lib/sportDetector';

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
  tacticalFactors: { label: string; points: string; isNegative?: boolean }[];
  technicalFactors: { label: string; points: string; isNegative?: boolean }[];
  strengthTitle: string;
  strengthDesc: string;
  weaknessTitle: string;
  weaknessDesc: string;
}

export function MatchDashboardClient() {
  const params = useParams();
  const matchId = Number(params?.id || '1');
  const { user } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const { setSport } = useSportStore();

  const [match, setMatch] = useState<Match | null>(null);
  const [analysis, setAnalysis] = useState<SportAnalysisData | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(70);
  const [snippetDuration, setSnippetDuration] = useState<number>(3.5);
  const [autoCalibratedNotice, setAutoCalibratedNotice] = useState<SportDetectionResult | null>(null);

  const manuallySwitchSport = (targetSport: SportType) => {
    if (!match) return;
    setSport(targetSport);
    const isTeamFocus = match.analysisFocus === 'TEAM';
    const updatedMatch = { ...match, sport: targetSport };
    setMatch(updatedMatch);

    const dynamicResult = generateDynamicAIAnalysis(
      matchId,
      targetSport,
      updatedMatch.athleteName,
      isTeamFocus ? 'TEAM' : 'PLAYER',
      updatedMatch.matchName,
      15.0,
      confidenceThreshold / 100,
      snippetDuration
    );

    dynamicResult.clips = dynamicResult.clips.map(c => ({ ...c, clipUrl: updatedMatch.videoUrl || '/sample-match.mp4' }));

    setAnalysis({
      score: dynamicResult.score,
      metricCards: dynamicResult.metricCards,
      clips: dynamicResult.clips,
      events: dynamicResult.events,
      recommendations: dynamicResult.recommendations,
      tacticalFactors: dynamicResult.tacticalFactors,
      technicalFactors: dynamicResult.technicalFactors,
      strengthTitle: dynamicResult.strengthTitle,
      strengthDesc: dynamicResult.strengthDesc,
      weaknessTitle: dynamicResult.weaknessTitle,
      weaknessDesc: dynamicResult.weaknessDesc,
    });
    setAutoCalibratedNotice(null);
  };

  const handleThresholdChange = (conf: number, dur: number) => {
    setConfidenceThreshold(conf);
    setSnippetDuration(dur);
    if (match) {
      const isTeamFocus = match.analysisFocus === 'TEAM';
      const activeSport = match.sport as SportType;
      const dynamicResult = generateDynamicAIAnalysis(
        matchId,
        activeSport,
        match.athleteName,
        isTeamFocus ? 'TEAM' : 'PLAYER',
        match.matchName,
        15.0,
        conf / 100,
        dur
      );
      dynamicResult.clips = dynamicResult.clips.map(c => ({ ...c, clipUrl: match.videoUrl || '/sample-match.mp4' }));
      setAnalysis({
        score: dynamicResult.score,
        metricCards: dynamicResult.metricCards,
        clips: dynamicResult.clips,
        events: dynamicResult.events,
        recommendations: dynamicResult.recommendations,
        tacticalFactors: dynamicResult.tacticalFactors,
        technicalFactors: dynamicResult.technicalFactors,
        strengthTitle: dynamicResult.strengthTitle,
        strengthDesc: dynamicResult.strengthDesc,
        weaknessTitle: dynamicResult.weaknessTitle,
        weaknessDesc: dynamicResult.weaknessDesc,
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadMatchAndAnalysis() {
      const email = user?.email || '';
      const storedMatches = getMatchesForUser(email);
      const foundMatch = storedMatches.find(m => String(m.id) === String(matchId)) || matches.find(m => String(m.id) === String(matchId)) || (storedMatches.length > 0 ? storedMatches[0] : null);

      const rawSport: SportType = (foundMatch?.sport as SportType) || 'Cricket';

      // Load persistent uploaded video file from IndexedDB
      const indexedDbVideoUrl = (foundMatch ? await getVideoObjectUrl(foundMatch.id) : null) || (await getLatestVideoObjectUrl());
      const actualVideoUrl = indexedDbVideoUrl || foundMatch?.videoUrl || '/sample-match.mp4';

      // AI Sport Mismatch Detection & Auto-Calibration
      const searchString = `${foundMatch?.matchName || ''} ${foundMatch?.notes || ''} ${actualVideoUrl}`;
      const detection = detectSportFromVideo(searchString, rawSport);

      let effectiveSport = rawSport;
      if (detection.isMismatch) {
        effectiveSport = detection.detectedSport;
        setAutoCalibratedNotice(detection);
      }

      setSport(effectiveSport);

      const isTeamFocus = foundMatch?.analysisFocus === 'TEAM';

      const currentMatch: Match = foundMatch ? { ...foundMatch, sport: effectiveSport, videoUrl: actualVideoUrl } : {
        id: matchId,
        matchName: `${effectiveSport} ${isTeamFocus ? 'Team Highlight' : 'Player'} Analysis`,
        sport: effectiveSport,
        matchDate: '2026-09-01',
        teamName: user?.fullName ? `${user.fullName}'s Team` : 'FC Thunder',
        opponentName: 'Opponents',
        venue: 'National Sports Arena',
        matchType: 'Competitive',
        athleteId: user?.id || 1,
        athleteName: user?.fullName || 'Rishi Tiwari',
        notes: 'AI computer vision biomechanics analysis',
        videoUrl: actualVideoUrl,
        analysisFocus: isTeamFocus ? 'TEAM' : 'PLAYER',
        status: 'COMPLETED',
      };

      const dynamicResult = generateDynamicAIAnalysis(
        matchId,
        effectiveSport,
        currentMatch.athleteName,
        isTeamFocus ? 'TEAM' : 'PLAYER',
        currentMatch.matchName,
        15.0,
        confidenceThreshold / 100,
        snippetDuration
      );

      // Ensure clips use actualVideoUrl
      dynamicResult.clips = dynamicResult.clips.map(c => ({ ...c, clipUrl: actualVideoUrl }));

      const sportData: SportAnalysisData = {
        score: dynamicResult.score,
        metricCards: dynamicResult.metricCards || [
          { title: 'Technical Score', value: dynamicResult.score.technicalScore, unit: '/ 100', subtitle: 'Technical Precision', icon: Activity },
          { title: 'Tactical Score', value: dynamicResult.score.tacticalScore, unit: '/ 100', subtitle: 'Tactical Awareness', icon: Award, badge: 'Needs Work', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
          { title: 'Physical Score', value: dynamicResult.score.physicalScore, unit: '/ 100', subtitle: 'Physical Peak', icon: TrendingUp },
          { title: 'Decision Score', value: dynamicResult.score.decisionMakingScore, unit: '/ 100', subtitle: 'Decision Quality', icon: ShieldCheck },
        ],
        clips: dynamicResult.clips,
        events: dynamicResult.events,
        recommendations: dynamicResult.recommendations,
        tacticalFactors: dynamicResult.tacticalFactors,
        technicalFactors: dynamicResult.technicalFactors,
        strengthTitle: dynamicResult.strengthTitle,
        strengthDesc: dynamicResult.strengthDesc,
        weaknessTitle: dynamicResult.weaknessTitle,
        weaknessDesc: dynamicResult.weaknessDesc,
      };

      if (isMounted) {
        setMatch(currentMatch);
        setAnalysis(sportData);
      }
    }

    loadMatchAndAnalysis();

    return () => {
      isMounted = false;
    };
  }, [matchId, user, matches, getMatchesForUser, setSport, confidenceThreshold, snippetDuration]);

  if (!match || !analysis) return null;

  const isTeam = match.analysisFocus === 'TEAM';

  return (
    <AuthGuard>
      <div className="space-y-8 pb-12">
        {/* Header Banner */}
        <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {match.sport} Analysis
                </span>

                {isTeam ? (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Team Highlight Mode
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <User className="w-3 h-3" /> Player Biomechanics Mode
                  </span>
                )}

                <span className="text-xs text-slate-400 font-mono">{match.matchDate}</span>
              </div>
              <h1 className="text-2xl font-black text-white">{match.matchName}</h1>
              <p className="text-xs text-slate-400">{match.teamName} vs {match.opponentName} • {match.venue}</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {isTeam ? 'Team Performance Rating' : 'Match Overall Performance'}
              </span>
              <div className="text-4xl font-black text-brand-400">{analysis.score.overallScore}</div>
            </div>
          </div>

          {/* Quick Sport Engine Selector */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 font-medium">Switch AI Analysis Engine:</span>
            <div className="flex items-center gap-2">
              {(['Football', 'Cricket', 'Volleyball'] as SportType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => manuallySwitchSport(s)}
                  className={`px-3 py-1 rounded-xl font-bold transition text-xs ${
                    match.sport === s
                      ? 'bg-brand-500 text-black shadow-md'
                      : 'bg-dark-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {s === 'Football' ? '⚽ Football' : s === 'Cricket' ? '🏏 Cricket' : '🏐 Volleyball'}
                </button>
              ))}
            </div>
          </div>

          {autoCalibratedNotice && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-brand-500/15 to-cyan-500/15 border border-brand-500/40 text-slate-200 text-xs font-medium space-y-1">
              <div className="flex items-center gap-2 text-brand-400 font-extrabold uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                AI Multimodal Sport Detection Active
              </div>
              <p className="text-slate-300">
                {autoCalibratedNotice.reason}
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysis.metricCards.map((card, idx) => (
            <MetricCard
              key={idx}
              title={card.title}
              value={card.value}
              unit={card.unit}
              subtitle={card.subtitle}
              icon={card.icon}
              badge={card.badge}
              badgeColor={card.badgeColor}
            />
          ))}
        </div>

        {/* Video Player & Moments */}
        <VideoPlayer
          videoUrl={match.videoUrl}
          clips={analysis.clips}
          onThresholdChange={handleThresholdChange}
          sport={match.sport as SportType}
          matchId={match.id}
          fileName={match.matchName}
        />

        {/* Spatial Heatmap */}
        <HeatmapViewer sport={match.sport as SportType} athleteName={match.athleteName} />

        {/* Event Timeline */}
        <EventTimeline events={analysis.events} />

        {/* AI Coach Chatbot */}
        <AICoachChatbot sport={match.sport as SportType} athleteName={match.athleteName} matchName={match.matchName} />
      </div>
    </AuthGuard>
  );
}
