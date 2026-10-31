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
  const [sport, setSport] = useState('Cricket');
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
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="pro-card p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto mb-2 font-bold text-xl">
            <UserPlus className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Athletisis Profile</h1>
          <p className="text-xs text-slate-400">Set up your sports performance workstation account</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-700/60 text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Rishi Tiwari"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">Primary Sport</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-white focus:outline-none focus:border-brand-500 transition font-medium"
              >
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Volleyball">Volleyball</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">Team Name</label>
              <input
                type="text"
                placeholder="e.g. Apex Warriors"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#090D16] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 uppercase tracking-wider mb-1.5">Select Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('ATHLETE')}
                className={`py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition border ${
                  role === 'ATHLETE'
                    ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                    : 'bg-[#090D16] text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4" /> Athlete Profile
              </button>

              <button
                type="button"
                onClick={() => setRole('COACH')}
                className={`py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition border ${
                  role === 'COACH'
                    ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                    : 'bg-[#090D16] text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" /> Coach Profile
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 font-semibold text-white text-xs uppercase tracking-wider shadow-sm transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already registered?{' '}
          <Link href="/login" className="text-brand-400 font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
