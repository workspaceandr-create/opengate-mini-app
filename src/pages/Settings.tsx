import { useState } from 'react';

const models = [
  { id: 'model_deepseek', label: 'DeepSeek Chat', desc: 'Быстрый, хорош для текста' },
  { id: 'model_claude', label: 'Claude 3.5 Sonnet', desc: 'Лучший для анализа' },
  { id: 'model_llama', label: 'Llama 3.3 70B', desc: 'Открытая модель Meta' },
];

export default function SettingsPage() {
  const [selectedModel, setSelectedModel] = useState('model_deepseek');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  return (
    <div className="page">
      <div className="section-header">Настройки</div>

      {/* AI Модель */}
      <div style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ marginBottom: 10, fontSize: 14, color: 'var(--tg-theme-hint-color)' }}>
          🤖 AI МОДЕЛЬ
        </div>
        {models.map((model) => (
          <div
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 16px',
              background: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
              borderRadius: 12,
              marginBottom: 8,
              cursor: 'pointer',
              border: selectedModel === model.id
                ? '2px solid var(--tg-theme-button-color, #3390ec)'
                : '2px solid transparent',
            }}
          >
            <div>
              <div style={{ fontWeight: 500 }}>{model.label}</div>
              <div style={{ fontSize: 13, color: 'var(--tg-theme-hint-color)', marginTop: 2 }}>{model.desc}</div>
            </div>
            {selectedModel === model.id && (
              <span style={{ color: 'var(--tg-theme-button-color)', fontSize: 20 }}>✓</span>
            )}
          </div>
        ))}
      </div>

      {/* Прочие настройки */}
      <div className="card-title" style={{ marginBottom: 10, fontSize: 14, color: 'var(--tg-theme-hint-color)' }}>
        ⚙️ ОБЩИЕ
      </div>

      <div
        className="settings-row"
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        style={{ cursor: 'pointer' }}
      >
        <span className="settings-label">🎙 Голосовые сообщения</span>
        <span style={{
          color: voiceEnabled ? '#34c759' : 'var(--tg-theme-hint-color)',
          fontWeight: 600
        }}>
          {voiceEnabled ? 'Вкл' : 'Выкл'}
        </span>
      </div>

      <div className="settings-row">
        <span className="settings-label">🌍 Язык</span>
        <span className="settings-value">Русский</span>
      </div>

      <div className="settings-row">
        <span className="settings-label">📋 Тариф</span>
        <span className="settings-value">Бесплатный</span>
      </div>

      <button className="btn-primary" style={{ marginTop: 20 }}>
        💾 Сохранить настройки
      </button>
    </div>
  );
}
