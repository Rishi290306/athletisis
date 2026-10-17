'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowRight, Video, Activity, Dumbbell, Play, LogIn, UserCheck, ShieldCheck, Compass, ShieldAlert } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { token, user, loginWithCredentials } = useAuthStore();

  const handleDemoLogin = (email: string) => {
    loginWithCredentials(email);
    router.push('/dashboard');
  };

  const tickerItems = [
    '🏏 CRICKET CREASE DELIVERY TRAJECTORY & SEAM METRICS',
    '⚽ FOOTBALL PASSING NETWORK & SPRINT VELOCITY',
    '🏐 VOLLEYBALL SPIKE ATTACK & NET JUMP HEIGHT',
    '🎯 17-POINT POSE SKELETON TRACKING',
    '🩺 BIOMECHANICAL INJURY STRAIN RADAR',
    '📄 PRINTABLE EXECUTIVE COACH REPORTS',
  ];

  return (
    <div className="space-y-12 py-6 relative">
      
      {/* Telemetry Live Ticker Bar */}
      <div className="w-full bg-[#152037] border-y border-slate-700/80 py-2.5 overflow-hidden shadow-inner">
        <div className="animate-marquee whitespace-nowrap flex gap-8 items-center text-xs font-mono font-bold tracking-wider text-sky-400">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <span key={idx} className="flex items-center gap-3">
              {item} <span className="text-slate-600 font-normal">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* SIGN IN GATE IF NOT AUTHENTICATED */}
      {!token ? (
        <section className="max-w-lg mx-auto pt-4 px-4">
          <div className="pro-card p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/40 text-sky-400 flex items-center justify-center mx-auto mb-2 font-bold text-xl shadow-sm">
                A
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Sign In to Athletisis Workstation</h1>
              <p className="text-xs text-slate-300">
                Enter your credentials or click instant demo login below to access sports telemetry & pose tracking.
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
                <label className="block font-bold text-slate-200 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue="rishi.tiwari@athletisis.ai"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1329] border border-slate-700 text-white focus:outline-none focus:border-sky-400 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 uppercase tracking-wider mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  defaultValue="demo123"
                  className="w-full px-4 py-3 rounded-xl bg-[#0b1329] border border-slate-700 text-white focus:outline-none focus:border-sky-400 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 font-extrabold text-white uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition"
              >
                Sign In to Account <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-700/80 space-y-3">
              <div className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
                Instant Demo Access
              </div>
              <button
                onClick={() => handleDemoLogin('rishi.tiwari@athletisis.ai')}
                className="w-full py-3 rounded-xl bg-[#0b1329] hover:bg-slate-800 border border-slate-700 text-sky-400 font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-sky-400" />
                Launch Demo Workstation (rishi.tiwari@athletisis.ai)
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* HERO SECTION FOR AUTHENTICATED USERS */
        <section className="max-w-5xl mx-auto text-center space-y-6 pt-4 px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-600/20 border border-sky-500/40 text-sky-300 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            PRO SPORTS PERFORMANCE WORKSTATION ACTIVE
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Computer Vision Sports Analytics <br />
            <span className="text-sky-400">& Biomechanical Pose Intelligence</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm text-slate-300 leading-relaxed">
            High-density match video telemetry, 2D tactical field maps, biomechanical strain radars, split-screen video comparison, and printable coach reports for Cricket 🏏, Football ⚽, and Volleyball 🏐.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/matches/analysis?id=101"
              className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-sky-600/30 transition"
            >
              Open Match #101 Workbench <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/upload"
              className="px-6 py-3.5 rounded-xl bg-[#152037] hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition shadow-sm"
            >
              Upload Match Footage
            </Link>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left">
            <div className="pro-card p-5 space-y-2">
              <Compass className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-bold text-white">2D Interactive Tactical Field Map</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Authentic vector surfaces for Cricket, Football, and Volleyball with synchronized timestamp video scrubbing.</p>
            </div>

            <div className="pro-card p-5 space-y-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Biomechanical Injury Risk Radar</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Monitors joint strain, sprint deceleration load, and muscle fatigue (Hamstrings, ACL risk, Quadriceps).</p>
            </div>

            <div className="pro-card p-5 space-y-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">AI Strategy & Training Drill Hub</h3>
              <p className="text-xs text-slate-300 leading-relaxed">Actionable drills with prescribed sets/reps, target score targets, and drill completion toggles.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
