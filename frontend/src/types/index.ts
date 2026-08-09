/* ── Types ─────────────────────────────────────────────────── */

export type ProjectStatus = 'active' | 'draft' | 'completed' | 'archived';
export type AnnotationType = 'bounding_box' | 'classification' | 'segmentation' | 'ner';
export type DatasetStatus = 'ready' | 'processing' | 'error' | 'uploading';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  annotationType: AnnotationType;
  classLabels: string[];
  tags: string[];
  datasetCount: number;
  totalItems: number;
  annotatedItems: number;
  reviewedItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface Dataset {
  id: string;
  projectId: string;
  name: string;
  status: DatasetStatus;
  fileCount: number;
  totalSizeBytes: number;
  format: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'project_created' | 'dataset_uploaded' | 'annotations_completed' | 'review_submitted';
  message: string;
  timestamp: string;
  projectId?: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalDatasets: number;
  annotationsCompleted: number;
  activeReviews: number;
}

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
}

export interface CreateProjectInput {
  name: string;
  description: string;
  tags: string[];
  annotationType: AnnotationType;
  classLabels: string[];
}
