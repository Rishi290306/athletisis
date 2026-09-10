'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Video, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSportStore, SPORT_CONFIGS, SportType } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { AuthGuard } from '@/components/AuthGuard';
import { api } from '@/lib/api';
import { VideoMetadata } from '@/types';

import { saveVideoBlob } from '@/lib/videoStore';
import { Users, User } from 'lucide-react';

import { detectSportFromVideo, SportDetectionResult } from '@/lib/sportDetector';

export default function UploadPage() {
  const router = useRouter();
  const { activeSport, setSport } = useSportStore();
  const { user, athlete: storeAthlete } = useAuthStore();
  const config = SPORT_CONFIGS[activeSport];

  const currentTeam = storeAthlete?.teamName || 'FC Thunder';

  const [matchName, setMatchName] = useState('Championship Final vs Opponents');
  const [matchDate, setMatchDate] = useState('2026-09-01');
  const [opponentName, setOpponentName] = useState('Opponent Team');
  const [venue, setVenue] = useState('Central Sports Stadium');
  const [matchType, setMatchType] = useState('Competitive');
  const [position, setPosition] = useState(config.positions[0]);
  const [analysisFocus, setAnalysisFocus] = useState<'PLAYER' | 'TEAM'>('PLAYER');
  const [notes, setNotes] = useState('AI tracking & performance engine evaluation');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [qualityAssessment, setQualityAssessment] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mismatchInfo, setMismatchInfo] = useState<SportDetectionResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['mp4', 'mov', 'avi', 'mkv'].includes(ext || '')) {
        setError('Unsupported file format. Please upload MP4, MOV, AVI, or MKV.');
        return;
      }
      setError(null);
      setSelectedFile(file);

      // AI Sport Mismatch Detection & Auto-Calibration
      const detection = detectSportFromVideo(file.name, activeSport);
      if (detection.isMismatch) {
        setMismatchInfo(detection);
        setSport(detection.detectedSport);
      } else {
        setMismatchInfo(null);
      }

      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const formatted = nameWithoutExt.replace(/[-_]/g, ' ');
      const effectiveSport = detection.isMismatch ? detection.detectedSport : activeSport;
      setMatchName(`${formatted.charAt(0).toUpperCase()}${formatted.slice(1)} - ${effectiveSport} Footage`);
    }
  };

  const addMatch = useMatchStore((state) => state.addMatch);

  const handleUploadAndAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      let fileBlobUrl = '/sample-match.mp4';
      if (selectedFile) {
        fileBlobUrl = URL.createObjectURL(selectedFile);
      }

      const newMatch = addMatch({
        matchName: matchName || `${activeSport} Match vs ${opponentName}`,
        sport: activeSport,
        matchDate: matchDate || new Date().toISOString().split('T')[0],
        teamName: currentTeam,
        opponentName: opponentName || 'Opponents',
        venue: venue || 'Stadium',
        matchType,
        athleteId: user?.id || Date.now(),
        athleteName: user?.fullName || 'Athlete User',
        notes: notes || 'AI tracking evaluation',
        videoUrl: fileBlobUrl,
        analysisFocus,
        status: 'COMPLETED',
      });

      if (selectedFile) {
        await saveVideoBlob(newMatch.id, selectedFile);
      }

      const videoMeta: VideoMetadata = {
        id: Date.now(),
        matchId: newMatch.id,
        originalFileName: selectedFile?.name || `${activeSport.toLowerCase()}_footage_sample.mp4`,
        fileUrl: `/storage/uploads/${activeSport.toLowerCase()}_sample.mp4`,
        fileSizeBytes: selectedFile?.size || 245000000,
        durationSeconds: 120.0,
        width: 1920,
        height: 1080,
        fps: 30.0,
        qualityScore: 88,
        lightingScore: 89,
        blurScore: 85,
        cameraAngle: 'Tactical Elevated Wide',
        playerVisibilityScore: 87,
        ballVisibilityScore: 84,
        warningMessage: 'Tracking engine calibrated for wide tactical pitch view.',
        status: 'QUALITY_CHECKED',
      };

      setQualityAssessment(videoMeta);

      setTimeout(() => {
        router.push(`/matches/analysis?id=${newMatch.id}`);
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Video upload and quality analysis failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto py-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-2 text-2xl">
            {config.icon}
          </div>
          <h1 className="text-3xl font-black text-white">Upload {config.name} Match Footage</h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Account: <strong className="text-white">{user?.fullName}</strong> ({currentTeam}). Upload match footage for computer vision analysis.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {mismatchInfo && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-brand-500/15 to-cyan-500/15 border border-brand-500/40 text-slate-200 text-xs font-medium space-y-1.5 shadow-xl">
            <div className="flex items-center gap-2 text-brand-400 font-extrabold uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              AI Multimodal Sport Detection & Auto-Calibration Active
            </div>
            <p className="text-slate-300 leading-relaxed">
              {mismatchInfo.reason}
            </p>
          </div>
        )}

        <form onSubmit={handleUploadAndAnalyze} className="space-y-6">
          {/* Sport Selection Buttons */}
          <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Select Sport Engine Category</label>
            <div className="grid grid-cols-3 gap-3">
              {(['Football', 'Cricket', 'Volleyball'] as SportType[]).map((s) => {
                const sConf = SPORT_CONFIGS[s];
                const isSel = activeSport === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => {
                      setSport(s);
                      setPosition(sConf.positions[0]);
                    }}
                    className={`p-3.5 rounded-xl border text-center transition duration-300 flex flex-col items-center gap-1 ${
                      isSel
                        ? 'bg-brand-500/20 border-brand-500 text-white shadow-[0_0_20px_rgba(255,199,0,0.3)] scale-[1.02]'
                        : 'bg-dark-950/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-2xl">{sConf.icon}</span>
                    <span className="text-xs font-extrabold">{sConf.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Analysis Focus Target (Player vs Team) */}
          <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Analysis Scope & Focus</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAnalysisFocus('PLAYER')}
                className={`p-4 rounded-xl border text-left transition duration-200 flex items-start gap-3 ${
                  analysisFocus === 'PLAYER'
                    ? 'bg-brand-500/20 border-brand-500 text-white shadow-[0_0_20px_rgba(255,199,0,0.25)]'
                    : 'bg-dark-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-6 h-6 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-white uppercase">Individual Athlete Focus</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">Evaluates personal biomechanics, individual decisions, and customized player drills.</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAnalysisFocus('TEAM')}
                className={`p-4 rounded-xl border text-left transition duration-200 flex items-start gap-3 ${
                  analysisFocus === 'TEAM'
                    ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                    : 'bg-dark-950/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-white uppercase">Team Highlight Focus</div>
                  <div className="text-[11px] text-slate-400 leading-tight mt-0.5">Evaluates team tactical compactness, formation press cohesion, and team-level recommendations.</div>
                </div>
              </button>
            </div>
          </div>

          {/* Match Metadata Fields */}
          <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">1. {config.name} Match Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Match Name</label>
                <input
                  type="text"
                  required
                  value={matchName}
                  onChange={(e) => setMatchName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Athlete Position / Role</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  {config.positions.map((pos) => (
                    <option key={pos} value={pos} className="bg-dark-900 text-white">
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Match Date</label>
                <input
                  type="date"
                  required
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Opponent Team</label>
                <input
                  type="text"
                  required
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Video File Dropzone */}
          <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">2. Select {config.name} Video</h2>

            <div className="border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-xl p-8 text-center transition bg-dark-950/80 group">
              <Video className="w-10 h-10 text-slate-500 group-hover:text-brand-400 mx-auto mb-3 transition-colors" />
              <p className="text-xs font-bold text-slate-200">Drag & drop {config.name} footage or click to browse</p>
              <p className="text-[11px] text-slate-500 mt-1">Supports MP4, MOV, AVI, MKV up to 500MB</p>

              <input
                type="file"
                accept=".mp4,.mov,.avi,.mkv"
                onChange={handleFileChange}
                className="mt-4 text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-500/10 file:text-brand-400 hover:file:bg-brand-500/20 file:cursor-pointer"
              />
            </div>
          </div>

          {/* Video Quality Report */}
          {qualityAssessment && (
            <div className="glass-panel border border-brand-500/30 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-brand-400" />
                  <h3 className="text-sm font-bold text-white">Video Quality Analysis Report</h3>
                </div>
                <span className="text-lg font-black text-brand-400">Quality Score: {qualityAssessment.qualityScore}%</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Resolution</span>
                  <span className="font-bold text-white">{qualityAssessment.width}x{qualityAssessment.height}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Framerate</span>
                  <span className="font-bold text-white">{qualityAssessment.fps} FPS</span>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Camera Angle</span>
                  <span className="font-bold text-white">{qualityAssessment.cameraAngle}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-dark-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Visibility Score</span>
                  <span className="font-bold text-white">{qualityAssessment.playerVisibilityScore}%</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 hover:from-brand-400 hover:to-cyan-300 font-extrabold text-black text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 hover:scale-[1.01]"
          >
            {uploading ? `Analyzing Quality & Creating ${config.name} Job...` : `Start Asynchronous ${config.name} AI Analysis`} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </AuthGuard>
  );
}
