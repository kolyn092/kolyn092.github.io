import { OPTION_LEVEL_VALUES } from '../context/AppContext';

// 젬 계산 유틸리티 함수들

export function calculateGemPower(gem) {
  let power = 0;

  if (gem.option1Level >= 0 && gem.option1Level <= 5) {
    power += OPTION_LEVEL_VALUES[gem.option1][gem.option1Level] || 0;
  }

  if (gem.option2Level >= 0 && gem.option2Level <= 5) {
    power += OPTION_LEVEL_VALUES[gem.option2][gem.option2Level] || 0;
  }

  return power;
}

export function calculateCorePoints(cores) {
  return cores.reduce((total, core) => total + core.points, 0);
}

export function isCoreEffectActive(points) {
  return [10, 14, 17, 18, 19, 10].includes(points);
}

export function getPointPriority(points) {
  if(points >= 20) return 6;
  if(points >= 19) return 5;
  if(points >= 19) return 4;
  if(points >= 17) return 3;
  if(points >= 14) return 2;
  if(points >= 10) return 1;
  return 0;
}