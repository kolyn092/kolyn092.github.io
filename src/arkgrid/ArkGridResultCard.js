import React from 'react';

function ArkGridResultCard({ combo, showCoreInfo = false }) {
  const getIconClass = (type) => {
    if (type === '해 코어') return 'sun';
    if (type === '달 코어') return 'moon';
    return 'star';
  };

  const getGradeClass = (grade) => {
    if (grade === '영웅') return 'hero';
    if (grade === '전설') return 'legend';
    if (grade === '유물') return 'relic';
    if (grade === '고대') return 'ancient';
    return '';
  };

  return (
    <div className={`result-card grade-${getGradeClass(combo.core.grade)} ${showCoreInfo ? 'core-info' : ''}`}>
      <div className="result-header">
        <div className={`result-icon ${getIconClass(combo.core.type)}`}></div>
        <h3 className="result-title">{combo.core.name} ({combo.core.type})</h3>
        {showCoreInfo && (
          <div className="core-target-info">
            <span className="target-points">목표: {combo.corePoints}포인트</span>
          </div>
        )}
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
        {combo.isEffectActive && (
          <div className="stat-group effect-active">
            <div className="stat-label">효과 활성화</div>
            <div className="stat-value">✅</div>
          </div>
        )}
      </div>

      {combo.gems.length > 0 ? (
        <div>
          <h4 className="gem-list-title">
            포함된 젬 ({combo.gems.length}개)
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
      ) : (
        <div className="no-gems">
          <p>젬이 배치되지 않음 (0포인트)</p>
        </div>
      )}
    </div>
  );
}

export default ArkGridResultCard;
