import { useState, useCallback } from 'react';
import HttpService from '../services/HttpService';

// HTTP 통신을 위한 커스텀 훅
export function useHttp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // 요청 실행 함수
  const execute = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || '요청 중 오류가 발생했습니다.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // GET 요청
  const get = useCallback(async (endpoint, options = {}) => {
    return execute(() => HttpService.get(endpoint, options));
  }, [execute]);

  // POST 요청
  const post = useCallback(async (endpoint, data, options = {}) => {
    return execute(() => HttpService.post(endpoint, data, options));
  }, [execute]);

  // PUT 요청
  const put = useCallback(async (endpoint, data, options = {}) => {
    return execute(() => HttpService.put(endpoint, data, options));
  }, [execute]);

  // DELETE 요청
  const del = useCallback(async (endpoint, options = {}) => {
    return execute(() => HttpService.delete(endpoint, options));
  }, [execute]);

  // PATCH 요청
  const patch = useCallback(async (endpoint, data, options = {}) => {
    return execute(() => HttpService.patch(endpoint, data, options));
  }, [execute]);

  // 파일 업로드
  const uploadFile = useCallback(async (endpoint, file, options = {}) => {
    return execute(() => HttpService.uploadFile(endpoint, file, options));
  }, [execute]);

  // 상태 초기화
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    get,
    post,
    put,
    delete: del,
    patch,
    uploadFile,
    reset,
    execute,
  };
}

// 특정 API를 위한 훅 (예: 사용자 데이터)
export function useUserApi() {
  const http = useHttp();

  const fetchUsers = useCallback(() => {
    return http.get('/api/users');
  }, [http]);

  const createUser = useCallback((userData) => {
    return http.post('/api/users', userData);
  }, [http]);

  const updateUser = useCallback((id, userData) => {
    return http.put(`/api/users/${id}`, userData);
  }, [http]);

  const deleteUser = useCallback((id) => {
    return http.delete(`/api/users/${id}`);
  }, [http]);

  return {
    ...http,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}

// 폼 데이터 관리를 위한 훅
export function useFormData(initialData = {}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }, [errors]);

  const updateFields = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const setAllErrors = useCallback((newErrors) => {
    setErrors(newErrors);
  }, []);

  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);

  const validate = useCallback((validationRules) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = formData[field];
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rule.message || `${field}는 필수입니다.`;
      } else if (rule.pattern && !rule.pattern.test(value)) {
        newErrors[field] = rule.message || `${field} 형식이 올바르지 않습니다.`;
      } else if (rule.minLength && value.length < rule.minLength) {
        newErrors[field] = rule.message || `${field}는 최소 ${rule.minLength}자 이상이어야 합니다.`;
      } else if (rule.maxLength && value.length > rule.maxLength) {
        newErrors[field] = rule.message || `${field}는 최대 ${rule.maxLength}자까지 가능합니다.`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  return {
    formData,
    errors,
    updateField,
    updateFields,
    setFieldError,
    setErrors: setAllErrors,
    reset,
    validate,
  };
}
