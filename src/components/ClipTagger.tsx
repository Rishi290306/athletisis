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
      case 'mistake': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'tactical': return 'bg-[#6675E8]/10 text-[#6675E8] border-[#6675E8]/20';
      default: return 'bg-[#0B1020] text-[#9AA6BD] border-[#28334D]';
    }
  };

  return (
    <div className="rounded-xl p-4 bg-[#151C35] border border-[#28334D] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#28334D]">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#6675E8]" />
          <h3 className="text-xs font-semibold text-[#F3F5FA] uppercase tracking-wider">
            Custom Video Clip Tagging & Bookmarks
          </h3>
        </div>
        <span className="text-xs font-mono text-[#9AA6BD]">
          Time: <span className="text-[#55BDEB] font-semibold">{formatTime(activeTimestamp)}</span>
        </span>
      </div>

      {/* Add New Tag Form */}
      <form onSubmit={handleAddTag} className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={inputLabel}
          onChange={(e) => setInputLabel(e.target.value)}
          placeholder={`Add tag at ${formatTime(activeTimestamp)} (e.g. Key Shot, Defensive Error)...`}
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-xs text-[#F3F5FA] placeholder-[#9AA6BD] focus:outline-none focus:border-[#6675E8] transition"
        />

        <select
          value={inputCategory}
          onChange={(e) => setInputCategory(e.target.value as ClipTag['category'])}
          className="px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-xs text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] transition font-medium"
        >
          <option value="highlight">Highlight</option>
          <option value="mistake">Technical Flaw</option>
          <option value="tactical">Tactical Movement</option>
          <option value="custom">Custom Tag</option>
        </select>

        <button
          type="submit"
          className="px-3.5 py-2 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Tag Timestamp
        </button>
      </form>

      {/* Tagged Clips List */}
      <div className="space-y-2">
        {tags.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#9AA6BD]">
            No clips bookmarked yet. Add tags during playback.
          </div>
        ) : (
          tags.map((tag) => (
            <div
              key={tag.id}
              className="p-2.5 rounded-lg bg-[#0B1020] border border-[#28334D] flex items-center justify-between gap-3 hover:border-[#3D4D73] transition"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onSeekTimestamp && onSeekTimestamp(tag.timestamp)}
                  className="px-2.5 py-1 rounded bg-[#151C35] hover:bg-[#1A2342] border border-[#28334D] text-[#55BDEB] font-mono font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-[#55BDEB]" />
                  {tag.timeFormatted}
                </button>
                <div>
                  <div className="text-xs font-semibold text-[#F3F5FA]">{tag.label}</div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border ${getCategoryBadge(tag.category)}`}>
                    {tag.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="p-1.5 text-[#9AA6BD] hover:text-rose-400 rounded hover:bg-[#151C35] transition cursor-pointer"
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
