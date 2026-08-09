import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileIcon, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { DropZone } from '../components/ui/DropZone';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Select } from '../components/ui/FormControls';
import { Badge } from '../components/ui/Badge';
import { getProjects, uploadDatasetFiles } from '../lib/api';
import { formatBytes, uid } from '../lib/utils';
import type { Project, UploadingFile } from '../types';

export function DatasetUploadPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getProjects().then((p) => {
      setProjects(p);
      if (p.length > 0) setSelectedProject(p[0].id);
    });
  }, []);

  const handleFiles = useCallback((newFiles: File[]) => {
    const entries: UploadingFile[] = newFiles.map((file) => ({
      id: uid(),
      file,
      progress: 0,
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...entries]);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const startUpload = async () => {
    if (!selectedProject || files.length === 0) return;
    setUploading(true);

    // Mark all pending as uploading
    setFiles((prev) => prev.map((f) => f.status === 'pending' ? { ...f, status: 'uploading' } : f));

    const pending = files.filter((f) => f.status === 'pending' || f.status === 'uploading');

    await uploadDatasetFiles(
      selectedProject,
      pending,
      (fileId, progress) => {
        setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, progress, status: 'uploading' } : f));
      },
      (fileId) => {
        setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, progress: 100, status: 'complete' } : f));
      },
      (fileId, _error) => {
        setFiles((prev) => prev.map((f) => f.id === fileId ? { ...f, status: 'error' } : f));
      },
    );

    setUploading(false);
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const completedCount = files.filter((f) => f.status === 'complete').length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Upload Dataset</h1>
          <p className="text-sm text-text-muted mt-0.5">Add files to a project</p>
        </div>
      </div>

      {/* Project selector */}
      <Card>
        <CardBody>
          <Select
            label="Target Project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </CardBody>
      </Card>

      {/* Drop zone */}
      <DropZone onFiles={handleFiles} accept="image/*,.csv,.json,.zip" />

      {/* File list */}
      {files.length > 0 && (
        <Card>
          <CardBody className="space-y-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary text-sm">
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </h3>
              {completedCount > 0 && (
                <Badge variant="success">{completedCount} uploaded</Badge>
              )}
            </div>

            {files.map((f) => (
              <div key={f.id} className="flex items-center gap-3 py-2 border-b border-border-subtle last:border-0">
                <FileIcon className="w-4 h-4 text-text-muted shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-primary truncate">{f.file.name}</p>
                    <span className="text-xs text-text-muted shrink-0 ml-2">{formatBytes(f.file.size)}</span>
                  </div>
                  {f.status === 'uploading' && (
                    <ProgressBar value={f.progress} size="sm" className="mt-1.5" />
                  )}
                </div>
                <div className="shrink-0">
                  {f.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-success" />}
                  {f.status === 'error' && <AlertCircle className="w-4 h-4 text-error" />}
                  {(f.status === 'pending') && (
                    <button onClick={() => removeFile(f.id)} className="p-1 hover:bg-surface-2 rounded cursor-pointer">
                      <Trash2 className="w-4 h-4 text-text-muted" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Upload button */}
      {files.length > 0 && pendingCount > 0 && (
        <div className="flex justify-end">
          <Button onClick={startUpload} disabled={uploading || !selectedProject}>
            {uploading ? 'Uploading...' : `Upload ${pendingCount} File${pendingCount !== 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
}
