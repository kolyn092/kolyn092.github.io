import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        maxWidth: '600px',
        padding: '40px'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '20px',
          fontWeight: '700'
        }}>
          🚀 Kolyn092's Projects
        </h1>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '40px',
          opacity: '0.9'
        }}>
          개발 프로젝트들을 확인해보세요
        </p>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '30px',
          margin: '20px 0',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'transform 0.3s ease'
        }}>
          <h2 style={{
            margin: '0 0 15px 0',
            fontSize: '1.5rem'
          }}>
            ⚔️ 아크그리드 최적화 시뮬레이터
          </h2>
          <p style={{
            margin: '0 0 20px 0',
            fontSize: '1rem'
          }}>
            로스트아크 아크그리드 젬 조합을 최적화하는 도구입니다.
          </p>
          <Link 
            to="/ark-grid-optimizer" 
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            시뮬레이터 사용하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
