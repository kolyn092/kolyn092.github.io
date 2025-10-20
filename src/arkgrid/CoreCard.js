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

  const handleTargetPointsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    dispatch({
      type: ActionTypes.UPDATE_CORE_TARGET_POINTS,
      payload: { coreId: core.id, targetPoints: selectedOptions }
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
      <div className="form-group">
        <label className="form-label">목표 포인트</label>
        <select
          multiple
          className="form-select"
          value={core.targetPoints || []}
          onChange={handleTargetPointsChange}
          style={{ minHeight: '80px' }}
        >
          <option value="0">0 (효과 없음)</option>
          <option value="10">10 (효과 활성화)</option>
          <option value="14">14 (효과 활성화)</option>
          <option value="17">17 (효과 활성화)</option>
          <option value="18">18 (효과 활성화)</option>
          <option value="19">19 (효과 활성화)</option>
          <option value="20">20 (효과 활성화)</option>
        </select>
        <div style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Ctrl+클릭으로 여러 포인트 선택 가능
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
