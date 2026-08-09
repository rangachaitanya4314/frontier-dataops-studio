import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Database,
  CheckCircle2,
  ClipboardCheck,
  Plus,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { getDashboardStats, getProjects, getRecentActivity } from '../lib/api';
import { formatNumber, timeAgo } from '../lib/utils';
import type { Project, ActivityItem, DashboardStats } from '../types';

const statusBadge: Record<string, 'success' | 'warning' | 'info' | 'default'> = {
  active: 'success',
  draft: 'warning',
  completed: 'info',
  archived: 'default',
};

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats);
    getProjects().then((p) => setProjects(p.slice(0, 4)));
    getRecentActivity().then(setActivity);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Overview of your DataOps workspace</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/datasets/upload')}>
            <Upload className="w-4 h-4" /> Upload
          </Button>
          <Button onClick={() => navigate('/projects/new')}>
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Projects" value={stats.totalProjects} icon={FolderKanban} trend={{ value: 12, label: 'this month' }} />
          <StatCard label="Total Datasets" value={stats.totalDatasets} icon={Database} trend={{ value: 8, label: 'this month' }} />
          <StatCard label="Annotations Done" value={formatNumber(stats.annotationsCompleted)} icon={CheckCircle2} trend={{ value: 24, label: 'this week' }} />
          <StatCard label="Active Reviews" value={stats.activeReviews} icon={ClipboardCheck} />
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Recent Projects</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => {
              const progress = project.totalItems > 0
                ? Math.round((project.annotatedItems / project.totalItems) * 100)
                : 0;
              return (
                <Card
                  key={project.id}
                  hover
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <CardBody>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-text-primary text-sm leading-tight">{project.name}</h3>
                      <Badge variant={statusBadge[project.status]}>{project.status}</Badge>
                    </div>
                    <p className="text-xs text-text-muted mb-3 line-clamp-2">{project.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-text-secondary">
                        <span>Annotation progress</span>
                        <span>{progress}%</span>
                      </div>
                      <ProgressBar value={progress} size="sm" />
                    </div>
                    <div className="flex gap-3 mt-3 text-xs text-text-muted">
                      <span>{project.datasetCount} datasets</span>
                      <span>{formatNumber(project.totalItems)} items</span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
          <Card>
            <CardBody className="divide-y divide-border-subtle">
              {activity.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-sm text-text-primary">{item.message}</p>
                  <p className="text-xs text-text-muted mt-1">{timeAgo(item.timestamp)}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
