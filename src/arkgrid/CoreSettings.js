import React from 'react';
import CoreCard from './CoreCard';
import { useApp } from '../context/AppContext';

const CoreSettings = React.memo(function CoreSettings() {
  const { state, dispatch, ActionTypes } = useApp();
  const { cores, currentPage, playerType } = state;

  const handlePlayerTypeChange = (e) => {
    dispatch({
      type: ActionTypes.SET_PLAYER_TYPE,
      payload: e.target.value
    });
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>
          {currentPage === '질서' ? '⚖️ 질서' : '🌪️ 혼돈'} 코어 설정 (우선순위대로)
        </h2>
        <div className="player-type-toggle">
          <label className="toggle-label">플레이어 타입:</label>
          <div className="toggle-buttons">
            <button
              className={`toggle-btn ${playerType === '딜러' ? 'active' : ''}`}
              onClick={() => handlePlayerTypeChange({ target: { value: '딜러' } })}
            >
              ⚔️ 딜러
            </button>
            <button
              className={`toggle-btn ${playerType === '서폿' ? 'active' : ''}`}
              onClick={() => handlePlayerTypeChange({ target: { value: '서폿' } })}
            >
              🛡️ 서폿
            </button>
          </div>
        </div>
      </div>
      <div className="core-grid">
        {cores.map(core => (
          <CoreCard key={core.id} core={core} />
        ))}
      </div>
    </div>
  );
});

export default CoreSettings;
