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
      <div className="pro-card p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/40 text-sky-400 flex items-center justify-center mx-auto mb-2 font-bold text-xl shadow-sm">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Sign In to Athletisis</h1>
          <p className="text-xs text-slate-300">Access your sports telemetry, 2D tactical maps, and AI performance coaching</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-700 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b1329] border border-slate-700 text-sm text-white focus:outline-none focus:border-sky-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b1329] border border-slate-700 text-sm text-white focus:outline-none focus:border-sky-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 font-extrabold text-white text-xs uppercase tracking-wider shadow-lg shadow-sky-600/30 transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Account'}
          </button>
        </form>

        <div className="pt-3 border-t border-slate-700/80 space-y-3 text-center">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Client Demo Login
          </div>
          <button
            type="button"
            onClick={() => {
              loginWithCredentials('rishi.tiwari@athletisis.ai', 'Rishi Tiwari');
              router.push('/dashboard');
            }}
            className="w-full py-3 rounded-xl bg-[#0b1329] hover:bg-slate-800 text-sky-400 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 shadow-sm transition"
          >
            <UserCheck className="w-4 h-4 text-sky-400" />
            Launch Instant Demo Profile (rishi.tiwari@athletisis.ai)
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 pt-1">
          Don't have an account?{' '}
          <Link href="/register" className="text-sky-400 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
