'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Upload,
  Video,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Trophy,
  MapPin,
  Calendar,
  Users,
  User,
  LayoutDashboard,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useSportStore, SPORT_CONFIGS, SportType } from '@/lib/sportStore';
import { useAuthStore, useMatchStore } from '@/lib/store';
import { AuthGuard } from '@/components/AuthGuard';
import { saveVideoBlob, savePoseDataset } from '@/lib/videoStore';
import { detectSportFromVideo } from '@/lib/sportDetector';

export default function UploadPage() {
  const router = useRouter();
  const { activeSport, setSport } = useSportStore();
  const { user, athlete: storeAthlete } = useAuthStore();

  const currentTeam = storeAthlete?.teamName || 'National High Performance Center';

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
      } else if (selectedSport === 'Volleyball') {
        fileBlobUrl = '/sample-volleyball.mp4';
      }

      const newMatch = addMatch({
        matchName: matchName.trim() || `${selectedSport} Match vs ${opponentName}`,
        sport: selectedSport,
        matchDate: matchDate || new Date().toISOString().split('T')[0],
        teamName: currentTeam,
        opponentName: opponentName.trim() || 'Opponent Team',
        venue: venue.trim() || 'National Stadium',
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

        // Initiate MediaPipe pose extraction on the backend
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);
          fetch('http://127.0.0.1:8000/api/v1/video/process-direct', {
            method: 'POST',
            body: formData,
          })
            .then((res) => (res.ok ? res.json() : null))
            .then(async (poseData) => {
              if (poseData && poseData.timeline && poseData.timeline.length > 0) {
                await savePoseDataset(newMatch.id, poseData);
                console.log('[Upload] MediaPipe pose track saved for match', newMatch.id);
              }
            })
            .catch((err) => {
              console.warn('[Upload] MediaPipe background processing error:', err);
            });
        } catch (e) {
          console.warn('[Upload] Could not trigger MediaPipe inference:', e);
        }
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
      <div className="max-w-3xl mx-auto space-y-5">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-2 border-b border-[#28334D]">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#9AA6BD] hover:text-[#55BDEB] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
          <span className="text-[11px] font-mono text-[#9AA6BD]">Video Intake & Telemetry Engine</span>
        </div>

        {/* Header Card */}
        <div className="rounded-xl p-5 sm:p-6 bg-[#151C35] border border-[#28334D] text-center space-y-1.5">
          <div className="w-10 h-10 rounded-lg bg-[#0B1020] text-[#6675E8] border border-[#28334D] flex items-center justify-center mx-auto mb-1.5 shadow-sm">
            <Upload className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5FA] tracking-tight">Upload Match Footage & Run Telemetry</h1>
          <p className="text-xs text-[#9AA6BD] max-w-lg mx-auto">
            Ingest video recordings to extract 17-point pose skeleton tracking, 2D tactical field maps, biomechanical strain metrics, and training drills.
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUploadAndAnalyze} className="rounded-xl p-5 sm:p-6 bg-[#151C35] border border-[#28334D] space-y-5 text-xs">
          
          {/* 1. Sport Selection Field */}
          <div>
            <label className="block font-semibold text-[#F3F5FA] uppercase tracking-wider mb-2 text-[11px]">
              1. Sport Discipline <span className="text-[#6675E8]">*</span>
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
                    className={`p-3 rounded-lg border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B1020] border-[#6675E8] text-[#F3F5FA] shadow-sm ring-1 ring-[#6675E8]/40'
                        : 'bg-[#0B1020] border-[#28334D] text-[#9AA6BD] hover:border-[#3D4D73] hover:text-[#F3F5FA]'
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
            <label className="block font-semibold text-[#F3F5FA] uppercase tracking-wider mb-2 text-[11px]">
              2. Match Video Recording <span className="text-[#9AA6BD] font-normal lowercase">(Optional: leave empty to use pre-calibrated sample footage)</span>
            </label>
            <div className="border-2 border-dashed border-[#28334D] hover:border-[#6675E8] rounded-xl p-6 text-center space-y-2 bg-[#0B1020] transition group cursor-pointer relative">
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/avi,video/webm,video/x-matroska"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Video className="w-8 h-8 text-[#6675E8] mx-auto transition-transform group-hover:scale-105" />
              <div>
                <p className="font-semibold text-[#F3F5FA] text-xs">
                  {selectedFile ? selectedFile.name : 'Select or drop match video file here'}
                </p>
                <p className="text-[11px] text-[#9AA6BD] mt-0.5">MP4, MOV, AVI, WebM (Auto 17-point MediaPipe mesh calibration)</p>
              </div>
              {selectedFile && (
                <div className="inline-block px-2.5 py-0.5 rounded bg-[#6675E8]/10 border border-[#6675E8]/30 text-[#55BDEB] font-mono text-[11px] font-semibold">
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
          <div className="space-y-3.5 pt-2 border-t border-[#28334D]">
            <h3 className="font-bold text-[#F3F5FA] uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-[#55BDEB]" /> Match Metadata & Telemetry Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-medium text-[#9AA6BD] mb-1">Match Title</label>
                <input
                  type="text"
                  required
                  value={matchName}
                  onChange={(e) => setMatchName(e.target.value)}
                  placeholder="e.g. Semi-Final vs Rivals"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9AA6BD] mb-1">Match Date</label>
                <input
                  type="date"
                  required
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9AA6BD] mb-1">Opponent Team</label>
                <input
                  type="text"
                  required
                  value={opponentName}
                  onChange={(e) => setOpponentName(e.target.value)}
                  placeholder="e.g. Melbourne Stars"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9AA6BD] mb-1">Venue / Arena</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Melbourne Cricket Ground"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9AA6BD] mb-1">Player Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] text-xs"
                >
                  {SPORT_CONFIGS[selectedSport]?.positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9AA6BD] mb-1">Analysis Focus</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAnalysisFocus('PLAYER')}
                    className={`py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                      analysisFocus === 'PLAYER'
                        ? 'bg-[#0B1020] text-[#F3F5FA] border-[#6675E8] shadow-sm font-semibold'
                        : 'bg-[#0B1020] text-[#9AA6BD] border-[#28334D] hover:text-[#F3F5FA]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Individual Player
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalysisFocus('TEAM')}
                    className={`py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                      analysisFocus === 'TEAM'
                        ? 'bg-[#0B1020] text-[#F3F5FA] border-[#6675E8] shadow-sm font-semibold'
                        : 'bg-[#0B1020] text-[#9AA6BD] border-[#28334D] hover:text-[#F3F5FA]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" /> Entire Team
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#9AA6BD] mb-1">Coach Notes & Tactical Directives</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific focus areas for computer vision analysis..."
                className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] resize-none text-xs"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="space-y-2.5 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting 17-Point Pose Keypoints & Telemetry...</span>
                </>
              ) : (
                <>
                  <span>Launch AI Telemetry & Open Workstation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <Link
              href="/dashboard"
              className="w-full py-2 rounded-lg bg-[#0B1020] hover:bg-[#1A2342] text-[#9AA6BD] hover:text-[#F3F5FA] border border-[#28334D] text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#6675E8]" />
              <span>Cancel & Return to Dashboard</span>
            </Link>
          </div>
        </form>

      </div>
    </AuthGuard>
  );
}

