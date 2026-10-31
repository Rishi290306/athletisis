'use client';

import { useState } from 'react';
import { Settings, Save, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { resetAllApplicationData } from '@/lib/resetStore';

export default function SettingsPage() {
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (confirm('Are you sure you want to delete ALL uploaded videos, matches, accounts, and reset the website to raw initial state?')) {
      setResetting(true);
      await resetAllApplicationData();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3 pro-card p-6">
        <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">System & Data Settings</h1>
          <p className="text-xs text-slate-400">Manage sport engine parameters, clean local databases, and perform raw system resets</p>
        </div>
      </div>

      {/* Raw Reset & Data Wipe Card */}
      <div className="pro-card border border-red-500/30 p-6 space-y-4">
        <div className="flex items-center gap-2 text-red-400 font-semibold uppercase tracking-wider text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Factory Reset & Raw Data Wipe
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Wipe all cached video blobs, local match data, saved accounts, and custom sport presets to reset Athletisis AI back to its completely clean, raw initial factory state.
        </p>

        <button
          onClick={handleReset}
          disabled={resetting}
          className="px-4 py-2.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/60 font-semibold text-red-200 text-xs flex items-center gap-2 transition disabled:opacity-50"
        >
          {resetting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          {resetting ? 'Wiping All Data...' : 'Delete All Data & Make Website Raw'}
        </button>
      </div>

      <div className="pro-card p-6 space-y-4">
        <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Sport Engine Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Active Sports Engines</label>
            <input type="text" disabled value="Football, Cricket, Volleyball" className="w-full px-3.5 py-2 rounded-lg bg-[#090D16] border border-slate-800 text-slate-400 font-medium" />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1">Computer Vision Keypoint Telemetry</label>
            <input type="text" disabled value="17-Point COCO Pose Model" className="w-full px-3.5 py-2 rounded-lg bg-[#090D16] border border-slate-800 text-slate-400 font-medium" />
          </div>
        </div>
      </div>
    </div>
  );
}
