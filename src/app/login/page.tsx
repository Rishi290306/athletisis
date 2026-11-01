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
    <div className="min-h-screen bg-[#0B1020] text-[#F3F5FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl p-6 sm:p-8 bg-[#151C35] border border-[#28334D] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#6675E8] text-white flex items-center justify-center mx-auto mb-2 font-bold text-sm shadow-sm">
            A
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5FA] tracking-tight">Sign In to Athletesis</h1>
          <p className="text-xs text-[#9AA6BD]">Access 17-point pose kinematics, spatial tactical maps, and match telemetry</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9AA6BD] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0B1020] border border-[#28334D] text-xs text-[#F3F5FA] placeholder-[#9AA6BD] focus:outline-none focus:border-[#6675E8] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9AA6BD] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0B1020] border border-[#28334D] text-xs text-[#F3F5FA] placeholder-[#9AA6BD] focus:outline-none focus:border-[#6675E8] transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] font-semibold text-white text-xs uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-3 border-t border-[#28334D] space-y-2 text-center">
          <div className="text-[10px] font-semibold text-[#9AA6BD] uppercase tracking-wider font-mono">
            Direct Evaluation Demo
          </div>
          <button
            type="button"
            onClick={() => {
              loginWithCredentials('rishi.tiwari@athletisis.ai', 'Rishi Tiwari');
              router.push('/dashboard');
            }}
            className="w-full py-2 rounded-lg bg-[#0B1020] hover:bg-[#1A2342] text-[#55BDEB] font-semibold text-xs flex items-center justify-center gap-2 border border-[#28334D] transition cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-[#55BDEB]" />
            <span>Launch Pre-Calibrated Demo Workstation</span>
          </button>
        </div>

        <p className="text-center text-xs text-[#9AA6BD] pt-1">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#6675E8] font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
