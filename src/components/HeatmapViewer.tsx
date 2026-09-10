'use client';

import React from 'react';
import { MatchStrategyTrainingHub } from './MatchStrategyTrainingHub';
import { SportType } from '@/lib/sportStore';

interface HeatmapViewerProps {
  sport?: SportType;
  athleteName?: string;
  heatmapsData?: Record<string, number[][]>;
}

export function HeatmapViewer({ sport = 'Cricket', athleteName }: HeatmapViewerProps) {
  return <MatchStrategyTrainingHub sport={sport} athleteName={athleteName} />;
}
