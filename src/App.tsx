import { useState } from 'react';
import HomePage from './pages/Home';
import PlansPage from './pages/Plans';
import HistoryPage from './pages/History';
import SettingsPage from './pages/Settings';

type Tab = 'home' | 'plans' | 'history' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <>
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'plans' && <PlansPage />}
      {activeTab === 'history' && <HistoryPage />}
      {activeTab === 'settings' && <SettingsPage />}

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <span className="nav-icon">🏠</span>
          <span>Главная</span>
        </button>
        <button className={`nav-item ${activeTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveTab('plans')}>
          <span className="nav-icon">💳</span>
          <span>Тарифы</span>
        </button>
        <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          <span className="nav-icon">📊</span>
          <span>История</span>
        </button>
        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <span className="nav-icon">⚙️</span>
          <span>Настройки</span>
        </button>
      </nav>
    </>
  );
}
