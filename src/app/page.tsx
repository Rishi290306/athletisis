'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowRight, Video, Activity, Dumbbell, ShieldCheck, Compass, ShieldAlert, UserCheck, Sparkles, LineChart } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { token, user, loginWithCredentials } = useAuthStore();

  const handleDemoLogin = (email: string) => {
    loginWithCredentials(email);
    router.push('/dashboard');
  };

  const tickerItems = [
    'CRICKET DELIVERY TRAJECTORY & SEAM METRICS',
    'FOOTBALL PASSING NETWORK & SPRINT VELOCITY',
    'VOLLEYBALL SPIKE ATTACK & JUMP ELEVATION',
    '17-POINT POSE SKELETON TRACKING',
    'BIOMECHANICAL INJURY STRAIN RADAR',
    'EXECUTIVE COACH PERFORMANCE REPORTS',
  ];

  return (
    <div className="space-y-12 py-6 relative">
      {/* Telemetry Minimal Ticker Bar */}
      <div className="w-full bg-[#090D16] border-y border-slate-800/80 py-2.5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-8 items-center text-[11px] font-mono font-medium tracking-wider text-slate-400">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <span key={idx} className="flex items-center gap-3">
              <span className="text-brand-400 font-semibold">{item}</span>
              <span className="text-slate-700">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* SIGN IN GATE IF NOT AUTHENTICATED */}
      {!token ? (
        <section className="max-w-md mx-auto pt-4 px-4">
          <div className="pro-card p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-2 font-bold text-lg">
                A
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to Athletisis</h1>
              <p className="text-xs text-slate-400">
                Professional sports analytics & computer vision biomechanics workstation.
              </p>
            </div>

            {/* Direct Form Submit */}
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
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue="rishi.tiwari@athletisis.ai"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090D16] border border-slate-800 text-white focus:outline-none focus:border-brand-500 transition text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 uppercase tracking-wider mb-1.5 text-[11px]">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  defaultValue="demo123"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#090D16] border border-slate-800 text-white focus:outline-none focus:border-brand-500 transition text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold text-white text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
              >
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-[11px] font-medium text-slate-400 text-center uppercase tracking-wider">
                Instant Demo Access
              </div>
              <button
                onClick={() => handleDemoLogin('rishi.tiwari@athletisis.ai')}
                className="w-full py-2.5 rounded-lg bg-[#090D16] hover:bg-slate-800 border border-slate-800 text-brand-400 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <UserCheck className="w-4 h-4 text-brand-400" />
                Launch Demo Workstation
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* HERO SECTION FOR AUTHENTICATED USERS */
        <section className="max-w-5xl mx-auto text-center space-y-6 pt-4 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            WORKSTATION ACTIVE
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Computer Vision Sports Analytics <br />
            <span className="text-brand-400">& Biomechanical Pose Intelligence</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm text-slate-400 leading-relaxed">
            High-density match video telemetry, 2D tactical field maps, biomechanical strain radars, split-screen video comparison, and printable coach reports across Cricket, Football, and Volleyball.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition"
            >
              Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/matches/analysis?id=101"
              className="px-5 py-2.5 rounded-lg bg-[#0E1424] hover:bg-slate-800 text-slate-200 font-medium text-xs uppercase tracking-wider border border-slate-800 flex items-center gap-2 transition"
            >
              Match #101 Workbench
            </Link>

            <Link
              href="/upload"
              className="px-5 py-2.5 rounded-lg bg-[#0E1424] hover:bg-slate-800 text-slate-300 font-medium text-xs uppercase tracking-wider border border-slate-800 flex items-center gap-2 transition"
            >
              Upload Footage
            </Link>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
            <div className="pro-card p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
                <Compass className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-semibold text-white">2D Tactical Spatial Map</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Vector surfaces for Cricket, Football, and Volleyball synchronized to video timestamp scrubbing.</p>
            </div>

            <div className="pro-card p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldAlert className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Biomechanical Strain Radar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Monitors joint strain, sprint deceleration load, and muscle fatigue (Hamstrings, ACL risk, Quadriceps).</p>
            </div>

            <div className="pro-card p-5 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Dumbbell className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-semibold text-white">AI Strategy & Drill Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Actionable drills with prescribed sets/reps, target score targets, and drill completion toggles.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
