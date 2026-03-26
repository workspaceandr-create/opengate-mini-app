// Mock данные — потом заменим на n8n API
const mockUser = {
  credits: 250,
  plan: 'Бесплатный',
  requests_used: 12,
  model: 'DeepSeek',
  voice_enabled: true,
};

// Получаем данные из Telegram WebApp
const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;

export default function HomePage() {
  const displayName = tgUser
    ? `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`
    : 'Пользователь';

  const username = tgUser?.username ? `@${tgUser.username}` : '';
  const avatarLetter = displayName[0]?.toUpperCase() || '?';

  return (
    <div className="page">
      {/* Профиль */}
      <div className="user-row">
        <div className="avatar">{avatarLetter}</div>
        <div>
          <div className="user-name">{displayName}</div>
          {username && <div className="user-username">{username}</div>}
        </div>
      </div>

      {/* Статистика */}
      <div className="stats-grid">
        <div className="card">
          <div className="card-title">⚡ Кредиты</div>
          <div className="card-value">{mockUser.credits}</div>
        </div>
        <div className="card">
          <div className="card-title">📋 Тариф</div>
          <div className="card-value" style={{ fontSize: 16 }}>{mockUser.plan}</div>
        </div>
        <div className="card">
          <div className="card-title">📨 Запросов</div>
          <div className="card-value">{mockUser.requests_used}</div>
        </div>
        <div className="card">
          <div className="card-title">🤖 Модель</div>
          <div className="card-value" style={{ fontSize: 15 }}>{mockUser.model}</div>
        </div>
      </div>

      {/* Кнопки */}
      <button className="btn-primary">🚀 Купить кредиты</button>
      <button className="btn-secondary">👑 Улучшить тариф</button>

      {/* Быстрые настройки */}
      <div className="card" style={{ marginTop: 8 }}>
        <div className="card-title">Текущие настройки</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span>🤖 Модель</span>
          <span style={{ color: 'var(--tg-theme-hint-color)' }}>{mockUser.model}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span>🎙 Голос</span>
          <span style={{ color: mockUser.voice_enabled ? '#34c759' : 'var(--tg-theme-hint-color)' }}>
            {mockUser.voice_enabled ? 'Включён' : 'Выключен'}
          </span>
        </div>
      </div>
    </div>
  );
}
