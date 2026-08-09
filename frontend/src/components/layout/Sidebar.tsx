import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Upload,
  PanelLeftClose,
  PanelLeft,
  Database,
  X,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/datasets/upload', icon: Upload, label: 'Upload' },
];

export function Sidebar({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-accent-subtle text-accent'
        : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
    }`;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border-subtle">
        <div className="p-1.5 bg-accent rounded-lg shrink-0">
          <Database className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold text-text-primary whitespace-nowrap">
            Frontier <span className="text-accent">DataOps</span>
          </span>
        )}

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="ml-auto p-1 rounded hover:bg-surface-2 md:hidden cursor-pointer"
        >
          <X className="w-5 h-5 text-text-muted" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={linkClass}
            onClick={onCloseMobile}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden md:block px-3 py-4 border-t border-border-subtle">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-muted hover:bg-surface-2 hover:text-text-primary transition-colors w-full cursor-pointer"
        >
          {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-surface-1 border-r border-border-subtle h-screen sticky top-0 transition-all duration-300 ${
          collapsed ? 'w-[68px]' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} />
          <aside className="relative flex flex-col w-64 h-full bg-surface-1 border-r border-border-subtle z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
