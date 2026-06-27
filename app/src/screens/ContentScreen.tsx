import { useMemo, useState } from 'react';
import { mockContent } from '../data/mockContent';
import type { ContentPlatform, ContentPost, ContentStatus } from '../data/types';
import productJar from '../assets/product-jar.png';

const platformChipStyle: Record<ContentPlatform, { bg: string; text: string }> = {
  Instagram: { bg: '#ECE0E5', text: '#7B566A' },
  TikTok: { bg: '#E0E4EA', text: '#475569' },
  Email: { bg: '#DEE8E1', text: '#3C6450' },
};

const statusChipStyle: Record<ContentStatus, { bg: string; text: string }> = {
  Ready: { bg: '#DFEAE1', text: '#3C6450' },
  Scheduled: { bg: '#EFE6D4', text: '#8A6A33' },
  Draft: { bg: '#F0E3DD', text: '#9C5E4C' },
  Idea: { bg: '#ECE7DA', text: '#8A8576' },
};

function formatScheduled(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function ContentScreen() {
  const today = useMemo(() => new Date(), []);
  const [reminderOverrides, setReminderOverrides] = useState<Record<string, boolean>>({});

  const posts: ContentPost[] = mockContent.map((p) => ({
    ...p,
    reminderOn: reminderOverrides[p.id] ?? p.reminderOn,
  }));

  const { thisWeek, nextWeek } = useMemo(() => {
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const weekEnd = new Date(startOfToday.getTime() + 7 * 86400000);
    const sorted = [...posts].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    return {
      thisWeek: sorted.filter((p) => new Date(p.scheduledAt) < weekEnd),
      nextWeek: sorted.filter((p) => new Date(p.scheduledAt) >= weekEnd),
    };
  }, [posts, today]);

  const todaysPost = posts.find((p) => {
    const d = new Date(p.scheduledAt);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  function toggleReminder(id: string) {
    setReminderOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? posts.find((p) => p.id === id)?.reminderOn) }));
  }

  return (
    <div style={{ padding: '20px var(--space-screen-x) 28px' }}>
      <h1
        style={{
          margin: '0 0 2px',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 28,
          color: 'var(--color-green-deep)',
        }}
      >
        Content
      </h1>
      <p
        style={{
          margin: '0 0 18px',
          fontSize: 13,
          color: 'var(--color-body-subtext)',
        }}
      >
        {today.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
      </p>

      {todaysPost && (
        <div
          style={{
            background: 'var(--color-brand-green)',
            color: 'var(--color-on-green-text)',
            borderRadius: 'var(--radius-card)',
            padding: '13px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 22,
          }}
        >
          <span style={{ fontSize: 16 }}>🔔</span>
          <span style={{ flex: 1, fontSize: 13.5 }}>
            Post today: <strong>{todaysPost.title}</strong>
          </span>
          <button
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'var(--color-on-green-text)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Open
          </button>
        </div>
      )}

      {thisWeek.length > 0 && (
        <PostGroup label="This week" posts={thisWeek} onToggleReminder={toggleReminder} />
      )}
      {nextWeek.length > 0 && (
        <PostGroup label="Next week" posts={nextWeek} onToggleReminder={toggleReminder} />
      )}

      <button
        style={{
          width: '100%',
          border: '1.5px dashed var(--color-placeholder)',
          borderRadius: 'var(--radius-card)',
          padding: '14px',
          background: 'none',
          color: 'var(--color-muted-label)',
          fontSize: 13.5,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        + Plan a post
      </button>
    </div>
  );
}

function PostGroup({
  label,
  posts,
  onToggleReminder,
}: {
  label: string;
  posts: ContentPost[];
  onToggleReminder: (id: string) => void;
}) {
  return (
    <section style={{ marginBottom: 'var(--space-section-gap)' }}>
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
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-list-gap)' }}>
        {posts.map((post) => {
          const platformChip = platformChipStyle[post.platform];
          const statusChip = statusChipStyle[post.status];
          return (
            <article
              key={post.id}
              style={{
                background: 'var(--color-card-surface)',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-card)',
                padding: 'var(--space-card)',
                display: 'flex',
                gap: 12,
              }}
            >
              {post.isProduct ? (
                <img
                  src={productJar}
                  alt=""
                  style={{ width: 58, height: 58, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 12,
                    background: 'var(--color-warm-panel)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    color: 'var(--color-muted-label)',
                    flexShrink: 0,
                  }}
                >
                  ☰
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: platformChip.bg,
                      color: platformChip.text,
                      borderRadius: 'var(--radius-chip)',
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {post.platform}
                  </span>
                  <span style={{ fontSize: 11.5, color: 'var(--color-faint-label)', alignSelf: 'center' }}>
                    {formatScheduled(post.scheduledAt)}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-green-deep)', marginBottom: 6 }}>
                  {post.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      background: statusChip.bg,
                      color: statusChip.text,
                      borderRadius: 'var(--radius-chip)',
                      padding: '3px 9px',
                      fontSize: 11.5,
                      fontWeight: 600,
                    }}
                  >
                    {post.status}
                  </span>
                  <button
                    onClick={() => onToggleReminder(post.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: post.reminderOn ? 'var(--color-green-mid)' : 'var(--color-placeholder)',
                    }}
                  >
                    🔔 {post.reminderOn ? 'Reminder on' : 'Remind me'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
