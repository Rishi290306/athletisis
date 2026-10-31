'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, Video, ShieldCheck, ArrowRight, CheckCircle2, Trophy, MapPin, Calendar, Users, User, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { useSportStore, SPORT_CONFIGS, SportType } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { AuthGuard } from '@/components/AuthGuard';
import { saveVideoBlob } from '@/lib/videoStore';
import { detectSportFromVideo } from '@/lib/sportDetector';

export default function UploadPage() {
  const router = useRouter();
  const { activeSport, setSport } = useSportStore();
  const { user, athlete: storeAthlete } = useAuthStore();

  const currentTeam = storeAthlete?.teamName || 'FC Thunder';

  // Form Fields
  const [selectedSport, setSelectedSport] = useState<SportType>(activeSport || 'Cricket');
  const [matchName, setMatchName] = useState('Championship Final vs Opponents');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [opponentName, setOpponentName] = useState('Rival Kings');
  const [venue, setVenue] = useState('National Sports Arena');
  const [matchType, setMatchType] = useState('Competitive');
  const [position, setPosition] = useState(SPORT_CONFIGS[selectedSport]?.positions[0] || 'Batsman (Opener)');
  const [analysisFocus, setAnalysisFocus] = useState<'PLAYER' | 'TEAM'>('PLAYER');
  const [notes, setNotes] = useState('AI tracking & computer vision performance evaluation');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSportChange = (newSport: SportType) => {
    setSelectedSport(newSport);
    setSport(newSport);
    setPosition(SPORT_CONFIGS[newSport]?.positions[0] || '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext || '')) {
        setError('Unsupported format. Please upload MP4, MOV, AVI, WebM or MKV.');
        return;
      }
      setError(null);
      setSelectedFile(file);

      const detection = detectSportFromVideo(file.name, selectedSport);
      if (detection.isMismatch) {
        handleSportChange(detection.detectedSport as SportType);
      }

      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const formatted = nameWithoutExt.replace(/[-_]/g, ' ');
      setMatchName(`${formatted.charAt(0).toUpperCase()}${formatted.slice(1)} - Analysis`);
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
      } else if (selectedSport === 'Cricket') {
        fileBlobUrl = '/sample-match2.mp4';
      }

      const newMatch = addMatch({
        matchName: matchName.trim() || `${selectedSport} Match vs ${opponentName}`,
        sport: selectedSport,
        matchDate: matchDate || new Date().toISOString().split('T')[0],
        teamName: currentTeam,
        opponentName: opponentName.trim() || 'Opponent Team',
        venue: venue.trim() || 'Main Stadium',
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

      router.push(`/matches/analysis?id=${newMatch.id}`);
    } catch (err: any) {
      setError(err?.message || 'Failed to process match video.');
      setUploading(false);
    }
  };

  const sportsList: SportType[] = ['Cricket', 'Football', 'Volleyball'];

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto space-y-5 py-4">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-sky-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
            <span>Return to Dashboard</span>
          </Link>
          <span className="text-[11px] font-mono text-slate-500">Video Intake & Telemetry Processor</span>
        </div>

        {/* Header Card */}
        <div className="pro-card p-5 sm:p-6 text-center space-y-1.5">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mx-auto mb-1.5 shadow-sm">
            <Upload className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Upload Match Video & Run Telemetry</h1>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Upload match video recordings to generate 17-point pose skeleton tracking, 2D tactical field maps, biomechanical strain metrics, and training drills.
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUploadAndAnalyze} className="pro-card p-5 sm:p-6 space-y-5 text-xs">
          
          {/* 1. Sport Selection Field */}
          <div>
            <label className="block font-medium text-slate-300 uppercase tracking-wider mb-2 text-[11px]">
              1. Sport Discipline <span className="text-sky-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {sportsList.map((s) => {
                const conf = SPORT_CONFIGS[s];
                const isSelected = selectedSport === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => handleSportChange(s)}
                    className={`p-3 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-400 text-white shadow-sm ring-1 ring-sky-400/30'
                        : 'bg-[#141D30] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{conf?.icon}</span>
                    <span className="font-semibold text-xs">{conf?.name.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Video File Dropzone */}
          <div>
            <label className="block font-medium text-slate-300 uppercase tracking-wider mb-2 text-[11px]">
              2. Match Video Recording <span className="text-slate-500 font-normal lowercase">(Optional: leave empty to use sample video)</span>
            </label>
            <div className="border border-dashed border-slate-700 hover:border-sky-500 rounded-xl p-5 text-center space-y-2 bg-[#141D30] transition group cursor-pointer relative">
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/avi,video/webm,video/x-matroska"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Video className="w-8 h-8 text-sky-400 mx-auto transition-transform group-hover:scale-105" />
              <div>
                <p className="font-semibold text-sky-400 text-xs">
                  {selectedFile ? selectedFile.name : 'Select or drag match video file'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">MP4, MOV, AVI, WebM (Adaptive letterbox & 17-point pose estimation)</p>
              </div>
              {selectedFile && (
                <div className="inline-block px-2.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono text-[11px] font-semibold">
                  ✓ File Attached: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* 3. Match Details Form Fields */}
          <div className="space-y-3.5 pt-2 border-t border-slate-800">
            <h3 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-sky-400" /> Match Metadata & Telemetry Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-medium text-slate-400 mb-1">Match Title</label>
                <input
                  type="text"
                  required
                  value={matchName}
                  onChange={(e) => setMatchName(e.target.value)}
                  placeholder="e.g. Semi-Final vs Rivals"
                  className="w-full px-3 py-2 rounded-lg bg-[#141D30] border border-slate-800 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Match Date</label>
                <input
                  type="date"
                  required
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141D30] border border-slate-800 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Opponent Team</label>
                <input
                  type="text"
                  required
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  placeholder="e.g. Melbourne Stars"
                  className="w-full px-3 py-2 rounded-lg bg-[#141D30] border border-slate-800 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Venue / Arena</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Melbourne Cricket Ground"
                  className="w-full px-3 py-2 rounded-lg bg-[#141D30] border border-slate-800 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Player Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141D30] border border-slate-800 text-white focus:outline-none focus:border-sky-400"
                >
                  {SPORT_CONFIGS[selectedSport]?.positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Analysis Focus</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAnalysisFocus('PLAYER')}
                    className={`py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 border transition ${
                      analysisFocus === 'PLAYER'
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                        : 'bg-[#141D30] text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Individual Player
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalysisFocus('TEAM')}
                    className={`py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 border transition ${
                      analysisFocus === 'TEAM'
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                        : 'bg-[#141D30] text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> Entire Team
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-400 mb-1">Coach Notes & Tactical Directives</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific focus areas for computer vision analysis..."
                className="w-full px-3 py-2 rounded-lg bg-[#141D30] border border-slate-800 text-white focus:outline-none focus:border-sky-400 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 active:scale-95"
            >
              {uploading ? (
                <>Extracting Pose Keypoints & Telemetry...</>
              ) : (
                <>Launch AI Telemetry & Open Workstation <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <Link
              href="/dashboard"
              className="w-full py-2.5 rounded-lg bg-[#141D30] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
              Cancel & Return to Dashboard
            </Link>
          </div>
        </form>

      </div>
    </AuthGuard>
  );
}
