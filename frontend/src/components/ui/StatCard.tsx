import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className = '' }: StatCardProps) {
  let TrendIcon: LucideIcon = Minus;
  let trendColor = 'text-text-muted';
  if (trend) {
    if (trend.value > 0) { TrendIcon = TrendingUp; trendColor = 'text-success'; }
    else if (trend.value < 0) { TrendIcon = TrendingDown; trendColor = 'text-error'; }
  }

  return (
    <div className={`bg-surface-1 border border-border-subtle rounded-xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-muted">{label}</span>
        <div className="p-2 bg-accent-subtle rounded-lg">
          <Icon className="w-4 h-4 text-accent" />
        </div>
      </div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span>{trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}</span>
        </div>
      )}
    </div>
  );
}
