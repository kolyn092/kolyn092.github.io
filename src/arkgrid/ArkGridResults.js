import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ArkGridResultCard from './ArkGridResultCard';

const ArkGridResults = React.memo(function Results() {
  const { state } = useApp();
  const { results, currentPage } = state;
  const [selectedCombination, setSelectedCombination] = useState(null);

  if (!results || results.length === 0) {
    return null;
  }

  const handleCombinationSelect = (combinationData, index) => {
    setSelectedCombination({ ...combinationData, index });
  };

  return (
    <div className="section">
      <h2>
        {currentPage === '질서' ? '⚖️ 질서' : '🌪️ 혼돈'} 최적 조합 결과 (상위 3개)
      </h2>
      
      {/* 조합 요약 목록 */}
      <div className="combination-summary-list">
        {results.map((combinationData, index) => (
          <div 
            key={index} 
            className={`combination-summary-card ${selectedCombination?.index === index ? 'selected' : ''}`}
            onClick={() => handleCombinationSelect(combinationData, index)}
          >
            <div className="summary-header">
              <h3>조합 #{index + 1}</h3>
              <div className="summary-stats">
                <span className="summary-points">
                  달성 포인트: [{combinationData.results.map(result => result.corePoints).join(', ')}]
                </span>
                <span className="summary-power">
                  총 전투력: {combinationData.totalPower.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 선택된 조합의 상세 정보 */}
      {selectedCombination && (
        <div className="selected-combination-details">
          <h3>선택된 조합 #{selectedCombination.index + 1} 상세 정보</h3>
          <div className="combination-details">
            {selectedCombination.results.map((result, coreIndex) => (
              <ArkGridResultCard 
                key={coreIndex} 
                combo={result} 
                showCoreInfo={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default ArkGridResults;
