import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MainHeader = React.memo(function MainHeader() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.hash === `#${path}`;
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">Kolyn092</span>
          </Link>
        </div>
        
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                홈
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/ark-grid-optimizer" 
                className={`nav-link ${isActive('/ark-grid-optimizer') ? 'active' : ''}`}
              >
                ⚔️ 아크그리드 최적화 시뮬레이터
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/user-management" 
                className={`nav-link ${isActive('/user-management') ? 'active' : ''}`}
              >
                👥 사용자 관리
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/api-test" 
                className={`nav-link ${isActive('/api-test') ? 'active' : ''}`}
              >
                🔧 API 테스트
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="header-actions">
          <button className="theme-toggle" title="테마 변경">
            🌙
          </button>
        </div>
      </div>
    </header>
  );
});

export default MainHeader;
