import { useState } from 'react';

type AgentTab = 'mine' | 'gallery';
type View = 'list' | 'create';

const EMOJIS = ['🧑‍💼', '⚖️', '📱', '💡', '🎨', '📊', '🔬', '🏋️', '✍️', '🩺', '🎓', '🍳'];

const GALLERY_AGENTS = [
  { id: 'g1', icon: '⚖️', iconClass: 'av-lawyer', name: 'Юрист', desc: 'Консультирую по праву РФ, анализирую договоры, нахожу актуальные законы', tags: ['web'], preset: true },
  { id: 'g2', icon: '📱', iconClass: 'av-smm', name: 'СММ-специалист', desc: 'Создаю контент-планы, пишу тексты для соцсетей, анализирую тренды', tags: ['web'], preset: true },
  { id: 'g3', icon: '💡', iconClass: 'av-coach', name: 'Бизнес-тренер', desc: 'Помогаю развивать личность и карьеру, ставить цели и достигать их', tags: ['web'], preset: true },
  { id: 'g4', icon: '🎓', iconClass: 'av-eng', name: 'Учитель', desc: 'Объясняю сложные темы простым языком, создаю учебные планы', tags: ['kb'], preset: true },
];

const MY_AGENTS_INIT = [
  { id: 'm1', icon: '🧑‍💼', iconClass: 'av-custom', name: 'Мой бизнес-советник', desc: 'Помогаю строить бизнес, анализирую рынки, ищу возможности для роста', tags: ['web', 'kb'], preset: false },
  { id: 'm2', icon: '📱', iconClass: 'av-smm', name: 'Мой СММ-помощник', desc: 'Пишу посты для моего бренда @myshop в стиле дружелюбно и с юмором', tags: ['web'], preset: false },
];

const MAX_MY_AGENTS = 5; // BASE plan limit

export default function AgentsPage() {
  const [tab, setTab] = useState<AgentTab>('mine');
  const [view, setView] = useState<View>('list');
  const [myAgents, setMyAgents] = useState(MY_AGENTS_INIT);

  // Create agent form state
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [agentName, setAgentName] = useState('');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [webSearch, setWebSearch] = useState(false);
  const [useKb, setUseKb] = useState(false);

  function handleCreate() {
    if (!agentName.trim()) return;
    const newAgent = {
      id: `m${Date.now()}`,
      icon: selectedEmoji,
      iconClass: 'av-custom',
      name: agentName,
      desc: agentPrompt || 'Мой агент',
      tags: [webSearch && 'web', useKb && 'kb'].filter(Boolean) as string[],
      preset: false,
    };
    setMyAgents(prev => [...prev, newAgent]);
    setView('list');
    setAgentName('');
    setAgentPrompt('');
    setWebSearch(false);
    setUseKb(false);
    setSelectedEmoji(EMOJIS[0]);
  }

  function handleDelete(id: string) {
    setMyAgents(prev => prev.filter(a => a.id !== id));
  }

  if (view === 'create') {
    return (
      <>
        <div className="ca-header">
          <button className="ca-back" onClick={() => setView('list')}>‹ Назад</button>
          <span className="ca-title">Новый агент</span>
        </div>

        <div className="section-header">Иконка</div>
        <div className="emoji-picker">
          {EMOJIS.map(e => (
            <div key={e} className={`emoji-opt${selectedEmoji === e ? ' selected' : ''}`} onClick={() => setSelectedEmoji(e)}>{e}</div>
          ))}
        </div>

        <div className="section-header">Основное</div>
        <div className="field-block">
          <div className="field-label">Имя агента</div>
          <input className="text-input" type="text" placeholder="Например: Мой юрист" value={agentName} onChange={e => setAgentName(e.target.value)} />
        </div>
        <div className="field-block" style={{ paddingTop: 0 }}>
          <div className="field-label">Системный промпт</div>
          <div className="field-sublabel">Опиши роль, стиль общения, специализацию агента</div>
          <textarea className="text-input" rows={4} placeholder="Ты опытный консультант с 15-летним стажем..." value={agentPrompt} onChange={e => setAgentPrompt(e.target.value)} />
        </div>

        <div className="section-header">Инструменты</div>
        <div className="tools-list">
          <div className="tool-row">
            <span className="tool-icon">🌐</span>
            <div className="tool-info">
              <div className="tool-name">Поиск в интернете</div>
              <div className="tool-desc">Агент ищет актуальную информацию в реальном времени</div>
            </div>
            <div className={`toggle${webSearch ? ' on' : ''}`} onClick={() => setWebSearch(v => !v)} />
          </div>
          <div className="tool-row">
            <span className="tool-icon">📚</span>
            <div className="tool-info">
              <div className="tool-name">База знаний</div>
              <div className="tool-desc">Загрузи документы — агент будет работать с ними</div>
            </div>
            <div className={`toggle${useKb ? ' on' : ''}`} onClick={() => setUseKb(v => !v)} />
          </div>
        </div>

        {useKb && (
          <>
            <div className="section-header">База знаний</div>
            <div className="kb-upload">
              <div className="kb-upload-icon">📎</div>
              <div className="kb-upload-text">
                <b>Загрузить документы</b>
                PDF, DOCX, TXT · до 10 файлов · 50 МБ
              </div>
            </div>
          </>
        )}

        <button className="btn-create-agent" onClick={handleCreate}>Создать агента →</button>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <span className="page-title">Агенты</span>
        <button className="btn-new-gradient" onClick={() => setView('create')}>＋ Создать</button>
      </div>

      <div className="agents-tabs">
        <div className={`agents-tab${tab === 'mine' ? ' active' : ''}`} onClick={() => setTab('mine')}>Мои</div>
        <div className={`agents-tab${tab === 'gallery' ? ' active' : ''}`} onClick={() => setTab('gallery')}>Галерея</div>
      </div>

      {tab === 'mine' && (
        <>
          <div className="section-header">Мои агенты · {myAgents.length} из {MAX_MY_AGENTS}</div>

          {myAgents.map(agent => (
            <div key={agent.id} className="agent-card custom">
              <div className="agent-card-top">
                <div className={`agent-avatar ${agent.iconClass}`}>{agent.icon}</div>
                <div className="agent-info">
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-desc">{agent.desc}</div>
                </div>
              </div>
              <div className="agent-tags">
                {agent.tags.includes('web') && <span className="agent-tag tag-web">🌐 Веб-поиск</span>}
                {agent.tags.includes('kb') && <span className="agent-tag tag-kb">📚 База знаний</span>}
                <span className="agent-tag tag-custom">✨ Мой агент</span>
              </div>
              <div className="agent-actions">
                <button className="btn-s btn-switch">▶ Запустить</button>
                <button className="btn-s btn-rename">✏️ Изменить</button>
                <button className="btn-s btn-del" onClick={() => handleDelete(agent.id)}>🗑</button>
              </div>
            </div>
          ))}

          {myAgents.length < MAX_MY_AGENTS && (
            <div className="add-agent-card" onClick={() => setView('create')}>
              <div className="agent-avatar av-new" style={{ width: 44, height: 44, borderRadius: 12, fontSize: 22 }}>➕</div>
              <div>
                <div style={{ color: '#5ba3e0', fontSize: 14, fontWeight: 600 }}>Создать агента</div>
                <div style={{ color: '#5a7a8a', fontSize: 12, marginTop: 2 }}>Ещё {MAX_MY_AGENTS - myAgents.length} слота доступно</div>
              </div>
            </div>
          )}

          <div className="section-header">Готовые агенты</div>
          {GALLERY_AGENTS.map(agent => (
            <div key={agent.id} className="agent-card preset">
              <div className="agent-card-top">
                <div className={`agent-avatar ${agent.iconClass}`}>{agent.icon}</div>
                <div className="agent-info">
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-desc">{agent.desc}</div>
                </div>
              </div>
              <div className="agent-tags">
                {agent.tags.includes('web') && <span className="agent-tag tag-web">🌐 Веб-поиск</span>}
                {agent.tags.includes('kb') && <span className="agent-tag tag-kb">📚 База знаний</span>}
                <span className="agent-tag tag-preset">✓ Готовый</span>
              </div>
              <div className="agent-actions">
                <button className="btn-s btn-switch">▶ Запустить</button>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'gallery' && (
        <>
          <div className="section-header">Готовые агенты</div>
          {GALLERY_AGENTS.map(agent => (
            <div key={agent.id} className="agent-card preset">
              <div className="agent-card-top">
                <div className={`agent-avatar ${agent.iconClass}`}>{agent.icon}</div>
                <div className="agent-info">
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-desc">{agent.desc}</div>
                </div>
              </div>
              <div className="agent-tags">
                {agent.tags.includes('web') && <span className="agent-tag tag-web">🌐 Веб-поиск</span>}
                {agent.tags.includes('kb') && <span className="agent-tag tag-kb">📚 База знаний</span>}
                <span className="agent-tag tag-preset">✓ Готовый</span>
              </div>
              <div className="agent-actions">
                <button className="btn-s btn-switch">▶ Запустить</button>
              </div>
            </div>
          ))}

          <div className="tier-lock">
            <span style={{ fontSize: 16 }}>🔒</span>
            <span className="lock-text">Создавайте своих агентов на тарифе BASE и выше</span>
            <button className="lock-upgrade">Upgrade</button>
          </div>
        </>
      )}
    </>
  );
}
