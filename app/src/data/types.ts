export type ContactCategory = 'wholesale' | 'clinical' | 'partnership' | 'massage';

export type ContactStatus =
  | 'Called — left voicemail'
  | 'Responded — in progress'
  | 'Booked / confirmed'
  | 'Not a fit right now';

export interface HistoryEntry {
  date: string;
  note: string;
}

export interface Contact {
  id: string;
  name: string;
  organization: string;
  category: ContactCategory;
  email: string;
  phone: string;
  firstContact: string;
  lastContact: string;
  nextFollowup: string;
  status: ContactStatus | null;
  notes: string;
  history: HistoryEntry[];
  topic: string;
  followBody: string;
  followShort: string;
}

export type Urgency = 'overdue' | 'today' | 'soon' | 'none';

export type TaskCategory = 'Follow-up' | 'Content' | 'Massage' | 'Finance' | 'Event';

export interface WeekTask {
  id: string;
  date: string;
  label: string;
  category: TaskCategory;
  contactId?: string;
  done: boolean;
}

export type ContentPlatform = 'Instagram' | 'TikTok' | 'Email';
export type ContentStatus = 'Ready' | 'Scheduled' | 'Draft' | 'Idea';

export interface ContentPost {
  id: string;
  title: string;
  platform: ContentPlatform;
  status: ContentStatus;
  scheduledAt: string;
  isProduct: boolean;
  reminderOn: boolean;
}
