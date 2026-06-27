import type { Urgency } from './types';

export function getUrgency(nextFollowup: string, today = new Date()): Urgency {
  const due = new Date(nextFollowup);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((due.getTime() - startOfToday.getTime()) / 86400000);

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 3) return 'soon';
  return 'none';
}

export function urgencyLabel(urgency: Urgency, nextFollowup: string, today = new Date()): string {
  const due = new Date(nextFollowup);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((due.getTime() - startOfToday.getTime()) / 86400000);

  if (urgency === 'overdue') return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
  if (urgency === 'today') return 'Due today';
  if (urgency === 'soon') return diffDays === 1 ? 'Due tomorrow' : `Due in ${diffDays} days`;
  return due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function urgencyColor(urgency: Urgency): string {
  switch (urgency) {
    case 'overdue':
      return 'var(--urgency-overdue)';
    case 'today':
      return 'var(--urgency-today)';
    default:
      return 'var(--urgency-soon)';
  }
}
