import type { WeekTask } from './types';

function daysFromToday(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export const mockTasks: WeekTask[] = [
  { id: 't1', date: daysFromToday(0), label: 'Follow up with Dr. Priya Anand', category: 'Follow-up', contactId: 'riverside-clinic', done: false },
  { id: 't2', date: daysFromToday(0), label: 'Post Instagram reel — new calendula batch', category: 'Content', done: false },
  { id: 't3', date: daysFromToday(1), label: 'Confirm Morgan Tate appointment', category: 'Massage', contactId: 'morgan-t', done: false },
  { id: 't4', date: daysFromToday(1), label: 'Reconcile this week\'s invoices', category: 'Finance', done: false },
  { id: 't5', date: daysFromToday(2), label: 'Follow up with Alex Romero re: contract', category: 'Follow-up', contactId: 'cedar-clinic', done: false },
  { id: 't6', date: daysFromToday(3), label: 'Pop-up market — Saturday booth setup', category: 'Event', done: false },
  { id: 't7', date: daysFromToday(3), label: 'Draft next week\'s email newsletter', category: 'Content', done: false },
  { id: 't8', date: daysFromToday(-1), label: 'Send wholesale samples to Bloom Apothecary', category: 'Follow-up', contactId: 'bloom-apothecary', done: true },
];
