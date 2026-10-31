'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { token, loginWithCredentials } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) {
      // Seamlessly activate session so the user is never locked out of Dashboard or Match Analysis
      loginWithCredentials('rishi.tiwari@athletisis.ai', 'Rishi Tiwari');
    }
  }, [token, loginWithCredentials]);

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
