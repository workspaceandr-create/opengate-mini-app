import { useState } from 'react';

interface Conv {
  id: number;
  icon: string;
  iconClass: string;
  title: string;
  model: string;
  agentTag?: string;
  date: string;
  count?: number;
  preview: string;
  active: boolean;
}

const MOCK_CONVS: Conv[] = [
  {
    id: 1,
    icon: '🧠',
    iconClass: 'ic-ds',
    title: 'Как приготовить борщ',
    model: 'DeepSeek',
    date: '26 мар',
    count: 12,
    preview: 'Борщ — это не просто суп, это целое искусство...',
    active: true,
  },
  {
    id: 2,
    icon: '⚖️',
    iconClass: 'ic-agent',
    title: 'Договор аренды — подводные камни',
    model: 'Claude',
    agentTag: '🤖 Юрист',
    date: '20 мар',
    preview: 'Обратите внимание на пункт 4.2 — арендодатель...',
    active: false,
  },
  {
    id: 3,
    icon: '📱',
    iconClass: 'ic-agent',
    title: 'Контент-план на апрель',
    model: 'DeepSeek',
    agentTag: '🤖 СММ',
    date: '15 мар',
    preview: 'Вот 30 идей для постов с учётом трендов...',
    active: false,
  },
  {
    id: 4,
    icon: '🎭',
    iconClass: 'ic-cl',
    title: 'Квантовые вычисления простыми словами',
    model: 'Claude',
    date: '10 мар',
    count: 3,
    preview: 'Представь компьютер как монету: орёл или решка...',
    active: false,
  },
];

export default function ChatsPage() {
  const [convs, setConvs] = useState(MOCK_CONVS);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameVal, setRenameVal] = useState('');

  function handleSwitch(id: number) {
    setConvs(prev => prev.map(c => ({ ...c, active: c.id === id })));
  }

  function handleDelete(id: number) {
    setConvs(prev => prev.filter(c => c.id !== id));
  }

  function startRename(conv: Conv) {
    setRenamingId(conv.id);
    setRenameVal(conv.title);
  }

  function commitRename(id: number) {
    setConvs(prev => prev.map(c => c.id === id ? { ...c, title: renameVal } : c));
    setRenamingId(null);
  }

  return (
    <>
      <div className="page-header">
        <span className="page-title">Мои диалоги</span>
        <button className="btn-new">＋ Новый</button>
      </div>

      {convs.map(conv => (
        <div key={conv.id} className={`conv-card${conv.active ? ' active-conv' : ''}`}>
          <span className="active-badge">● активный</span>
          <div className="conv-card-top">
            <div className={`conv-icon ${conv.iconClass}`}>{conv.icon}</div>
            <div className="conv-info">
              {renamingId === conv.id ? (
                <input
                  className="text-input"
                  style={{ padding: '4px 8px', fontSize: 13, marginBottom: 4 }}
                  value={renameVal}
                  autoFocus
                  onChange={e => setRenameVal(e.target.value)}
                  onBlur={() => commitRename(conv.id)}
                  onKeyDown={e => e.key === 'Enter' && commitRename(conv.id)}
                />
              ) : (
                <div className="conv-title">{conv.title}</div>
              )}
              <div className="conv-meta">
                <span className="conv-model">{conv.model}</span>
                {conv.agentTag && <span className="conv-agent-tag">{conv.agentTag}</span>}
                <span className="conv-date">{conv.date}</span>
                {conv.count && <span className="conv-count">· {conv.count} сообщ.</span>}
              </div>
            </div>
          </div>
          <div className="conv-preview">{conv.preview}</div>
          <div className="conv-actions">
            {!conv.active && (
              <button className="btn-s btn-switch" onClick={() => handleSwitch(conv.id)}>▶ Переключиться</button>
            )}
            <button className="btn-s btn-rename" onClick={() => startRename(conv)}>✏️ {conv.active ? 'Переименовать' : ''}</button>
            <button className="btn-s btn-del" onClick={() => handleDelete(conv.id)}>🗑</button>
          </div>
        </div>
      ))}
    </>
  );
}
