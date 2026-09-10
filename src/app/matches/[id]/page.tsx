import { Suspense } from 'react';
import { MatchDashboardClient } from './MatchDashboardClient';

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '101' },
    { id: '102' },
    { id: '103' },
    { id: '201' },
    { id: '301' },
  ];
}

export default function MatchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-400 text-xs">Loading Match Analysis...</div>}>
      <MatchDashboardClient />
    </Suspense>
  );
}
