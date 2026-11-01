'use client';

import React from 'react';
import { StandardizedEvent } from '@/types';
import { CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface EventTimelineProps {
  events?: StandardizedEvent[];
}

export function EventTimeline({ events = [] }: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl p-4 text-center text-[#9AA6BD] text-xs bg-[#151C35] border border-[#28334D]">
        No event timeline recorded yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 bg-[#151C35] border border-[#28334D]">
      <h3 className="text-xs font-bold text-[#F3F5FA] uppercase tracking-wider mb-3 flex items-center gap-2">
        <Zap className="w-4 h-4 text-[#55BDEB]" />
        <span>Standardized Match Event Timeline ({events.length} Events)</span>
      </h3>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {events.map((evt) => {
          const isError = evt.eventType.includes('ERROR') || evt.success === false;
          const isSuccess = evt.success === true;

          return (
            <div
              key={evt.id}
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                isError
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                  : isSuccess
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                  : 'bg-[#0B1020] border-[#28334D] text-[#F3F5FA]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isError ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[#55BDEB] shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-xs block">{evt.eventType}</span>
                  <span className="text-[10px] text-[#9AA6BD] font-mono">
                    Duration: {evt.durationSeconds}s • Confidence: {(evt.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#0B1020] border border-[#28334D]">
                {evt.formattedTimestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
