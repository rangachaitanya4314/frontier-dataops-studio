import type { Project, Dataset, ActivityItem, DashboardStats } from '../types';

/* ── Mock Projects ────────────────────────────────────────── */

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Autonomous Driving v3',
    description: 'Street scene object detection dataset for self-driving vehicle perception pipeline. Includes pedestrians, vehicles, traffic signs, and lane markings.',
    status: 'active',
    annotationType: 'bounding_box',
    classLabels: ['car', 'pedestrian', 'cyclist', 'traffic_sign', 'traffic_light', 'lane_marking'],
    tags: ['autonomous-driving', 'object-detection', 'production'],
    datasetCount: 4,
    totalItems: 24500,
    annotatedItems: 18200,
    reviewedItems: 15800,
    createdAt: '2026-06-15T10:00:00Z',
    updatedAt: '2026-08-08T14:30:00Z',
  },
  {
    id: 'proj-2',
    name: 'Medical Imaging — Chest X-Ray',
    description: 'Classification of chest X-ray images for detecting pneumonia, COVID-19, and other pulmonary conditions.',
    status: 'active',
    annotationType: 'classification',
    classLabels: ['normal', 'pneumonia', 'covid-19', 'tuberculosis', 'other'],
    tags: ['medical', 'classification', 'radiology'],
    datasetCount: 2,
    totalItems: 8400,
    annotatedItems: 6100,
    reviewedItems: 5200,
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-08-07T11:45:00Z',
  },
  {
    id: 'proj-3',
    name: 'Satellite Land Use Mapping',
    description: 'Semantic segmentation of satellite imagery for land use classification across urban, agricultural, and natural regions.',
    status: 'draft',
    annotationType: 'segmentation',
    classLabels: ['urban', 'agriculture', 'forest', 'water', 'barren', 'wetland'],
    tags: ['satellite', 'segmentation', 'geo'],
    datasetCount: 1,
    totalItems: 3200,
    annotatedItems: 450,
    reviewedItems: 0,
    createdAt: '2026-07-20T15:00:00Z',
    updatedAt: '2026-08-05T09:20:00Z',
  },
  {
    id: 'proj-4',
    name: 'Customer Support NER',
    description: 'Named entity recognition for extracting product names, order IDs, dates, and issue categories from customer support tickets.',
    status: 'completed',
    annotationType: 'ner',
    classLabels: ['product', 'order_id', 'date', 'issue_category', 'person_name'],
    tags: ['nlp', 'ner', 'customer-support'],
    datasetCount: 3,
    totalItems: 12000,
    annotatedItems: 12000,
    reviewedItems: 11800,
    createdAt: '2026-04-10T08:00:00Z',
    updatedAt: '2026-07-25T16:00:00Z',
  },
  {
    id: 'proj-5',
    name: 'Retail Product Detection',
    description: 'Object detection for retail shelf monitoring — identifying products, price tags, and empty shelf spaces.',
    status: 'archived',
    annotationType: 'bounding_box',
    classLabels: ['product', 'price_tag', 'empty_space', 'shelf_divider'],
    tags: ['retail', 'object-detection'],
    datasetCount: 2,
    totalItems: 5600,
    annotatedItems: 5600,
    reviewedItems: 5600,
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-05-30T10:00:00Z',
  },
];

/* ── Mock Datasets ────────────────────────────────────────── */

export const mockDatasets: Dataset[] = [
  { id: 'ds-1', projectId: 'proj-1', name: 'highway_batch_01.zip', status: 'ready', fileCount: 5200, totalSizeBytes: 3_200_000_000, format: 'images/png', createdAt: '2026-06-20T10:00:00Z' },
  { id: 'ds-2', projectId: 'proj-1', name: 'urban_scenes_v2.zip', status: 'ready', fileCount: 8400, totalSizeBytes: 5_100_000_000, format: 'images/jpg', createdAt: '2026-07-05T14:00:00Z' },
  { id: 'ds-3', projectId: 'proj-1', name: 'night_driving.zip', status: 'processing', fileCount: 6200, totalSizeBytes: 4_000_000_000, format: 'images/png', createdAt: '2026-08-01T09:00:00Z' },
  { id: 'ds-4', projectId: 'proj-1', name: 'rain_conditions.zip', status: 'ready', fileCount: 4700, totalSizeBytes: 2_800_000_000, format: 'images/png', createdAt: '2026-08-03T11:00:00Z' },
  { id: 'ds-5', projectId: 'proj-2', name: 'chest_xray_train.csv', status: 'ready', fileCount: 5600, totalSizeBytes: 850_000_000, format: 'csv', createdAt: '2026-07-02T10:00:00Z' },
  { id: 'ds-6', projectId: 'proj-2', name: 'chest_xray_val.csv', status: 'ready', fileCount: 2800, totalSizeBytes: 420_000_000, format: 'csv', createdAt: '2026-07-02T10:30:00Z' },
  { id: 'ds-7', projectId: 'proj-3', name: 'sentinel2_tiles.zip', status: 'ready', fileCount: 3200, totalSizeBytes: 7_500_000_000, format: 'images/tiff', createdAt: '2026-07-21T08:00:00Z' },
  { id: 'ds-8', projectId: 'proj-4', name: 'support_tickets_q1.json', status: 'ready', fileCount: 4000, totalSizeBytes: 12_000_000, format: 'json', createdAt: '2026-04-12T09:00:00Z' },
  { id: 'ds-9', projectId: 'proj-4', name: 'support_tickets_q2.json', status: 'ready', fileCount: 4500, totalSizeBytes: 14_000_000, format: 'json', createdAt: '2026-06-15T09:00:00Z' },
  { id: 'ds-10', projectId: 'proj-4', name: 'support_tickets_q3.json', status: 'ready', fileCount: 3500, totalSizeBytes: 10_500_000, format: 'json', createdAt: '2026-08-01T09:00:00Z' },
];

/* ── Mock Activity ────────────────────────────────────────── */

export const mockActivity: ActivityItem[] = [
  { id: 'act-1', type: 'dataset_uploaded', message: 'rain_conditions.zip uploaded to Autonomous Driving v3', timestamp: '2026-08-08T14:30:00Z', projectId: 'proj-1' },
  { id: 'act-2', type: 'annotations_completed', message: '500 annotations completed on Medical Imaging — Chest X-Ray', timestamp: '2026-08-07T11:45:00Z', projectId: 'proj-2' },
  { id: 'act-3', type: 'review_submitted', message: 'Review batch submitted for Autonomous Driving v3 (200 items)', timestamp: '2026-08-06T16:20:00Z', projectId: 'proj-1' },
  { id: 'act-4', type: 'project_created', message: 'Satellite Land Use Mapping project created', timestamp: '2026-08-05T09:20:00Z', projectId: 'proj-3' },
  { id: 'act-5', type: 'annotations_completed', message: '1,200 annotations completed on Customer Support NER', timestamp: '2026-08-04T10:00:00Z', projectId: 'proj-4' },
  { id: 'act-6', type: 'dataset_uploaded', message: 'support_tickets_q3.json uploaded to Customer Support NER', timestamp: '2026-08-01T09:00:00Z', projectId: 'proj-4' },
];

/* ── Dashboard Stats ──────────────────────────────────────── */

export const mockDashboardStats: DashboardStats = {
  totalProjects: mockProjects.length,
  totalDatasets: mockDatasets.length,
  annotationsCompleted: mockProjects.reduce((sum, p) => sum + p.annotatedItems, 0),
  activeReviews: 3,
};
