import React, { useState, useEffect } from 'react';
import { useApp, OPTION_TYPES } from '../context/AppContext';
import { calculateGemPower } from './GemCalculations';

const GemCard = React.memo(function GemCard({ gem }) {
  const { state, dispatch, ActionTypes } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    cost: gem.cost,
    points: gem.points,
    option1: gem.option1,
    option1Level: gem.option1Level,
    option2: gem.option2,
    option2Level: gem.option2Level
  });

  useEffect(() => {
    setEditData({
      cost: gem.cost,
      points: gem.points,
      option1: gem.option1,
      option1Level: gem.option1Level,
      option2: gem.option2,
      option2Level: gem.option2Level
    });
  }, [gem]);

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    dispatch({
      type: ActionTypes.UPDATE_GEM,
      payload: {
        id: gem.id,
        ...editData
      }
    });
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setEditData({
      cost: gem.cost,
      points: gem.points,
      option1: gem.option1,
      option1Level: gem.option1Level,
      option2: gem.option2,
      option2Level: gem.option2Level
    });
    setIsEditing(false);
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

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleSelection = () => {
    if (!isEditing) {
      console.log('Toggle gem selection:', gem.id);
    }
  };

  if (isEditing) {
    return (
      <div className="gem-card editing">
        <div className="gem-number">{gem.gemNumber}</div>
        <div className="gem-info">
          <div className="gem-stats">
            <div className="gem-edit-field">
              <label>의지력:</label>
              <input
                type="number"
                value={editData.cost}
                onChange={(e) => handleInputChange('cost', parseInt(e.target.value) || 1)}
                min="1"
                className="gem-edit-input"
              />
            </div>
            <div className="gem-edit-field">
              <label>포인트:</label>
              <input
                type="number"
                value={editData.points}
                onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 1)}
                min="1"
                className="gem-edit-input"
              />
            </div>
          </div>
          <div className="gem-option">
            <span className="gem-option-label">옵션1:</span>
            <select
              value={editData.option1}
              onChange={(e) => handleInputChange('option1', e.target.value)}
              className="gem-edit-select"
            >
              {OPTION_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              value={editData.option1Level}
              onChange={(e) => handleInputChange('option1Level', parseInt(e.target.value) || 0)}
              min="0"
              max="5"
              className="gem-edit-input-small"
            />
          </div>
          <div className="gem-option">
            <span className="gem-option-label">옵션2:</span>
            <select
              value={editData.option2}
              onChange={(e) => handleInputChange('option2', e.target.value)}
              className="gem-edit-select"
            >
              {OPTION_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              value={editData.option2Level}
              onChange={(e) => handleInputChange('option2Level', parseInt(e.target.value) || 0)}
              min="0"
              max="5"
              className="gem-edit-input-small"
            />
          </div>
          <div className="gem-total">
            <span className="gem-total-value">
              총 증가량: {calculateGemPower(editData).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="gem-actions">
          <button 
            className="btn-small btn-save" 
            onClick={handleSave}
          >
            저장
          </button>
          <button 
            className="btn-small btn-cancel" 
            onClick={handleCancel}
          >
            취소
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
  }

  return (
    <div className="gem-card" onClick={handleToggleSelection}>
      <div className="gem-number">{gem.gemNumber}</div>
      <div className="gem-info">
        <div className="gem-stats">
          <span className="gem-cost">
            의지력: {gem.cost}
          </span>
          <span className="gem-points">
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
