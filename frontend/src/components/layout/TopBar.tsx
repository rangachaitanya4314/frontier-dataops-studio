import { Menu, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
}

export function TopBar({ onMenuClick, title }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 h-14 bg-surface-0/80 backdrop-blur-md border-b border-border-subtle">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-text-muted hover:bg-surface-2 md:hidden cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {title && <h1 className="text-lg font-semibold text-text-primary hidden md:block">{title}</h1>}

      {/* Search (visual only) */}
      <div className="flex-1 max-w-md ml-auto md:ml-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects, datasets..."
            className="w-full pl-10 pr-4 py-1.5 bg-surface-1 border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
          RC
        </div>
      </div>
    </header>
  );
}
