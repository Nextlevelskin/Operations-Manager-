import { useState } from 'react';
import { TabBar, type Tab } from './components/TabBar';
import { TodayScreen } from './screens/TodayScreen';

function App() {
  const [tab, setTab] = useState<Tab>('today');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-cream-bg)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          minHeight: '100vh',
          background: 'var(--color-cream-bg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {tab === 'today' && <TodayScreen />}
          {tab === 'week' && <Placeholder title="Week" />}
          {tab === 'contacts' && <Placeholder title="Contacts" />}
          {tab === 'content' && <Placeholder title="Content" />}
        </main>
        <TabBar active={tab} onChange={setTab} />
      </div>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div style={{ padding: '40px 22px', textAlign: 'center', color: 'var(--color-body-subtext)' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-green-deep)' }}>{title}</p>
      <p>Coming soon.</p>
    </div>
  );
}

export default App;
