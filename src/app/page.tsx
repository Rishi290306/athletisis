'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  ArrowRight,
  Video,
  Activity,
  Dumbbell,
  ShieldCheck,
  Compass,
  ShieldAlert,
  UserCheck,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { token, user, loginWithCredentials } = useAuthStore();

  const handleDemoLogin = (email: string) => {
    loginWithCredentials(email);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F3F5FA] flex flex-col justify-between selection:bg-[#6675E8] selection:text-white">
      {/* Top Minimal Navigation Bar for Public Landing */}
      <header className="border-b border-[#28334D] bg-[#0B1020]/90 backdrop-blur-md px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6675E8] flex items-center justify-center font-bold text-white text-sm shadow-sm">
            A
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-wider text-[#F3F5FA]">
              ATHLETESIS
            </span>
            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#E8B75A]/10 text-[#E8B75A] border border-[#E8B75A]/30">
              PRO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Launch Workstation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={() => handleDemoLogin('rishi.tiwari@athletisis.ai')}
              className="px-4 py-2 rounded-lg bg-[#151C35] hover:bg-[#1A2342] border border-[#28334D] text-[#F3F5FA] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Instant Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#55BDEB]" />
            </button>
          )}
        </div>
      </header>

      {/* Main Hero & Auth Gate */}
      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20 flex-1 flex flex-col justify-center space-y-12">
        
        {/* Hero Copy */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151C35] border border-[#28334D] text-[#55BDEB] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>MediaPipe 17-Point Computer Vision Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3F5FA] leading-tight">
            Computer Vision Sports Analytics & Biomechanical Telemetry
          </h1>

          <p className="text-sm sm:text-base text-[#9AA6BD] max-w-2xl mx-auto leading-relaxed">
            High-density video telemetry, 2D tactical pitch mapping, joint strain radars, and automated kinematic event classification across Cricket, Football, and Volleyball.
          </p>
        </div>

        {/* Auth / Launch Card */}
        {!token ? (
          <div className="max-w-md mx-auto w-full p-6 sm:p-8 rounded-xl bg-[#151C35] border border-[#28334D] shadow-xl space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-[#F3F5FA]">Sign In to Workstation</h2>
              <p className="text-xs text-[#9AA6BD]">Enter your credentials or launch the pre-calibrated demo.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const emailInput = (form.elements.namedItem('email') as HTMLInputElement).value;
                if (emailInput) {
                  loginWithCredentials(emailInput);
                  router.push('/dashboard');
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue="rishi.tiwari@athletisis.ai"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] transition text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  defaultValue="demo123"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1020] border border-[#28334D] text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] transition text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] font-semibold text-white text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <span>Sign In to Platform</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-3 border-t border-[#28334D] space-y-2">
              <div className="text-[10px] font-semibold text-[#9AA6BD] text-center uppercase tracking-wider font-mono">
                Instant Evaluation
              </div>
              <button
                onClick={() => handleDemoLogin('rishi.tiwari@athletisis.ai')}
                className="w-full py-2 rounded-lg bg-[#0B1020] hover:bg-[#1A2342] border border-[#28334D] text-[#55BDEB] font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#55BDEB]" />
                <span>Launch Calibrated Demo Session</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition"
            >
              <span>Open Workstation Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/matches/analysis?id=101"
              className="px-5 py-2.5 rounded-lg bg-[#151C35] hover:bg-[#1A2342] text-[#F3F5FA] font-medium text-xs border border-[#28334D] flex items-center gap-2 transition"
            >
              <span>Match #101 Pose Workbench</span>
            </Link>

            <Link
              href="/upload"
              className="px-5 py-2.5 rounded-lg bg-[#151C35] hover:bg-[#1A2342] text-[#9AA6BD] hover:text-[#F3F5FA] font-medium text-xs border border-[#28334D] flex items-center gap-2 transition"
            >
              <span>Upload Match Footage</span>
            </Link>
          </div>
        )}

        {/* Three Core Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#55BDEB]/10 border border-[#55BDEB]/30 text-[#55BDEB] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#F3F5FA]">17-Point Pose Kinematics</h3>
            <p className="text-xs text-[#9AA6BD] leading-relaxed">
              Real-time joint coordinate mapping, velocity calculation, release apex detection, and anatomical angle tracking.
            </p>
          </div>

          <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#E8B75A]/10 border border-[#E8B75A]/30 text-[#E8B75A] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#F3F5FA]">2D Tactical Pitch Maps</h3>
            <p className="text-xs text-[#9AA6BD] leading-relaxed">
              Coordinate vector pitch surfaces synchronized with video playheads across Cricket, Football, and Volleyball.
            </p>
          </div>

          <div className="rounded-xl p-5 bg-[#151C35] border border-[#28334D] space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#6675E8]/10 border border-[#6675E8]/30 text-[#6675E8] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#F3F5FA]">Biomechanical Strain Radar</h3>
            <p className="text-xs text-[#9AA6BD] leading-relaxed">
              Monitors knee flexion strain, shoulder rotation torque, and deceleration loads to proactively minimize injury risk.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#28334D] py-6 px-6 text-center text-xs text-[#9AA6BD]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Athletesis Sports Technology Platform • v2.4 PRO</span>
          <span className="font-mono text-[11px]">MediaPipe 17-Point Pose & Kinematic Classifier</span>
        </div>
      </footer>
    </div>
  );
}
