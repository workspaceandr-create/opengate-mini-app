import { useState, useEffect } from 'react';
import { fetchProfile, MODEL_DISPLAY } from '../api';
import type { ProfileData } from '../api';

const PLAN_TOKENS: Record<string, number> = {
  FREE: 50_000,
  BASE: 500_000,
  PRO: 2_000_000,
};

const tgWebApp = (window as any).Telegram?.WebApp;
const tgUser = tgWebApp?.initDataUnsafe?.user;

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    tgWebApp?.ready?.();
    const chatId = tgUser?.id;
    if (!chatId) { setLoading(false); return; }
    fetchProfile(chatId)
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const displayName = tgUser
    ? `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`
    : profile?.full_name || 'Пользователь';
  const username = tgUser?.username
    ? `@${tgUser.username}`
    : (profile?.username && profile.username !== 'no_username' ? `@${profile.username}` : '@username');
  const avatarLetter = displayName[0]?.toUpperCase() || 'П';

  const plan = profile?.plan ?? 'FREE';
  const tokensTotal = PLAN_TOKENS[plan] ?? 50_000;
  const tokensUsed = profile?.tokens_used_month ?? 0;
  const tokensBalance = Math.max(0, tokensTotal - tokensUsed);
  const tokensK = tokensBalance >= 1000
    ? (tokensBalance / 1000).toFixed(0) + 'к'
    : String(tokensBalance);
  const percentUsed = Math.round((tokensUsed / tokensTotal) * 100);

  const requests = profile?.total_requests ?? 0;
  const dialogs = profile?.active_dialogs ?? 0;
  const modelKey = profile?.current_model ?? profile?.last_model_key ?? 'model_deepseek';
  const modelName = MODEL_DISPLAY[modelKey] ?? 'DeepSeek';
  const activeDialog = profile?.active_dialog_title ?? '—';

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
          <div className="profile-plan">⭐ {plan}</div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
          Загрузка...
        </div>
      )}

      {!loading && !tgUser && (
        <div style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--text-secondary)', fontSize: 14 }}>
          Откройте приложение через бота @OpenGateAI_bot
        </div>
      )}

      {!loading && tgUser && !error && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Токены</div>
              <div className="stat-value">{tokensK}</div>
              <div className="stat-sub">осталось · {percentUsed}% исп.</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Запросы</div>
              <div className="stat-value">{requests}</div>
              <div className="stat-sub">за всё время</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Диалоги</div>
              <div className="stat-value">{dialogs}</div>
              <div className="stat-sub">активных</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Модель</div>
              <div className="stat-value" style={{ fontSize: 16 }}>{modelName}</div>
              <div className="stat-sub">текущая</div>
            </div>
          </div>

          <div className="active-dialog-block">
            <div className="active-dialog-label">Активный диалог</div>
            <div className="active-dialog-name">{activeDialog}</div>
            <div className="active-dialog-model">{modelName}</div>
          </div>
        </>
      )}

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
