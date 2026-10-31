'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Menu,
  CheckCircle2,
  Zap,
  Activity,
  LogOut,
  ChevronDown,
  User,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useSportStore, SportType } from '@/lib/sportStore';

interface DashboardHeaderProps {
  onOpenMobileMenu?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({
  onOpenMobileMenu,
  searchQuery = '',
  onSearchChange,
  title = 'Dashboard',
  subtitle,
}: DashboardHeaderProps) {
  const { user, logout } = useAuthStore();
  const { activeSport, setSport } = useSportStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sports: { type: SportType; label: string; icon: string }[] = [
    { type: 'Football', label: 'Football', icon: '⚽' },
    { type: 'Cricket', label: 'Cricket', icon: '🏏' },
    { type: 'Volleyball', label: 'Volleyball', icon: '🏐' },
  ];

  const notifications = [
    {
      id: 1,
      title: 'Pose Calibration Completed',
      desc: '17 keypoint anatomical tracking calibrated for Match #101',
      time: '12m ago',
      icon: Activity,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      id: 2,
      title: 'Peak Sprint Speed Flagged',
      desc: 'Burst speed 29.4 km/h recorded in 2nd half transition',
      time: '1h ago',
      icon: Zap,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 3,
      title: 'Biomechanical Safety Clear',
      desc: 'Knee strain & landing load within low injury risk tier',
      time: '3h ago',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
  ];

  const derivedSubtitle =
    subtitle ||
    `Welcome back, ${user?.fullName || 'Athlete'}. Real-time biomechanics & tactical performance overview.`;

  return (
    <header className="sticky top-0 z-30 bg-[#070B1E]/80 backdrop-blur-md border-b border-indigo-950/60 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        
        {/* Left: Mobile Toggle + Title & Subtitle */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-[#0D1535] border border-indigo-900/40 text-slate-300 hover:text-white transition"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                {title}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/25">
                {activeSport}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium line-clamp-1">
              {derivedSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Sport Engine Switcher + Search Bar + Notification + Profile Avatar */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          
          {/* Sport Engine Pills */}
          <div className="flex items-center bg-[#0C132E] p-1 rounded-xl border border-indigo-950/80 text-xs shadow-inner">
            {sports.map((s) => (
              <button
                key={s.type}
                onClick={() => setSport(s.type)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSport === s.type
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Search Bar with Shortcut Badge */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search matches, players, metrics..."
              className="w-full sm:w-56 md:w-64 bg-[#0B112C] border border-indigo-900/40 text-xs text-slate-200 placeholder-slate-400 rounded-xl pl-9 pr-10 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition shadow-inner"
            />
            <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#141E47] text-slate-400 border border-indigo-800/40 pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {/* Notification Bell Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-2.5 rounded-xl bg-[#0C132E] border border-indigo-900/40 text-slate-300 hover:text-white hover:border-indigo-500/50 transition relative shadow-sm"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2 ring-2 ring-[#0C132E] animate-pulse" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0D1535] border border-indigo-500/30 p-3.5 shadow-2xl z-50 animate-in fade-in space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-indigo-900/40">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">3 New</span>
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-[#121B42]/60 hover:bg-[#121B42] transition border border-indigo-900/30 text-xs space-y-0.5 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-md border ${n.color}`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className="font-bold text-slate-200 text-xs">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono ml-auto">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight pl-6">{n.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-[#0C132E] border border-indigo-900/40 hover:border-indigo-500/50 transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-[1px] shadow-sm">
                <div className="w-full h-full bg-[#080E24] rounded-[7px] flex items-center justify-center text-xs font-black text-cyan-300">
                  {user?.fullName
                    ? user.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'RT'}
                </div>
              </div>

              <div className="hidden md:flex flex-col text-left pr-1">
                <span className="text-xs font-bold text-white tracking-tight leading-none">
                  {user?.fullName || 'Rishi Tiwari'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {user?.role === 'COACH' ? 'Tactical Coach' : 'Pro Athlete'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0D1535] border border-indigo-500/30 p-2 shadow-2xl z-50 animate-in fade-in space-y-1 text-xs">
                <div className="p-2 border-b border-indigo-900/40">
                  <div className="font-bold text-white">{user?.fullName || 'Rishi Tiwari'}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email || 'rishi.tiwari@athletisis.ai'}</div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile Settings</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
