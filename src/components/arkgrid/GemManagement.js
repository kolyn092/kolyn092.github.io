import React from 'react';
import { useApp } from '../../context/AppContext';
import GemCard from './GemCard';
import GemForm from './GemForm';

const GemManagement = React.memo(function GemManagement() {
  const { state, dispatch, ActionTypes } = useApp();
  const { gems, currentPage } = state;

  const handleToggleAddForm = () => {
    dispatch({
      type: ActionTypes.TOGGLE_ADD_FORM
    });
  };

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>
          {currentPage === '질서' ? '⚖️ 질서' : '🌪️ 혼돈'} 젬 관리
        </h2>
        <button className="btn-primary" onClick={handleToggleAddForm}>
          + 젬 추가
        </button>
      </div>

      <GemForm />

      <div className="gem-grid">
        {gems.map(gem => (
          <GemCard key={gem.id} gem={gem} />
        ))}
      </div>
    </div>
  );
});

export default GemManagement;
