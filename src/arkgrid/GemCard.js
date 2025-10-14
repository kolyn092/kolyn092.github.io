import React from 'react';
import { useApp } from '../context/AppContext';
import { calculateGemPower } from './gemCalculations';

const GemCard = React.memo(function GemCard({ gem }) {
  const { dispatch, ActionTypes } = useApp();

  const handleEdit = (e) => {
    e.stopPropagation();
    dispatch({
      type: ActionTypes.SET_EDITING_GEM,
      payload: gem.id
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('이 젬을 삭제하시겠습니까?')) {
      dispatch({
        type: ActionTypes.DELETE_GEM,
        payload: gem.id
      });
    }
  };

  const handleToggleSelection = () => {
    // This would be used for manual gem selection if needed
    console.log('Toggle gem selection:', gem.id);
  };

  return (
    <div className="gem-card" onClick={handleToggleSelection}>
      <div className="gem-number">{gem.gemNumber}</div>
      <div className="gem-info">
        <div className="gem-stats">
          <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
            의지력: {gem.cost}
          </span>
          <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
            포인트: {gem.points}
          </span>
        </div>
        <div className="gem-option">
          <span className="gem-option-label">옵션1:</span>
          <span className="gem-option-value">{gem.option1} Lv.{gem.option1Level}</span>
        </div>
        {gem.option2Level > 0 && (
          <div className="gem-option">
            <span className="gem-option-label">옵션2:</span>
            <span className="gem-option-value">{gem.option2} Lv.{gem.option2Level}</span>
          </div>
        )}
        <div className="gem-total">
          <span className="gem-total-value">
            총 증가량: {calculateGemPower(gem).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="gem-actions">
        <button 
          className="btn-small btn-edit" 
          onClick={handleEdit}
        >
          편집
        </button>
        <button 
          className="btn-small btn-delete" 
          onClick={handleDelete}
        >
          삭제
        </button>
      </div>
    </div>
  );
});

export default GemCard;
