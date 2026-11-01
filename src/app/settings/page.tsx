'use client';

import React, { useState } from 'react';
import {
  Settings,
  Save,
  Trash2,
  AlertTriangle,
  RefreshCw,
  User,
  ShieldCheck,
  Cpu,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuthStore } from '@/lib/store';
import { useSportStore } from '@/lib/sportStore';
import { resetAllApplicationData } from '@/lib/resetStore';

export default function SettingsPage() {
  const { user, athlete } = useAuthStore();
  const { activeSport } = useSportStore();

  const [fullName, setFullName] = useState(user?.fullName || 'Rishi Tiwari');
  const [email, setEmail] = useState(user?.email || 'rishi.tiwari@athletisis.ai');
  const [clubName, setClubName] = useState(athlete?.teamName || 'National High Performance Center');
  const [resetting, setResetting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all local video blobs, matches, and application caches to raw factory state?')) {
      setResetting(true);
      await resetAllApplicationData();
      window.location.reload();
    }
  };

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#6675E8] flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0B1020] text-[#6675E8] border border-[#28334D]">
                  Platform Config
                </span>
                <span className="text-xs text-[#9AA6BD]">• Enterprise SaaS v2.4</span>
              </div>
              <h1 className="text-lg font-bold text-[#F3F5FA] tracking-tight">Platform & Account Settings</h1>
            </div>
          </div>
        </div>

        {/* 1. Profile & Organization Form */}
        <form onSubmit={handleSave} className="rounded-xl p-6 bg-[#151C35] border border-[#28334D] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#28334D]">
            <h2 className="text-sm font-bold text-[#F3F5FA] flex items-center gap-2">
              <User className="w-4 h-4 text-[#55BDEB]" />
              <span>User Profile & Organization</span>
            </h2>
            {saved && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Preferences Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] transition text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1">
                Account Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] transition text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1">
                Athletic Organization / Club
              </label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] transition text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1">
                Active Sport Discipline
              </label>
              <input
                type="text"
                disabled
                value={`${activeSport} (Configured in Sidebar)`}
                className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#9AA6BD] font-mono text-xs cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Account Settings</span>
            </button>
          </div>
        </form>

        {/* 2. Computer Vision & Telemetry Engine Configuration */}
        <div className="rounded-xl p-6 bg-[#151C35] border border-[#28334D] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#28334D]">
            <h2 className="text-sm font-bold text-[#F3F5FA] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#E8B75A]" />
              <span>Computer Vision & MediaPipe Engine</span>
            </h2>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-[#0B1020] border border-[#28334D]">
              ONLINE (14ms INFERENCE)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[#0B1020] border border-[#28334D] space-y-1">
              <span className="text-[10px] text-[#9AA6BD] uppercase font-mono block">Pose Estimator</span>
              <span className="font-semibold text-[#F3F5FA] block">MediaPipe 17-Point COCO</span>
              <p className="text-[11px] text-[#9AA6BD]">Calibrated anatomical keypoint mapping</p>
            </div>

            <div className="p-3 rounded-lg bg-[#0B1020] border border-[#28334D] space-y-1">
              <span className="text-[10px] text-[#9AA6BD] uppercase font-mono block">Video Telemetry FPS</span>
              <span className="font-semibold text-[#F3F5FA] block">60 FPS Native Sampling</span>
              <p className="text-[11px] text-[#9AA6BD]">Sub-pixel temporal tracking resolution</p>
            </div>

            <div className="p-3 rounded-lg bg-[#0B1020] border border-[#28334D] space-y-1">
              <span className="text-[10px] text-[#9AA6BD] uppercase font-mono block">Confidence Threshold</span>
              <span className="font-semibold text-[#F3F5FA] block">0.35 Min Landmark Tier</span>
              <p className="text-[11px] text-[#9AA6BD]">Adaptive occlusion filter enabled</p>
            </div>
          </div>
        </div>

        {/* 3. System Reset & Data Wipe Card */}
        <div className="rounded-xl p-6 bg-[#151C35] border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Factory Reset & Cached Data Wipe</span>
          </div>
          <p className="text-xs text-[#9AA6BD] leading-relaxed">
            Wipe all cached video blobs, local match records, saved accounts, and custom sport presets to reset Athletisis AI back to its clean initial factory state.
          </p>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 font-semibold text-rose-300 text-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {resetting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            <span>{resetting ? 'Resetting Application State...' : 'Reset Application State to Raw Initial'}</span>
          </button>
        </div>

      </div>
    </AuthGuard>
  );
}
