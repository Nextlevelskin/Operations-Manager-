import { useMemo, useState } from 'react';
import { mockTasks } from '../data/mockTasks';
import type { TaskCategory, WeekTask } from '../data/types';

const categoryChipStyle: Record<TaskCategory, { bg: string; text: string }> = {
  'Follow-up': { bg: 'var(--cat-clinical-bg)', text: 'var(--cat-clinical-text)' },
  Content: { bg: 'var(--cat-partnership-bg)', text: 'var(--cat-partnership-text)' },
  Massage: { bg: 'var(--cat-massage-bg)', text: 'var(--cat-massage-text)' },
  Finance: { bg: 'var(--cat-wholesale-bg)', text: 'var(--cat-wholesale-text)' },
  Event: { bg: '#ECE7DA', text: '#8A8576' },
};

function dayKey(date: string): string {
  return date;
}

function dayLabel(date: string, today: Date): string {
  const d = new Date(date);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.round((d.getTime() - startOfToday.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

export function WeekScreen() {
  const today = useMemo(() => new Date(), []);
  const [doneOverrides, setDoneOverrides] = useState<Record<string, boolean>>({});

  const tasks: WeekTask[] = mockTasks.map((t) => ({
    ...t,
    done: doneOverrides[t.id] ?? t.done,
  }));

  const grouped = useMemo(() => {
    const groups = new Map<string, WeekTask[]>();
    const sorted = [...tasks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (const task of sorted) {
      const key = dayKey(task.date);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(task);
    }
    return Array.from(groups.entries());
  }, [tasks]);

  function toggleDone(id: string) {
    setDoneOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? tasks.find((t) => t.id === id)?.done) }));
  }

  return (
    <div style={{ padding: '20px var(--space-screen-x) 28px' }}>
      <h1
        style={{
          margin: '0 0 2px',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 28,
          color: 'var(--color-green-deep)',
        }}
      >
        This week
      </h1>
      <p
        style={{
          margin: '0 0 22px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          color: 'var(--color-faint-label)',
        }}
      >
        {today.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} —{' '}
        {new Date(today.getTime() + 6 * 86400000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </p>

      {grouped.map(([date, dayTasks]) => (
        <section key={date} style={{ marginBottom: 'var(--space-section-gap)' }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--color-green-deep)',
              margin: '0 0 10px',
            }}
          >
            {dayLabel(date, today)}
          </p>
          <div
            style={{
              background: 'var(--color-card-surface)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
            }}
          >
            {dayTasks.map((task, i) => {
              const chip = categoryChipStyle[task.category];
              return (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '13px 14px',
                    borderTop: i === 0 ? 'none' : '1px solid rgba(40,50,40,0.06)',
                  }}
                >
                  <button
                    aria-label={task.done ? 'Mark as not done' : 'Mark as done'}
                    onClick={() => toggleDone(task.id)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: task.done ? 'none' : '2px solid var(--color-placeholder)',
                      background: task.done ? 'var(--color-brand-green)' : 'transparent',
                      color: 'var(--color-on-green-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      cursor: 'pointer',
                      flexShrink: 0,
                      padding: 0,
                    }}
                  >
                    {task.done ? '✓' : ''}
                  </button>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: task.done ? 'var(--color-placeholder)' : 'var(--color-body-text)',
                      textDecoration: task.done ? 'line-through' : 'none',
                    }}
                  >
                    {task.label}
                  </span>
                  <span
                    style={{
                      background: chip.bg,
                      color: chip.text,
                      borderRadius: 'var(--radius-chip)',
                      padding: '4px 9px',
                      fontSize: 11.5,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {task.category}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
