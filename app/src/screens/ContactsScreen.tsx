import { useMemo, useRef, useState } from 'react';
import { useContacts } from '../contexts/ContactsContext';
import { getUrgency, urgencyColor, urgencyLabel } from '../data/urgency';
import { Avatar } from '../components/Avatar';
import { categoryLabel } from '../data/category';
import type { Contact, ContactCategory } from '../data/types';
import { ContactFormModal, type ContactFormValues } from '../components/ContactFormModal';
import { contactsToCsv, csvToContacts, downloadCsv, templateCsv, type ImportResult } from '../data/csv';

type FilterValue = 'all' | ContactCategory;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'wholesale', label: categoryLabel.wholesale },
  { value: 'clinical', label: categoryLabel.clinical },
  { value: 'partnership', label: categoryLabel.partnership },
  { value: 'press', label: categoryLabel.press },
];

const urgencyRank = { overdue: 0, today: 1, soon: 2, none: 3 } as const;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ContactsScreen() {
  const { contacts: allContacts, addContact, updateContact, deleteContact, importContacts } = useContacts();
  const today = useMemo(() => new Date(), []);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | 'new' | null>(null);
  const [importSummary, setImportSummary] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contacts = useMemo(() => {
    return allContacts
      .filter((c) => filter === 'all' || c.category === filter)
      .filter((c) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return c.name.toLowerCase().includes(q) || c.organization.toLowerCase().includes(q);
      })
      .map((c) => ({ contact: c, urgency: getUrgency(c.nextFollowup, today) }))
      .sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency]);
  }, [allContacts, filter, search, today]);

  function handleSave(values: ContactFormValues) {
    if (editingContact && editingContact !== 'new') {
      updateContact(editingContact.id, values);
    } else {
      addContact({
        ...values,
        firstContact: todayIso(),
        lastContact: todayIso(),
        topic: 'follow-up',
        followBody: '',
        followShort: '',
      });
    }
    setEditingContact(null);
  }

  function handleDelete() {
    if (editingContact && editingContact !== 'new') {
      deleteContact(editingContact.id);
    }
    setEditingContact(null);
  }

  function handleExport() {
    downloadCsv('contacts.csv', contactsToCsv(allContacts));
  }

  function handleDownloadTemplate() {
    downloadCsv('contacts-template.csv', templateCsv());
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      const result = csvToContacts(text);
      importContacts(result.contacts);
      setImportSummary(result);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const buttonRowStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    padding: '8px 14px',
    fontSize: 12.5,
    fontWeight: 600,
    cursor: 'pointer',
    background: 'var(--color-card-surface)',
    color: 'var(--color-green-deep)',
    boxShadow: 'var(--shadow-card)',
    whiteSpace: 'nowrap',
  };

  return (
    <div style={{ padding: '20px var(--space-screen-x) 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 28,
            color: 'var(--color-green-deep)',
          }}
        >
          Contacts
        </h1>
        <button
          onClick={() => setEditingContact('new')}
          style={{
            border: 'none',
            background: 'var(--color-brand-green)',
            color: 'var(--color-on-green-text)',
            borderRadius: 'var(--radius-pill)',
            padding: '9px 16px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Add
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 14, paddingBottom: 2 }}>
        <button style={buttonRowStyle} onClick={handleExport}>
          Export CSV
        </button>
        <button style={buttonRowStyle} onClick={() => fileInputRef.current?.click()}>
          Import CSV
        </button>
        <button style={buttonRowStyle} onClick={handleDownloadTemplate}>
          Download template
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleImportFile}
          style={{ display: 'none' }}
        />
      </div>

      {importSummary && (
        <div
          style={{
            background: 'var(--color-soft-green-tint)',
            borderRadius: 'var(--radius-card)',
            padding: '12px 14px',
            fontSize: 13,
            color: 'var(--color-green-deep)',
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <div>
            Imported {importSummary.contacts.length} contact{importSummary.contacts.length === 1 ? '' : 's'}.
            {importSummary.skipped > 0 && ` Skipped ${importSummary.skipped} missing a name or email.`}
            {importSummary.defaultedCategory > 0 &&
              ` ${importSummary.defaultedCategory} given a default category.`}
            {importSummary.defaultedDate > 0 && ` ${importSummary.defaultedDate} given a default follow-up date.`}
          </div>
          <button
            onClick={() => setImportSummary(null)}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--color-green-deep)' }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

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
          <button
            key={contact.id}
            onClick={() => setEditingContact(contact)}
            style={{
              width: '100%',
              textAlign: 'left',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
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
          </button>
        ))}
      </div>

      {editingContact && (
        <ContactFormModal
          initial={editingContact === 'new' ? undefined : editingContact}
          onSave={handleSave}
          onDelete={editingContact !== 'new' ? handleDelete : undefined}
          onClose={() => setEditingContact(null)}
        />
      )}
    </div>
  );
}
