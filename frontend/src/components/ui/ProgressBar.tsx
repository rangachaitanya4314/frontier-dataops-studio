interface ProgressBarProps {
  value: number;       // 0-100
  className?: string;
  size?: 'sm' | 'md';
  color?: 'accent' | 'success' | 'warning' | 'error';
}

const colors = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
};

export function ProgressBar({ value, className = '', size = 'md', color = 'accent' }: ProgressBarProps) {
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div className={`w-full ${h} bg-surface-3 rounded-full overflow-hidden ${className}`}>
      <div
        className={`${h} ${colors[color]} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
