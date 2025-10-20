import { OPTION_LEVEL_VALUES } from '../context/AppContext';

// 코어 계수 맵 (등급, 질서/혼돈, 해/달/별 타입별)
const CORE_COEFF_MAP = {
  '영웅': {
    '질서': {
      '☀️ 해 코어': [1.5],
      '🌙 달 코어': [1.5],
      '⭐ 별 코어': [1.5]
    },
    '혼돈': {
      '☀️ 해 코어': [0.5],
      '🌙 달 코어': [0.5],
      '⭐ 별 코어': [0.5]
    }
  },
  '전설': {
    '질서': {
      '☀️ 해 코어': [1.5, 4.0],
      '🌙 달 코어': [1.5, 4.0],
      '⭐ 별 코어': [1.5, 2.5]
    },
    '혼돈': {
      '☀️ 해 코어': [0.5, 1.0],
      '🌙 달 코어': [0.5, 1.0],
      '⭐ 별 코어': [0.5, 1.0]
    }
  },
  '유물': {
    '질서': {
      '☀️ 해 코어': [1.5, 4.0, 7.5, 7.67, 7.83, 8.0],
      '🌙 달 코어': [1.5, 4.0, 7.5, 7.67, 7.83, 8.0],
      '⭐ 별 코어': [1.5, 2.5, 4.5, 4.67, 4.83, 5.0]
    },
    '혼돈': {
      '☀️ 해 코어': [0.5, 1.0, 2.5, 2.67, 2.83, 3.0],
      '🌙 달 코어': [0.5, 1.0, 2.5, 2.67, 2.83, 3.0],
      '⭐ 별 코어': [0.5, 1.0, 2.5, 2.67, 2.83, 3.0]
    }
  },
  '고대': {
    '질서': {
      '☀️ 해 코어': [1.5, 4.0, 8.5, 8.67, 8.83, 9.0],
      '🌙 달 코어': [1.5, 4.0, 8.5, 8.67, 8.83, 9.0],
      '⭐ 별 코어': [1.5, 2.5, 5.5, 5.67, 5.83, 6.0]
    },
    '혼돈': {
      '☀️ 해 코어': [0.5, 1.0, 3.5, 3.67, 3.83, 4.0],
      '🌙 달 코어': [0.5, 1.0, 3.5, 3.67, 3.83, 4.0],
      '⭐ 별 코어': [0.5, 1.0, 2.5, 2.67, 2.83, 3.0]
    }
  }
};

// 젬 계산 유틸리티 함수들

export function calculateGemPower(gem, playerType = '딜러') {
  let power = 0;

  // 딜러: 공격력, 보스피해, 추가피해만 계산
  // 서폿: 아군피해강화, 아군공격강화, 낙인력만 계산
  const dealerOptions = ['공격력', '보스피해', '추가피해'];
  const supportOptions = ['아군피해강화', '아군공격강화', '낙인력'];
  
  const validOptions = playerType === '딜러' ? dealerOptions : supportOptions;

  if (gem.option1Level >= 0 && gem.option1Level <= 5 && validOptions.includes(gem.option1)) {
    power += OPTION_LEVEL_VALUES[gem.option1][gem.option1Level] || 0;
  }

  if (gem.option2Level >= 0 && gem.option2Level <= 5 && validOptions.includes(gem.option2)) {
    power += OPTION_LEVEL_VALUES[gem.option2][gem.option2Level] || 0;
  }

  return power;
}

export function calculateCorePoints(cores) {
  return cores.reduce((total, core) => total + core.points, 0);
}

export function isCoreEffectActive(points) {
  return points >= 10;
}

export function getPointPriority(points) {
  if(points >= 20) return 6;
  if(points >= 19) return 5;
  if(points >= 18) return 4;
  if(points >= 17) return 3;
  if(points >= 14) return 2;
  if(points >= 10) return 1;
  return 0;
}

// 코어 계수 계산 함수
export function getCoreCoeff(core, currentPage) {
  const grade = core.grade;
  const orderType = currentPage; // '질서' 또는 '혼돈'
  const coreType = core.type;
  
  try {
    const coeffArray = CORE_COEFF_MAP[grade][orderType][coreType];
    return coeffArray || [];
  } catch (error) {
    console.warn('코어 계수 맵에서 값을 찾을 수 없습니다:', { grade, orderType, coreType });
    return [];
  }
}

// 코어 포인트에 따른 계수 가져오기
export function getCoreCoeffByPoints(core, currentPage, points) {
  const coeffArray = getCoreCoeff(core, currentPage);
  
  // 포인트에 따른 인덱스 매핑
  const pointIndexMap = {
    10: 0,
    14: 1,
    17: 2,
    18: 3,
    19: 4,
    20: 5
  };
  
  const index = pointIndexMap[points];
  
  if (index !== undefined && index < coeffArray.length) {
    return coeffArray[index];
  }
  
  // 값이 없으면 마지막 인덱스 값 사용
  return coeffArray.length > 0 ? coeffArray[coeffArray.length - 1] : 0;
}

// 코어 총 전투력 계산 (젬 전투력 + 코어 포인트 점수)
export function calculateCoreTotalPower(gems, core, currentPage, playerType = '딜러') {
  // 젬들의 기본 전투력 합계
  const gemPower = gems.reduce((sum, gem) => sum + calculateGemPower(gem, playerType), 0);
  
  // 코어 포인트 계산
  const corePoints = gems.reduce((sum, gem) => sum + gem.points, 0);
  
  // 코어 계수 가져오기
  const coeff = getCoreCoeffByPoints(core, currentPage, corePoints);
  
  // 총 전투력 = 젬 전투력 + 코어 포인트 점수
  const totalPower = gemPower + corePoints;
  
  return {
    gemPower,
    coeff,
    totalPower,
    corePoints
  };
}