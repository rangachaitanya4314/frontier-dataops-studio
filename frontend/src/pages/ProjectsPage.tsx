import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List, Search } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { EmptyState } from '../components/ui/EmptyState';
import { getProjects } from '../lib/api';
import { formatNumber, formatDate } from '../lib/utils';
import type { Project, ProjectStatus } from '../types';

const statusBadge: Record<ProjectStatus, 'success' | 'warning' | 'info' | 'default'> = {
  active: 'success',
  draft: 'warning',
  completed: 'info',
  archived: 'default',
};

export function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const filtered = projects.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (filter && !p.name.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-sm text-text-muted mt-1">{projects.length} projects total</p>
        </div>
        <Button onClick={() => navigate('/projects/new')}>
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Filter projects..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-1 border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'draft', 'completed', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize cursor-pointer ${
                statusFilter === s
                  ? 'bg-accent text-white'
                  : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg cursor-pointer ${view === 'grid' ? 'bg-surface-2 text-accent' : 'text-text-muted hover:bg-surface-2'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg cursor-pointer ${view === 'list' ? 'bg-surface-2 text-accent' : 'text-text-muted hover:bg-surface-2'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={filter || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first project to get started'}
          action={!filter && statusFilter === 'all' ? { label: 'New Project', onClick: () => navigate('/projects/new') } : undefined}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const progress = project.totalItems > 0
              ? Math.round((project.annotatedItems / project.totalItems) * 100)
              : 0;
            return (
              <Card key={project.id} hover onClick={() => navigate(`/projects/${project.id}`)}>
                <CardBody>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-text-primary text-sm leading-tight pr-2">{project.name}</h3>
                    <Badge variant={statusBadge[project.status]}>{project.status}</Badge>
                  </div>
                  <p className="text-xs text-text-muted mb-3 line-clamp-2">{project.description}</p>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <ProgressBar value={progress} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{project.datasetCount} datasets · {formatNumber(project.totalItems)} items</span>
                    <span>{formatDate(project.updatedAt)}</span>
                  </div>
                  {project.tags.length > 0 && (
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="default">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((project) => {
            const progress = project.totalItems > 0
              ? Math.round((project.annotatedItems / project.totalItems) * 100)
              : 0;
            return (
              <Card
                key={project.id}
                hover
                onClick={() => navigate(`/projects/${project.id}`)}
                className="!rounded-lg"
              >
                <CardBody className="flex items-center gap-4 !py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text-primary text-sm truncate">{project.name}</h3>
                      <Badge variant={statusBadge[project.status]}>{project.status}</Badge>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{project.description}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-xs text-text-muted shrink-0">
                    <span className="w-20">{formatNumber(project.totalItems)} items</span>
                    <div className="w-32">
                      <ProgressBar value={progress} size="sm" />
                    </div>
                    <span className="w-24 text-right">{formatDate(project.updatedAt)}</span>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
