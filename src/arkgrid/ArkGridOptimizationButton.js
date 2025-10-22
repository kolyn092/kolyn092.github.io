import React, { useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { ArkGridOptimization } from './ArkGridOptimization';

// 중단 가능한 최적화 실행 함수
function runOptimizationWithCancellation(cores, gems, currentPage, playerType, optimizationRef, signal) {
  // 중단 체크를 위한 플래그
  let isCancelled = false;
  
  // AbortSignal 이벤트 리스너 등록
  if (signal) {
    signal.addEventListener('abort', () => {
      isCancelled = true;
      console.log('중단 신호 수신됨');
    });
  }
  
  // 중단 체크 함수
  const checkCancellation = () => {
    if (optimizationRef.current === null || isCancelled || (signal && signal.aborted)) {
      isCancelled = true;
      return true;
    }
    return false;
  };
  
  // 최적화 실행을 여러 단계로 나누어 중단 가능하게 처리
  const runOptimization = () => {
    try {
      // 1단계: 조합 생성
      if (checkCancellation()) throw new Error('사용자에 의해 중단됨');
      
      // 2단계: 최적화 실행
      const results = ArkGridOptimization(cores, gems, currentPage, playerType);
      
      if (checkCancellation()) throw new Error('사용자에 의해 중단됨');
      
      return results;
    } catch (error) {
      if (isCancelled) {
        throw new Error('사용자에 의해 중단됨');
      }
      throw error;
    }
  };
  
  // 비동기로 실행하되 중단 가능하게 처리
  setTimeout(() => {
    try {
      const results = runOptimization();
      if (optimizationRef.current && !isCancelled) {
        optimizationRef.current.resolve(results);
      }
    } catch (error) {
      if (optimizationRef.current) {
        optimizationRef.current.reject(error);
      }
    }
  }, 0);
}

function ArkGridOptimizationButton() {
  const { state, dispatch, ActionTypes } = useApp();
  const { cores, gems, currentPage, playerType, isOptimizing, optimizationProgress } = state;
  const optimizationRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleOptimize = useCallback(async () => {
    if (isOptimizing) return;

    console.log(`=== ${currentPage} 페이지 최적화 실행 ===`);
    console.log('사용할 코어 수:', cores.length);
    console.log('사용할 젬 수:', gems.length);
    console.log('코어 정보:', cores.map(c => ({ id: c.id, name: c.name, type: c.type, grade: c.grade })));
    console.log('젬 정보:', gems.map(g => ({ id: g.id, cost: g.cost, points: g.points })));
    
    // AbortController 생성
    abortControllerRef.current = new AbortController();
    
    // 최적화 시작
    dispatch({ type: ActionTypes.START_OPTIMIZATION });
    
    try {
      // 진행률 업데이트를 위한 인터벌
      const progressInterval = setInterval(() => {
        dispatch({
          type: ActionTypes.UPDATE_OPTIMIZATION_PROGRESS,
          payload: Math.min(optimizationProgress + 1, 90)
        });
      }, 100);

      // 최적화 실행 (중단 가능한 비동기 처리)
      const results = await new Promise((resolve, reject) => {
        optimizationRef.current = { resolve, reject };
        
        // 중단 가능한 최적화 실행
        runOptimizationWithCancellation(cores, gems, currentPage, playerType, optimizationRef, abortControllerRef.current.signal);
      });

      clearInterval(progressInterval);
      
      // 완료
      dispatch({
        type: ActionTypes.UPDATE_OPTIMIZATION_PROGRESS,
        payload: 100
      });
      
      dispatch({
        type: ActionTypes.SET_RESULTS,
        payload: results
      });
      
      // 잠시 후 로딩 상태 해제
      setTimeout(() => {
        dispatch({ type: ActionTypes.STOP_OPTIMIZATION });
      }, 500);
      
    } catch (error) {
      if (error.name === 'AbortError' || error.message === '사용자에 의해 중단됨') {
        console.log('최적화가 중단되었습니다.');
      } else {
        console.error('최적화 실행 중 오류:', error);
      }
      dispatch({ type: ActionTypes.STOP_OPTIMIZATION });
    }
  }, [cores, gems, currentPage, playerType, isOptimizing, optimizationProgress, dispatch, ActionTypes]);

  const handleStop = useCallback(() => {
    console.log('최적화 중단 요청');
    
    // AbortController로 중단 신호 전송
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Promise reject
    if (optimizationRef.current) {
      optimizationRef.current.reject(new Error('사용자에 의해 중단됨'));
      optimizationRef.current = null;
    }
    
    dispatch({ type: ActionTypes.STOP_OPTIMIZATION });
  }, [dispatch, ActionTypes]);

  return (
    <div className="optimize-btn">
      {!isOptimizing ? (
        <button className="btn-optimize" onClick={handleOptimize}>
          {currentPage === '질서' ? '⚖️ 질서' : '🌪️ 혼돈'} 최적화 실행
        </button>
      ) : (
        <div className="optimization-loading">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              최적화 실행 중... {optimizationProgress}%
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${optimizationProgress}%` }}
              ></div>
            </div>
            <button className="btn-stop" onClick={handleStop}>
              중단
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArkGridOptimizationButton;
