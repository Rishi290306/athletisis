'use client';

import React, { useState } from 'react';
import { Bookmark, Plus, Tag, Play, Trash2, Check } from 'lucide-react';

interface ClipTag {
  id: string;
  timestamp: number;
  timeFormatted: string;
  label: string;
  category: 'highlight' | 'mistake' | 'tactical' | 'custom';
}

interface ClipTaggerProps {
  activeTimestamp?: number;
  onSeekTimestamp?: (seconds: number) => void;
}

export function ClipTagger({ activeTimestamp = 0, onSeekTimestamp }: ClipTaggerProps) {
  const [tags, setTags] = useState<ClipTag[]>([
    { id: '1', timestamp: 14, timeFormatted: '00:14', label: 'Key Passing Combination', category: 'highlight' },
    { id: '2', timestamp: 42, timeFormatted: '00:42', label: 'Late Defensive Recovery Stance', category: 'mistake' },
    { id: '3', timestamp: 85, timeFormatted: '01:25', label: 'Max Velocity Sprint Spike', category: 'highlight' },
  ]);

  const [inputLabel, setInputLabel] = useState('');
  const [inputCategory, setInputCategory] = useState<ClipTag['category']>('highlight');

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputLabel.trim()) return;

    const newTag: ClipTag = {
      id: Date.now().toString(),
      timestamp: Math.round(activeTimestamp),
      timeFormatted: formatTime(activeTimestamp),
      label: inputLabel.trim(),
      category: inputCategory,
    };

    setTags([...tags, newTag]);
    setInputLabel('');
  };

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  const getCategoryBadge = (cat: ClipTag['category']) => {
    switch (cat) {
      case 'highlight': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'mistake': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'tactical': return 'bg-brand-500/10 text-brand-400 border-brand-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="pro-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Custom Video Clip Tagging & Bookmarks
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Time: <span className="text-brand-400 font-semibold">{formatTime(activeTimestamp)}</span>
        </span>
      </div>

      {/* Add New Tag Form */}
      <form onSubmit={handleAddTag} className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={inputLabel}
          onChange={(e) => setInputLabel(e.target.value)}
          placeholder={`Add tag at ${formatTime(activeTimestamp)} (e.g. Key Shot, Defensive Error)...`}
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
        />

        <select
          value={inputCategory}
          onChange={(e) => setInputCategory(e.target.value as ClipTag['category'])}
          className="px-3 py-2 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-brand-500 transition"
        >
          <option value="highlight">Highlight</option>
          <option value="mistake">Technical Mistake</option>
          <option value="tactical">Tactical Note</option>
          <option value="custom">Custom Tag</option>
        </select>

        <button
          type="submit"
          className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Tag Clip
        </button>
      </form>

      {/* Tagged Clips List */}
      <div className="space-y-2">
        {tags.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No clips bookmarked yet. Add tags during playback.
          </div>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="p-2.5 rounded-lg bg-[#090D16] border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSeekTimestamp && onSeekTimestamp(tag.timestamp)}
                  className="px-2.5 py-1 rounded bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 text-brand-400 font-mono font-medium text-xs flex items-center gap-1.5 transition"
                >
                  <Play className="w-3 h-3 fill-brand-400" />
                  {tag.timeFormatted}
                </button>
                <div>
                  <div className="text-xs font-semibold text-white">{tag.label}</div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border ${getCategoryBadge(tag.category)}`}>
                    {tag.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
