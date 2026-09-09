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
  heatmapTabs: { id: string; label: string }[];
}

export const SPORT_CONFIGS: Record<SportType, SportConfig> = {
  Football: {
    id: 'Football',
    name: 'Football',
    icon: '⚽',
    badge: 'Primary MVP Active',
    themeColor: '#ffc700',
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
      secondaryStatValue: '29.4 km/h',
      tertiaryStatLabel: 'Distance Covered',
      tertiaryStatValue: '10.4 km',
    },
    heatmapTabs: [
      { id: 'movement', label: 'Movement Pitch' },
      { id: 'touch', label: 'Pass & Touch' },
      { id: 'defensive', label: 'Tackle & Press' },
      { id: 'mistake', label: 'Turnover Heatmap' },
    ],
  },
  Cricket: {
    id: 'Cricket',
    name: 'Cricket',
    icon: '🏏',
    badge: 'Engine Active',
    themeColor: '#00f0ff',
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
    heatmapTabs: [
      { id: 'wagonWheel', label: '360° Wagon Wheel' },
      { id: 'pitchMap', label: '22-Yard Pitch Map' },
      { id: 'fielding', label: 'Fielding Coverage' },
      { id: 'boundary', label: 'Boundary Zones' },
    ],
  },
  Volleyball: {
    id: 'Volleyball',
    name: 'Volleyball',
    icon: '🏐',
    badge: 'Engine Active',
    themeColor: '#ff007f',
    positions: ['Outside Hitter (Spiker)', 'Setter', 'Middle Blocker', 'Opposite Hitter', 'Libero (Defender)'],
    dnaLabels: {
      technical: 'Spiking Power',
      tactical: 'Setting Precision',
      physical: 'Vertical Jump',
      decision: 'Tactical Reading',
      consistency: 'Defense & Digging',
    },
    sampleMetrics: {
      primaryStatLabel: 'Spike Velocity',
      primaryStatValue: '92.4 km/h',
      secondaryStatLabel: 'Spike Jump Height',
      secondaryStatValue: '78 cm',
      tertiaryStatLabel: 'Dig Efficiency',
      tertiaryStatValue: '86.2%',
    },
    heatmapTabs: [
      { id: 'spike', label: 'Spike Attack Zones' },
      { id: 'serve', label: 'Serve Placement' },
      { id: 'setter', label: 'Setter Distribution' },
      { id: 'block', label: 'Block Defense Grid' },
    ],
  },
};

interface SportStore {
  activeSport: SportType;
  setSport: (sport: SportType) => void;
}

export const useSportStore = create<SportStore>((set) => ({
  activeSport: 'Football',
  setSport: (sport) => set({ activeSport: sport }),
}));
