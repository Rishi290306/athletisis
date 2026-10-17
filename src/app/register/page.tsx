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
      <div className="pro-card p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/40 text-sky-400 flex items-center justify-center mx-auto mb-2 font-bold text-xl shadow-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Athletisis Profile</h1>
          <p className="text-xs text-slate-300">Set up your sports performance workstation account</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-700 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. Rishi Tiwari"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b1329] border border-slate-700 text-sm text-white focus:outline-none focus:border-sky-400 transition"
              />
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">Primary Sport</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-[#0b1329] border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400 transition font-bold"
              >
                <option value="Cricket">🏏 Cricket</option>
                <option value="Football">⚽ Football</option>
                <option value="Volleyball">🏐 Volleyball</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">Team Name</label>
              <input
                type="text"
                placeholder="e.g. Apex Warriors"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-3 rounded-xl bg-[#0b1329] border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">Select Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('ATHLETE')}
                className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition border ${
                  role === 'ATHLETE'
                    ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                    : 'bg-[#0b1329] text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4" /> Athlete Profile
              </button>

              <button
                type="button"
                onClick={() => setRole('COACH')}
                className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition border ${
                  role === 'COACH'
                    ? 'bg-sky-600 text-white border-sky-400 shadow-md'
                    : 'bg-[#0b1329] text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" /> Coach Profile
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-sky-600 hover:bg-sky-500 font-extrabold text-white text-xs uppercase tracking-wider shadow-lg shadow-sky-600/30 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2 border-t border-slate-700/80">
          Already registered?{' '}
          <Link href="/login" className="text-sky-400 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
