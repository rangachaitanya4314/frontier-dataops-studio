/**
 * API client stub.
 *
 * All data access flows through this module. Today every function returns
 * mock data from `./mockData`. When a FastAPI backend is added, replace the
 * implementations here with real `fetch()` calls — page components stay
 * untouched.
 */

import type { Project, Dataset, ActivityItem, DashboardStats, CreateProjectInput, UploadingFile } from '../types';
import { mockProjects, mockDatasets, mockActivity, mockDashboardStats } from './mockData';

// Simulate network latency
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

/* ── Projects ─────────────────────────────────────────────── */

export async function getProjects(): Promise<Project[]> {
  await delay();
  return [...mockProjects];
}

export async function getProject(id: string): Promise<Project | undefined> {
  await delay();
  return mockProjects.find((p) => p.id === id);
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  await delay(500);
  const project: Project = {
    id: `proj-${Date.now()}`,
    ...input,
    status: 'draft',
    datasetCount: 0,
    totalItems: 0,
    annotatedItems: 0,
    reviewedItems: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProjects.unshift(project);
  return project;
}

/* ── Datasets ─────────────────────────────────────────────── */

export async function getDatasets(projectId?: string): Promise<Dataset[]> {
  await delay();
  if (projectId) return mockDatasets.filter((d) => d.projectId === projectId);
  return [...mockDatasets];
}

/* ── Upload (isolated for future FastAPI replacement) ──────── */

/**
 * Simulates file upload with progress callbacks.
 *
 * Future: Replace with real FormData + fetch POST to `/api/datasets/upload`
 * and read progress from XMLHttpRequest or ReadableStream.
 */
export async function uploadDatasetFiles(
  _projectId: string,
  files: UploadingFile[],
  onProgress: (fileId: string, progress: number) => void,
  onComplete: (fileId: string) => void,
  onError: (fileId: string, error: string) => void,
): Promise<void> {
  for (const f of files) {
    try {
      // Simulate chunked upload progress
      for (let p = 0; p <= 100; p += 10 + Math.floor(Math.random() * 15)) {
        await delay(150 + Math.random() * 200);
        onProgress(f.id, Math.min(p, 100));
      }
      onProgress(f.id, 100);
      onComplete(f.id);
    } catch {
      onError(f.id, 'Upload failed (simulated)');
    }
  }
}

/* ── Dashboard ────────────────────────────────────────────── */

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();
  return { ...mockDashboardStats };
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  await delay();
  return [...mockActivity];
}
