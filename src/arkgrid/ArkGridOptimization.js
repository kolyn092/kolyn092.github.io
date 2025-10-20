import { calculateGemPower, isCoreEffectActive, getPointPriority, calculateCoreTotalPower } from './GemCalculations';

export function getCombinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const [first, ...rest] = arr;
  const withFirst = getCombinations(rest, k - 1).map(c => [first, ...c]);
  const withoutFirst = getCombinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

export function canReplaceGem(currentGem, newGem, currentCorePoints) {
  if (currentGem.cost !== newGem.cost) return false;
  if (newGem.points < currentGem.points) return false;
  if (currentGem.id === newGem.id) return false;
  return true;
}

export function findBetterReplacement(currentGems, currentCorePoints, availableGems) {
  let bestReplacement = null;
  let maxImprovement = 0;
  
  const currentCoreGemIds = new Set(currentGems.map(gem => gem.id));
  
  currentGems.forEach((currentGem, index) => {
    availableGems.forEach(newGem => {
      if (canReplaceGem(currentGem, newGem, currentCorePoints) && 
          !currentCoreGemIds.has(newGem.id)) {
        const currentPower = calculateGemPower(currentGem);
        const newPower = calculateGemPower(newGem);
        const improvement = newPower - currentPower;
        
        if (improvement > maxImprovement) {
          maxImprovement = improvement;
          bestReplacement = {
            index: index,
            oldGem: currentGem,
            newGem: newGem,
            improvement: improvement
          };
        }
      }
    });
  });
  
  return bestReplacement;
}

// 모든 코어 포인트 조합 생성
export function generateCorePointCombinations(cores) {
  const combinations = [];
  
  function generateCombinations(index, currentCombination) {
    if (index === cores.length) {
      combinations.push([...currentCombination]);
      return;
    }
    
    const core = cores[index];
    const targetPoints = core.targetPoints || [0];
    
    for (const points of targetPoints) {
      currentCombination.push(points);
      generateCombinations(index + 1, currentCombination);
      currentCombination.pop();
    }
  }
  
  generateCombinations(0, []);
  return combinations;
}

// 특정 코어 포인트 조합이 달성 가능한지 확인
export function isCombinationFeasible(cores, gems, targetPoints) {
  const usedGems = new Set();
  
  // 0이 아닌 포인트 코어들만 달성 가능성 확인
  for (let i = 0; i < cores.length; i++) {
    const core = cores[i];
    const targetPoint = targetPoints[i];
    
    if (targetPoint === 0) continue; // 0포인트 코어는 젬 배치 선택사항이므로 확인 제외
    
    const availableGems = gems.filter(gem => !usedGems.has(gem.id));
    let found = false;
    
    // 1개부터 4개까지 젬 조합 시도
    for (let gemCount = 1; gemCount <= 4; gemCount++) {
      const allCombos = getCombinations(availableGems, gemCount);
      
      for (const combo of allCombos) {
        const totalCost = combo.reduce((s, g) => s + g.cost, 0);
        const totalPoints = combo.reduce((s, g) => s + g.points, 0);
        
        if (totalCost <= core.limit && totalPoints === targetPoint) {
          combo.forEach(gem => usedGems.add(gem.id));
          found = true;
          break;
        }
      }
      
      if (found) break;
    }
    
    if (!found) return false;
  }
  
  return true;
}

// 특정 코어 포인트 조합의 최적 젬 배치 찾기
export function findOptimalGemPlacement(cores, gems, targetPoints, currentPage = '질서', playerType = '딜러') {
  const usedGems = new Set();
  const results = [];
  
  // 1단계: 0이 아닌 포인트 코어들 먼저 처리
  for (let i = 0; i < cores.length; i++) {
    const core = cores[i];
    const targetPoint = targetPoints[i];
    
    if (targetPoint === 0) {
      results.push({
        core: core,
        gems: [],
        power: 0,
        cost: 0,
        corePoints: 0,
        isEffectActive: false,
        pointPriority: 0
      });
      continue;
    }
    
    const availableGems = gems.filter(gem => !usedGems.has(gem.id));
    let bestCombo = null;
    
    // 1개부터 4개까지 젬 조합 시도
    for (let gemCount = 1; gemCount <= 4; gemCount++) {
      const allCombos = getCombinations(availableGems, gemCount);
      
      for (const combo of allCombos) {
        const totalCost = combo.reduce((s, g) => s + g.cost, 0);
        const totalPoints = combo.reduce((s, g) => s + g.points, 0);
        const totalPower = combo.reduce((s, g) => s + calculateGemPower(g), 0);
        
        if (totalCost <= core.limit && totalPoints === targetPoint) {
          const isEffectActive = isCoreEffectActive(totalPoints);
          const pointPriority = getPointPriority(totalPoints);
          
          // 코어 계수 적용한 총 전투력 계산
          const coreTotalPower = calculateCoreTotalPower(combo, core, currentPage, playerType);
          
          if (!bestCombo || coreTotalPower.totalPower > bestCombo.power) {
            bestCombo = {
              gems: combo,
              power: coreTotalPower.totalPower,
              gemPower: coreTotalPower.gemPower,
              coeff: coreTotalPower.coeff,
              cost: totalCost,
              corePoints: totalPoints,
              isEffectActive: isEffectActive,
              pointPriority: pointPriority
            };
          }
        }
      }
    }
    
    if (bestCombo) {
      bestCombo.gems.forEach(gem => usedGems.add(gem.id));
      results.push({
        core: core,
        ...bestCombo
      });
    } else {
      return null; // 달성 불가능
    }
  }
  
  // 2단계: 0포인트 코어들에 남은 젬들로 최대 전투력 구성
  for (let i = 0; i < cores.length; i++) {
    const core = cores[i];
    const targetPoint = targetPoints[i];
    
    if (targetPoint !== 0) continue; // 이미 처리된 코어는 스킵
    
    const availableGems = gems.filter(gem => !usedGems.has(gem.id));
    let bestCombo = null;
    
    // 1개부터 4개까지 젬 조합 시도 (의지력 한도 내에서 최대 전투력)
    for (let gemCount = 1; gemCount <= 4; gemCount++) {
      const allCombos = getCombinations(availableGems, gemCount);
      
      for (const combo of allCombos) {
        const totalCost = combo.reduce((s, g) => s + g.cost, 0);
        const totalPower = combo.reduce((s, g) => s + calculateGemPower(g), 0);
        
        if (totalCost <= core.limit) {
          // 0포인트 코어에 대한 코어 계수 적용한 총 전투력 계산
          const coreTotalPower = calculateCoreTotalPower(combo, core, currentPage, playerType);
          
          if (!bestCombo || coreTotalPower.totalPower > bestCombo.power) {
            bestCombo = {
              gems: combo,
              power: coreTotalPower.totalPower,
              gemPower: coreTotalPower.gemPower,
              coeff: coreTotalPower.coeff,
              cost: totalCost,
              corePoints: coreTotalPower.corePoints, // 실제 젬 포인트 합산
              isEffectActive: isCoreEffectActive(coreTotalPower.corePoints), // 실제 포인트로 효과 활성화 확인
              pointPriority: getPointPriority(coreTotalPower.corePoints) // 실제 포인트로 우선순위 계산
            };
          }
        }
      }
    }
    
    if (bestCombo) {
      bestCombo.gems.forEach(gem => usedGems.add(gem.id));
      // 0포인트 코어에 배치된 젬의 실제 포인트 합산
      const actualCorePoints = bestCombo.gems.reduce((sum, gem) => sum + gem.points, 0);
      results[i] = {
        core: core,
        ...bestCombo,
        corePoints: actualCorePoints // 실제 젬 포인트 합산
      };
    } else {
      // 젬이 없어도 0포인트 코어는 빈 상태로 유지
      results[i] = {
        core: core,
        gems: [],
        power: 0,
        cost: 0,
        corePoints: 0,
        isEffectActive: false,
        pointPriority: 0
      };
    }
  }
  
  return results;
}

export function ArkGridOptimization(cores, gems, currentPage = '질서', playerType = '딜러') {
  console.log('=== 새로운 최적화 시작 ===');
  console.log('총 젬 수:', gems.length);
  console.log('현재 페이지:', currentPage);
  console.log('플레이어 타입:', playerType);
  
  // 모든 코어 포인트 조합 생성
  const allCombinations = generateCorePointCombinations(cores);
  console.log('생성된 조합 수:', allCombinations.length);
  
  const feasibleCombinations = [];
  
  // 각 조합이 달성 가능한지 확인
  allCombinations.forEach((combination, index) => {
    console.log(`조합 ${index + 1}:`, combination);
    
    if (isCombinationFeasible(cores, gems, combination)) {
      const optimalPlacement = findOptimalGemPlacement(cores, gems, combination, currentPage, playerType);
      
      if (optimalPlacement) {
        const totalPower = optimalPlacement.reduce((sum, result) => sum + result.power, 0);
        const totalPointPriority = optimalPlacement.reduce((sum, result) => sum + result.pointPriority, 0);
        
        feasibleCombinations.push({
          combination: combination,
          results: optimalPlacement,
          totalPower: totalPower,
          totalPointPriority: totalPointPriority
        });
        
        console.log(`✅ 달성 가능 - 총 전투력: ${totalPower}, 총 포인트 우선순위: ${totalPointPriority}`);
      }
    } else {
      console.log(`❌ 달성 불가능`);
    }
  });
  
  // 우선순위 정렬: totalPower > totalPointPriority
  feasibleCombinations.sort((a, b) => {
    if (a.totalPower !== b.totalPower) {
      return b.totalPower - a.totalPower;
    }
    return b.totalPointPriority - a.totalPointPriority;
  });
  
  console.log('최종 정렬된 조합:', feasibleCombinations.slice(0, 3).map(c => ({
    combination: c.combination,
    totalPower: c.totalPower,
    totalPointPriority: c.totalPointPriority
  })));
  
  // 상위 3개 조합 반환
  return feasibleCombinations.slice(0, 3);
}
