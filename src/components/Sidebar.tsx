'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Video,
  BarChart2,
  Users,
  Dumbbell,
  Bot,
  Upload,
  Settings,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  X,
  CheckCircle2,
  LogOut,
  Trash2,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useSportStore, SportType } from '@/lib/sportStore';
import { resetAllApplicationData } from '@/lib/resetStore';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { activeSport, setSport } = useSportStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Exact nav items matching the user's top bar screenshot:
  // Dashboard, Matches, Performance, Team, Drills, AI Coach
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/matches', label: 'Matches', icon: Video },
    { href: '/performance', label: 'Performance', icon: BarChart2 },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/training', label: 'Drills', icon: Dumbbell },
    { href: '/coach', label: 'AI Coach', icon: Bot },
  ];

  const sports: { type: SportType; label: string; icon: string }[] = [
    { type: 'Cricket', label: 'Cricket', icon: '🏏' },
    { type: 'Football', label: 'Football', icon: '⚽' },
    { type: 'Volleyball', label: 'Volleyball', icon: '🏐' },
  ];

  const navContent = (
    <div className="flex flex-col h-full bg-[#080D21] border-r border-indigo-950/70 text-slate-300 select-none">
      
      {/* 1. Athletesis Logo Header */}
      <div className="p-4 sm:p-5 pb-3 flex items-center justify-between border-b border-indigo-950/40">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <div className="w-full h-full bg-[#070C1E] rounded-[7px] flex items-center justify-center font-black text-white text-sm tracking-tighter">
              <span className="bg-gradient-to-br from-white via-sky-200 to-blue-400 bg-clip-text text-transparent">
                A
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black tracking-wider text-white">
              ATHLETESIS
            </span>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 tracking-widest font-mono">
              PRO
            </span>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation Body */}
      <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
        
        {/* 2. Sport Engine Switcher Pills (from top bar) */}
        <div className="space-y-1">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Sport Discipline
          </span>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0C132E] border border-indigo-950/80 shadow-inner">
            {sports.map((s) => {
              const isSelected = activeSport === s.type;
              return (
                <button
                  key={s.type}
                  onClick={() => setSport(s.type)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                  title={`Switch to ${s.label}`}
                >
                  <span className="text-xs">{s.icon}</span>
                  <span className="text-[10px] truncate max-w-full">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Primary CTA: Upload Match Button (from top bar) */}
        <div>
          <Link
            href="/upload"
            onClick={onClose}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition active:scale-95 group"
          >
            <Upload className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Upload Match</span>
          </Link>
        </div>

        {/* 4. Main Navigation Menu (Dashboard, Matches, Performance, Team, Drills, AI Coach) */}
        <div className="space-y-1">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Workstation
          </span>
          <div className="pt-1 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/matches');

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/25 via-indigo-600/15 to-transparent text-white border-l-2 border-blue-500 font-bold shadow-sm shadow-blue-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Secondary: Settings & Help */}
        <div className="space-y-1 pt-1.5 border-t border-indigo-950/40">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Preferences
          </span>
          <div className="pt-0.5 space-y-0.5">
            <Link
              href="/settings"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/settings'
                  ? 'bg-gradient-to-r from-blue-600/25 via-indigo-600/15 to-transparent text-white border-l-2 border-blue-500'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

      </div>

      {/* 5. Pro Plan Card with Subtle Blue Wave Background Decoration */}
      <div className="p-3 pt-0">
        <div className="relative rounded-2xl p-3.5 overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-[#121B42] via-[#0D1535] to-[#080D21] shadow-xl shadow-black/40">
          
          {/* Subtle Blue Wave SVG Background */}
          <svg
            className="absolute -right-4 -bottom-4 w-36 h-28 opacity-25 pointer-events-none"
            viewBox="0 0 160 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 70 C40 40, 80 100, 160 55 L160 110 L0 110 Z"
              fill="url(#sidebarWave1)"
            />
            <path
              d="M0 88 C45 60, 95 105, 160 75 L160 110 L0 110 Z"
              fill="url(#sidebarWave2)"
            />
            <defs>
              <linearGradient id="sidebarWave1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="sidebarWave2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-sm">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.2 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                PRO PLAN
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Pro Analytics Suite</h4>
              <p className="text-[10px] text-slate-300 leading-snug">
                17-point pose kinematics & exportable reports.
              </p>
            </div>

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full mt-1.5 py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <span>Upgrade</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. User Profile, Sign Out & Reset Data Footer (from top bar screenshot) */}
      <div className="p-3 border-t border-indigo-950/60 bg-[#070C1E]">
        <div className="flex items-center justify-between gap-2">
          
          {/* User Avatar & Name */}
          <Link
            href="/settings"
            onClick={onClose}
            className="flex items-center gap-2 min-w-0 flex-1 p-1 rounded-lg hover:bg-white/[0.04] transition group"
            title="Profile & Settings"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
              {user?.fullName
                ? user.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'RT'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                {user?.fullName || 'Rishi Tiwari'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {user?.role === 'COACH' ? 'Coach' : 'Athlete'}
              </div>
            </div>
          </Link>

          {/* Action Icons: Sign Out & Reset Data */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={async () => {
                if (confirm('Reset application state and reload default demo data?')) {
                  await resetAllApplicationData();
                  window.location.reload();
                }
              }}
              title="Reset Data"
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              aria-label="Reset Data"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Upgrade Pro Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0C132E] border border-indigo-500/30 p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Athletesis Pro Workstation</h3>
                <p className="text-xs text-slate-400">Enterprise AI computer vision & biomechanics</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#121B42]/70 border border-indigo-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited 17-point MediaPipe pose video telemetry</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#121B42]/70 border border-indigo-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>2D tactical pitch maps & spatial touch heatmaps</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#121B42]/70 border border-indigo-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Biomechanical joint strain radar & injury prevention</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#121B42]/70 border border-indigo-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-angle clip bookmarking & PDF report exporter</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Current Tier</div>
                <div className="text-sm font-bold text-amber-300">Pro Elite Active</div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 font-extrabold text-xs text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 transition active:scale-95"
              >
                Close Workstation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 shadow-2xl animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
