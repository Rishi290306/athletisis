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
    <div className="min-h-screen bg-[#0B1020] text-[#F3F5FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl p-6 sm:p-8 bg-[#151C35] border border-[#28334D] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-[#6675E8] text-white flex items-center justify-center mx-auto mb-2 font-bold text-sm shadow-sm">
            A
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#F3F5FA] tracking-tight">Create Athletesis Account</h1>
          <p className="text-xs text-[#9AA6BD]">Set up your sports performance workstation profile</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#9AA6BD] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Rishi Tiwari"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#0B1020] border border-[#28334D] text-xs text-[#F3F5FA] placeholder-[#9AA6BD] focus:outline-none focus:border-[#6675E8] transition"
              />
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1.5">
                Primary Sport
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0B1020] border border-[#28334D] text-xs text-[#F3F5FA] focus:outline-none focus:border-[#6675E8] transition font-medium"
              >
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Volleyball">Volleyball</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1.5">
                Team / Squad
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Warriors"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0B1020] border border-[#28334D] text-xs text-[#F3F5FA] placeholder-[#9AA6BD] focus:outline-none focus:border-[#6675E8] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#9AA6BD] uppercase tracking-wider mb-1.5">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('ATHLETE')}
                className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                  role === 'ATHLETE'
                    ? 'bg-[#0B1020] text-[#F3F5FA] border-[#6675E8] shadow-sm font-semibold'
                    : 'bg-[#0B1020] text-[#9AA6BD] border-[#28334D] hover:text-[#F3F5FA]'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-[#E8B75A]" /> Athlete
              </button>

              <button
                type="button"
                onClick={() => setRole('COACH')}
                className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                  role === 'COACH'
                    ? 'bg-[#0B1020] text-[#F3F5FA] border-[#6675E8] shadow-sm font-semibold'
                    : 'bg-[#0B1020] text-[#9AA6BD] border-[#28334D] hover:text-[#F3F5FA]'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#55BDEB]" /> Coach
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#6675E8] hover:bg-[#5463D6] font-semibold text-white text-xs uppercase tracking-wider shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-[#9AA6BD] pt-2 border-t border-[#28334D]">
          Already registered?{' '}
          <Link href="/login" className="text-[#6675E8] font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
