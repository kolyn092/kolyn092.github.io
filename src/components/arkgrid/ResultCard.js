import React from 'react';

function ResultCard({ combo }) {
  const getIconClass = (type) => {
    if (type === '해 코어') return 'sun';
    if (type === '달 코어') return 'moon';
    return 'star';
  };

  return (
    <div className="result-card">
      <div className="result-header">
        <div className={`result-icon ${getIconClass(combo.core.type)}`}></div>
        <h3 className="result-title">{combo.core.name} ({combo.core.type})</h3>
      </div>
      
      <div className="result-stats">
        <div className="stat-group">
          <div className="stat-label">총 전투력</div>
          <div className="stat-value large">{combo.power.toFixed(2)}</div>
        </div>
        <div className="stat-group">
          <div className="stat-label">코어 포인트</div>
          <div className="stat-value">{combo.corePoints}</div>
        </div>
        <div className="stat-group">
          <div className="stat-label">사용 의지력</div>
          <div className="stat-value">{combo.cost}/{combo.core.limit}</div>
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 12px 0', color: '#4a5568' }}>
          포함된 젬
        </h4>
        <div className="gem-list">
          {combo.gems.map(g => (
            <div key={g.id} className="gem-item">
              <div className="gem-item-header">
                <div className="gem-item-number">{g.gemNumber}</div>
                <span className="gem-item-stats">의지력: {g.cost}, 포인트: {g.points}</span>
              </div>
              <div className="gem-item-options">
                <div className="gem-item-option">옵션1: {g.option1} Lv.{g.option1Level}</div>
                {g.option2Level > 0 && (
                  <div className="gem-item-option">옵션2: {g.option2} Lv.{g.option2Level}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
