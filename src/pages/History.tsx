// Mock данные — потом заменим на n8n API
const mockHistory = [
  { date: '26 мар', action: 'Регистрация бонус', credits: +50, type: 'plus' },
  { date: '25 мар', action: 'Генерация текста', credits: -2, type: 'minus' },
  { date: '25 мар', action: 'Голосовое сообщение', credits: -3, type: 'minus' },
  { date: '24 мар', action: 'Генерация изображения', credits: -5, type: 'minus' },
  { date: '24 мар', action: 'Генерация текста', credits: -2, type: 'minus' },
  { date: '23 мар', action: 'Голосовое сообщение', credits: -3, type: 'minus' },
  { date: '22 мар', action: 'Пополнение', credits: +100, type: 'plus' },
];

export default function HistoryPage() {
  const total = mockHistory.reduce((sum, item) => sum + item.credits, 0);

  return (
    <div className="page">
      <div className="section-header">История</div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">⚡ Баланс</div>
          <div className="card-value">250</div>
        </div>
        <div className="card">
          <div className="card-title">📊 Всего</div>
          <div className="card-value" style={{ color: total > 0 ? '#34c759' : undefined }}>
            {total > 0 ? '+' : ''}{total}
          </div>
        </div>
      </div>

      <div className="card">
        {mockHistory.map((item, i) => (
          <div key={i} className="history-item">
            <div>
              <div className="history-action">{item.action}</div>
              <div className="history-date">{item.date}</div>
            </div>
            <div className={`history-credits ${item.type === 'plus' ? 'credits-plus' : 'credits-minus'}`}>
              {item.credits > 0 ? '+' : ''}{item.credits} ⚡
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
