import { useMemo, useState } from 'react';
import { mockContacts } from '../data/mockContacts';
import { getUrgency, urgencyColor, urgencyLabel } from '../data/urgency';
import { Avatar } from '../components/Avatar';
import { categoryLabel } from '../data/category';
import type { ContactCategory } from '../data/types';

type FilterValue = 'all' | ContactCategory;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'wholesale', label: categoryLabel.wholesale },
  { value: 'clinical', label: categoryLabel.clinical },
  { value: 'partnership', label: categoryLabel.partnership },
  { value: 'massage', label: categoryLabel.massage },
];

const urgencyRank = { overdue: 0, today: 1, soon: 2, none: 3 } as const;

export function ContactsScreen() {
  const today = useMemo(() => new Date(), []);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');

  const contacts = useMemo(() => {
    return mockContacts
      .filter((c) => filter === 'all' || c.category === filter)
      .filter((c) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return c.name.toLowerCase().includes(q) || c.organization.toLowerCase().includes(q);
      })
      .map((c) => ({ contact: c, urgency: getUrgency(c.nextFollowup, today) }))
      .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency]);
  }, [filter, search, today]);

  return (
    <div style={{ padding: '20px var(--space-screen-x) 28px' }}>
      <h1
        style={{
          margin: '0 0 16px',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 28,
          color: 'var(--color-green-deep)',
        }}
      >
        Contacts
      </h1>

      <input
        type="text"
        placeholder="Search contacts"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          padding: '12px 14px',
          fontSize: 14,
          background: 'var(--color-card-surface)',
          boxShadow: 'var(--shadow-card)',
          marginBottom: 16,
          color: 'var(--color-body-text)',
        }}
      />

      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          marginBottom: 18,
          paddingBottom: 2,
        }}
      >
        {FILTERS.map((f) => {
          const isActive = f.value === filter;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                flexShrink: 0,
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                background: isActive ? 'var(--color-brand-green)' : 'var(--color-card-surface)',
                color: isActive ? 'var(--color-on-green-text)' : 'var(--color-muted-label)',
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          background: 'var(--color-card-surface)',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
        }}
      >
        {contacts.length === 0 && (
          <p style={{ padding: 20, fontSize: 13.5, color: 'var(--color-body-subtext)', textAlign: 'center' }}>
            No contacts match.
          </p>
        )}
        {contacts.map(({ contact, urgency }, i) => (
          <div
            key={contact.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '13px 14px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(40,50,40,0.06)',
            }}
          >
            <Avatar name={contact.name} category={contact.category} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-green-deep)' }}>{contact.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--color-body-subtext)' }}>
                {contact.organization} · {categoryLabel[contact.category]}
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: urgencyColor(urgency), whiteSpace: 'nowrap' }}>
              {urgencyLabel(urgency, contact.nextFollowup, today)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
