export default function PlansPage() {
  return (
    <>
      <div className="page-header">
        <span className="page-title">Тарифы</span>
      </div>

      {/* FREE */}
      <div className="plan-card current">
        <div className="plan-top">
          <div className="plan-name">FREE <span className="badge-current">текущий</span></div>
          <div className="plan-price">0 ₽<span>/мес</span></div>
        </div>
        <div className="plan-features">
          <div className="plan-feature">50 000 токенов / месяц</div>
          <div className="plan-feature">10 диалогов</div>
          <div className="plan-feature">Готовые агенты (только просмотр)</div>
          <div className="plan-feature">Модель DeepSeek</div>
        </div>
      </div>

      {/* BASE */}
      <div className="plan-card">
        <div className="plan-top">
          <div className="plan-name">BASE</div>
          <div className="plan-price">299 ₽<span>/мес</span></div>
        </div>
        <div className="plan-features">
          <div className="plan-feature">500 000 токенов / месяц</div>
          <div className="plan-feature">10 диалогов</div>
          <div className="plan-feature plan-feature-purple">🤖 До 5 своих агентов</div>
          <div className="plan-feature plan-feature-purple">🌐 Поиск в интернете</div>
          <div className="plan-feature">DeepSeek + Claude + Llama</div>
          <div className="plan-feature">Голосовые сообщения</div>
        </div>
        <button className="plan-btn-upgrade">Перейти на BASE →</button>
      </div>

      {/* PRO */}
      <div className="plan-card">
        <div className="plan-top">
          <div className="plan-name">PRO</div>
          <div className="plan-price">799 ₽<span>/мес</span></div>
        </div>
        <div className="plan-features">
          <div className="plan-feature">2 000 000 токенов / месяц</div>
          <div className="plan-feature">10 диалогов + архив</div>
          <div className="plan-feature plan-feature-purple">🤖 Неограниченно агентов</div>
          <div className="plan-feature plan-feature-purple">🌐 Поиск в интернете</div>
          <div className="plan-feature plan-feature-purple">📚 База знаний (RAG)</div>
          <div className="plan-feature">Все модели</div>
          <div className="plan-feature">Генерация изображений</div>
        </div>
        <button className="plan-btn-upgrade">Перейти на PRO →</button>
      </div>
    </>
  );
}
