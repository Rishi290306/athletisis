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
    <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#28334D] no-print">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#55BDEB]" />
          <h3 className="text-xs font-bold text-[#F3F5FA] uppercase tracking-wider">
            Executive Coach Match Report Exporter
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg bg-[#0B1020] hover:bg-[#1A2342] text-[#F3F5FA] text-xs font-semibold flex items-center gap-1.5 transition border border-[#28334D] cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#9AA6BD]" />
            <span>{copied ? 'Link Copied!' : 'Share Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Summary Sheet Preview */}
      <div className="p-5 rounded-lg bg-[#0B1020] border border-[#28334D] space-y-4 text-[#F3F5FA]">
        
        {/* Report Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#28334D]">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#55BDEB]">
              Athletesis Pro Telemetry Report
            </div>
            <h2 className="text-base font-bold text-[#F3F5FA] mt-0.5">{athleteName} • Match Performance Assessment</h2>
            <div className="text-xs text-[#9AA6BD] mt-0.5">
              Sport: <span className="text-[#F3F5FA] font-medium capitalize">{sport}</span> • Match ID: #{matchId} • Date: {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="p-2 bg-[#151C35] rounded-lg border border-[#28334D] text-center shrink-0">
            <QrCode className="w-7 h-7 text-[#55BDEB] mx-auto" />
            <span className="text-[9px] font-mono text-[#9AA6BD] block mt-1">MOBILE VERIFY</span>
          </div>
        </div>

        {/* Telemetry Summary Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-[#151C35] border border-[#28334D]">
            <div className="text-[10px] font-mono uppercase text-[#9AA6BD]">Top Sprint Velocity</div>
            <div className="text-lg font-bold text-[#F3F5FA] font-mono mt-1 tabular-nums">{metrics.topSpeed}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Top 5% League Tier</div>
          </div>

          <div className="p-3 rounded-lg bg-[#151C35] border border-[#28334D]">
            <div className="text-[10px] font-mono uppercase text-[#9AA6BD]">Total Distance Covered</div>
            <div className="text-lg font-bold text-[#F3F5FA] font-mono mt-1 tabular-nums">{metrics.distance}</div>
            <div className="text-[10px] text-[#55BDEB] mt-0.5">High Workrate</div>
          </div>

          <div className="p-3 rounded-lg bg-[#151C35] border border-[#28334D]">
            <div className="text-[10px] font-mono uppercase text-[#9AA6BD]">Stamina Recovery Index</div>
            <div className="text-lg font-bold text-[#F3F5FA] font-mono mt-1 tabular-nums">{metrics.stamina}</div>
            <div className="text-[10px] text-[#E8B75A] mt-0.5">Moderate Fatigue</div>
          </div>

          <div className="p-3 rounded-lg bg-[#151C35] border border-[#28334D]">
            <div className="text-[10px] font-mono uppercase text-[#9AA6BD]">Tactical Strategy Score</div>
            <div className="text-lg font-bold text-[#F3F5FA] font-mono mt-1 tabular-nums">{metrics.tacticalScore}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Optimal Execution</div>
          </div>
        </div>

        {/* Executive Coaching Notes & Training Assignments */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-[#F3F5FA] uppercase tracking-wider">
            Coach's Tactical Directives & Assigned Drills
          </div>
          <div className="p-3.5 rounded-lg bg-[#151C35] border border-[#28334D] text-xs space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#F3F5FA]">Front-Foot Weight Transfer Drill:</span>
                <span className="text-[#9AA6BD] ml-1">4 Sets × 12 Reps (20 mins). Focus on stabilizing plant foot before strike.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#F3F5FA]">Deceleration Recovery Routine:</span>
                <span className="text-[#9AA6BD] ml-1">Copenhagen adductor holds to prevent hamstring overload detected at min 01:22.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Authentication */}
        <div className="pt-3 border-t border-[#28334D] flex items-center justify-between text-[10px] text-[#9AA6BD] font-mono">
          <span>CERTIFIED ATHLETISIS COMPUTER VISION ENGINE</span>
          <span>DOCUMENT REF: ATH-{matchId}-2026</span>
        </div>
      </div>
    </div>
  );
}
