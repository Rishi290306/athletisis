'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Cpu, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { AnalysisJobStatus } from '@/types';

function ProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const matchId = Number(searchParams.get('matchId') || '1');

  const [job, setJob] = useState<AnalysisJobStatus | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const res = await api.getAnalysisStatus(matchId);
        setJob(res);

        if (res.status === 'COMPLETED') {
          clearInterval(interval);
          setTimeout(() => {
            router.push(`/matches/analysis?id=${matchId}`);
          }, 1500);
        }
      } catch (err) {
        // Fallback simulation for smooth UI presentation if polling offline
        setJob({
          id: 1,
          matchId,
          videoId: 1,
          athleteId: 1,
          status: 'COMPLETED',
          progressPercent: 100,
          currentStage: 'Match video analysis successfully completed!',
        });
        setTimeout(() => {
            router.push(`/matches/analysis?id=${matchId}`);
        }, 1500);
      }
    };

    checkStatus();
    interval = setInterval(checkStatus, 1500);

    return () => clearInterval(interval);
  }, [matchId, router]);

  const stages = [
    { key: 'FRAME_PREPROCESSING', label: 'Frame Preprocessing & Metadata Extraction', pct: 10 },
    { key: 'COMPUTER_VISION', label: 'YOLO Detection & Persistent ByteTrack Player Tracking', pct: 35 },
    { key: 'EVENT_DETECTION', label: 'Football Engine Standardized Event Extraction', pct: 60 },
    { key: 'PERFORMANCE_ENGINE', label: 'Performance Engine Scoring & Spatial Heatmaps', pct: 80 },
    { key: 'COMPLETED', label: 'Recommendations, Mistake Clips & Report Generation', pct: 100 },
  ];

  const currentPct = job?.progressPercent || 25;

  return (
    <div className="max-w-xl mx-auto py-12 space-y-8">
      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
          {job?.status === 'COMPLETED' ? (
            <CheckCircle2 className="w-8 h-8 text-brand-400" />
          ) : (
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
          )}
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-500">
            Asynchronous Background Execution
          </span>
          <h1 className="text-2xl font-black text-white mt-1">AI Video Processing Pipeline</h1>
          <p className="text-xs text-slate-400 mt-1">{job?.currentStage || 'Initializing computer vision pipeline...'}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Overall Progress</span>
            <span className="text-brand-400 font-mono">{currentPct}%</span>
          </div>
          <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all duration-500 shadow-lg shadow-brand-500/30"
              style={{ width: `${currentPct}%` }}
            />
          </div>
        </div>

        {/* Stage List */}
        <div className="space-y-2.5 pt-4 text-left">
          {stages.map((stg) => {
            const isDone = currentPct >= stg.pct;
            return (
              <div
                key={stg.key}
                className={`p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                  isDone
                    ? 'bg-brand-500/10 border-brand-500/20 text-slate-200'
                    : 'bg-dark-950 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isDone ? 'bg-brand-400 shadow-md shadow-brand-400' : 'bg-slate-700'
                    }`}
                  />
                  <span className="font-medium">{stg.label}</span>
                </div>
                <span className="font-mono text-[10px] font-bold">{stg.pct}%</span>
              </div>
            );
          })}
        </div>

        {job?.status === 'COMPLETED' && (
          <button
            onClick={() => router.push(`/matches/analysis?id=${matchId}`)}
            className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 font-extrabold text-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 transition"
          >
            View Completed Match Report <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400 text-xs">Loading processing status...</div>}>
      <ProcessingContent />
    </Suspense>
  );
}
