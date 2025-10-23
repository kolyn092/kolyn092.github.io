import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ArkGridResultCard from './ArkGridResultCard';

const ArkGridResults = React.memo(function Results() {
  const { state } = useApp();
  const { results, currentPage, hasOptimized, isOptimizing } = state;
  const [selectedCombination, setSelectedCombination] = useState(null);

  // 페이지 변경 시 선택된 조합 초기화
  React.useEffect(() => {
    setSelectedCombination(null);
  }, [currentPage]);

  console.log('🔍 ArkGridResults 렌더링:', { hasOptimized, isOptimizing, resultsLength: results?.length, results });

  // 최적화 실행 중이거나 실행 전에는 아무것도 표시하지 않음
  if (isOptimizing || !hasOptimized) {
    console.log('❌ 최적화 실행 중이거나 실행 전 - 결과 카드 숨김');
    return null;
  }

  // 최적화 실행 후 결과가 없는 경우 (빈 배열이거나 null인 경우)
  if (!results || results.length === 0) {
    console.log('❌ 결과 없음 - "만족하는 조합이 없습니다" 표시');
    return (
      <div className="section">
        <h2>
          {currentPage === '질서' ? '⚖️ 질서' : '🌪️ 혼돈'} 최적 조합 결과
        </h2>
        <div className="no-results-message">
          <div className="no-results-content">
            <div className="no-results-icon">😔</div>
            <h3>만족하는 조합이 없습니다</h3>
            <p>현재 설정된 조건으로는 달성 가능한 조합을 찾을 수 없습니다.</p>
            <div className="no-results-suggestions">
              <p>다음과 같이 조정해보세요:</p>
              <ul>
                <li>• 목표 포인트를 낮춰보세요</li>
                <li>• 젬을 추가해보세요</li>
                <li>• 코어 등급을 높여보세요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
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
