import React from 'react';
import { useApp } from '../context/AppContext';
import { optimize } from '../utils/optimization';

function OptimizationButton() {
  const { state, dispatch, ActionTypes } = useApp();
  const { cores, gems, currentPage } = state;

  const handleOptimize = () => {
    const results = optimize(cores, gems);
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

export default OptimizationButton;
