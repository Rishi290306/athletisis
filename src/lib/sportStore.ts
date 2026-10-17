'use client';

import { create } from 'zustand';

export type SportType = 'Football' | 'Cricket' | 'Volleyball';

export interface SportConfig {
  id: SportType;
  name: string;
  icon: string;
  badge: string;
  themeColor: string;
  positions: string[];
  dnaLabels: {
    technical: string;
    tactical: string;
    physical: string;
    decision: string;
    consistency: string;
  };
  sampleMetrics: {
    primaryStatLabel: string;
    primaryStatValue: string;
    secondaryStatLabel: string;
    secondaryStatValue: string;
    tertiaryStatLabel: string;
    tertiaryStatValue: string;
  };
}

export const SPORT_CONFIGS: Record<SportType, SportConfig> = {
  Cricket: {
    id: 'Cricket',
    name: 'Cricket',
    icon: '🏏',
    badge: 'CV Telemetry Active',
    themeColor: '#38bdf8',
    positions: ['Batsman (Opener)', 'Batsman (Middle-Order)', 'Fast Bowler', 'Spin Bowler', 'All-Rounder', 'Wicketkeeper'],
    dnaLabels: {
      technical: 'Batting Precision',
      tactical: 'Shot Selection',
      physical: 'Agility & Speed',
      decision: 'Bowling Line & Length',
      consistency: 'Fielding Reflexes',
    },
    sampleMetrics: {
      primaryStatLabel: 'Batting Strike Rate',
      primaryStatValue: '142.5',
      secondaryStatLabel: 'Bowling Release Speed',
      secondaryStatValue: '138.2 km/h',
      tertiaryStatLabel: 'Good Length Accuracy',
      tertiaryStatValue: '84.0%',
    },
  },
  Football: {
    id: 'Football',
    name: 'Football / Soccer',
    icon: '⚽',
    badge: 'CV Telemetry Active',
    themeColor: '#0ea5e9',
    positions: ['Center Midfielder', 'Striker', 'Winger', 'Center Back', 'Fullback', 'Goalkeeper'],
    dnaLabels: {
      technical: 'Technical Precision',
      tactical: 'Tactical Awareness',
      physical: 'Physical Peak',
      decision: 'Decision Making',
      consistency: 'Consistency Score',
    },
    sampleMetrics: {
      primaryStatLabel: 'Pass Accuracy',
      primaryStatValue: '85.7%',
      secondaryStatLabel: 'Peak Sprint Speed',
      secondaryStatValue: '32.4 km/h',
      tertiaryStatLabel: 'Distance Covered',
      tertiaryStatValue: '10.4 km',
    },
  },
  Volleyball: {
    id: 'Volleyball',
    name: 'Volleyball',
    icon: '🏐',
    badge: 'CV Telemetry Active',
    themeColor: '#ec4899',
    positions: ['Outside Hitter', 'Setter', 'Middle Blocker', 'Opposite Hitter', 'Libero'],
    dnaLabels: {
      technical: 'Spike Power',
      tactical: 'Setter Distribution',
      physical: 'Vertical Jump',
      decision: 'Block Reading',
      consistency: 'Digging Accuracy',
    },
    sampleMetrics: {
      primaryStatLabel: 'Spike Velocity',
      primaryStatValue: '92.4 km/h',
      secondaryStatLabel: 'Spike Height',
      secondaryStatValue: '78 cm',
      tertiaryStatLabel: 'Dig Efficiency',
      tertiaryStatValue: '86.2%',
    },
  },
};

interface SportStore {
  activeSport: SportType;
  setSport: (sport: SportType) => void;
}

export const useSportStore = create<SportStore>((set) => ({
  activeSport: 'Cricket',
  setSport: (sport) => set({ activeSport: sport }),
}));
