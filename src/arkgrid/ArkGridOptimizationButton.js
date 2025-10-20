import React from 'react';
import { useApp } from '../context/AppContext';
import { ArkGridOptimization } from './ArkGridOptimization';

function ArkGridOptimizationButton() {
  const { state, dispatch, ActionTypes } = useApp();
  const { cores, gems, currentPage, playerType } = state;

  const handleOptimize = () => {
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
