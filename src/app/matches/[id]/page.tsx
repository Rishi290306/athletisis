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
  return <MatchDashboardClient />;
}
