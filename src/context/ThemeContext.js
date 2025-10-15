import React, { createContext, useContext, useEffect } from 'react';

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

// 테마 프로바이더 - 다크모드 고정
export function ThemeProvider({ children }) {
  // 다크모드 고정
  const isDarkMode = true;

  // 다크모드 설정 적용
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const value = {
    isDarkMode,
    toggleTheme: () => {}, // 빈 함수로 유지 (호환성)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
