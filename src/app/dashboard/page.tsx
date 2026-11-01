'use client';

import React, { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import { DashboardHeader } from '@/components/DashboardHeader';
import { StatCardsRow } from '@/components/StatCardsRow';
import { RecentAnalysisWorkbench } from '@/components/RecentAnalysisWorkbench';
import { PerformanceTrendChart } from '@/components/PerformanceTrendChart';
import { RecentMatchesTable } from '@/components/RecentMatchesTable';
import { RecentActivityPanel } from '@/components/RecentActivityPanel';
import { useSportStore, SPORT_CONFIGS } from '@/lib/sportStore';
import { useAuthStore, useMatchStore, DEFAULT_DEMO_MATCHES } from '@/lib/store';
import { Match } from '@/types';

export default function DashboardPage() {
  const { activeSport } = useSportStore();
  const { user } = useAuthStore();
  const { matches, getMatchesForUser } = useMatchStore();

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
    setRecentMatch(matchingSportMatch || resolvedMatches[0] || DEFAULT_DEMO_MATCHES[0]);
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
      <div className="flex-1 flex flex-col w-full min-h-screen">
        
        {/* Top Context Header Bar */}
        <DashboardHeader
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
        <footer className="border-t border-[#28334D] bg-[#0B1020] py-4 px-6 sm:px-8 text-center sm:text-left text-xs text-[#9AA6BD]">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-medium text-[#F3F5FA]">
              Athletesis Enterprise Platform <span className="text-[#6675E8]">/</span> Computer Vision & Biomechanics Workstation
            </span>
            <span className="text-[11px] text-[#9AA6BD] font-mono">
              v2.4 PRO • MediaPipe 17-Point Vision Tasks & Kinematic Event Engine
            </span>
          </div>
        </footer>

      </div>
    </AuthGuard>
  );
}
