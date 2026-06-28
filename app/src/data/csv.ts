import type { Contact, ContactCategory, ContactStatus } from './types';

const CATEGORY_VALUES: ContactCategory[] = ['wholesale', 'clinical', 'partnership', 'press'];
const STATUS_VALUES: ContactStatus[] = [
  'Awaiting Outreach',
  'In Progress',
  'Follow-up Due',
  'Follow-up Sent',
  'Awaiting Response',
  'Response Received',
  'Active Partner',
];

export const CSV_COLUMNS = [
  'Name',
  'Email',
  'Organization',
  'Category',
  'Phone',
  'Next Follow-up Date',
  'Status',
  'Notes',
] as const;

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    if (inQuotes) {
      if (char === '"') {
        if (normalized[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function contactsToCsv(contacts: Contact[]): string {
  const header = CSV_COLUMNS.join(',');
  const lines = contacts.map((c) =>
    [
      c.name,
      c.email,
      c.organization,
      categoryDisplay(c.category),
      c.phone,
      c.nextFollowup,
      c.status ?? '',
      c.notes,
    ]
      .map((v) => csvEscape(v ?? ''))
      .join(','),
  );
  return [header, ...lines].join('\n');
}

function categoryDisplay(category: ContactCategory): string {
  if (category === 'press') return 'Press/PR';
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function daysFromToday(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

export interface ImportResult {
  contacts: Contact[];
  skipped: number;
  defaultedCategory: number;
  defaultedDate: number;
}

export function csvToContacts(text: string): ImportResult {
  const rows = parseCsv(text);
  if (rows.length === 0) {
    return { contacts: [], skipped: 0, defaultedCategory: 0, defaultedDate: 0 };
  }
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name.toLowerCase());

  const nameIdx = idx('Name');
  const emailIdx = idx('Email');
  const orgIdx = idx('Organization');
  const categoryIdx = idx('Category');
  const phoneIdx = idx('Phone');
  const dateIdx = idx('Next Follow-up Date');
  const statusIdx = idx('Status');
  const notesIdx = idx('Notes');

  const contacts: Contact[] = [];
  let skipped = 0;
  let defaultedCategory = 0;
  let defaultedDate = 0;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const name = (nameIdx >= 0 ? cells[nameIdx] : '')?.trim();
    const email = (emailIdx >= 0 ? cells[emailIdx] : '')?.trim();
    if (!name) {
      skipped++;
      continue;
    }

    const rawCategory = (categoryIdx >= 0 ? cells[categoryIdx] : '')?.trim().toLowerCase();
    const normalizedCategory = rawCategory === 'press/pr' ? 'press' : rawCategory;
    let category: ContactCategory = 'wholesale';
    if (normalizedCategory && (CATEGORY_VALUES as string[]).includes(normalizedCategory)) {
      category = normalizedCategory as ContactCategory;
    } else {
      defaultedCategory++;
    }

    const rawDate = (dateIdx >= 0 ? cells[dateIdx] : '')?.trim();
    let nextFollowup = rawDate;
    if (!rawDate || Number.isNaN(new Date(rawDate).getTime())) {
      nextFollowup = daysFromToday(7);
      defaultedDate++;
    }

    const rawStatus = (statusIdx >= 0 ? cells[statusIdx] : '')?.trim();
    const status = (STATUS_VALUES as string[]).includes(rawStatus) ? (rawStatus as ContactStatus) : null;

    const today = daysFromToday(0);
    contacts.push({
      id: `imported-${Date.now()}-${i}`,
      name,
      email,
      organization: orgIdx >= 0 ? cells[orgIdx]?.trim() ?? '' : '',
      category,
      phone: phoneIdx >= 0 ? cells[phoneIdx]?.trim() ?? '' : '',
      firstContact: today,
      lastContact: today,
      nextFollowup,
      status,
      notes: notesIdx >= 0 ? cells[notesIdx]?.trim() ?? '' : '',
      history: [],
      topic: 'follow-up',
      followBody: '',
      followShort: '',
    });
  }

  return { contacts, skipped, defaultedCategory, defaultedDate };
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function templateCsv(): string {
  const header = CSV_COLUMNS.join(',');
  const example = [
    'Jamie Rivera',
    'jamie@example.com',
    'Example Boutique',
    'Wholesale',
    '555-010-1234',
    daysFromToday(7),
    '',
    'Met at the spring market, interested in a starter wholesale order.',
  ]
    .map(csvEscape)
    .join(',');
  return [header, example].join('\n');
}
