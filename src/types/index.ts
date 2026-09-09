export type Role = 'ATHLETE' | 'COACH' | 'ADMIN';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
  athleteId?: number;
}

export interface AthleteDNA {
  technicalScore: number;
  tacticalScore: number;
  physicalScore: number;
  decisionMakingScore: number;
  consistencyScore: number;
  overallScore: number;
}

export interface Athlete {
  id: number;
  userId: number;
  name: string;
  age: number;
  sport: string;
  position: string;
  teamName: string;
  preferredRole: string;
  experienceLevel: string;
  profilePhotoUrl?: string;
  matchesAnalyzedCount: number;
  dna: AthleteDNA;
}

export interface Match {
  id: number;
  matchName: string;
  sport: string;
  matchDate: string;
  teamName: string;
  opponentName: string;
  venue: string;
  matchType: string;
  athleteId: number;
  athleteName: string;
  notes?: string;
  videoUrl?: string;
  analysisFocus?: 'PLAYER' | 'TEAM';
  status: 'CREATED' | 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
}

export interface VideoMetadata {
  id: number;
  matchId: number;
  originalFileName: string;
  fileUrl: string;
  fileSizeBytes: number;
  durationSeconds: number;
  width: number;
  height: number;
  fps: number;
  qualityScore: number;
  lightingScore: number;
  blurScore: number;
  cameraAngle: string;
  playerVisibilityScore: number;
  ballVisibilityScore: number;
  warningMessage?: string;
  status: string;
}

export interface StandardizedEvent {
  id: number;
  matchId: number;
  athleteId: number;
  sport: string;
  eventType: 'PASS' | 'SHOT' | 'TACKLE' | 'INTERCEPTION' | 'POSSESSION_LOSS' | 'DECISION_ERROR' | 'POSITIONING_ERROR' | 'BALL_BOWLED' | 'DOT_BALL' | 'WICKET' | 'BOUNDARY' | 'SERVE' | 'SET' | 'BLOCK' | 'SPIKE' | 'BEST_MOMENT' | (string & {});
  timestampSeconds: number;
  formattedTimestamp: string;
  durationSeconds: number;
  confidence: number;
  success?: boolean;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  metadataJson?: string;
}

export interface VideoClip {
  id: number;
  matchId: number;
  athleteId: number;
  clipType: 'MISTAKE' | 'IMPORTANT_MOMENT' | 'BEST_MOMENT' | 'GOAL' | 'SHOT' | 'TACKLE';
  title: string;
  description: string;
  startTimestampSeconds: number;
  endTimestampSeconds: number;
  formattedTimestamp: string;
  clipUrl: string;
  thumbnailUrl?: string;
  decisionAnalysis?: string;
}

export interface GroundedInsight {
  category: string;
  title: string;
  evidence: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PerformanceScore {
  id: number;
  matchId: number;
  athleteId: number;
  sport: string;
  position: string;
  technicalScore: number;
  tacticalScore: number;
  physicalScore: number;
  decisionMakingScore: number;
  consistencyScore: number;
  overallScore: number;
  metricsJson?: string;
  strengthsJson?: string;
  weaknessesJson?: string;
  explainableFactorsJson?: string;
  aiConfidenceJson?: string;
  heatmapsJson?: string;
}

export interface Recommendation {
  id: number;
  athleteId: number;
  matchId: number;
  weaknessTitle: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedDrill: string;
  frequency: string;
  currentScore: number;
  targetScore: number;
  status: string;
  evidenceDescription: string;
}

export interface AnalysisJobStatus {
  id: number;
  matchId: number;
  videoId?: number;
  athleteId?: number;
  status: 'QUEUED' | 'FRAME_PREPROCESSING' | 'COMPUTER_VISION' | 'EVENT_DETECTION' | 'PERFORMANCE_ENGINE' | 'COMPLETED' | 'FAILED';
  progressPercent: number;
  currentStage: string;
  errorDetails?: string;
}
