'use client';

import React from 'react';
import { StandardizedEvent } from '@/types';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface EventTimelineProps {
  events?: StandardizedEvent[];
}

export function EventTimeline({ events = [] }: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="bg-dark-900 border border-slate-800 rounded-xl p-4 text-center text-slate-400 text-xs">
        No event timeline recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-dark-900 border border-slate-800 rounded-xl p-4 shadow-lg">
      <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Zap className="w-4 h-4 text-brand-400" />
        Standardized Match Event Timeline ({events.length} Events)
      </h3>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {events.map((evt) => {
          const isError = evt.eventType.includes('ERROR') || evt.success === false;
          const isSuccess = evt.success === true;

          return (
            <div
              key={evt.id}
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                isError
                  ? 'bg-red-500/10 border-red-500/20 text-red-200'
                  : isSuccess
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                  : 'bg-dark-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isError ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                )}
                <div>
                  <span className="font-bold uppercase tracking-wide mr-2 text-white">{evt.eventType}</span>
                  <span className="text-[11px] text-slate-400">Confidence: {(evt.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-black/40 border border-slate-800">
                {evt.formattedTimestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
