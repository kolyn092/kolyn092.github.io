import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Constants
export const CORE_LIMITS = {
  '영웅': 9,
  '전설': 12,
  '유물': 15,
  '고대': 17
};

export const OPTION_TYPES = [
  '아군피해강화',
  '아군공격강화', 
  '낙인력',
  '공격력',
  '보스피해',
  '추가피해'
];

export const OPTION_LEVEL_VALUES = {
  '아군피해강화': { 1: 0.95, 2: 1.89, 3: 2.84, 4: 3.79, 5: 4.73 },
  '아군공격강화': { 1: 2.27, 2: 4.73, 3: 7.19, 4: 9.65, 5: 11.74 },
  '낙인력': { 1: 1.52, 2: 3.22, 3: 4.92, 4: 6.62, 5: 8.14 },
  '공격력': { 1: 0.81, 2: 1.61, 3: 2.68, 4: 3.48, 5: 4.28 },
  '보스피해': { 1: 2.14, 2: 4.28, 3: 6.68, 4: 8.82, 5: 10.96 },
  '추가피해': { 1: 1.34, 2: 2.94, 3: 4.55, 4: 6.15, 5: 7.75 }
};

export const CORE_TYPES = ['☀️ 해 코어', '🌙 달 코어', '⭐ 별 코어'];

// Initial state
const initialState = {
  currentPage: '질서',
  playerType: '딜러', // 딜러 또는 서폿
  cores: [
    { id: 1, name: '코어 1', type: '☀️ 해 코어', grade: '영웅', limit: 9, targetPoints: [0, 10] },
    { id: 2, name: '코어 2', type: '🌙 달 코어', grade: '전설', limit: 12, targetPoints: [0, 10] },
    { id: 3, name: '코어 3', type: '⭐ 별 코어', grade: '유물', limit: 15, targetPoints: [0] }
  ],
  gems: [
    { id: 1, gemNumber: 1, cost: 5, points: 5, option1: '아군피해강화', option1Level: 1, option2: '아군공격강화', option2Level: 2 }
  ],
  results: [],
  editingGem: null,
  nextGemId: 2,
  showAddForm: false,
  isOptimizing: false,
  optimizationProgress: 0,
  hasOptimized: false
};

// Action types
const ActionTypes = {
  SWITCH_PAGE: 'SWITCH_PAGE',
  SET_PLAYER_TYPE: 'SET_PLAYER_TYPE',
  LOAD_DATA: 'LOAD_DATA',
  SAVE_DATA: 'SAVE_DATA',
  UPDATE_CORE_TYPE: 'UPDATE_CORE_TYPE',
  UPDATE_CORE_GRADE: 'UPDATE_CORE_GRADE',
  UPDATE_CORE_TARGET_POINTS: 'UPDATE_CORE_TARGET_POINTS',
  ADD_GEM: 'ADD_GEM',
  UPDATE_GEM: 'UPDATE_GEM',
  DELETE_GEM: 'DELETE_GEM',
  SET_EDITING_GEM: 'SET_EDITING_GEM',
  TOGGLE_ADD_FORM: 'TOGGLE_ADD_FORM',
  SET_RESULTS: 'SET_RESULTS',
  RESET_DATA: 'RESET_DATA',
  START_OPTIMIZATION: 'START_OPTIMIZATION',
  UPDATE_OPTIMIZATION_PROGRESS: 'UPDATE_OPTIMIZATION_PROGRESS',
  STOP_OPTIMIZATION: 'STOP_OPTIMIZATION'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SWITCH_PAGE:
      return {
        ...state,
        currentPage: action.payload,
        results: [],
        hasOptimized: false
      };
    
    case ActionTypes.SET_PLAYER_TYPE:
      return {
        ...state,
        playerType: action.payload,
        results: []
      };
    
    case ActionTypes.LOAD_DATA:
      return {
        ...state,
        cores: action.payload.cores || state.cores,
        gems: action.payload.gems || state.gems,
        nextGemId: action.payload.nextGemId || state.nextGemId
      };
    
    case ActionTypes.UPDATE_CORE_TYPE:
      return {
        ...state,
        cores: state.cores.map(core => 
          core.id === action.payload.coreId 
            ? { ...core, type: action.payload.type }
            : core
        )
      };
    
    case ActionTypes.UPDATE_CORE_GRADE:
      return {
        ...state,
        cores: state.cores.map(core => 
          core.id === action.payload.coreId 
            ? { ...core, grade: action.payload.grade, limit: CORE_LIMITS[action.payload.grade] }
            : core
        )
      };
    
    case ActionTypes.UPDATE_CORE_TARGET_POINTS:
      return {
        ...state,
        cores: state.cores.map(core => 
          core.id === action.payload.coreId 
            ? { ...core, targetPoints: action.payload.targetPoints }
            : core
        )
      };
    
    case ActionTypes.ADD_GEM:
      const newGem = {
        ...action.payload,
        id: state.nextGemId,
        gemNumber: Math.max(...state.gems.map(g => g.gemNumber), 0) + 1
      };
      return {
        ...state,
        gems: [...state.gems, newGem],
        nextGemId: state.nextGemId + 1,
        showAddForm: false,
        editingGem: null
      };
    
    case ActionTypes.UPDATE_GEM:
      return {
        ...state,
        gems: state.gems.map(gem => 
          gem.id === action.payload.id 
            ? { ...gem, ...action.payload }
            : gem
        ),
        showAddForm: false,
        editingGem: null
      };
    
    case ActionTypes.DELETE_GEM:
      return {
        ...state,
        gems: state.gems.filter(gem => gem.id !== action.payload)
      };
    
    case ActionTypes.SET_EDITING_GEM:
      return {
        ...state,
        editingGem: action.payload,
        showAddForm: true
      };
    
    case ActionTypes.TOGGLE_ADD_FORM:
      return {
        ...state,
        showAddForm: !state.showAddForm,
        editingGem: null
      };
    
    case ActionTypes.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
        hasOptimized: true
      };
    
    case ActionTypes.RESET_DATA:
      return {
        ...initialState,
        currentPage: state.currentPage
      };
    
    case ActionTypes.START_OPTIMIZATION:
      return {
        ...state,
        isOptimizing: true,
        optimizationProgress: 0,
        results: [],
        hasOptimized: true
      };
    
    case ActionTypes.UPDATE_OPTIMIZATION_PROGRESS:
      return {
        ...state,
        optimizationProgress: action.payload
      };
    
    case ActionTypes.STOP_OPTIMIZATION:
      return {
        ...state,
        isOptimizing: false,
        optimizationProgress: 0
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const savedData = localStorage.getItem('arkGridData');
    
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        const pageData = data[state.currentPage];
        
        console.log(`=== 페이지 전환: ${state.currentPage} ===`);
        console.log('저장된 데이터:', data);
        console.log('현재 페이지 데이터:', pageData);
        
        if (pageData) {
          const cores = pageData.cores || state.cores;
          const gems = pageData.gems || state.gems;
          const nextGemId = Math.max(...gems.map(g => g.id), 0) + 1;
          
          console.log('로드할 코어 수:', cores.length);
          console.log('로드할 젬 수:', gems.length);
          
          dispatch({
            type: ActionTypes.LOAD_DATA,
            payload: { cores, gems, nextGemId }
          });
        } else {
          console.log('현재 페이지 데이터가 없습니다. 기본값 사용');
        }
      } catch (error) {
        console.error('Failed to load arkGrid data:', error);
      }
    } else {
      console.log('저장된 데이터가 없습니다. 기본값 사용');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentPage]);

  // Save data to localStorage when state changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    try {
      const existingData = localStorage.getItem('arkGridData');
      let data = existingData ? JSON.parse(existingData) : {};
      
      data[state.currentPage] = {
        cores: state.cores,
        gems: state.gems
      };
      
      localStorage.setItem('arkGridData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save arkGrid data:', error);
    }
  }, [state.cores, state.gems, state.currentPage]);

  const value = {
    state,
    dispatch,
    ActionTypes
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
