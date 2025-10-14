import React from 'react';
import { useApp } from '../context/AppContext';
import ResultCard from './arkgrid/ResultCard';

const Results = React.memo(function Results() {
  const { state } = useApp();
  const { results, currentPage } = state;

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="section">
      <h2>
        {currentPage === '질서' ? '⚖️ 질서' : '🌪️ 혼돈'} 최적 조합 결과
      </h2>
      <div className="results">
        {results.map((combo, index) => (
          <ResultCard key={index} combo={combo} />
        ))}
      </div>
    </div>
  );
});

export default Results;
