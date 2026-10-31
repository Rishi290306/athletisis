'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { LogIn, Lock, Mail, UserCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);

  const [email, setEmail] = useState('rishi.tiwari@athletisis.ai');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      loginWithCredentials(email.trim());
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="pro-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-2 font-bold text-xl">
            <LogIn className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to Athletisis</h1>
          <p className="text-xs text-slate-400">Access sports telemetry, 2D tactical maps, and AI performance coaching</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-700/60 text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold text-white text-xs uppercase tracking-wider transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800 space-y-3 text-center">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Quick Client Demo Login
          </div>
          <button
            type="button"
            onClick={() => {
              loginWithCredentials('rishi.tiwari@athletisis.ai', 'Rishi Tiwari');
              router.push('/dashboard');
            }}
            className="w-full py-2.5 rounded-lg bg-[#090D16] hover:bg-slate-800 text-brand-400 font-medium text-xs flex items-center justify-center gap-2 border border-slate-800 transition"
          >
            <UserCheck className="w-4 h-4 text-brand-400" />
            Launch Instant Demo Profile (rishi.tiwari@athletisis.ai)
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 pt-1">
          Don't have an account?{' '}
          <Link href="/register" className="text-brand-400 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
