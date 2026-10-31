'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  if (isDashboard) {
    // The Dashboard page manages its own full-width workstation with the reference Sidebar & DashboardHeader
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="border-t border-slate-800/80 bg-[#090D16]/90 backdrop-blur py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-semibold text-slate-400">
            Athletesis Platform <span className="text-slate-600">/</span> Computer Vision & Sports Kinematics
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            v2.4 PRO • MediaPipe Vision Tasks & Kinematic Event Engine
          </span>
        </div>
      </footer>
    </>
  );
}
