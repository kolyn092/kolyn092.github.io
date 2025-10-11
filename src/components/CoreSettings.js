import React from 'react';
import CoreCard from './CoreCard';
import { useApp } from '../context/AppContext';

function CoreSettings() {
  const { state } = useApp();
  const { cores, currentPage } = state;

  return (
    <div className="section">
      <h2>
        {currentPage === '질서' ? '⚖️ 질서' : '🌪️ 혼돈'} 코어 설정 (우선순위대로)
      </h2>
      <div className="core-grid">
        {cores.map(core => (
          <CoreCard key={core.id} core={core} />
        ))}
      </div>
    </div>
  );
}

export default CoreSettings;
