import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

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
  '공격력': { 1: 1.0, 2: 2.0, 3: 3.0, 4: 4.0, 5: 5.0 },
  '보스피해': { 1: 0.8, 2: 1.6, 3: 2.4, 4: 3.2, 5: 4.0 },
  '추가피해': { 1: 0.3, 2: 0.6, 3: 0.9, 4: 1.2, 5: 1.5 }
};

export const CORE_TYPES = ['해 코어', '달 코어', '별 코어'];

// Initial state
const initialState = {
  currentPage: '질서',
  cores: [
    { id: 1, name: '코어 1', type: '해 코어', grade: '영웅', limit: 9 },
    { id: 2, name: '코어 2', type: '달 코어', grade: '전설', limit: 12 },
    { id: 3, name: '코어 3', type: '별 코어', grade: '유물', limit: 15 }
  ],
  gems: [
    { id: 1, gemNumber: 1, cost: 5, points: 5, option1: '아군피해강화', option1Level: 1, option2: '아군공격강화', option2Level: 2 }
  ],
  results: [],
  editingGem: null,
  nextGemId: 2,
  showAddForm: false
};

// Action types
const ActionTypes = {
  SWITCH_PAGE: 'SWITCH_PAGE',
  LOAD_DATA: 'LOAD_DATA',
  SAVE_DATA: 'SAVE_DATA',
  UPDATE_CORE_TYPE: 'UPDATE_CORE_TYPE',
  UPDATE_CORE_GRADE: 'UPDATE_CORE_GRADE',
  ADD_GEM: 'ADD_GEM',
  UPDATE_GEM: 'UPDATE_GEM',
  DELETE_GEM: 'DELETE_GEM',
  SET_EDITING_GEM: 'SET_EDITING_GEM',
  TOGGLE_ADD_FORM: 'TOGGLE_ADD_FORM',
  SET_RESULTS: 'SET_RESULTS',
  RESET_DATA: 'RESET_DATA'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SWITCH_PAGE:
      return {
        ...state,
        currentPage: action.payload,
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
        results: action.payload
      };
    
    case ActionTypes.RESET_DATA:
      return {
        ...initialState,
        currentPage: state.currentPage
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
  const loadData = useCallback(() => {
    const savedCores = localStorage.getItem(`arkGrid${state.currentPage}Cores`);
    const savedGems = localStorage.getItem(`arkGrid${state.currentPage}Gems`);
    
    if (savedCores || savedGems) {
      const cores = savedCores ? JSON.parse(savedCores) : state.cores;
      const gems = savedGems ? JSON.parse(savedGems) : state.gems;
      const nextGemId = Math.max(...gems.map(g => g.id), 0) + 1;
      
      dispatch({
        type: ActionTypes.LOAD_DATA,
        payload: { cores, gems, nextGemId }
      });
    }
  }, [state.currentPage, state.cores, state.gems, dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(`arkGrid${state.currentPage}Cores`, JSON.stringify(state.cores));
    localStorage.setItem(`arkGrid${state.currentPage}Gems`, JSON.stringify(state.gems));
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
