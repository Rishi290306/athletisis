'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { LogIn, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      loginWithCredentials(email);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="glass-panel border border-brand-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto mb-2 shadow-[0_0_25px_rgba(255,199,0,0.3)]">
            <LogIn className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to Athletisis</h1>
          <p className="text-xs text-slate-300">Access your personalized AI sports performance and team analytics</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-950/90 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-950/90 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 hover:from-brand-400 hover:to-cyan-300 font-black text-black text-sm shadow-xl shadow-brand-500/25 transition disabled:opacity-50 hover:scale-[1.01]"
          >
            {loading ? 'Authenticating...' : 'Sign In to Account'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          Don't have an account?{' '}
          <Link href="/register" className="text-brand-400 font-bold hover:underline">
            Register new account
          </Link>
        </p>
      </div>
    </div>
  );
}
