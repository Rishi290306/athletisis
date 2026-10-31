'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Users,
  BarChart3,
  Film,
  Settings,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  X,
  CheckCircle2,
  Shield,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const mainNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/matches', label: 'Match Analysis', icon: Video },
    { href: '/team', label: 'Player Analytics', icon: Users },
    { href: '/performance', label: 'Performance Reports', icon: BarChart3 },
    { href: '/matches', label: 'Video Library', icon: Film },
  ];

  const secondaryNavItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/coach', label: 'Help & Support', icon: HelpCircle },
  ];

  const navContent = (
    <div className="flex flex-col h-full bg-[#080D21] border-r border-indigo-950/60 text-slate-300 select-none">
      
      {/* 1. Athletesis Logo Header */}
      <div className="p-5 pb-4 flex items-center justify-between border-b border-indigo-950/40">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <div className="w-full h-full bg-[#070C1E] rounded-[11px] flex items-center justify-center font-black text-white text-base tracking-tighter">
              <span className="bg-gradient-to-br from-white via-sky-200 to-blue-400 bg-clip-text text-transparent">
                A
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-wider text-white">
                ATHLETESIS
              </span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 tracking-widest">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight">
              Sports Analytics Platform
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

      {/* 2. Navigation Menu */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Menu
          </span>
          <div className="pt-1.5 space-y-1">
            {mainNavItems.map((item) => {
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/25 via-indigo-600/15 to-transparent text-white border-l-2 border-blue-500 shadow-sm shadow-blue-500/10 font-bold'
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

        <div className="space-y-1 pt-2 border-t border-indigo-950/40">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            System & Support
          </span>
          <div className="pt-1.5 space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/25 via-indigo-600/15 to-transparent text-white border-l-2 border-blue-500'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Pro Plan Card with Subtle Blue Wave Background Decoration */}
      <div className="p-3.5 pt-0">
        <div className="relative rounded-2xl p-4 overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-[#121B42] via-[#0D1535] to-[#080D21] shadow-xl shadow-black/40">
          
          {/* Subtle Blue Wave SVG Background */}
          <svg
            className="absolute -right-4 -bottom-4 w-36 h-28 opacity-30 pointer-events-none"
            viewBox="0 0 160 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 70 C40 40, 80 100, 160 55 L160 110 L0 110 Z"
              fill="url(#waveGrad1)"
            />
            <path
              d="M0 88 C45 60, 95 105, 160 75 L160 110 L0 110 Z"
              fill="url(#waveGrad2)"
            />
            <defs>
              <linearGradient id="waveGrad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818CF8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                PRO PLAN
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Pro Analytics Suite</h4>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                Unlock 17-point pose kinematics, radar HUD & exportable reports.
              </p>
            </div>

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <span>Upgrade</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
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
