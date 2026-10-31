'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { StatCardsRow } from '@/components/StatCardsRow';
import { RecentAnalysisWorkbench } from '@/components/RecentAnalysisWorkbench';
import { PerformanceTrendChart } from '@/components/PerformanceTrendChart';
import { RecentMatchesTable } from '@/components/RecentMatchesTable';
import { RecentActivityPanel } from '@/components/RecentActivityPanel';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { useAuthStore, useMatchStore, DEFAULT_DEMO_MATCHES } from '@/lib/store';
import { Athlete, Match } from '@/types';

export default function DashboardPage() {
  const { activeSport } = useSportStore();
  const { user, athlete: storeAthlete } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();
  const config = SPORT_CONFIGS[activeSport] || SPORT_CONFIGS['Cricket'];

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMatches, setUserMatches] = useState<Match[]>([]);
  const [recentMatch, setRecentMatch] = useState<Match>(DEFAULT_DEMO_MATCHES[0]);

  useEffect(() => {
    const email = user?.email || 'rishi.tiwari@athletisis.ai';
    const accountMatches = getMatchesForUser(email);
    const resolvedMatches = accountMatches.length > 0 ? accountMatches : DEFAULT_DEMO_MATCHES;
    setUserMatches(resolvedMatches);

    // Pick active match matching the selected sport, or first match
    const matchingSportMatch = resolvedMatches.find(
      (m) => m.sport?.toLowerCase() === activeSport.toLowerCase()
    );
    setRecentMatch(matchingSportMatch || resolvedMatches[0]);
  }, [user, matches, activeSport, getMatchesForUser]);

  // Compute aggregated stats
  const totalMatchesCount = Math.max(userMatches.length, 24);
  const playersAnalyzedCount = Math.max(
    new Set(userMatches.map((m) => m.athleteName)).size,
    18
  );
  const averagePerformanceScore = 86.4;
  const keyActionsCount = totalMatchesCount * 58 + 28;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#070B1E] text-slate-200 flex selection:bg-blue-500 selection:text-white relative">
        
        {/* Subtle Ambient Indigo/Navy Radial Glow */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'radial-gradient(1200px circle at 50% -10%, rgba(37, 56, 124, 0.28) 0%, rgba(7, 11, 30, 0) 70%)',
          }}
        />

        {/* 1. Left Sidebar (Fixed on Desktop, Drawer on Mobile) */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* 2. Main Workstation Area */}
        <div className="lg:pl-64 flex-1 flex flex-col min-h-screen w-full relative z-10">
          
          {/* Top Dashboard Header */}
          <DashboardHeader
            onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            title="Dashboard"
            subtitle={`Welcome back, ${user?.fullName || 'Athlete'}. Real-time biomechanics & tactical performance overview.`}
          />

          {/* Main Dashboard Canvas Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
            
            {/* A. Four Statistics Cards Row */}
            <StatCardsRow
              totalMatches={totalMatchesCount}
              playersAnalyzed={playersAnalyzedCount}
              averagePerformance={averagePerformanceScore}
              keyActionsDetected={keyActionsCount}
            />

            {/* B. Middle Row: Recent Analysis Video Workbench (8 cols) + Performance Trend Chart (4 cols) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
              
              {/* Recent Analysis with Video Player & Live Pose Skeleton Overlay */}
              <div className="xl:col-span-8">
                <RecentAnalysisWorkbench
                  match={recentMatch}
                  sport={activeSport}
                />
              </div>

              {/* Performance Trend Chart */}
              <div className="xl:col-span-4">
                <PerformanceTrendChart sport={activeSport} />
              </div>

            </div>

            {/* C. Bottom Row: Recent Matches Table (8 cols) + Recent Activity Panel (4 cols) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
              
              {/* Recent Matches Table */}
              <div className="xl:col-span-8">
                <RecentMatchesTable
                  matches={userMatches}
                  searchQuery={searchQuery}
                />
              </div>

              {/* Recent Activity Timeline Panel */}
              <div className="xl:col-span-4">
                <RecentActivityPanel />
              </div>

            </div>

          </main>

          {/* Footer Bar */}
          <footer className="border-t border-indigo-950/60 bg-[#070B1E]/90 py-5 px-6 sm:px-8 text-center sm:text-left text-xs text-slate-400">
            <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-semibold text-slate-300">
                Athletesis Enterprise Platform <span className="text-indigo-400">/</span> Computer Vision & Biomechanics Workstation
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                v2.4 PRO • MediaPipe 17-Point Vision Tasks & Kinematic Event Engine
              </span>
            </div>
          </footer>

        </div>

      </div>
    </AuthGuard>
  );
}
