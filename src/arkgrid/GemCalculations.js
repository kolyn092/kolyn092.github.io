// 젬 계산 유틸리티 함수들

export function calculateGemPower(gem) {
    if (!gem || !gem.options) return 0;
    
    return gem.options.reduce((total, option) => {
      return total + (option.value || 0);
    }, 0);
  }
  
  export function calculateCorePoints(cores) {
    if (!cores || cores.length === 0) return 0;
    
    return cores.reduce((total, core) => {
      return total + (core.points || 0);
    }, 0);
  }
  
  export function isCoreEffectActive(core, gems) {
    if (!core || !gems) return false;
    
    // 코어 효과 활성화 로직
    return gems.some(gem => gem.coreId === core.id);
  }
  
  export function getPointPriority(type) {
    const priorities = {
      '해 코어': 1,
      '달 코어': 2,
      '별 코어': 3
    };
    
    return priorities[type] || 999;
  }