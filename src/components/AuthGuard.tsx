'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ShieldAlert, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { token } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) {
      router.replace('/login');
    }
  }, [token, router]);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Authentication Required</h2>
          <p className="text-xs text-slate-400">
            Please log in with your athlete or coach credentials to view personalized performance analytics.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 via-amber-400 to-cyan-400 font-extrabold text-black text-xs shadow-xl shadow-brand-500/25 transition hover:scale-105"
        >
          <KeyRound className="w-4 h-4" /> Sign In Now
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
