import React from 'react';
import { useApp } from '../context/AppContext';
import { ArkGridOptimization } from './ArkGridOptimization';

function ArkGridOptimizationButton() {
  const { state, dispatch, ActionTypes } = useApp();
  const { cores, gems, currentPage, playerType } = state;

  const handleOptimize = () => {
    console.log(`=== ${currentPage} 페이지 최적화 실행 ===`);
    console.log('사용할 코어 수:', cores.length);
    console.log('사용할 젬 수:', gems.length);
    console.log('코어 정보:', cores.map(c => ({ id: c.id, name: c.name, type: c.type, grade: c.grade })));
    console.log('젬 정보:', gems.map(g => ({ id: g.id, cost: g.cost, points: g.points })));
    
    const results = ArkGridOptimization(cores, gems, currentPage, playerType);
    dispatch({
      type: ActionTypes.SET_RESULTS,
      payload: results
    });
  };

  return (
    <div className="optimize-btn">
      <button className="btn-optimize" onClick={handleOptimize}>
        {currentPage === '질서' ? '⚖️ 질서' : '🌪️ 혼돈'} 최적화 실행
      </button>
    </div>
  );
}

export default ArkGridOptimizationButton;
