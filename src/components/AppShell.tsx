'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Menu } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/register';
  const isDashboard = pathname === '/dashboard';

  if (isPublicPage) {
    return <>{children}</>;
  }

  // Dashboard manages its own customized header + workstation canvas
  if (isDashboard) {
    return <>{children}</>;
  }

  // All other platform pages (/matches, /performance, /team, /training, /coach, /settings, /upload)
  return (
    <div className="min-h-screen bg-[#070B1E] text-slate-200 flex relative selection:bg-blue-500 selection:text-white">
      {/* Background radial gradient */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'radial-gradient(1200px circle at 50% -10%, rgba(37, 56, 124, 0.28) 0%, rgba(7, 11, 30, 0) 70%)',
        }}
      />

      {/* Persistent Left Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen w-full relative z-10">
        
        {/* Mobile Header Bar with Hamburger */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#080D21]/90 backdrop-blur-md border-b border-indigo-950/60 p-3.5 flex items-center justify-between">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-[#0D1535] border border-indigo-900/40 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-black tracking-wider text-white">ATHLETESIS PRO</span>
          <div className="w-9" />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
