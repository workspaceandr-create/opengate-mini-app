import { useState, useEffect } from 'react';
import { fetchChats, switchDialog, newDialog, MODEL_DISPLAY, MODEL_ICON, formatDate } from '../api';
import type { ChatData } from '../api';

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

export default function ChatsPage() {
  const [chatId, setChatId] = useState<number | null>(null);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [noUser, setNoUser] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');

  useEffect(() => {
    const tgWebApp = (window as any).Telegram?.WebApp;
    tgWebApp?.ready?.();
    tgWebApp?.expand?.();

    const id = getChatId();
    if (!id) { setNoUser(true); setLoading(false); return; }
    setChatId(id);
    fetchChats(id)
      .then(setChats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSwitch(conv: ChatData) {
    if (!chatId || conv.status === 'active') return;
    setSwitching(conv.conversation_id);
    try {
      await switchDialog(chatId, conv.conversation_id);
      setChats(prev => prev.map(c => ({
        ...c,
        status: c.conversation_id === conv.conversation_id ? 'active' : 'inactive',
      })));
    } finally {
      setSwitching(null);
    }
  }

  async function handleNew() {
    if (!chatId || creating) return;
    setCreating(true);
    try {
      const created = await newDialog(chatId);
      setChats(prev => [
        { ...created, last_message: null },
        ...prev.map(c => ({ ...c, status: 'inactive' })),
      ]);
    } catch {}
    setCreating(false);
  }

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
        <button className="btn-new" onClick={handleNew} disabled={creating}>
          {creating ? '...' : '＋ Новый'}
        </button>
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
        const isActive = conv.status === 'active' || i === 0;
        const icon = MODEL_ICON[conv.model_key] ?? '💬';
        const iconClass = conv.model_key === 'model_claude' ? 'ic-cl' : 'ic-ds';
        const modelName = MODEL_DISPLAY[conv.model_key] ?? conv.model_key;
        const preview = conv.last_message
          ? conv.last_message.replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 80) + '...'
          : 'Нет сообщений';
        const isSwitching = switching === conv.conversation_id;

        return (
          <div
            key={conv.conversation_id}
            className={`conv-card${isActive ? ' active-conv' : ''}`}
            onClick={() => !isActive && handleSwitch(conv)}
            style={{ cursor: isActive ? 'default' : 'pointer' }}
          >
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
                    onClick={e => e.stopPropagation()}
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
            <div className="conv-actions" onClick={e => e.stopPropagation()}>
              {!isActive && (
                <button
                  className="btn-s btn-switch"
                  onClick={() => handleSwitch(conv)}
                  disabled={isSwitching}
                >
                  {isSwitching ? '...' : '▶ Переключиться'}
                </button>
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
