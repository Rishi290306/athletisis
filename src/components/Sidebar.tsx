'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  BarChart2,
  Users,
  Dumbbell,
  Bot,
  Upload,
  Settings,
  Sparkles,
  ArrowUpRight,
  X,
  CheckCircle2,
  LogOut,
  Trash2,
  Film,
  HelpCircle,
  Keyboard,
  FileQuestion,
  ExternalLink,
  VolumeX,
  Eye,
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
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Core navigation items corresponding to the user's top bar and requested architecture
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/matches', label: 'Match Analysis', icon: Video },
    { href: '/team', label: 'Player Analytics', icon: Users },
    { href: '/performance', label: 'Performance Reports', icon: BarChart2 },
    { href: '/matches', label: 'Video Library', icon: Film },
    { href: '/training', label: 'Drills & Training', icon: Dumbbell },
    { href: '/coach', label: 'AI Coach & Tactics', icon: Bot },
  ];

  const sports: { type: SportType; label: string; icon: string }[] = [
    { type: 'Cricket', label: 'Cricket', icon: '🏏' },
    { type: 'Football', label: 'Football', icon: '⚽' },
    { type: 'Volleyball', label: 'Volleyball', icon: '🏐' },
  ];

  const navContent = (
    <div className="flex flex-col h-full bg-[#0B1020] border-r border-[#28334D] text-[#9AA6BD] select-none">
      
      {/* 1. Athletesis Logo Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#28334D] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md bg-[#6675E8] flex items-center justify-center font-bold text-white text-xs tracking-tight shadow-sm shadow-[#6675E8]/20 group-hover:bg-[#5463D6] transition-colors">
            A
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tracking-wider text-[#F3F5FA]">
              ATHLETESIS
            </span>
            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#E8B75A]/10 text-[#E8B75A] border border-[#E8B75A]/30">
              PRO
            </span>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-[#9AA6BD] hover:text-[#F3F5FA] hover:bg-[#151C35] transition"
            aria-label="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scrollable Navigation Body */}
      <div className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        
        {/* 2. Sport Discipline Switcher (Cricket / Football / Volleyball from top bar) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9AA6BD]">
              Sport Discipline
            </span>
            <span className="text-[9px] font-mono text-[#55BDEB]">Active</span>
          </div>
          
          <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#151C35] border border-[#28334D]">
            {sports.map((s) => {
              const isSelected = activeSport === s.type;
              return (
                <button
                  key={s.type}
                  onClick={() => setSport(s.type)}
                  className={`py-1.5 px-1 rounded-md text-xs font-medium flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B1020] text-[#F3F5FA] border border-[#28334D] shadow-sm font-semibold'
                      : 'text-[#9AA6BD] hover:text-[#F3F5FA] hover:bg-[#1A2342]/60'
                  }`}
                  title={`Switch to ${s.label}`}
                >
                  <span className="text-xs leading-none">{s.icon}</span>
                  <span className="text-[10px] truncate max-w-full leading-tight">{s.label}</span>
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
            className="w-full py-2 px-3 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] text-[#F3F5FA] font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] group"
          >
            <Upload className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Upload Match</span>
          </Link>
        </div>

        {/* 4. Main Navigation Menu */}
        <div className="space-y-1">
          <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-[#9AA6BD]">
            Workstation
          </span>
          <nav className="pt-0.5 space-y-0.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/matches' && item.href !== '/dashboard');

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors ${
                    isActive
                      ? 'bg-[#151C35] text-[#F3F5FA] border-l-2 border-[#6675E8] font-semibold'
                      : 'text-[#9AA6BD] hover:text-[#F3F5FA] hover:bg-[#151C35]/60'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#6675E8]' : 'text-[#9AA6BD]'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6675E8]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Preferences & Support Section */}
        <div className="space-y-1 pt-2 border-t border-[#28334D]">
          <span className="px-1 text-[10px] font-semibold uppercase tracking-wider text-[#9AA6BD]">
            Preferences & Help
          </span>
          <div className="pt-0.5 space-y-0.5">
            <Link
              href="/settings"
              onClick={onClose}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs transition-colors ${
                pathname === '/settings'
                  ? 'bg-[#151C35] text-[#F3F5FA] border-l-2 border-[#6675E8] font-semibold'
                  : 'text-[#9AA6BD] hover:text-[#F3F5FA] hover:bg-[#151C35]/60'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0 text-[#9AA6BD]" />
              <span>Settings</span>
            </Link>

            <button
              onClick={() => {
                setShowHelpModal(true);
                onClose?.();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs text-[#9AA6BD] hover:text-[#F3F5FA] hover:bg-[#151C35]/60 transition-colors cursor-pointer text-left"
            >
              <HelpCircle className="w-4 h-4 shrink-0 text-[#9AA6BD]" />
              <span>Help & Support</span>
            </button>
          </div>
        </div>

      </div>

      {/* 5. Pro Plan Card with Subtle Wave Background Decoration */}
      <div className="p-3 pt-0 shrink-0">
        <div className="relative rounded-lg p-3 overflow-hidden border border-[#28334D] bg-[#151C35]">
          
          {/* Subtle Blue Wave SVG Background */}
          <svg
            className="absolute -right-3 -bottom-3 w-32 h-24 opacity-20 pointer-events-none"
            viewBox="0 0 160 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 70 C40 40, 80 100, 160 55 L160 110 L0 110 Z"
              fill="#55BDEB"
            />
            <path
              d="M0 88 C45 60, 95 105, 160 75 L160 110 L0 110 Z"
              fill="#6675E8"
            />
          </svg>

          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="w-5 h-5 rounded bg-[#E8B75A]/10 border border-[#E8B75A]/30 text-[#E8B75A] flex items-center justify-center">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E8B75A]/15 text-[#E8B75A] border border-[#E8B75A]/30 font-mono">
                PRO PLAN
              </span>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#F3F5FA]">Pro Analytics Suite</h4>
              <p className="text-[10px] text-[#9AA6BD] leading-tight mt-0.5">
                17-point pose kinematics & biomechanics reports.
              </p>
            </div>

            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full mt-1 py-1.5 px-2.5 rounded-md bg-[#E8B75A] hover:bg-[#DBA644] text-[#0B1020] text-xs font-bold flex items-center justify-center gap-1 transition active:scale-[0.99] cursor-pointer"
            >
              <span>Upgrade</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. User Profile, Sign Out & Reset Data Footer (from top bar screenshot) */}
      <div className="h-14 px-3 border-t border-[#28334D] bg-[#0B1020] flex items-center justify-between shrink-0">
        {/* User Info Link */}
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-2 min-w-0 flex-1 p-1 rounded-md hover:bg-[#151C35] transition group"
          title="Account Settings"
        >
          <div className="w-7 h-7 rounded-md bg-[#151C35] border border-[#28334D] text-[#F3F5FA] font-bold text-xs flex items-center justify-center shrink-0">
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
            <div className="text-xs font-semibold text-[#F3F5FA] truncate group-hover:text-[#55BDEB] transition-colors leading-tight">
              {user?.fullName || 'Rishi Tiwari'}
            </div>
            <div className="text-[10px] text-[#9AA6BD] truncate leading-tight">
              {user?.role === 'COACH' ? 'Tactical Coach' : 'Pro Athlete'}
            </div>
          </div>
        </Link>

        {/* Action Buttons: Sign Out & Reset Data */}
        <div className="flex items-center gap-0.5 shrink-0 pl-1">
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            title="Sign Out"
            className="p-1.5 rounded-md text-[#9AA6BD] hover:text-[#F3F5FA] hover:bg-[#151C35] transition cursor-pointer"
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
            className="p-1.5 rounded-md text-[#9AA6BD] hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            aria-label="Reset Data"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upgrade Pro Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-xl bg-[#151C35] border border-[#28334D] p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-1 rounded-md text-[#9AA6BD] hover:text-[#F3F5FA] hover:bg-[#1A2342] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E8B75A]/10 border border-[#E8B75A]/30 text-[#E8B75A] flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F3F5FA]">Athletesis Pro Workstation</h3>
                <p className="text-xs text-[#9AA6BD]">Computer vision & biomechanics analytics</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#9AA6BD]">
              <div className="flex items-center gap-2 p-2 rounded-md bg-[#0B1020] border border-[#28334D]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[#F3F5FA]">Unlimited 17-point MediaPipe pose video telemetry</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-[#0B1020] border border-[#28334D]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[#F3F5FA]">2D tactical pitch maps & spatial touch heatmaps</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-[#0B1020] border border-[#28334D]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[#F3F5FA]">Biomechanical joint strain radar & injury prevention</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-[#0B1020] border border-[#28334D]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[#F3F5FA]">Multi-angle clip bookmarking & PDF report exporter</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#28334D]">
              <div>
                <div className="text-[10px] text-[#9AA6BD] uppercase tracking-wider font-mono">Current Plan</div>
                <div className="text-xs font-bold text-[#E8B75A]">Pro Elite Active</div>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 rounded-md bg-[#E8B75A] hover:bg-[#DBA644] font-bold text-xs text-[#0B1020] shadow-sm transition active:scale-95 cursor-pointer"
              >
                Close Workstation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#151C35] border border-[#28334D] p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md text-[#9AA6BD] hover:text-[#F3F5FA] hover:bg-[#1A2342] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#6675E8]/10 border border-[#6675E8]/30 text-[#6675E8] flex items-center justify-center shadow-sm">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F3F5FA]">Athletesis Help & Pro Guide</h3>
                <p className="text-xs text-[#9AA6BD]">Documentation, hotkeys and computer vision telemetry</p>
              </div>
            </div>

            {/* Quick Actions & Features */}
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#0B1020] border border-[#28334D] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F3F5FA]">
                  <Eye className="w-3.5 h-3.5 text-[#55BDEB]" />
                  <span>17-Point Pose Skeleton & Telemetry</span>
                </div>
                <p className="text-[11px] text-[#9AA6BD] leading-relaxed">
                  During match playback, toggle the <strong>Pose Skeleton</strong> button on the video player to render calibrated 17-point joint keypoints and biomechanical angle metrics in real time.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#0B1020] border border-[#28334D] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F3F5FA]">
                  <VolumeX className="w-3.5 h-3.5 text-[#E8B75A]" />
                  <span>Audio Voice Cancellation / Volume Suppression</span>
                </div>
                <p className="text-[11px] text-[#9AA6BD] leading-relaxed">
                  Use the <strong>Cancel Voice</strong> or volume slider directly in the video player controls to suppress commentary and ambient noise so you can focus on pure movement kinematics.
                </p>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="p-3 rounded-lg bg-[#0B1020] border border-[#28334D] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F3F5FA]">
                  <Keyboard className="w-3.5 h-3.5 text-[#6675E8]" />
                  <span>Pro Keyboard Shortcuts</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded bg-[#151C35] border border-[#28334D]/60">
                    <span className="text-[#9AA6BD]">Global Search</span>
                    <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#0B1020] text-[#F3F5FA] border border-[#28334D]">⌘K</kbd>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-[#151C35] border border-[#28334D]/60">
                    <span className="text-[#9AA6BD]">Play / Pause</span>
                    <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#0B1020] text-[#F3F5FA] border border-[#28334D]">Space</kbd>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-[#151C35] border border-[#28334D]/60">
                    <span className="text-[#9AA6BD]">Step Frame</span>
                    <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#0B1020] text-[#F3F5FA] border border-[#28334D]">J / L</kbd>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-[#151C35] border border-[#28334D]/60">
                    <span className="text-[#9AA6BD]">Pose Skeleton</span>
                    <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#0B1020] text-[#F3F5FA] border border-[#28334D]">C</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Footer */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-[#9AA6BD] border-t border-[#28334D]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Engine: MediaPipe 17-Pt Ready</span>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-3.5 py-1.5 rounded-md bg-[#6675E8] hover:bg-[#5463D6] font-semibold text-xs text-white transition cursor-pointer"
              >
                Close Guide
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
