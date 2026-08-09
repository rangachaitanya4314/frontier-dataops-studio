import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Tabs } from '../components/ui/Tabs';
import { getProject, getDatasets } from '../lib/api';
import { formatNumber, formatDate, formatBytes } from '../lib/utils';
import type { Project, Dataset, ProjectStatus } from '../types';

const statusBadge: Record<ProjectStatus, 'success' | 'warning' | 'info' | 'default'> = {
  active: 'success',
  draft: 'warning',
  completed: 'info',
  archived: 'default',
};

const datasetStatusBadge: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  ready: 'success',
  processing: 'info',
  error: 'error',
  uploading: 'warning',
};

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  useEffect(() => {
    if (!id) return;
    getProject(id).then((p) => {
      if (!p) navigate('/projects');
      else setProject(p);
    });
    getDatasets(id).then(setDatasets);
  }, [id, navigate]);

  if (!project) return null;

  const progress = project.totalItems > 0
    ? Math.round((project.annotatedItems / project.totalItems) * 100)
    : 0;

  const reviewProgress = project.totalItems > 0
    ? Math.round((project.reviewedItems / project.totalItems) * 100)
    : 0;

  const overviewTab = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Stats */}
      <Card>
        <CardBody className="space-y-4">
          <h3 className="font-semibold text-text-primary">Project Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-muted">Total Items</p>
              <p className="text-lg font-bold text-text-primary">{formatNumber(project.totalItems)}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Datasets</p>
              <p className="text-lg font-bold text-text-primary">{project.datasetCount}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Annotated</p>
              <p className="text-lg font-bold text-text-primary">{formatNumber(project.annotatedItems)}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Reviewed</p>
              <p className="text-lg font-bold text-text-primary">{formatNumber(project.reviewedItems)}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Progress */}
      <Card>
        <CardBody className="space-y-4">
          <h3 className="font-semibold text-text-primary">Progress</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Annotation</span>
                <span className="text-text-primary font-medium">{progress}%</span>
              </div>
              <ProgressBar value={progress} color="accent" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Review</span>
                <span className="text-text-primary font-medium">{reviewProgress}%</span>
              </div>
              <ProgressBar value={reviewProgress} color="success" />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Details */}
      <Card className="md:col-span-2">
        <CardBody className="space-y-3">
          <h3 className="font-semibold text-text-primary">Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-text-muted">Annotation Type</span>
              <p className="text-text-primary font-medium capitalize">{project.annotationType.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-text-muted">Created</span>
              <p className="text-text-primary font-medium">{formatDate(project.createdAt)}</p>
            </div>
            <div>
              <span className="text-text-muted">Last Updated</span>
              <p className="text-text-primary font-medium">{formatDate(project.updatedAt)}</p>
            </div>
            <div>
              <span className="text-text-muted">Class Labels</span>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {project.classLabels.map((l) => <Badge key={l} variant="info">{l}</Badge>)}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const datasetsTab = (
    <div className="space-y-3">
      {datasets.length === 0 ? (
        <p className="text-sm text-text-muted py-8 text-center">No datasets uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="py-2 px-3 text-text-muted font-medium">Name</th>
                <th className="py-2 px-3 text-text-muted font-medium">Status</th>
                <th className="py-2 px-3 text-text-muted font-medium">Files</th>
                <th className="py-2 px-3 text-text-muted font-medium">Size</th>
                <th className="py-2 px-3 text-text-muted font-medium">Format</th>
                <th className="py-2 px-3 text-text-muted font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((ds) => (
                <tr key={ds.id} className="border-b border-border-subtle hover:bg-surface-1 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-text-primary">{ds.name}</td>
                  <td className="py-2.5 px-3"><Badge variant={datasetStatusBadge[ds.status]}>{ds.status}</Badge></td>
                  <td className="py-2.5 px-3 text-text-secondary">{formatNumber(ds.fileCount)}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{formatBytes(ds.totalSizeBytes)}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{ds.format}</td>
                  <td className="py-2.5 px-3 text-text-muted">{formatDate(ds.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const annotationsTab = (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-surface-2 rounded-2xl mb-4">
        <CheckCircle2 className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">Annotation Canvas</h3>
      <p className="text-sm text-text-muted max-w-sm">
        The annotation interface will be available in a future release. For now, you can manage datasets and project settings.
      </p>
    </div>
  );

  const settingsTab = (
    <Card>
      <CardBody className="space-y-4">
        <h3 className="font-semibold text-text-primary">Project Settings</h3>
        <p className="text-sm text-text-muted">
          Project configuration editing will be available in a future release.
        </p>
      </CardBody>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-text-primary">{project.name}</h1>
            <Badge variant={statusBadge[project.status]}>{project.status}</Badge>
          </div>
          <p className="text-sm text-text-muted mt-1">{project.description}</p>
          {project.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {project.tags.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview', content: overviewTab },
          { id: 'datasets', label: `Datasets (${datasets.length})`, content: datasetsTab },
          { id: 'annotations', label: 'Annotations', content: annotationsTab },
          { id: 'settings', label: 'Settings', content: settingsTab },
        ]}
      />
    </div>
  );
}
