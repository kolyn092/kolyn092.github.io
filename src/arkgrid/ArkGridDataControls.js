import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';

function DataControls() {
  const { state, dispatch, ActionTypes } = useApp();
  const { cores, gems, currentPage } = state;
  const fileInputRef = useRef(null);

  const handleExport = () => {
    // localStorage에서 모든 페이지 데이터 가져오기
    const savedData = localStorage.getItem('arkGridData');
    let allData = {};
    
    if (savedData) {
      try {
        allData = JSON.parse(savedData);
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        allData = {};
      }
    }
    
    // 현재 페이지 데이터도 포함
    allData[currentPage] = {
      gems: gems,
      cores: cores
    };
    
    const data = {
      ...allData,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ark-grid-unified-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // 통합 형식 (질서/혼돈 키가 있는 경우)
        if (importedData['질서'] || importedData['혼돈']) {
          // localStorage에 통합 데이터 저장
          localStorage.setItem('arkGridData', JSON.stringify(importedData));
          
          // 현재 페이지 데이터 로드
          const pageData = importedData[currentPage];
          if (pageData && pageData.gems && pageData.cores) {
            const nextGemId = Math.max(...pageData.gems.map(g => g.id), 0) + 1;
            dispatch({
              type: ActionTypes.LOAD_DATA,
              payload: { 
                cores: pageData.cores, 
                gems: pageData.gems, 
                nextGemId 
              }
            });
          }
          
          // 로드된 페이지 수 계산
          const loadedPages = [];
          if (importedData['질서'] && importedData['질서'].gems && importedData['질서'].cores) {
            loadedPages.push('질서');
          }
          if (importedData['혼돈'] && importedData['혼돈'].gems && importedData['혼돈'].cores) {
            loadedPages.push('혼돈');
          }
          
          alert(`${loadedPages.join(', ')} 페이지의 데이터를 성공적으로 불러왔습니다. 페이지를 전환하면 해당 페이지의 데이터가 자동으로 로드됩니다.`);
        }
        // 단일 페이지 형식 (기존 형식)
        else if (importedData.gems && importedData.cores) {
          const nextGemId = Math.max(...importedData.gems.map(g => g.id), 0) + 1;
          dispatch({
            type: ActionTypes.LOAD_DATA,
            payload: { 
              cores: importedData.cores, 
              gems: importedData.gems, 
              nextGemId 
            }
          });
          alert(`${currentPage} 페이지의 젬 데이터와 코어 설정을 성공적으로 불러왔습니다.`);
        } else if (Array.isArray(importedData)) {
          const nextGemId = Math.max(...importedData.map(g => g.id), 0) + 1;
          dispatch({
            type: ActionTypes.LOAD_DATA,
            payload: { 
              gems: importedData, 
              nextGemId 
            }
          });
          alert(`${currentPage} 페이지의 젬 데이터를 성공적으로 불러왔습니다.`);
        } else {
          alert('올바른 데이터 형식이 아닙니다.');
        }
      } catch (error) {
        alert('파일을 읽는 중 오류가 발생했습니다: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      dispatch({
        type: ActionTypes.RESET_DATA
      });
    }
  };

  return (
    <div className="controls">
      <button className="btn" onClick={handleExport}>
        💾 데이터 저장
      </button>
      <label className="btn" htmlFor="importFile">
        📁 데이터 불러오기
      </label>
      <input
        ref={fileInputRef}
        type="file"
        id="importFile"
        className="file-input"
        accept=".json"
        onChange={handleImport}
      />
      <button className="btn" onClick={handleReset}>
        🔄 데이터 초기화
      </button>
    </div>
  );
}

export default DataControls;
