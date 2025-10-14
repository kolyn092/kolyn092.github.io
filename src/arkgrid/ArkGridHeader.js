import React from 'react';
import { useApp } from '../context/AppContext';
import ArkGridDataControls from './ArkGridDataControls';

const Header = React.memo(function Header() {
  const { state, dispatch, ActionTypes } = useApp();
  const { currentPage } = state;

  const handlePageSwitch = (page) => {
    dispatch({
      type: ActionTypes.SWITCH_PAGE,
      payload: page
    });
  };

  return (
    <div className="header">
      <h1>아크그리드 최적화 시뮬레이터</h1>
      <p>데이터는 질서 따로 혼돈 따로 저장해주세요</p>
      
      <div className="page-switcher">
        <button 
          className={currentPage === '질서' ? 'active' : ''}
          onClick={() => handlePageSwitch('질서')}
        >
          ⚖️ 질서
        </button>
        <button 
          className={currentPage === '혼돈' ? 'active' : ''}
          onClick={() => handlePageSwitch('혼돈')}
        >
          🌪️ 혼돈
        </button>
      </div>
      
      <ArkGridDataControls />
    </div>
  );
});

export default Header;
