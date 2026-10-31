'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Upload,
  Video,
  User,
  Bot,
  Dumbbell,
  Users,
  ShieldAlert,
  ChevronDown,
  BarChart2,
  Brain,
  LogOut,
  Trash2,
  Menu,
  X,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { SportSelector } from './SportSelector';
import { resetAllApplicationData } from '@/lib/resetStore';

export function Navbar() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState(pathname);
  const [openDropdown, setOpenDropdown] = useState<'analytics' | 'ai' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, user, logout } = useAuthStore();

  useEffect(() => {
    setActivePath(pathname);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/matches', label: 'Matches', icon: Video },
    { href: '/performance', label: 'Performance', icon: BarChart2 },
    { href: '/team', label: 'Team', icon: Users },
    { href: '/training', label: 'Drills', icon: Dumbbell },
    { href: '/coach', label: 'AI Coach', icon: Bot },
  ];

  const secondaryLinks = [
    { href: '/opponent', label: 'Opponent Prep', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Brand Logo & Sport Switcher */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link
              href="/"
              prefetch={true}
              onClick={() => setActivePath('/')}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-600 text-white font-bold text-sm flex items-center justify-center shadow-sm group-hover:bg-sky-500 transition-colors">
                A
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold tracking-tight text-white block">
                  ATHLETESIS
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono text-sky-400 font-semibold px-1.5 py-0.2 rounded bg-sky-500/10 border border-sky-500/20">
                  PRO
                </span>
              </div>
            </Link>

            <div className="border-l border-slate-800 pl-3">
              <SportSelector />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.href || (item.href !== '/dashboard' && activePath?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-sky-600/15 text-sky-300 font-semibold border border-sky-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Upload CTA Button */}
            <Link
              href="/upload"
              prefetch={true}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5 transition shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Match</span>
            </Link>

            {/* Auth / Account Controls */}
            {token ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-300 hidden xl:inline-block bg-[#0E1424] px-2.5 py-1 rounded-md border border-slate-800">
                  {user?.fullName || 'Athlete'}
                </span>
                <button
                  onClick={logout}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#0E1424] hover:bg-rose-500/15 hover:text-rose-300 text-slate-400 hover:border-rose-500/30 border border-slate-800 transition flex items-center gap-1.5"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Reset application state and reload default demo data?')) {
                      await resetAllApplicationData();
                    }
                  }}
                  title="Reset Data"
                  className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1 rounded-md text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                >
                  Log In
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Responsive Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800/80 space-y-1">
            <div className="grid grid-cols-2 gap-1.5">
              {navLinks.concat(secondaryLinks).map((item) => {
                const Icon = item.icon;
                const isActive = activePath === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition ${
                      isActive
                        ? 'bg-sky-600/20 text-sky-300 font-semibold border border-sky-500/30'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-sky-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
