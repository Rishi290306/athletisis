'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

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

  // Derive standardized page title and subtitle from pathname
  const getPageMeta = (path: string) => {
    if (path.startsWith('/matches/analysis') || path.match(/^\/matches\/\d+/)) {
      return { title: 'Match Analysis Workbench', subtitle: 'Biomechanical telemetry, pose tracking & event detection' };
    }
    if (path.startsWith('/matches')) {
      return { title: 'Match Analysis', subtitle: 'Match footage library, 17-point pose tracks & performance records' };
    }
    if (path.startsWith('/team')) {
      return { title: 'Player Analytics', subtitle: 'Squad roster, athlete biometric profiles & position radar' };
    }
    if (path.startsWith('/performance')) {
      return { title: 'Performance Reports', subtitle: 'Longitudinal rating evolution & biomechanical trend curves' };
    }
    if (path.startsWith('/training')) {
      return { title: 'Drills & Training', subtitle: 'Personalized AI tactical exercises & movement correction' };
    }
    if (path.startsWith('/coach')) {
      return { title: 'AI Coach & Tactics', subtitle: 'Real-time kinematic chatbot & tactical game preparation' };
    }
    if (path.startsWith('/settings')) {
      return { title: 'Platform Settings', subtitle: 'Account preferences, sport engines & export configurations' };
    }
    if (path.startsWith('/upload')) {
      return { title: 'Upload Match Video', subtitle: 'Ingest match footage for 17-point pose estimation & AI classification' };
    }
    return { title: 'Athletesis Platform', subtitle: 'AI-powered sports performance analytics' };
  };

  const pageMeta = getPageMeta(pathname || '');

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F3F5FA] flex relative selection:bg-[#6675E8] selection:text-white">
      {/* Permanent Left Sidebar across all application views */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Canvas */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen w-full relative z-10">
        
        {/* If on dashboard, dashboard renders its custom interactive header. For all other pages, provide unified top context bar */}
        {!isDashboard && (
          <DashboardHeader
            onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            title={pageMeta.title}
            subtitle={pageMeta.subtitle}
          />
        )}

        {isDashboard ? (
          children
        ) : (
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
            {children}
          </main>
        )}
      </div>
    </div>
  );
}
