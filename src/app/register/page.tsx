'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { UserPlus, Lock, Mail, User as UserIcon, Shield, Trophy } from 'lucide-react';
import { Role } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const registerAccount = useAuthStore((state) => state.registerAccount);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('ATHLETE');
  const [sport, setSport] = useState('Football');
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      registerAccount(fullName.trim(), email.trim(), role === 'COACH' ? 'COACH' : 'ATHLETE', sport, teamName.trim() || 'My Team');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="glass-panel border border-brand-500/30 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto mb-2 shadow-[0_0_25px_rgba(255,199,0,0.3)]">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">Create Account</h1>
          <p className="text-xs text-slate-300">Set up your raw profile to start tracking sports performance</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. Alex Hunter"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-950/90 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Primary Sport</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-dark-950/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 transition"
              >
                <option value="Football">⚽ Football</option>
                <option value="Cricket">🏏 Cricket</option>
                <option value="Volleyball">🏐 Volleyball</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Team Name</label>
              <input
                type="text"
                placeholder="e.g. Apex FC"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-dark-950/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Select Account Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('ATHLETE')}
                className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition border ${
                  role === 'ATHLETE'
                    ? 'bg-brand-500/20 text-brand-400 border-brand-500/40 shadow-[0_0_15px_rgba(255,199,0,0.2)]'
                    : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4" /> Athlete Profile
              </button>

              <button
                type="button"
                onClick={() => setRole('COACH')}
                className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition border ${
                  role === 'COACH'
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-dark-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" /> Head Coach Profile
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 hover:from-brand-400 hover:to-cyan-300 font-black text-black text-sm uppercase tracking-wider shadow-xl shadow-brand-500/25 transition disabled:opacity-50 hover:scale-[1.01]"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          Already registered?{' '}
          <Link href="/login" className="text-brand-400 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
