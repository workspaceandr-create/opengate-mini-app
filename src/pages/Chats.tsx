import { useState, useEffect } from 'react';
import { fetchChats, MODEL_DISPLAY, MODEL_ICON, formatDate } from '../api';
import type { ChatData } from '../api';

function getTelegramUser() {
  const tgWebApp = (window as any).Telegram?.WebApp;
  if (!tgWebApp) return null;
  if (tgWebApp.initDataUnsafe?.user) return tgWebApp.initDataUnsafe.user;
  const initData = tgWebApp.initData;
  if (!initData) return null;
  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [noUser, setNoUser] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');

  useEffect(() => {
    const tgWebApp = (window as any).Telegram?.WebApp;
    tgWebApp?.ready?.();
    tgWebApp?.expand?.();

    const user = getTelegramUser();
    const chatId = user?.id;
    if (!chatId) {
      setNoUser(true);
      setLoading(false);
      return;
    }
    fetchChats(chatId)
      .then(setChats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function startRename(conv: ChatData) {
    setRenamingId(conv.conversation_id);
    setRenameVal(conv.title);
  }

  function commitRename(id: string) {
    setChats(prev => prev.map(c => c.conversation_id === id ? { ...c, title: renameVal } : c));
    setRenamingId(null);
  }

  function handleDelete(id: string) {
    setChats(prev => prev.filter(c => c.conversation_id !== id));
  }

  return (
    <>
      <div className="page-header">
        <span className="page-title">Мои диалоги</span>
        <button className="btn-new">＋ Новый</button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>Загрузка...</div>
      )}

      {noUser && (
        <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-secondary)', fontSize: 14 }}>
          Откройте приложение через бота @OpenGateAI_bot
        </div>
      )}

      {!loading && !noUser && chats.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-secondary)' }}>
          Нет диалогов. Начни общение с ботом!
        </div>
      )}

      {chats.map((conv, i) => {
        const isActive = conv.status === 'active' && i === 0;
        const icon = MODEL_ICON[conv.model_key] ?? '💬';
        const iconClass = conv.model_key === 'model_claude' ? 'ic-cl' : 'ic-ds';
        const modelName = MODEL_DISPLAY[conv.model_key] ?? conv.model_key;
        const preview = conv.last_message
          ? conv.last_message.replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 80) + '...'
          : 'Нет сообщений';

        return (
          <div key={conv.conversation_id} className={`conv-card${isActive ? ' active-conv' : ''}`}>
            {isActive && <span className="active-badge">● активный</span>}
            <div className="conv-card-top">
              <div className={`conv-icon ${iconClass}`}>{icon}</div>
              <div className="conv-info">
                {renamingId === conv.conversation_id ? (
                  <input
                    className="text-input"
                    style={{ padding: '4px 8px', fontSize: 13, marginBottom: 4 }}
                    value={renameVal}
                    autoFocus
                    onChange={e => setRenameVal(e.target.value)}
                    onBlur={() => commitRename(conv.conversation_id)}
                    onKeyDown={e => e.key === 'Enter' && commitRename(conv.conversation_id)}
                  />
                ) : (
                  <div className="conv-title">{conv.title}</div>
                )}
                <div className="conv-meta">
                  <span className="conv-model">{modelName}</span>
                  <span className="conv-date">{formatDate(conv.updated_at)}</span>
                  {conv.message_count > 0 && (
                    <span className="conv-count">· {conv.message_count} сообщ.</span>
                  )}
                </div>
              </div>
            </div>
            <div className="conv-preview">{preview}</div>
            <div className="conv-actions">
              {!isActive && (
                <button className="btn-s btn-switch">▶ Переключиться</button>
              )}
              <button className="btn-s btn-rename" onClick={() => startRename(conv)}>
                ✏️ {isActive ? 'Переименовать' : ''}
              </button>
              <button className="btn-s btn-del" onClick={() => handleDelete(conv.conversation_id)}>🗑</button>
            </div>
          </div>
        );
      })}
    </>
  );
}
