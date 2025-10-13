import React from 'react';
import { Link } from 'react-router-dom';

const NewHomePage = React.memo(function NewHomePage() {
  return (
    <div className="main-content">
      <div className="content-container">
        {/* 히어로 섹션 */}
        <div className="hero-section">
          <h1 className="hero-title">
            🚀 Kolyn092's Projects
          </h1>
          <p className="hero-subtitle">
            개발 프로젝트들을 확인해보세요
          </p>
          <p className="hero-description">
            다양한 웹 애플리케이션과 도구들을 통해 더 나은 개발 경험을 제공합니다.
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

          {/* 사용자 관리 */}
          <div className="feature-card">
            <div className="feature-card-header">
              <span className="feature-icon">👥</span>
              <h2 className="feature-title">사용자 관리</h2>
            </div>
            <p className="feature-description">
              HTTP 통신을 통한 사용자 CRUD 기능을 테스트할 수 있습니다. 
              RESTful API와 React의 조합으로 구현된 완전한 사용자 관리 시스템입니다.
            </p>
            <Link to="/user-management" className="feature-link">
              사용자 관리
            </Link>
          </div>

          {/* API 테스트 */}
          <div className="feature-card">
            <div className="feature-card-header">
              <span className="feature-icon">🔧</span>
              <h2 className="feature-title">API 테스트</h2>
            </div>
            <p className="feature-description">
              다양한 HTTP 요청을 테스트하고 응답을 확인할 수 있습니다. 
              GET, POST, PUT, DELETE 요청을 실시간으로 테스트해보세요.
            </p>
            <Link to="/api-test" className="feature-link">
              API 테스트
            </Link>
          </div>

          {/* 개발 도구 */}
          <div className="feature-card">
            <div className="feature-card-header">
              <span className="feature-icon">🛠️</span>
              <h2 className="feature-title">개발 도구</h2>
            </div>
            <p className="feature-description">
              React, Node.js, 그리고 다양한 최신 기술 스택을 활용한 
              개발 도구들과 유틸리티들을 제공합니다.
            </p>
            <Link to="/api-test" className="feature-link">
              개발 도구
            </Link>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>프로젝트</h3>
              <p>다양한 웹 애플리케이션과 도구들을 통해 더 나은 개발 경험을 제공합니다.</p>
            </div>
            <div className="footer-section">
              <h3>기술 스택</h3>
              <p>React, Node.js, JavaScript, HTML5, CSS3</p>
            </div>
            <div className="footer-section">
              <h3>연락처</h3>
              <p>GitHub: kolyn092</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Kolyn092. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
});

export default NewHomePage;
