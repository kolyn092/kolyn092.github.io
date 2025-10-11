import React, { useState, useEffect } from 'react';
import { useApp, OPTION_TYPES } from '../context/AppContext';

function GemForm() {
  const { state, dispatch, ActionTypes } = useApp();
  const { editingGem, showAddForm } = state;
  
  const [formData, setFormData] = useState({
    cost: 1,
    points: 1,
    option1: '아군피해강화',
    option1Level: 1,
    option2: '아군공격강화',
    option2Level: 0
  });

  useEffect(() => {
    if (editingGem) {
      const gem = state.gems.find(g => g.id === editingGem);
      if (gem) {
        setFormData({
          cost: gem.cost,
          points: gem.points,
          option1: gem.option1,
          option1Level: gem.option1Level,
          option2: gem.option2,
          option2Level: gem.option2Level
        });
      }
    } else {
      setFormData({
        cost: 1,
        points: 1,
        option1: '아군피해강화',
        option1Level: 1,
        option2: '아군공격강화',
        option2Level: 0
      });
    }
  }, [editingGem, state.gems]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingGem) {
      dispatch({
        type: ActionTypes.UPDATE_GEM,
        payload: {
          id: editingGem,
          ...formData
        }
      });
    } else {
      dispatch({
        type: ActionTypes.ADD_GEM,
        payload: formData
      });
    }
  };

  const handleCancel = () => {
    dispatch({
      type: ActionTypes.TOGGLE_ADD_FORM
    });
  };

  if (!showAddForm) return null;

  return (
    <div className="add-form">
      <h3>{editingGem ? '젬 편집' : '새 젬 추가'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field small">
            <label>의지력 비용</label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>
          <div className="form-field small">
            <label>포인트</label>
            <input
              type="number"
              value={formData.points}
              onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>
          <div className="form-field medium">
            <label>옵션1 타입</label>
            <select
              value={formData.option1}
              onChange={(e) => handleInputChange('option1', e.target.value)}
            >
              {OPTION_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-field small">
            <label>옵션1 레벨</label>
            <input
              type="number"
              value={formData.option1Level}
              onChange={(e) => handleInputChange('option1Level', parseInt(e.target.value) || 0)}
              min="0"
              max="5"
            />
          </div>
          <div className="form-field medium">
            <label>옵션2 타입</label>
            <select
              value={formData.option2}
              onChange={(e) => handleInputChange('option2', e.target.value)}
            >
              {OPTION_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-field small">
            <label>옵션2 레벨</label>
            <input
              type="number"
              value={formData.option2Level}
              onChange={(e) => handleInputChange('option2Level', parseInt(e.target.value) || 0)}
              min="0"
              max="5"
            />
          </div>
          <div className="form-buttons">
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="btn-primary">
              {editingGem ? '수정' : '추가'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GemForm;
