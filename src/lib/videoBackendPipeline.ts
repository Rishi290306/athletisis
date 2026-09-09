'use client';

import { Match, VideoMetadata, AnalysisJobStatus, PerformanceScore, VideoClip, Recommendation } from '@/types';
import { SportType } from './sportStore';
import { generateDynamicAIAnalysis, DynamicAnalysisResult } from './aiAnalysisEngine';
import { saveVideoBlob, getVideoObjectUrl } from './videoStore';

export interface BackendAnalysisJob {
  jobId: string;
  matchId: number;
  sport: SportType;
  status: 'QUEUED' | 'EXTRACTING_FRAMES' | 'TRACKING_SKELETON' | 'COMPUTING_BIOMECHANICS' | 'COMPLETED' | 'FAILED';
  progressPercentage: number;
  currentPhase: string;
  startedAt: string;
  completedAt?: string;
  result?: DynamicAnalysisResult;
}

const activeJobs: Record<number, BackendAnalysisJob> = {};

export function initiateBackendAnalysis(
  matchId: number,
  sport: SportType,
  athleteName: string,
  position: string,
  analysisFocus: 'PLAYER' | 'TEAM',
  fileName: string = 'footage.mp4'
): BackendAnalysisJob {
  const jobId = `job_${Date.now()}_${matchId}`;
  
  const job: BackendAnalysisJob = {
    jobId,
    matchId,
    sport,
    status: 'QUEUED',
    progressPercentage: 5,
    currentPhase: 'Initializing Computer Vision Ingestion Pipeline...',
    startedAt: new Date().toISOString(),
  };

  activeJobs[matchId] = job;

  // Run async multi-phase processing simulation
  simulateBackendPhases(job, athleteName, position, analysisFocus, fileName);

  return job;
}

async function simulateBackendPhases(
  job: BackendAnalysisJob,
  athleteName: string,
  position: string,
  analysisFocus: 'PLAYER' | 'TEAM',
  fileName: string
) {
  const steps = [
    { delay: 300, pct: 25, status: 'EXTRACTING_FRAMES' as const, phase: 'Extracting 30 FPS High-Resolution Video Frames...' },
    { delay: 600, pct: 55, status: 'TRACKING_SKELETON' as const, phase: 'Running 17-Point COCO Pose Estimation & Object Bounding Box Tracking...' },
    { delay: 900, pct: 85, status: 'COMPUTING_BIOMECHANICS' as const, phase: 'Calculating Kinetic Chain Mechanics, Release Vectors & Tactical Error Corridors...' },
    { delay: 1200, pct: 100, status: 'COMPLETED' as const, phase: 'AI Analysis Complete! Synthesizing Performance Scores & Video Moments...' },
  ];

  for (const step of steps) {
    await new Promise(res => setTimeout(res, step.delay));
    job.progressPercentage = step.pct;
    job.status = step.status;
    job.currentPhase = step.phase;

    if (step.pct === 100) {
      job.completedAt = new Date().toISOString();
      job.result = generateDynamicAIAnalysis(
        job.matchId,
        job.sport,
        position,
        analysisFocus,
        fileName
      );
    }
  }
}

export function getBackendJobStatus(matchId: number): BackendAnalysisJob {
  if (activeJobs[matchId]) {
    return activeJobs[matchId];
  }

  return {
    jobId: `job_completed_${matchId}`,
    matchId,
    sport: 'Cricket',
    status: 'COMPLETED',
    progressPercentage: 100,
    currentPhase: 'AI Computer Vision Pipeline Completed',
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };
}
