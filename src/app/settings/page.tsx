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
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      <div className="flex items-center gap-3 bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">System & Data Reset Settings</h1>
          <p className="text-xs text-slate-400">Manage sport engine parameters, clean local databases, and perform raw system resets</p>
        </div>
      </div>

      {/* Raw Reset & Data Wipe Card */}
      <div className="bg-dark-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-red-400 font-extrabold uppercase tracking-wider text-xs">
          <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
          Factory Reset & Raw Data Wipe
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Wipe all cached video blobs, local match data, saved accounts, and custom sport presets to reset Athletisis AI back to its completely clean, raw initial factory state.
        </p>

        <button
          onClick={handleReset}
          disabled={resetting}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 font-black text-white text-xs flex items-center gap-2 shadow-lg shadow-red-500/30 transition disabled:opacity-50"
        >
          {resetting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {resetting ? 'Wiping All Data...' : 'Delete All Data & Make Website Raw'}
        </button>
      </div>

      <div className="bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Sport Engine Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Active Sports Engines</label>
            <input type="text" disabled value="Football, Cricket, Volleyball" className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-slate-400 font-bold" />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">Computer Vision Keypoint Telemetry</label>
            <input type="text" disabled value="17-Point COCO Pose Model" className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-slate-400 font-bold" />
          </div>
        </div>
      </div>
    </div>
  );
}
