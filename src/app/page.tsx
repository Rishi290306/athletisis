'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ArrowRight, Video, Cpu, Activity, Dumbbell, TrendingUp, Zap, Sparkles, Play, LogIn, UserCheck, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { token, user, loginWithCredentials } = useAuthStore();

  const handleDemoLogin = (email: string) => {
    loginWithCredentials(email);
    router.push('/dashboard');
  };

  const tickerItems = [
    '⚽ 94% PASSING ACCURACY',
    '⚡ 29.4 KM/H PEAK SPRINT SPEED',
    '📈 +29.5% POSITIONING IMPROVEMENT',
    '🎯 87% CV CONFIDENCE SCORE',
    '🧠 EXPLAINABLE AI DECISION BREAKDOWN',
    '🛡️ PRE-MATCH AI OPPONENT STRATEGY',
  ];

  return (
    <div className="space-y-16 py-6 relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-[150px] pointer-events-none animate-pulse-gold" />
      <div className="absolute top-1/3 right-5 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />

      {/* Ticker */}
      <div className="w-full bg-dark-900/90 border-y border-brand-500/30 py-2.5 overflow-hidden backdrop-blur-xl shadow-lg">
        <div className="animate-marquee whitespace-nowrap flex gap-8 items-center text-xs font-black tracking-widest text-brand-400">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <span key={idx} className="flex items-center gap-3">
              {item} <span className="text-slate-700 font-normal">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* STARTUP LOGIN GATE IF NOT AUTHENTICATED */}
      {!token ? (
        <section className="max-w-lg mx-auto pt-4 relative z-10">
          <div className="glass-panel border border-brand-500/40 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto mb-2 shadow-[0_0_25px_rgba(255,199,0,0.3)] animate-float">
                <LogIn className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Sign In to Athletisis</h1>
              <p className="text-xs text-slate-300">
                Log in to your account to view your sports performance analytics, heatmaps, and AI coaching.
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
              className="space-y-4"
            >
              <div>
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-dark-950/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider mb-1">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl bg-dark-950/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 hover:from-brand-400 hover:to-cyan-300 font-black text-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-brand-500/25 transition hover:scale-[1.01]"
              >
                Sign In to Account <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <Link href="/register" className="text-brand-400 font-bold hover:underline">
                  Register New Account →
                </Link>
              </p>
            </div>
          </div>
        </section>
      ) : (
        /* HERO SECTION WHEN LOGGED IN */
        <section className="text-center space-y-8 max-w-4xl mx-auto pt-4 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-brand-500/40 text-brand-300 text-xs font-extrabold shadow-[0_0_30px_rgba(255,199,0,0.25)] animate-float">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Authenticated as {user?.fullName} ({user?.role})</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Understand Your Game.{' '}
            <span className="text-gradient-gold block mt-2 drop-shadow-[0_0_40px_rgba(255,199,0,0.35)]">
              Improve Your Performance.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Upload game video and let Athletisis transform raw footage into computer-vision metrics, spatial heatmaps, decision analysis, and personalized coaching plans.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
            <Link
              href="/dashboard"
              className="px-9 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 hover:from-brand-400 hover:to-cyan-300 text-slate-950 font-black text-sm flex items-center gap-2.5 shadow-[0_0_40px_rgba(255,199,0,0.45)] hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              <Zap className="w-4 h-4 fill-slate-950" /> Go to My Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/upload"
              className="px-8 py-4 rounded-2xl glass-panel glass-panel-hover text-slate-200 font-bold text-sm border border-slate-700/80 transition-all duration-300"
            >
              Upload Match Footage
            </Link>
          </div>
        </section>
      )}

      {/* Core Feedback Loop Pipeline */}
      <section className="glass-panel border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-black text-brand-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" /> The Core Feedback Loop
          </span>
          <h2 className="text-3xl font-black text-white mt-1">From Match Footage to Measured Progress</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            { step: '01', title: 'MATCH VIDEO', desc: 'Upload game footage with automated quality check', icon: Video },
            { step: '02', title: 'AI ANALYSIS', desc: 'ByteTrack player tracking & event detection', icon: Cpu },
            { step: '03', title: 'PERFORMANCE', desc: 'Score breakdown & grounded insights', icon: Activity },
            { step: '04', title: 'COACHING', desc: 'Personalized drills & "What Should I Have Done?"', icon: Dumbbell },
            { step: '05', title: 'IMPROVEMENT', desc: 'Track progress match-over-match (+29.5%)', icon: TrendingUp },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-dark-950/80 border border-slate-800/80 rounded-2xl p-5 relative group glass-panel-gold-hover"
              >
                <span className="text-3xl font-black text-slate-800 group-hover:text-brand-400/40 transition-colors">
                  {item.step}
                </span>
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center my-3 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(255,199,0,0.2)]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">{item.title}</h3>
                <p className="text-[11px] text-slate-400 leading-normal">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
