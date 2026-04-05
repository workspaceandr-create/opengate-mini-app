import { useState, useEffect } from 'react';
import { fetchHistory, formatDate } from '../api';
import type { HistoryItem } from '../api';

function getChatId(): number | null {
  const tgWebApp = (window as any).Telegram?.WebApp;
  if (tgWebApp?.initDataUnsafe?.user?.id) return tgWebApp.initDataUnsafe.user.id;
  const initData = tgWebApp?.initData;
  if (initData) {
    try {
      const params = new URLSearchParams(initData);
      const userStr = params.get('user');
      if (userStr) return JSON.parse(userStr).id;
    } catch {}
  }
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get('id');
  if (idParam) {
    const chatId = parseInt(idParam, 10);
    if (!isNaN(chatId)) return chatId;
  }
  return null;
}

const ACTION_ICON: Record<string, string> = {
  'Текстовый запрос': '💬',
  'Веб-поиск': '🔍',
  'Анализ фото': '📷',
  'Генерация изображения': '🎨',
};

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noUser, setNoUser] = useState(false);

  useEffect(() => {
    const tgWebApp = (window as any).Telegram?.WebApp;
    tgWebApp?.ready?.();
    tgWebApp?.expand?.();

    const id = getChatId();
    if (!id) { setNoUser(true); setLoading(false); return; }
    fetchHistory(id)
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalTokens = items.reduce((s, i) => s + i.tokens_in + i.tokens_out, 0);
  const totalCost = items.reduce((s, i) => s + Number(i.cost_usd), 0);

  return (
    <>
      <div className="page-header">
        <span className="page-title">История</span>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>Загрузка...</div>
      )}

      {noUser && (
        <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-secondary)', fontSize: 14 }}>
          Откройте приложение через бота @OpenGateAI_bot
        </div>
      )}

      {!loading && !noUser && items.length > 0 && (
        <div className="stats-grid" style={{ marginBottom: 8 }}>
          <div className="stat-card">
            <div className="stat-label">Запросов</div>
            <div className="stat-value">{items.length}</div>
            <div className="stat-sub">в истории</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Токены</div>
            <div className="stat-value">{totalTokens >= 1000 ? (totalTokens / 1000).toFixed(1) + 'к' : totalTokens}</div>
            <div className="stat-sub">всего</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Стоимость</div>
            <div className="stat-value" style={{ fontSize: 16 }}>${totalCost.toFixed(4)}</div>
            <div className="stat-sub">за всё время</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Последний</div>
            <div className="stat-value" style={{ fontSize: 14 }}>{formatDate(items[0].created_at)}</div>
            <div className="stat-sub">запрос</div>
          </div>
        </div>
      )}

      {!loading && !noUser && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-secondary)' }}>
          История пуста. Начни общение с ботом!
        </div>
      )}

      {items.map((item, i) => {
        const icon = ACTION_ICON[item.action] ?? '💬';
        const tokens = item.tokens_in + item.tokens_out;
        return (
          <div key={i} className="history-item">
            <div className="hi-icon">{icon}</div>
            <div className="hi-body">
              <div className="hi-action">{item.action}</div>
              <div className="hi-meta">{item.model} · {formatDate(item.created_at)}</div>
            </div>
            <div className="hi-right">
              <div className="hi-amount hi-minus">{tokens > 0 ? `−${tokens} tok` : '—'}</div>
              {Number(item.cost_usd) > 0 && (
                <div className="hi-tokens">${Number(item.cost_usd).toFixed(4)}</div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
