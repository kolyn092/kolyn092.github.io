import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MainHeader = React.memo(function MainHeader() {
  const location = useLocation();
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [isEditing, setIsEditing] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || location.hash === `#${path}`;
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('apiKey', apiKey);
    setIsEditing(false);
  };

  const handleEditApiKey = () => {
    setIsEditing(true);
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
        
        <div className="header-actions">
          <div className="api-key-section">
            {isEditing ? (
              <div className="api-key-input-group">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="API 키를 입력하세요"
                  className="api-key-input"
                />
                <button 
                  onClick={handleSaveApiKey}
                  className="api-key-save-btn"
                >
                  저장
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="api-key-cancel-btn"
                >
                  취소
                </button>
              </div>
            ) : (
              <div className="api-key-display">
                <span className="api-key-label">
                  API 키: {apiKey ? '••••••••' : '설정되지 않음'}
                </span>
                <button 
                  onClick={handleEditApiKey}
                  className="api-key-edit-btn"
                >
                  {apiKey ? '수정' : '설정'}
                </button>
              </div>
            )}
          </div>
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
        
      </div>
    </header>
  );
});

export default MainHeader;
