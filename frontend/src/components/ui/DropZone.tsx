import { useCallback, useState, type DragEvent } from 'react';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  className?: string;
}

export function DropZone({ onFiles, accept, className = '' }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }, [onFiles]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    if (accept) input.accept = accept;
    input.onchange = () => {
      const files = Array.from(input.files || []);
      if (files.length) onFiles(files);
    };
    input.click();
  }, [onFiles, accept]);

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl
        cursor-pointer transition-colors
        ${dragging
          ? 'border-accent bg-accent-subtle'
          : 'border-border-default hover:border-accent/50 hover:bg-surface-1'
        } ${className}`}
    >
      <div className="p-3 bg-surface-2 rounded-xl mb-3">
        <Upload className="w-6 h-6 text-text-muted" />
      </div>
      <p className="text-sm font-medium text-text-primary mb-1">
        Drop files here or click to browse
      </p>
      <p className="text-xs text-text-muted">
        Supports images, CSV, and JSON files
      </p>
    </div>
  );
}
