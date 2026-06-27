import type { ContentPost } from './types';

function daysFromToday(offset: number, hour: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const mockContent: ContentPost[] = [
  {
    id: 'c1',
    title: 'New calendula batch is here',
    platform: 'Instagram',
    status: 'Ready',
    scheduledAt: daysFromToday(0, 17),
    isProduct: true,
    reminderOn: true,
  },
  {
    id: 'c2',
    title: 'Behind the scenes: making lavender balm',
    platform: 'TikTok',
    status: 'Scheduled',
    scheduledAt: daysFromToday(2, 12),
    isProduct: false,
    reminderOn: true,
  },
  {
    id: 'c3',
    title: 'Monthly newsletter — wholesale partners',
    platform: 'Email',
    status: 'Draft',
    scheduledAt: daysFromToday(4, 9),
    isProduct: false,
    reminderOn: false,
  },
  {
    id: 'c4',
    title: 'Client testimonial reel',
    platform: 'Instagram',
    status: 'Idea',
    scheduledAt: daysFromToday(8, 17),
    isProduct: false,
    reminderOn: false,
  },
  {
    id: 'c5',
    title: 'Holiday gift box reveal',
    platform: 'Instagram',
    status: 'Idea',
    scheduledAt: daysFromToday(10, 17),
    isProduct: true,
    reminderOn: false,
  },
];
