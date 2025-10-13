import React, { createContext, useContext, useState, useEffect } from 'react';

// 테마 컨텍스트 생성
const ThemeContext = createContext();

// 테마 훅
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// 테마 프로바이더
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 로컬 스토리지에서 테마 설정 불러오기
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // 시스템 테마 설정 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 테마 토글 함수
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // 테마 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // HTML 요소에 테마 클래스 추가/제거
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
