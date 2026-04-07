import { useState, useEffect, useRef } from 'react';
import { fetchChats, switchDialog, newDialog, renameDialog, deleteDialog, fetchMessages, MODEL_DISPLAY, MODEL_ICON, formatDate, formatDateTime } from '../api';
import type { ChatData, MessageItem } from '../api';

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

  // Chat detail view
  const [viewConv, setViewConv] = useState<ChatData | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const msgsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tgWebApp = (window as any).Telegram?.WebApp;
    tgWebApp?.ready?.();
    tgWebApp?.expand?.();

    const id = getChatId();
    if (!id) { setNoUser(true); setLoading(false); return; }
    setChatId(id);
    const openActive = new URLSearchParams(window.location.search).get('open') === 'active';
    fetchChats(id)
      .then(chats => {
        setChats(chats);
        if (openActive) {
          const active = chats.find(c => c.status === 'active');
          if (active) handleOpenConv(active, id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (msgsEndRef.current) {
      msgsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  async function handleOpenConv(conv: ChatData, id?: number) {
    const cid = id ?? chatId;
    if (!cid) return;
    setViewConv(conv);
    setMessages([]);
    setMsgsLoading(true);
    try {
      const msgs = await fetchMessages(cid, conv.conversation_id);
      setMessages(msgs);
    } catch {}
    setMsgsLoading(false);
  }

  async function handleSwitch(conv: ChatData) {
    if (!chatId || conv.status === 'active') return;
    setSwitching(conv.conversation_id);
    try {
      await switchDialog(chatId, conv.conversation_id);
      setChats(prev => prev.map(c => ({
        ...c,
        status: c.conversation_id === conv.conversation_id ? 'active' : 'closed',
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
        ...prev.map(c => ({ ...c, status: 'closed' })),
      ]);
    } catch {}
    setCreating(false);
  }

  function startRename(conv: ChatData) {
    setRenamingId(conv.conversation_id);
    setRenameVal(conv.title);
  }

  async function commitRename(id: string) {
    if (!chatId) return;
    setChats(prev => prev.map(c => c.conversation_id === id ? { ...c, title: renameVal } : c));
    if (viewConv?.conversation_id === id) setViewConv(v => v ? { ...v, title: renameVal } : v);
    setRenamingId(null);
    await renameDialog(chatId, id, renameVal).catch(() => {});
  }

  async function handleDelete(id: string) {
    if (!chatId) return;
    setChats(prev => prev.filter(c => c.conversation_id !== id));
    if (viewConv?.conversation_id === id) setViewConv(null);
    await deleteDialog(chatId, id).catch(() => {});
  }

  // ===== CHAT DETAIL VIEW =====
  if (viewConv) {
    const icon = MODEL_ICON[viewConv.model_key] ?? '💬';
    const modelName = MODEL_DISPLAY[viewConv.model_key] ?? viewConv.model_key;

    return (
      <div className="cd-wrap">
        <div className="cd-header">
          <button className="cd-back-btn-top" onClick={() => setViewConv(null)}>←</button>
          <div className="cd-info">
            <div className="cd-title">{viewConv.title}</div>
            <div className="cd-model">{icon} {modelName}</div>
          </div>
        </div>

        <div className="cd-messages">
          {msgsLoading && (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary, #5a7a8a)' }}>
              Загрузка...
            </div>
          )}
          {!msgsLoading && messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 24px', color: '#5a7a8a', fontSize: 14 }}>
              Нет сообщений
            </div>
          )}
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const isPhoto = isUser && msg.content.startsWith('[Фото]');
            const photoCaption = isPhoto ? msg.content.replace('[Фото]', '').trim() : '';
            const isImage = !isUser && msg.content.startsWith('[Изображение]');
            const imageUrl = isImage ? msg.content.replace('[Изображение]', '').trim() : '';
            return (
              <div key={i} className={`cd-msg ${isUser ? 'cd-msg-user' : 'cd-msg-bot'}`}>
                {isPhoto ? (
                  <div className="cd-bubble cd-bubble-photo">
                    <span className="cd-photo-icon">📷</span>
                    {photoCaption && <span className="cd-photo-caption">{photoCaption}</span>}
                  </div>
                ) : isImage && imageUrl ? (
                  <a className="cd-image-wrap" href={imageUrl} target="_blank" rel="noreferrer">
                    <img className="cd-image-thumb" src={imageUrl} alt="Сгенерированное изображение" />
                    <div className="cd-image-hint">🔍 Открыть</div>
                  </a>
                ) : !isUser ? (
                  <div className="cd-bubble" dangerouslySetInnerHTML={{ __html: msg.content }} />
                ) : (
                  <div className="cd-bubble">{msg.content}</div>
                )}
                <div className="cd-msg-time">{formatDateTime(msg.created_at)}</div>
              </div>
            );
          })}
          <div ref={msgsEndRef} />
        </div>

        <div className="cd-footer">
          <button
            className="cd-continue-btn"
            onClick={() => {
              const tgWebApp = (window as any).Telegram?.WebApp;
              tgWebApp?.close?.();
            }}
          >
            💬 Продолжить в боте
          </button>
        </div>
      </div>
    );
  }

  // ===== CHATS LIST =====
  return (
    <div className="chats-list-wrap">
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

      {chats.map((conv) => {
        const isActive = conv.status === 'active';
        const icon = MODEL_ICON[conv.model_key] ?? '💬';
        const iconClass = conv.model_key === 'chat_gpt' ? 'ic-cl' : 'ic-ds';
        const modelName = MODEL_DISPLAY[conv.model_key] ?? conv.model_key;
        const preview = conv.last_message
          ? conv.last_message.replace(/\*\*/g, '').replace(/\n/g, ' ').replace(/<[^>]+>/g, '').slice(0, 80) + '...'
          : 'Нет сообщений';
        const isSwitching = switching === conv.conversation_id;

        return (
          <div
            key={conv.conversation_id}
            className={`conv-card${isActive ? ' active-conv' : ''}`}
            onClick={() => isActive ? handleOpenConv(conv) : handleSwitch(conv)}
            style={{ cursor: 'pointer' }}
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
              {isActive ? (
                <button
                  className="btn-s btn-switch"
                  onClick={() => handleOpenConv(conv)}
                >
                  ▶ Открыть
                </button>
              ) : (
                <button
                  className="btn-s btn-switch"
                  onClick={() => handleSwitch(conv)}
                  disabled={isSwitching}
                >
                  {isSwitching ? '...' : '▶ Переключиться'}
                </button>
              )}
              <button className="btn-s btn-rename" onClick={() => startRename(conv)}>
                ✏️ Переименовать
              </button>
              <button className="btn-s btn-del" onClick={() => handleDelete(conv.conversation_id)}>🗑</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
