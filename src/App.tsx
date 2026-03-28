import { useState } from 'react';
import ChatsPage from './pages/Chats';
import AgentsPage from './pages/Agents';
import HomePage from './pages/Home';
import PlansPage from './pages/Plans';
import SettingsPage from './pages/Settings';

type Tab = 'chats' | 'agents' | 'home' | 'plans' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <>
      <div className="screen">
        {activeTab === 'chats' && <ChatsPage />}
        {activeTab === 'agents' && <AgentsPage />}
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'plans' && <PlansPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </div>

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`} onClick={() => setActiveTab('chats')}>
          <span className="nav-icon">💬</span>
          <span className="nav-label">Чаты</span>
        </button>
        <button className={`nav-item ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>
          <span className="nav-icon">🤖</span>
          <span className="nav-label">Агенты</span>
        </button>
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Главная</span>
        </button>
        <button className={`nav-item ${activeTab === 'plans' ? 'active' : ''}`} onClick={() => setActiveTab('plans')}>
          <span className="nav-icon">💳</span>
          <span className="nav-label">Тарифы</span>
        </button>
        <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Настройки</span>
        </button>
      </nav>
    </>
  );
}
