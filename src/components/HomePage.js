import React from 'react';
import { Link } from 'react-router-dom';

const NewHomePage = React.memo(function NewHomePage() {
  return (
    <div className="main-content">
      <div className="content-container">
        {/* 히어로 섹션 */}
        <div className="hero-section">
          <h1 className="hero-title">

          </h1>
          <p className="hero-subtitle">
            
          </p>
          <p className="hero-description">
            
          </p>
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
      </div>

      {/* 푸터 */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-bottom">
            <p>&copy; 2024 Kolyn092. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default NewHomePage;
