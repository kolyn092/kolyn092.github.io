import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';

function DataControls() {
  const { state, dispatch, ActionTypes } = useApp();
  const { cores, gems, currentPage } = state;
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const data = {
      gems: gems,
      cores: cores,
      pageType: currentPage,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ark-grid-${currentPage === '질서' ? 'order' : 'chaos'}-data-${new Date().toISOString().split('T')[0]}.json`;
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
        
        if (importedData.gems && importedData.cores) {
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
