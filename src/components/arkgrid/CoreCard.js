import React from 'react';
import { useApp, CORE_TYPES, CORE_LIMITS } from '../../context/AppContext';

const CoreCard = React.memo(function CoreCard({ core }) {
  const { dispatch, ActionTypes } = useApp();

  const handleTypeChange = (type) => {
    dispatch({
      type: ActionTypes.UPDATE_CORE_TYPE,
      payload: { coreId: core.id, type }
    });
  };

  const handleGradeChange = (grade) => {
    dispatch({
      type: ActionTypes.UPDATE_CORE_GRADE,
      payload: { coreId: core.id, grade }
    });
  };

  const getIconClass = (type) => {
    if (type === '해 코어') return 'sun';
    if (type === '달 코어') return 'moon';
    return 'star';
  };

  return (
    <div className="core-card">
      <div className="core-header">
        <div className={`core-icon ${getIconClass(core.type)}`}></div>
        <h3 className="core-title">{core.name}</h3>
      </div>
      <div className="form-group">
        <label className="form-label">코어 종류</label>
        <select 
          className="form-select" 
          value={core.type}
          onChange={(e) => handleTypeChange(e.target.value)}
        >
          {CORE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">등급</label>
        <select 
          className="form-select" 
          value={core.grade}
          onChange={(e) => handleGradeChange(e.target.value)}
        >
          {Object.keys(CORE_LIMITS).map(grade => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
      </div>
      <div className="core-limit">
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>의지력 한도</span>
        <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#2d3748' }}>
          {core.limit}
        </span>
      </div>
    </div>
  );
});

export default CoreCard;
