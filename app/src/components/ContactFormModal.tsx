import { useState } from 'react';
import type { Contact, ContactCategory, ContactStatus } from '../data/types';
import { categoryLabel } from '../data/category';

const STATUS_OPTIONS: ContactStatus[] = [
  'Awaiting Outreach',
  'In Progress',
  'Follow-up Due',
  'Follow-up Sent',
  'Awaiting Response',
  'Response Received',
  'Active Partner',
];

export interface ContactFormValues {
  name: string;
  organization: string;
  category: ContactCategory;
  email: string;
  phone: string;
  nextFollowup: string;
  status: ContactStatus | null;
  notes: string;
}

interface ContactFormModalProps {
  initial?: Contact;
  onSave: (values: ContactFormValues) => void;
  onDelete?: () => void;
  onClose: () => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ContactFormModal({ initial, onSave, onDelete, onClose }: ContactFormModalProps) {
  const [values, setValues] = useState<ContactFormValues>({
    name: initial?.name ?? '',
    organization: initial?.organization ?? '',
    category: initial?.category ?? 'wholesale',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    nextFollowup: initial?.nextFollowup ?? todayIso(),
    status: initial?.status ?? null,
    notes: initial?.notes ?? '',
  });
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim()) {
      setError('Name is required.');
      return;
    }
    onSave(values);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid rgba(40,50,40,0.15)',
    borderRadius: 10,
    padding: '10px 12px',
    fontSize: 14,
    background: '#fff',
    color: 'var(--color-body-text)',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--color-muted-label)',
    marginBottom: 5,
    display: 'block',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(40,50,40,0.4)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          maxHeight: '88vh',
          overflowY: 'auto',
          background: 'var(--color-cream-bg)',
          borderRadius: '18px 18px 0 0',
          padding: '20px 22px calc(20px + env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 22,
            color: 'var(--color-green-deep)',
          }}
        >
          {initial ? 'Edit contact' : 'Add contact'}
        </h2>

        {error && <p style={{ color: 'var(--urgency-overdue)', fontSize: 13, margin: 0 }}>{error}</p>}

        <div>
          <label style={labelStyle}>Name *</label>
          <input
            style={inputStyle}
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            type="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>Organization</label>
          <input
            style={inputStyle}
            value={values.organization}
            onChange={(e) => setValues((v) => ({ ...v, organization: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select
            style={inputStyle}
            value={values.category}
            onChange={(e) => setValues((v) => ({ ...v, category: e.target.value as ContactCategory }))}
          >
            {(Object.keys(categoryLabel) as ContactCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabel[cat]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Phone</label>
          <input
            style={inputStyle}
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>Next follow-up date</label>
          <input
            style={inputStyle}
            type="date"
            value={values.nextFollowup}
            onChange={(e) => setValues((v) => ({ ...v, nextFollowup: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={inputStyle}
            value={values.status ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, status: (e.target.value || null) as ContactStatus | null }))}
          >
            <option value="">—</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Notes</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
            value={values.notes}
            onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              border: '1px solid rgba(40,50,40,0.15)',
              background: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '12px',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-body-text)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              border: 'none',
              background: 'var(--color-brand-green)',
              color: 'var(--color-on-green-text)',
              borderRadius: 'var(--radius-pill)',
              padding: '12px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>

        {onDelete && (
          <div style={{ marginTop: 4 }}>
            {confirmingDelete ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  style={{
                    flex: 1,
                    border: '1px solid rgba(40,50,40,0.15)',
                    background: 'none',
                    borderRadius: 'var(--radius-pill)',
                    padding: '10px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-body-text)',
                    cursor: 'pointer',
                  }}
                >
                  Keep contact
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'var(--urgency-overdue)',
                    color: '#fff',
                    borderRadius: 'var(--radius-pill)',
                    padding: '10px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Confirm delete
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'none',
                  color: 'var(--urgency-overdue)',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '8px',
                  cursor: 'pointer',
                }}
              >
                Delete contact
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
