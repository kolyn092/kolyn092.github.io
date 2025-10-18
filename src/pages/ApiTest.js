import React, { useState } from 'react';
import { useHttp } from '../hooks/useHttp';
import HttpForm from '../components/forms/HttpForm';

// API 테스트 페이지
const ApiTest = React.memo(function ApiTest() {
  const { loading, error, get, post, put, delete: del } = useHttp();
  const [response, setResponse] = useState(null);
  const [requestType, setRequestType] = useState('GET');
  const [endpoint, setEndpoint] = useState('/armories/characters');
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');

  // API 키 변경 감지
  React.useEffect(() => {
    const handleStorageChange = () => {
      setApiKey(localStorage.getItem('apiKey') || '');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // API 요청 실행
  const handleApiRequest = async (formData) => {
    try {
      let result;
      
      switch (requestType) {
        case 'GET':
          result = await get(endpoint);
          break;
        case 'POST':
          result = await post(endpoint, formData);
          break;
        case 'PUT':
          result = await put(endpoint, formData);
          break;
        case 'DELETE':
          result = await del(endpoint);
          break;
        default:
          throw new Error('지원하지 않는 요청 타입입니다.');
      }
      
      setResponse(result);
    } catch (err) {
      console.error('API 요청 실패:', err);
      setResponse({ error: err.message });
    }
  };

  // 요청 타입 변경
  const handleRequestTypeChange = (e) => {
    setRequestType(e.target.value);
  };

  // 엔드포인트 변경
  const handleEndpointChange = (e) => {
    setEndpoint(e.target.value);
  };

  // 응답 초기화
  const handleClearResponse = () => {
    setResponse(null);
  };

  // 폼 필드 정의 (POST, PUT 요청용) - 로스트아크 API용
  const formFields = [
    {
      name: 'CategoryCode',
      label: '카테고리 코드',
      type: 'number',
      placeholder: '20000 (예: 무기)'
    },
    {
      name: 'ItemTier',
      label: '아이템 티어',
      type: 'number',
      placeholder: '3 (예: 티어 3)'
    },
    {
      name: 'ItemGrade',
      label: '아이템 등급',
      type: 'text',
      placeholder: '전설 (예: 전설, 영웅)'
    },
    {
      name: 'ItemName',
      label: '아이템 이름',
      type: 'text',
      placeholder: '검색할 아이템 이름'
    }
  ];

  return (
    <div className="api-test">
      <h1>로스트아크 API 테스트</h1>
      
      {/* API 키 상태 */}
      <div className="api-key-status">
        <h3>현재 API 키 상태</h3>
        <p className={apiKey ? 'api-key-valid' : 'api-key-missing'}>
          {apiKey ? `✅ API 키 설정됨: ${apiKey.substring(0, 8)}...` : '❌ API 키가 설정되지 않았습니다'}
        </p>
        <p className="api-key-note">
          로스트아크 API 키를 설정하면 자동으로 Authorization 헤더에 포함됩니다.
          <br />
          <a href="https://developer-lostark.game.onstove.com" target="_blank" rel="noopener noreferrer" style={{color: '#667eea', textDecoration: 'underline'}}>
            로스트아크 개발자 사이트에서 API 키를 발급받으세요
          </a>
        </p>
      </div>
      
      {/* 요청 설정 */}
      <div className="request-config">
        <h2>요청 설정</h2>
        
        <div className="config-row">
          <label>
            요청 타입:
            <select 
              value={requestType} 
              onChange={handleRequestTypeChange}
              className="form-input"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </label>
        </div>
        
        <div className="config-row">
          <label>
            엔드포인트:
            <select 
              value={endpoint} 
              onChange={handleEndpointChange}
              className="form-input"
            >
              <option value="/armories/characters">캐릭터 정보 조회 (GET)</option>
              <option value="/armories/characters/{characterName}">특정 캐릭터 정보 (GET)</option>
              <option value="/characters/{characterName}/siblings">캐릭터 형제 캐릭터 (GET)</option>
              <option value="/gamecontents/calendar">게임 컨텐츠 캘린더 (GET)</option>
              <option value="/markets/items">경매장 아이템 조회 (POST)</option>
              <option value="/markets/items/{itemId}">특정 아이템 정보 (GET)</option>
              <option value="/guilds/rankings">길드 랭킹 (GET)</option>
              <option value="/characters/{characterName}/siblings">캐릭터 형제 캐릭터 (GET)</option>
            </select>
          </label>
        </div>
        
        <div className="config-row">
          <label>
            커스텀 엔드포인트:
            <input
              type="text"
              value={endpoint}
              onChange={handleEndpointChange}
              className="form-input"
              placeholder="/armories/characters/캐릭터명"
            />
          </label>
        </div>
      </div>

      {/* 폼 (POST, PUT 요청용) */}
      {(requestType === 'POST' || requestType === 'PUT') && (
        <div className="form-section">
          <h2>요청 데이터</h2>
          <HttpForm
            fields={formFields}
            onSubmit={handleApiRequest}
            submitText="요청 실행"
            resetText="초기화"
          />
        </div>
      )}

      {/* GET, DELETE 요청 버튼 */}
      {(requestType === 'GET' || requestType === 'DELETE') && (
        <div className="simple-request">
          <button
            onClick={() => handleApiRequest({})}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? '요청 중...' : `${requestType} 요청 실행`}
          </button>
        </div>
      )}

      {/* 응답 표시 */}
      {response && (
        <div className="response-section">
          <div className="response-header">
            <h2>응답 결과</h2>
            <button
              onClick={handleClearResponse}
              className="btn btn-secondary btn-sm"
            >
              초기화
            </button>
          </div>
          
          <div className="response-content">
            <pre className="response-json">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* 에러 표시 */}
      {error && (
        <div className="error-section">
          <h2>에러</h2>
          <div className="error-message">{error}</div>
        </div>
      )}
    </div>
  );
});

export default ApiTest;
