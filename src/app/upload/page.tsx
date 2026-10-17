'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Video, ShieldCheck, ArrowRight, CheckCircle2, Trophy, MapPin, Calendar, Users, User } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Header Card */}
        <div className="pro-card p-6 sm:p-8 space-y-2 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/40 flex items-center justify-center mx-auto mb-2 font-bold shadow-md">
            <Upload className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Upload Match Footage & Telemetry</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Upload match video recordings to generate 17-point pose skeleton tracking, 2D tactical field maps, biomechanical strain metrics, and actionable training drills.
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUploadAndAnalyze} className="pro-card p-6 sm:p-8 space-y-6 text-xs">
          
          {/* 1. Sport Selection Field */}
          <div>
            <label className="block font-bold text-slate-200 uppercase tracking-wider mb-2">
              1. Select Sport Discipline <span className="text-sky-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {sportsList.map((s) => {
                const conf = SPORT_CONFIGS[s];
                const isSelected = selectedSport === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => handleSportChange(s)}
                    className={`p-3.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-600/30 border-sky-400 text-white shadow-lg ring-2 ring-sky-400/50'
                        : 'bg-[#0b1329] border-slate-700/80 text-slate-300 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl">{conf?.icon}</span>
                    <span className="font-bold text-xs">{conf?.name.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Video File Dropzone */}
          <div>
            <label className="block font-bold text-slate-200 uppercase tracking-wider mb-2">
              2. Match Video File <span className="text-slate-400 font-normal">(Leave empty to use calibrated sample match footage)</span>
            </label>
            <div className="border-2 border-dashed border-slate-700 hover:border-sky-400 rounded-xl p-6 text-center space-y-3 bg-[#0b1329] transition group cursor-pointer relative">
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/avi,video/webm,video/x-matroska"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Video className="w-10 h-10 text-sky-400 mx-auto group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-bold text-sky-400 text-xs">
                  {selectedFile ? selectedFile.name : 'Click or drag & drop to choose match video'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Supports MP4, MOV, AVI, WebM (Auto-downscales for smooth browser playback)</p>
              </div>
              {selectedFile && (
                <div className="inline-block px-3 py-1 rounded bg-sky-950/60 border border-sky-700 text-sky-300 font-mono text-xs font-bold">
                  ✓ File Attached: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-700 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* 3. Match Details Form Fields */}
          <div className="space-y-4 pt-2 border-t border-slate-700/80">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-2">
              <Trophy className="w-4 h-4 text-sky-400" /> 3. Match Metadata & Telemetry Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Match Title</label>
                <input
                  type="text"
                  required
                  value={matchName}
                  onChange={(e) => setMatchName(e.target.value)}
                  placeholder="e.g. Semi-Final vs Rivals"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0b1329] border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Match Date</label>
                <input
                  type="date"
                  required
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0b1329] border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Opponent Team</label>
                <input
                  type="text"
                  required
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  placeholder="e.g. Melbourne Stars"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0b1329] border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Venue / Arena</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Melbourne Cricket Ground"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0b1329] border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Player Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#0b1329] border border-slate-700 text-white focus:outline-none focus:border-sky-400"
                >
                  {SPORT_CONFIGS[selectedSport]?.positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Analysis Focus</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAnalysisFocus('PLAYER')}
                    className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border transition ${
                      analysisFocus === 'PLAYER'
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                        : 'bg-[#0b1329] text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Individual Player
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalysisFocus('TEAM')}
                    className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 border transition ${
                      analysisFocus === 'TEAM'
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                        : 'bg-[#0b1329] text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> Entire Team
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Coach Notes & Tactical Directives</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific focus areas for computer vision analysis..."
                className="w-full px-3.5 py-2 rounded-lg bg-[#0b1329] border border-slate-700 text-white focus:outline-none focus:border-sky-400 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition disabled:opacity-50"
          >
            {uploading ? (
              <>Extracting Pose Keypoints & Telemetry...</>
            ) : (
              <>Launch AI Telemetry & Open Workstation <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

      </div>
    </AuthGuard>
  );
}
