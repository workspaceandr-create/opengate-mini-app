import { useState } from 'react';

const MODELS = [
  { id: 'model_deepseek', icon: '🧠', label: 'DeepSeek Chat', desc: 'Быстрый, хорош для текста' },
  { id: 'model_claude', icon: '🎭', label: 'Claude 3.5 Sonnet', desc: 'Лучший для анализа' },
  { id: 'model_llama', icon: '🦙', label: 'Llama 3.3 70B', desc: 'Открытая модель Meta' },
];

export default function SettingsPage() {
  const [selectedModel, setSelectedModel] = useState('model_deepseek');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  return (
    <>
      <div className="page-header">
        <span className="page-title">Настройки</span>
      </div>

      <div className="section-header">AI Модель</div>
      {MODELS.map(model => (
        <div key={model.id} className={`model-row${selectedModel === model.id ? ' selected' : ''}`} onClick={() => setSelectedModel(model.id)}>
          <div className="model-row-left">
            <span className="model-icon">{model.icon}</span>
            <div>
              <div className="model-name">{model.label}</div>
              <div className="model-desc">{model.desc}</div>
            </div>
          </div>
          {selectedModel === model.id && <span className="model-check">✓</span>}
        </div>
      ))}

      <div className="section-header">Общие</div>
      <div className="settings-section">
        <div className="settings-row" onClick={() => setVoiceEnabled(v => !v)}>
          <div className="settings-row-left">
            <span style={{ fontSize: 18 }}>🎙</span>
            <span className="settings-label">Голосовые сообщения</span>
          </div>
          <div className={`toggle${voiceEnabled ? ' on' : ''}`} onClick={e => { e.stopPropagation(); setVoiceEnabled(v => !v); }} />
        </div>
        <div className="settings-row">
          <div className="settings-row-left">
            <span style={{ fontSize: 18 }}>🌍</span>
            <span className="settings-label">Язык</span>
          </div>
          <span className="settings-value">Русский</span>
        </div>
      </div>

      <div className="section-header">Аккаунт</div>
      <div className="settings-section">
        <div className="settings-row">
          <div className="settings-row-left">
            <span style={{ fontSize: 18 }}>💳</span>
            <span className="settings-label">Тариф</span>
          </div>
          <span className="settings-value">FREE</span>
        </div>
        <div className="settings-row">
          <div className="settings-row-left">
            <span style={{ fontSize: 18 }}>💬</span>
            <span className="settings-label">Поддержка</span>
          </div>
          <span className="menu-arrow">›</span>
        </div>
      </div>
    </>
  );
}
