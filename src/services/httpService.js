// HTTP 통신을 위한 기본 서비스
class HttpService {
  constructor(baseURL = 'https://developer-lostark.game.onstove.com') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    };
  }

  // API 키 가져오기
  getApiKey() {
    return localStorage.getItem('apiKey') || '';
  }

  // 기본 요청 메서드
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // API 키가 있으면 Authorization 헤더 추가
    const apiKey = this.getApiKey();
    const headers = { ...this.defaultHeaders, ...options.headers };

    if (apiKey) {
      headers['Authorization'] = `bearer ${apiKey}`;
    }

    const config = {
      headers,
      ...options,
    };

    try {
      console.log(`🌐 HTTP 요청 시작: ${url}`);
      console.log('📤 요청 헤더:', headers);
      console.log('⚙️ 요청 옵션:', options);

      const response = await fetch(url, config);

      // 응답 정보 로깅
      console.log(`📡 응답 상태: ${response.status} ${response.statusText}`);
      console.log('📥 응답 헤더:', Object.fromEntries(response.headers.entries()));
      console.log('🔗 응답 URL:', response.url);
      console.log('✅ 응답 OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP 에러 응답:', errorText);
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      console.log('📄 Content-Type:', contentType);

      if (contentType && contentType.includes('application/json')) {
        const jsonData = await response.json();
        console.log('📊 JSON 응답 데이터:', jsonData);
        return jsonData;
      }

      const textData = await response.text();
      console.log('📝 텍스트 응답 데이터:', textData);
      return textData;
    } catch (error) {
      console.error('🚨 HTTP 요청 에러:', error);
      console.error('🔍 에러 상세:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // GET 요청
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  // POST 요청
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT 요청
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE 요청
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  // PATCH 요청
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // 파일 업로드
  async uploadFile(endpoint, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // FormData 사용 시 Content-Type 헤더 제거
      ...options,
    });
  }

  // 헤더 설정
  setHeader(key, value) {
    this.defaultHeaders[key] = value;
  }

  // 헤더 제거
  removeHeader(key) {
    delete this.defaultHeaders[key];
  }

  // 기본 URL 설정
  setBaseURL(url) {
    this.baseURL = url;
  }
}

// 기본 인스턴스 생성
const httpService = new HttpService();

export default httpService;
export { HttpService };
