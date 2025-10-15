import React, { useState } from 'react';
import { useHttp } from '../hooks/UseHttp';
import HttpForm from '../components/forms/HttpForm';

// API 테스트 페이지
const ApiTest = React.memo(function ApiTest() {
  const { loading, error, get, post, put, delete: del } = useHttp();
  const [response, setResponse] = useState(null);
  const [requestType, setRequestType] = useState('GET');
  const [endpoint, setEndpoint] = useState('/api/test');

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

  // 폼 필드 정의 (POST, PUT 요청용)
  const formFields = [
    {
      name: 'name',
      label: '이름',
      type: 'text',
      placeholder: '이름을 입력하세요'
    },
    {
      name: 'email',
      label: '이메일',
      type: 'email',
      placeholder: '이메일을 입력하세요'
    },
    {
      name: 'message',
      label: '메시지',
      type: 'textarea',
      placeholder: '메시지를 입력하세요'
    }
  ];

  return (
    <div className="api-test">
      <h1>API 테스트</h1>
      
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
            <input
              type="text"
              value={endpoint}
              onChange={handleEndpointChange}
              className="form-input"
              placeholder="/api/endpoint"
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
