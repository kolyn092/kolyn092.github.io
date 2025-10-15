import React from 'react';
import { useApp, CORE_TYPES, CORE_LIMITS } from '../context/AppContext';

const CoreCard = React.memo(function CoreCard({ core }) {
  const { dispatch, ActionTypes } = useApp();

  const getGradeClass = (grade) => {
    const gradeMap = {
      '영웅': 'hero',
      '전설': 'legend', 
      '유물': 'relic',
      '고대': 'ancient'
    };
    return gradeMap[grade] || 'hero';
  };

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
    if (type.includes('해 코어')) return 'sun';
    if (type.includes('달 코어')) return 'moon';
    return 'star';
  };

  return (
    <div className={`core-card grade-${getGradeClass(core.grade)}`}>
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
        <div style={{ marginTop: '8px', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
        </div>
      </div>
      <div className="core-limit">
        <span className="core-limit-label">의지력 한도</span>
        <span className="core-limit-value">
          {core.limit}
        </span>
      </div>
    </div>
  );
});

export default CoreCard;
