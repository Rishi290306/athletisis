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
  Settings,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useSportStore } from '@/lib/sportStore';

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
  const { activeSport } = useSportStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Pose Calibration Completed',
      desc: '17 keypoint anatomical tracking calibrated for Match #101',
      time: '12m ago',
      icon: Activity,
      color: 'text-[#55BDEB] bg-[#55BDEB]/10 border-[#55BDEB]/30',
    },
    {
      id: 2,
      title: 'Peak Sprint Speed Flagged',
      desc: 'Burst speed 29.4 km/h recorded in 2nd half transition',
      time: '1h ago',
      icon: Zap,
      color: 'text-[#E8B75A] bg-[#E8B75A]/10 border-[#E8B75A]/30',
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
    <header className="sticky top-0 z-30 bg-[#0B1020]/90 backdrop-blur-md border-b border-[#28334D] px-4 sm:px-6 lg:px-8 h-14 flex items-center transition-all">
      <div className="flex items-center justify-between gap-4 w-full">
        
        {/* Left: Mobile Drawer Toggle + Page Title & Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-1.5 rounded-md bg-[#151C35] border border-[#28334D] text-[#9AA6BD] hover:text-[#F3F5FA] transition cursor-pointer"
              aria-label="Open Navigation Drawer"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#F3F5FA] truncate">
                {title}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-[#151C35] text-[#55BDEB] border border-[#28334D]">
                {activeSport}
              </span>
            </div>
            <p className="text-[11px] text-[#9AA6BD] font-normal truncate hidden sm:block">
              {derivedSubtitle}
            </p>
          </div>
        </div>

        {/* Right Context Controls: Search Bar + Notification Bell + Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Search Input with ⌘K Badge */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#9AA6BD] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search matches, players, telemetry..."
              className="w-44 sm:w-64 bg-[#151C35] border border-[#28334D] text-xs text-[#F3F5FA] placeholder-[#9AA6BD] rounded-lg pl-8 pr-9 py-1.5 focus:border-[#6675E8] focus:outline-none transition shadow-sm"
            />
            <kbd className="hidden sm:inline-block absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#0B1020] text-[#9AA6BD] border border-[#28334D] pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="p-1.5 rounded-lg bg-[#151C35] border border-[#28334D] text-[#9AA6BD] hover:text-[#F3F5FA] hover:border-[#3D4D73] transition relative cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8B75A] absolute top-1.5 right-1.5 ring-2 ring-[#151C35]" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#151C35] border border-[#28334D] p-3 shadow-2xl z-50 animate-in fade-in space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#28334D]">
                  <span className="text-xs font-semibold text-[#F3F5FA] uppercase tracking-wider">
                    Notifications
                  </span>
                  <span className="text-[10px] font-mono text-[#55BDEB] font-semibold">3 New</span>
                </div>

                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className="p-2 rounded-lg bg-[#0B1020] hover:bg-[#1A2342] transition border border-[#28334D] text-xs space-y-0.5 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded border ${n.color}`}>
                            <Icon className="w-3 h-3" />
                          </div>
                          <span className="font-semibold text-[#F3F5FA] text-xs truncate">{n.title}</span>
                          <span className="text-[10px] text-[#9AA6BD] font-mono ml-auto shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#9AA6BD] leading-tight pl-6">{n.desc}</p>
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
              className="flex items-center gap-2 p-1 rounded-lg bg-[#151C35] border border-[#28334D] hover:border-[#3D4D73] transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded bg-[#6675E8] flex items-center justify-center text-[10px] font-bold text-white">
                {user?.fullName
                  ? user.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'RT'}
              </div>

              <div className="hidden md:flex flex-col text-left pr-1">
                <span className="text-xs font-semibold text-[#F3F5FA] leading-tight">
                  {user?.fullName || 'Rishi Tiwari'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#9AA6BD] hidden md:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#151C35] border border-[#28334D] p-1.5 shadow-2xl z-50 animate-in fade-in space-y-1 text-xs">
                <div className="p-2 border-b border-[#28334D]">
                  <div className="font-semibold text-[#F3F5FA] truncate">{user?.fullName || 'Rishi Tiwari'}</div>
                  <div className="text-[10px] text-[#9AA6BD] truncate">{user?.email || 'rishi.tiwari@athletisis.ai'}</div>
                </div>

                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[#9AA6BD] hover:text-[#F3F5FA] hover:bg-[#1A2342] transition"
                >
                  <Settings className="w-3.5 h-3.5 text-[#9AA6BD]" />
                  <span>Profile Settings</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-rose-400 hover:bg-rose-500/10 transition text-left cursor-pointer"
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
