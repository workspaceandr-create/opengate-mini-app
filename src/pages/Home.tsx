// Mock данные — потом заменим на n8n API
const mockUser = {
  plan: 'FREE',
  tokens_balance: 38_500,
  tokens_total: 50_000,
  requests: 12,
  dialogs: 3,
  model: 'DeepSeek',
  active_dialog: 'Как приготовить борщ',
  active_model: 'DeepSeek',
};

const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;

export default function HomePage() {
  const displayName = tgUser
    ? `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`
    : 'Пользователь';
  const username = tgUser?.username ? `@${tgUser.username}` : '@username';
  const avatarLetter = displayName[0]?.toUpperCase() || 'П';

  const tokensK = (mockUser.tokens_balance / 1000).toFixed(0);
  const percentUsed = Math.round(((mockUser.tokens_total - mockUser.tokens_balance) / mockUser.tokens_total) * 100);

  return (
    <>
      {/* Профиль */}
      <div className="profile-block">
        <div className="avatar">
          {tgUser?.photo_url
            ? <img src={tgUser.photo_url} alt="avatar" />
            : avatarLetter
          }
        </div>
        <div>
          <div className="profile-name">{displayName}</div>
          <div className="profile-username">{username}</div>
          <div className="profile-plan">⭐ {mockUser.plan}</div>
        </div>
      </div>

      {/* Статистика */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Токены</div>
          <div className="stat-value">{tokensK}к</div>
          <div className="stat-sub">осталось · {percentUsed}% исп.</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Запросы</div>
          <div className="stat-value">{mockUser.requests}</div>
          <div className="stat-sub">за всё время</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Диалоги</div>
          <div className="stat-value">{mockUser.dialogs}</div>
          <div className="stat-sub">активных</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Модель</div>
          <div className="stat-value" style={{ fontSize: 16 }}>{mockUser.model}</div>
          <div className="stat-sub">текущая</div>
        </div>
      </div>

      {/* Активный диалог */}
      <div className="active-dialog-block">
        <div className="active-dialog-label">Активный диалог</div>
        <div className="active-dialog-name">{mockUser.active_dialog}</div>
        <div className="active-dialog-model">{mockUser.active_model}</div>
      </div>

      {/* Меню */}
      <div className="section-header">Дополнительно</div>
      <div className="menu-section">
        <div className="menu-row">
          <div className="menu-row-left">
            <span className="menu-icon">📚</span>
            <span className="menu-label">База знаний</span>
          </div>
          <span className="menu-arrow">›</span>
        </div>
        <div className="menu-row">
          <div className="menu-row-left">
            <span className="menu-icon">📊</span>
            <span className="menu-label">История расходов</span>
          </div>
          <span className="menu-arrow">›</span>
        </div>
        <div className="menu-row">
          <div className="menu-row-left">
            <span className="menu-icon">🎁</span>
            <span className="menu-label">Акции и бонусы</span>
          </div>
          <span className="menu-arrow">›</span>
        </div>
        <div className="menu-row">
          <div className="menu-row-left">
            <span className="menu-icon">💬</span>
            <span className="menu-label">Поддержка</span>
          </div>
          <span className="menu-arrow">›</span>
        </div>
      </div>
    </>
  );
}
