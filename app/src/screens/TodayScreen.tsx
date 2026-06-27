import { useMemo } from 'react';
import { mockContacts } from '../data/mockContacts';
import { getUrgency, urgencyColor, urgencyLabel } from '../data/urgency';
import { Avatar } from '../components/Avatar';
import { CategoryChip } from '../components/CategoryChip';
import logo from '../assets/logo.png';
import productHero from '../assets/product-hero.png';

const founderFirstName = 'Melissa';

function formatEyebrowDate(date: Date) {
  return date
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase()
    .replace(',', ' ·');
}

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function TodayScreen() {
  const today = useMemo(() => new Date(), []);

  const { needsToday, comingUp } = useMemo(() => {
    const withUrgency = mockContacts.map((c) => ({ contact: c, urgency: getUrgency(c.nextFollowup, today) }));
    const needs = withUrgency
      .filter((c) => c.urgency === 'overdue' || c.urgency === 'today')
      .sort((a, b) => new Date(a.contact.nextFollowup).getTime() - new Date(b.contact.nextFollowup).getTime());
    const soon = withUrgency
      .filter((c) => c.urgency === 'soon')
      .sort((a, b) => new Date(a.contact.nextFollowup).getTime() - new Date(b.contact.nextFollowup).getTime());
    return { needsToday: needs, comingUp: soon };
  }, [today]);

  const tasksToday = 2;

  return (
    <div style={{ padding: '20px var(--space-screen-x) 28px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <img src={logo} alt="next level skincare" style={{ height: 21 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            aria-label="Settings"
            style={{
              border: 'none',
              background: 'none',
              fontSize: 18,
              color: 'var(--color-muted-label)',
              cursor: 'pointer',
              minWidth: 44,
              minHeight: 44,
            }}
          >
            ⚙
          </button>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--color-brand-green)',
              color: 'var(--color-on-green-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {founderFirstName[0]}
          </div>
        </div>
      </header>

      <p
        style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '1.4px',
          color: 'var(--color-faint-label)',
        }}
      >
        {formatEyebrowDate(today)}
      </p>

      <h1
        style={{
          margin: '6px 0 6px',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 30,
          color: 'var(--color-green-deep)',
        }}
      >
        {getGreeting(today)}, {founderFirstName}.
      </h1>

      <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--color-body-subtext)', lineHeight: 1.5 }}>
        {needsToday.length > 0
          ? `${needsToday.length} ${needsToday.length === 1 ? 'person is' : 'people are'} waiting to hear from you. Start at the top.`
          : "You're all caught up. Enjoy the calm."}
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 26 }}>
        <div
          style={{
            flex: 1,
            background: 'var(--color-brand-green)',
            color: 'var(--color-on-green-text)',
            borderRadius: 'var(--radius-card)',
            padding: '14px 16px',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26 }}>
            {needsToday.length}
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-on-green-text-2)' }}>follow-ups</div>
        </div>
        <div
          style={{
            flex: 1,
            background: 'var(--color-warm-panel)',
            color: 'var(--color-green-deep)',
            borderRadius: 'var(--radius-card)',
            padding: '14px 16px',
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 26 }}>{tasksToday}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-body-subtext)' }}>tasks today</div>
        </div>
      </div>

      {needsToday.length > 0 ? (
        <section style={{ marginBottom: 'var(--space-section-gap)' }}>
          <SectionLabel>Needs you today</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-list-gap)' }}>
            {needsToday.map(({ contact, urgency }) => (
              <article
                key={contact.id}
                style={{
                  background: 'var(--color-card-surface)',
                  borderRadius: 'var(--radius-card)',
                  padding: 'var(--space-card)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Avatar name={contact.name} category={contact.category} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--color-green-deep)' }}>
                      {contact.name}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: urgencyColor(urgency) }}>
                      {urgencyLabel(urgency, contact.nextFollowup, today)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-body-subtext)', marginBottom: 6 }}>
                    {contact.organization}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <CategoryChip category={contact.category} />
                    <button
                      style={{
                        background: 'var(--color-brand-green)',
                        color: 'var(--color-on-green-text)',
                        border: 'none',
                        borderRadius: 'var(--radius-pill)',
                        padding: '7px 14px',
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      ✦ Draft
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section style={{ textAlign: 'center', padding: '20px 0 30px' }}>
          <div
            style={{
              width: 56,
              height: 56,
              margin: '0 auto 14px',
              borderRadius: '50%',
              background: 'var(--color-soft-green-tint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: 'var(--color-green-mid)',
            }}
          >
            ✓
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20, margin: '0 0 6px' }}>
            You've cleared today.
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--color-body-subtext)', margin: '0 0 18px' }}>
            Nothing urgent is waiting. Enjoy a little breathing room.
          </p>
          <img src={productHero} alt="" style={{ maxWidth: 200, margin: '0 auto' }} />
        </section>
      )}

      {comingUp.length > 0 && (
        <section>
          <SectionLabel>Coming up</SectionLabel>
          <div
            style={{
              background: 'var(--color-card-surface)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
            }}
          >
            {comingUp.map(({ contact, urgency }, i) => {
              const dot = `var(--cat-${contact.category}-dot)`;
              return (
                <div
                  key={contact.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderTop: i === 0 ? 'none' : '1px solid rgba(40,50,40,0.06)',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{contact.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--color-body-subtext)' }}>{contact.organization}</div>
                  </div>
                  <span style={{ fontSize: 12, color: urgencyColor(urgency), fontWeight: 600 }}>
                    {urgencyLabel(urgency, contact.nextFollowup, today)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '1.4px',
        textTransform: 'uppercase',
        color: 'var(--color-muted-label)',
        margin: '0 0 10px',
      }}
    >
      {children}
    </p>
  );
}
