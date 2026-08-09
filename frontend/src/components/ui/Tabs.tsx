import { useState, type ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);

  return (
    <div>
      <div className="flex border-b border-border-subtle gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative cursor-pointer
              ${active === tab.id
                ? 'text-accent'
                : 'text-text-muted hover:text-text-primary'
              }`}
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full" />
            )}
          </button>
        ))}
      </div>
      <div className="py-5">{current?.content}</div>
    </div>
  );
}
