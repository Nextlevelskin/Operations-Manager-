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
