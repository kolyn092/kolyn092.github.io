import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const MainHeader = React.memo(function MainHeader() {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const isActive = (path) => {
    return location.pathname === path || location.hash === `#${path}`;
  };

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <span className="logo-icon">KolynLab</span>
            <span className="logo-text"></span>
          </Link>
        </div>
        
        {/* <nav className="header-nav">
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
                ⚔️ 
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/user-management" 
                className={`nav-link ${isActive('/user-management') ? 'active' : ''}`}
              >
                👥 
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/api-test" 
                className={`nav-link ${isActive('/api-test') ? 'active' : ''}`}
              >
                🔧 
              </Link>
            </li>
          </ul>
        </nav> */}
        
        <div className="header-actions">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            title={isDarkMode ? "라이트 모드로 변경" : "다크 모드로 변경"}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
});

export default MainHeader;
