import { useState } from 'react';
import { TabBar, type Tab } from './components/TabBar';
import { TodayScreen } from './screens/TodayScreen';
import { WeekScreen } from './screens/WeekScreen';
import { ContactsScreen } from './screens/ContactsScreen';
import { ContentScreen } from './screens/ContentScreen';

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
          {tab === 'week' && <WeekScreen />}
          {tab === 'contacts' && <ContactsScreen />}
          {tab === 'content' && <ContentScreen />}
        </main>
        <TabBar active={tab} onChange={setTab} />
      </div>
    </div>
  );
}

export default App;
