const plans = [
  {
    id: 'free',
    name: 'FREE',
    price: 'Бесплатно',
    requests: '20',
    models: 'DeepSeek',
    features: ['20 запросов/мес', 'Текст и голос', 'DeepSeek'],
    active: true,
  },
  {
    id: 'base',
    name: 'BASE',
    price: '299 ₽/мес',
    requests: '500',
    models: 'Все модели',
    features: ['500 запросов/мес', 'Все модели', 'Фото + голос'],
    active: false,
  },
  {
    id: 'pro',
    name: 'PRO',
    price: '799 ₽/мес',
    requests: '∞',
    models: 'Все + приоритет',
    features: ['Безлимит', 'Приоритет', 'Все функции'],
    active: false,
  },
];

export default function PlansPage() {
  return (
    <div className="page">
      <div className="section-header">Тарифы</div>

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.active ? 'active' : ''}`}>
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">{plan.price}</div>
            {plan.features.map((f, i) => (
              <div key={i} className="plan-feature">
                {i === 0 ? '📨' : i === 1 ? '🤖' : '✨'} {f}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Детали тарифов */}
      <div className="card">
        <div className="card-title">🆓 FREE — Бесплатно</div>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 1.8, fontSize: 14 }}>
          <li>20 запросов в месяц</li>
          <li>Текстовый чат и голосовые сообщения</li>
          <li>Модель DeepSeek</li>
        </ul>
        <button className="btn-primary" style={{ marginTop: 12 }} disabled>
          Активный тариф
        </button>
      </div>

      <div className="card">
        <div className="card-title">⭐ BASE — 299 ₽/мес</div>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 1.8, fontSize: 14 }}>
          <li>500 запросов в месяц</li>
          <li>Все AI-модели (Claude, Llama, DeepSeek)</li>
          <li>Генерация изображений</li>
          <li>Голосовые сообщения</li>
        </ul>
        <button className="btn-primary" style={{ marginTop: 12 }}>
          Выбрать BASE ⭐
        </button>
      </div>

      <div className="card">
        <div className="card-title">👑 PRO — 799 ₽/мес</div>
        <ul style={{ paddingLeft: 20, marginTop: 8, lineHeight: 1.8, fontSize: 14 }}>
          <li>Безлимитные запросы</li>
          <li>Приоритетная обработка</li>
          <li>Все модели + новые первыми</li>
          <li>Расширенные настройки AI</li>
          <li>Системные промпты</li>
        </ul>
        <button className="btn-primary" style={{ marginTop: 12 }}>
          Выбрать PRO 👑
        </button>
      </div>
    </div>
  );
}
