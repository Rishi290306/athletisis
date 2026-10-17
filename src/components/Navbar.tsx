'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Upload, Video, User, Bot, Dumbbell, Users, ShieldAlert, ChevronDown, BarChart2, Brain, LogOut, Trash2 } from 'lucide-react';
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
    <header className="sticky top-0 z-50 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto rounded-xl bg-[#152037]/95 backdrop-blur-md border border-slate-700/80 shadow-xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Sport Engine Switcher */}
          <div className="flex items-center gap-4">
            <Link href="/" prefetch={true} onClick={() => setActivePath('/')} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-sky-600 text-white font-bold text-lg flex items-center justify-center shadow-md group-hover:bg-sky-500 transition-colors">
                A
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                  ATHLETISIS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PRO SPORTS ANALYTICS
                </span>
              </div>
            </Link>

            {token && (
              <div className="hidden md:block border-l border-slate-700/80 pl-4">
                <SportSelector />
              </div>
            )}
          </div>

          {/* Integrated Navigation Hub */}
          {token ? (
            <nav className="hidden lg:flex items-center space-x-1.5">
              {/* Dashboard */}
              <Link
                href="/dashboard"
                prefetch={true}
                onClick={() => {
                  setActivePath('/dashboard');
                  setOpenDropdown(null);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  activePath === '/dashboard'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Dashboard
              </Link>

              {/* Analytics Hub Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setOpenDropdown('analytics')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'analytics' ? null : 'analytics')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                    isAnalyticsActive
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  Analytics & Reports
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'analytics' ? 'rotate-180 text-white' : 'text-slate-400'}`} />
                </button>

                {openDropdown === 'analytics' && (
                  <div className="absolute top-full left-0 pt-2 w-64 z-50">
                    <div className="rounded-xl bg-[#152037] border border-slate-700 shadow-2xl p-2 space-y-1">
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
                            className={`p-2.5 rounded-lg block transition ${
                              isSubActive ? 'bg-sky-600/20 border border-sky-500/40' : 'hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-md bg-[#0b1329] border border-slate-700 text-sky-400">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">{item.label}</div>
                                <div className="text-[10px] text-slate-300 leading-tight">{item.desc}</div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* AI & Coaching Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setOpenDropdown('ai')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'ai' ? null : 'ai')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                    isAIActive
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  AI & Coaching
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'ai' ? 'rotate-180 text-white' : 'text-slate-400'}`} />
                </button>

                {openDropdown === 'ai' && (
                  <div className="absolute top-full left-0 pt-2 w-60 z-50">
                    <div className="rounded-xl bg-[#152037] border border-slate-700 shadow-2xl p-2 space-y-1">
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
                            className={`p-2.5 rounded-lg block transition ${
                              isSubActive ? 'bg-sky-600/20 border border-sky-500/40' : 'hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-md bg-[#0b1329] border border-slate-700 text-sky-400">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">{item.label}</div>
                                <div className="text-[10px] text-slate-300 leading-tight">{item.desc}</div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Upload CTA Button */}
              <Link
                href="/upload"
                prefetch={true}
                onClick={() => {
                  setActivePath('/upload');
                  setOpenDropdown(null);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5 transition ml-1 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Match
              </Link>
            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-300">
              <span>Pro sports analytics workstation for coaches & competitive athletes</span>
            </div>
          )}

          {/* User Auth & Sign Out Controls */}
          <div className="flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200 hidden sm:inline-block bg-[#0b1329] px-3 py-1.5 rounded-lg border border-slate-700">
                  {user?.fullName || 'Athlete User'}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-red-600/20 hover:text-red-300 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Delete all stored match data, cached videos, and reset local store?')) {
                      await resetAllApplicationData();
                    }
                  }}
                  title="Reset Data"
                  className="p-1.5 rounded-lg text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  prefetch={true}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  prefetch={true}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition"
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
