import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NewHomePage = React.memo(function NewHomePage() {
  const [characterName, setCharacterName] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (characterName.trim()) {
      navigate(`/character-info?name=${encodeURIComponent(characterName.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="main-content">
      <div className="content-container">
        {/* 히어로 섹션 */}
        <div className="hero-section">
          <h1 className="hero-title">
            로스트아크 캐릭터 정보 조회
          </h1>
          <p className="hero-subtitle">
            캐릭터명을 입력하여 상세 정보를 확인하세요
          </p>
          <p className="hero-description">
            로스트아크 공식 API를 통해 실시간 캐릭터 정보를 제공합니다
          </p>
        </div>

        {/* 캐릭터 검색 섹션 */}
        <div className="character-search-section">
          <div className="search-container">
            <div className="search-input-group">
              <input
                type="text"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="캐릭터명을 입력하세요"
                className="character-search-input"
              />
              <button
                onClick={handleSearch}
                disabled={!characterName.trim()}
                className="search-button"
              >
                검색
              </button>
            </div>
            <p className="search-note">
              정확한 캐릭터명을 입력해주세요. 대소문자를 구분합니다.
            </p>
          </div>
        </div>

        {/* 기능 카드들 */}
        <div className="feature-cards">
          {/* 아크그리드 시뮬레이터 */}
          <div className="feature-card">
            <div className="feature-card-header">
              <span className="feature-icon">⚔️</span>
              <h2 className="feature-title">아크그리드 최적화 시뮬레이터</h2>
            </div>
            <p className="feature-description">
              로스트아크 아크그리드 젬 조합을 최적화하는 도구입니다. 
              질서와 혼돈 페이지를 분리하여 각각의 젬 조합을 효율적으로 관리할 수 있습니다.
            </p>
            <Link to="/ark-grid-optimizer" className="feature-link">
              시뮬레이터 사용하기
            </Link>
          </div>
        </div>
        <div className="feature-cards">
          {/* API 테스트 */}
          <div className="feature-card">
            <div className="feature-card-header">
              <span className="feature-icon">🔧</span>
              <h2 className="feature-title">API 테스트</h2>
            </div>
            <p className="feature-description">
              API 테스트 페이지입니다.
            </p>
            <Link to="/api-test" className="feature-link">
              API 테스트 사용하기
            </Link>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-bottom">
            <p>&copy; 2025 Kolyn092. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default NewHomePage;
