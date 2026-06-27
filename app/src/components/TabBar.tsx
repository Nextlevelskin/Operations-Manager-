export type Tab = 'today' | 'week' | 'contacts' | 'content';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: '☀' },
  { id: 'week', label: 'Week', icon: '▦' },
  { id: 'contacts', label: 'Contacts', icon: '☰' },
  { id: 'content', label: 'Content', icon: '✎' },
];

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav
      style={{
        display: 'flex',
        background: 'var(--color-tabbar-bg)',
        borderTop: '1px solid rgba(40,50,40,0.08)',
        padding: '8px 8px calc(8px + env(safe-area-inset-bottom))',
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              padding: '6px 0',
              minHeight: 44,
              color: isActive ? 'var(--color-brand-green)' : 'var(--color-placeholder)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
