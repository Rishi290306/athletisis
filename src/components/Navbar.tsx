'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Upload, Video, User, Bot, Dumbbell, Users, ShieldAlert, Zap, ChevronDown, BarChart2, Brain, Sparkles, LogOut, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { SportSelector } from './SportSelector';
import { resetAllApplicationData } from '@/lib/resetStore';

export function Navbar() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname);
  const [openDropdown, setOpenDropdown] = useState<'analytics' | 'ai' | null>(null);
  const { token, user, logout } = useAuthStore();

  useEffect(() => {
    setActivePath(pathname);
    setOpenDropdown(null);
  }, [pathname]);

  const analyticsLinks = [
    { href: '/matches', label: 'Analyzed Matches', desc: 'Spatial heatmaps & clip breakdowns', icon: Video },
    { href: '/performance', label: 'Rating History', desc: 'Longitudinal multi-match trends', icon: User },
    { href: '/team', label: 'Team Analytics', desc: 'Passing networks & player nodes', icon: Users },
    { href: '/opponent', label: 'Opponent Strategy', desc: 'Pre-match AI game plan generator', icon: ShieldAlert },
  ];

  const aiLinks = [
    { href: '/coach', label: 'AI Coach', desc: 'Interactive tactical Q&A assistant', icon: Bot },
    { href: '/training', label: 'Personalized Drills', desc: 'Targeted drills & progress tracking', icon: Dumbbell },
  ];

  const isAnalyticsActive = analyticsLinks.some(l => activePath === l.href || activePath?.startsWith(l.href));
  const isAIActive = aiLinks.some(l => activePath === l.href || activePath?.startsWith(l.href));

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 py-3 px-4 sm:px-6 will-change-transform transform-gpu">
      <div className="max-w-7xl mx-auto rounded-2xl bg-dark-900/85 backdrop-blur-2xl border border-slate-800/90 shadow-[0_10px_35px_rgba(0,0,0,0.5)] px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Sport Selector */}
          <div className="flex items-center gap-4">
            <Link href="/" prefetch={true} onClick={() => setActivePath('/')} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-amber-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_25px_rgba(255,199,0,0.45)] group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] transition-all duration-300 relative overflow-hidden">
                <span className="relative z-10">A</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-gradient-neon">
                  ATHLETISIS
                </span>
                <span className="block text-[9px] uppercase font-extrabold tracking-widest text-brand-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <Zap className="w-2.5 h-2.5 fill-brand-400" /> AI Sports Analytics
                </span>
              </div>
            </Link>

            {/* Sport Engine Switcher - Shown when logged in */}
            {token && (
              <div className="hidden md:block border-l border-slate-800/80 pl-4">
                <SportSelector />
              </div>
            )}
          </div>

          {/* Integrated Navigation Hub - Shown only when logged in */}
          {token ? (
            <nav className="hidden lg:flex items-center space-x-2">
              {/* 1. Dashboard */}
              <Link
                href="/dashboard"
                prefetch={true}
                onClick={() => {
                  setActivePath('/dashboard');
                  setOpenDropdown(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-150 relative ${
                  activePath === '/dashboard'
                    ? 'bg-brand-500/20 text-white border border-brand-500/50 shadow-[0_0_15px_rgba(255,199,0,0.3)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${activePath === '/dashboard' ? 'text-brand-400' : 'text-slate-400'}`} />
                Dashboard
              </Link>

              {/* 2. Analytics Hub Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setOpenDropdown('analytics')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'analytics' ? null : 'analytics')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-150 ${
                    isAnalyticsActive
                      ? 'bg-cyan-500/20 text-white border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart2 className={`w-3.5 h-3.5 ${isAnalyticsActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  Analytics & Reports
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'analytics' ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
                </button>

                {openDropdown === 'analytics' && (
                  <div className="absolute top-full left-0 pt-2 w-64 z-50">
                    <div className="rounded-2xl bg-dark-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      {analyticsLinks.map((item) => {
                        const Icon = item.icon;
                        const isSubActive = activePath === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            prefetch={true}
                            onClick={() => {
                              setActivePath(item.href);
                              setOpenDropdown(null);
                            }}
                            className={`p-2.5 rounded-xl block transition duration-200 ${
                              isSubActive ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-dark-950 border border-slate-800 text-cyan-400">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-xs font-extrabold text-white">{item.label}</div>
                                <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. AI & Coaching Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setOpenDropdown('ai')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'ai' ? null : 'ai')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-150 ${
                    isAIActive
                      ? 'bg-purple-500/20 text-white border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Brain className={`w-3.5 h-3.5 ${isAIActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  AI & Coaching
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'ai' ? 'rotate-180 text-purple-400' : 'text-slate-500'}`} />
                </button>

                {openDropdown === 'ai' && (
                  <div className="absolute top-full left-0 pt-2 w-60 z-50">
                    <div className="rounded-2xl bg-dark-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                      {aiLinks.map((item) => {
                        const Icon = item.icon;
                        const isSubActive = activePath === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            prefetch={true}
                            onClick={() => {
                              setActivePath(item.href);
                              setOpenDropdown(null);
                            }}
                            className={`p-2.5 rounded-xl block transition duration-200 ${
                              isSubActive ? 'bg-purple-500/15 border border-purple-500/30' : 'hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-dark-950 border border-slate-800 text-purple-400">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-xs font-extrabold text-white">{item.label}</div>
                                <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Upload CTA Button */}
              <Link
                href="/upload"
                prefetch={true}
                onClick={() => {
                  setActivePath('/upload');
                  setOpenDropdown(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 hover:from-brand-400 hover:to-cyan-300 text-slate-950 flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,199,0,0.35)] transition duration-200 hover:scale-105 ml-1"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Match
              </Link>
            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-2 text-xs font-extrabold text-slate-400">
              <span>Sign in at start to access sports analytics & performance dashboards</span>
            </div>
          )}

          {/* User Auth & Sign Out Controls */}
          <div className="flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-200 hidden sm:inline-block bg-dark-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  {user?.fullName || 'Athlete User'}
                </span>
                <button
                  onClick={logout}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 text-slate-300 border border-slate-700 transition duration-200 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Delete all stored match data, cached videos, and make website raw?')) {
                      await resetAllApplicationData();
                    }
                  }}
                  title="Delete All Data & Make Website Raw"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition duration-200 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">Make Website Raw</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  prefetch={true}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  prefetch={true}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 hover:from-brand-400 hover:to-cyan-300 text-slate-950 shadow-[0_0_25px_rgba(255,199,0,0.4)] transition-all duration-200 hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
