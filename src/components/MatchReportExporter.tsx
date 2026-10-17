'use client';

import React, { useState } from 'react';
import { Printer, Download, QrCode, Share2, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

interface MatchReportExporterProps {
  sport?: string;
  athleteName?: string;
  matchId?: string;
  metrics?: {
    topSpeed?: string;
    distance?: string;
    stamina?: string;
    tacticalScore?: string;
  };
}

export function MatchReportExporter({
  sport = 'Soccer',
  athleteName = 'Rishi Tiwari',
  matchId = '101',
  metrics = {
    topSpeed: '32.8 km/h',
    distance: '9.4 km',
    stamina: '78.5 / 100',
    tacticalScore: '84.2 / 100'
  }
}: MatchReportExporterProps) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pro-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 no-print">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Executive Coach Match Report Exporter
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Link Copied!' : 'Share Link'}
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF Report
          </button>
        </div>
      </div>

      {/* Printable Report Summary Sheet Preview */}
      <div className="p-5 rounded-lg bg-[#090a0f] border border-slate-800 space-y-4 text-slate-100">
        
        {/* Report Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Athletisis Pro Telemetry Report
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">{athleteName} • Match Performance Assessment</h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Sport: <span className="text-slate-200 font-semibold capitalize">{sport}</span> • Match ID: #{matchId} • Date: {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="p-2 bg-[#12151e] rounded-lg border border-slate-800 text-center shrink-0">
            <QrCode className="w-8 h-8 text-sky-400 mx-auto" />
            <span className="text-[9px] font-mono text-slate-400 block mt-1">SCAN FOR MOBILE</span>
          </div>
        </div>

        {/* Telemetry Summary Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[#12151e] border border-slate-800">
            <div className="text-[10px] font-bold uppercase text-slate-400">Top Sprint Velocity</div>
            <div className="text-lg font-bold text-white font-mono mt-1">{metrics.topSpeed}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Top 5% League Avg</div>
          </div>

          <div className="p-3 rounded-lg bg-[#12151e] border border-slate-800">
            <div className="text-[10px] font-bold uppercase text-slate-400">Total Distance Covered</div>
            <div className="text-lg font-bold text-white font-mono mt-1">{metrics.distance}</div>
            <div className="text-[10px] text-sky-400 mt-0.5">High Workrate</div>
          </div>

          <div className="p-3 rounded-lg bg-[#12151e] border border-slate-800">
            <div className="text-[10px] font-bold uppercase text-slate-400">Stamina Recovery Index</div>
            <div className="text-lg font-bold text-white font-mono mt-1">{metrics.stamina}</div>
            <div className="text-[10px] text-amber-400 mt-0.5">Moderate Fatigue</div>
          </div>

          <div className="p-3 rounded-lg bg-[#12151e] border border-slate-800">
            <div className="text-[10px] font-bold uppercase text-slate-400">Tactical Strategy Score</div>
            <div className="text-lg font-bold text-white font-mono mt-1">{metrics.tacticalScore}</div>
            <div className="text-[10px] text-purple-400 mt-0.5">Excellent Alignment</div>
          </div>
        </div>

        {/* Executive Coaching Notes & Training Assignments */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            Coach's Tactical Directives & Assigned Drills
          </div>
          <div className="p-3 rounded-lg bg-[#12151e] border border-slate-800 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Front-Foot Weight Transfer Drill:</span>
                <span className="text-slate-300 ml-1">4 Sets x 12 Reps (20 mins). Focus on stabilizing plant foot before strike.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Deceleration Recovery Routine:</span>
                <span className="text-slate-300 ml-1">Copenhagen adductor holds to prevent hamstring overload detected at min 01:22.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Authentication */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>CERTIFIED ATHLETISIS COMPUTER VISION ENGINE</span>
          <span>DOCUMENT REF: ATH-{matchId}-2026</span>
        </div>
      </div>
    </div>
  );
}
