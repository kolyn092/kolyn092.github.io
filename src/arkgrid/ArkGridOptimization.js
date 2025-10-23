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

// 특정 코어 포인트 조합이 달성 가능한지 확인 (전역 최적화 방식)
export function isCombinationFeasible(cores, gems, targetPoints) {
  let isFeasible = false;
  
  // 전역 최적화로 달성 가능한지 확인
  function checkGlobalFeasibility(coreIndex, usedGems) {
    if (coreIndex >= cores.length) {
      // 모든 코어 처리 완료
      isFeasible = true;
      return;
    }
    
    const core = cores[coreIndex];
    const availableGems = gems.filter(gem => !usedGems.has(gem.id));
    
    if (targetPoints[coreIndex] === 0) {
      // 0포인트 코어: 젬 배치 없이 다음 코어로
      checkGlobalFeasibility(coreIndex + 1, usedGems);
    } else {
      // 목표 포인트가 있는 코어: 조건을 만족하는 젬 조합 찾기
      for (let gemCount = 1; gemCount <= 4; gemCount++) {
        const combos = getCombinations(availableGems, gemCount);
        
        for (const combo of combos) {
          const totalCost = combo.reduce((s, g) => s + g.cost, 0);
          const totalPoints = combo.reduce((s, g) => s + g.points, 0);
          
          if (totalCost <= core.limit && totalPoints >= targetPoints[coreIndex]) {
            // 이 조합을 사용해보기
            combo.forEach(gem => usedGems.add(gem.id));
            checkGlobalFeasibility(coreIndex + 1, usedGems);
            
            if (isFeasible) return; // 달성 가능하면 즉시 종료
            
            // 되돌리기
            combo.forEach(gem => usedGems.delete(gem.id));
          }
        }
      }
    }
  }
  
  checkGlobalFeasibility(0, new Set());
  
  if (isFeasible) {
    console.log('✅ 모든 코어 달성 가능');
  }
  
  return isFeasible;
}

// 전역 최적화: 3개 코어에 동시에 젬 배치하여 최대 총 전투력 찾기
export function findOptimalGemPlacement(cores, gems, targetPoints, currentPage = '질서', playerType = '딜러') {
  let bestTotalPower = 0;
  let bestAssignment = null;
  
  // 모든 젬을 3개 코어에 배치하는 모든 가능한 조합 탐색
  function findGlobalOptimalAssignment(coreIndex, usedGems, currentAssignment) {
    if (coreIndex >= cores.length) {
      // 모든 코어에 젬 배치 완료 - 총 전투력 계산
      let totalPower = 0;
      let validAssignment = true;
      
      for (let i = 0; i < cores.length; i++) {
        const assignment = currentAssignment[i];
        if (assignment) {
          totalPower += assignment.power;
        } else if (targetPoints[i] > 0) {
          // 목표 포인트가 있는 코어에 젬이 배치되지 않음
          validAssignment = false;
          break;
        }
      }
      
      if (validAssignment && totalPower > bestTotalPower) {
        bestTotalPower = totalPower;
        bestAssignment = currentAssignment.map(assignment => assignment ? { ...assignment } : null);
      }
      
      return;
    }
    
    const core = cores[coreIndex];
    const availableGems = gems.filter(gem => !usedGems.has(gem.id));
    
    if (targetPoints[coreIndex] === 0) {
      // 0포인트 코어: 남은 젬으로 최대 전투력 구성
      let bestCombo = null;
      
      for (let gemCount = 1; gemCount <= 4; gemCount++) {
        const combos = getCombinations(availableGems, gemCount);
        
        for (const combo of combos) {
          const totalCost = combo.reduce((s, g) => s + g.cost, 0);
          
          if (totalCost <= core.limit) {
            const coreTotalPower = calculateCoreTotalPower(combo, core, currentPage, playerType);
            
            if (!bestCombo || coreTotalPower.totalPower > bestCombo.power) {
              bestCombo = {
                core: core,
                gems: combo,
                power: coreTotalPower.totalPower,
                gemPower: coreTotalPower.gemPower,
                coeff: coreTotalPower.coeff,
                cost: totalCost,
                corePoints: coreTotalPower.corePoints,
                isEffectActive: isCoreEffectActive(coreTotalPower.corePoints),
                pointPriority: getPointPriority(coreTotalPower.corePoints)
              };
            }
          }
        }
      }
      
      if (bestCombo) {
        bestCombo.gems.forEach(gem => usedGems.add(gem.id));
        currentAssignment[coreIndex] = bestCombo;
        findGlobalOptimalAssignment(coreIndex + 1, usedGems, currentAssignment);
        bestCombo.gems.forEach(gem => usedGems.delete(gem.id));
        currentAssignment[coreIndex] = null;
      } else {
        // 젬 배치 없이 다음 코어로
        findGlobalOptimalAssignment(coreIndex + 1, usedGems, currentAssignment);
      }
    } else {
      // 목표 포인트가 있는 코어: 조건을 만족하는 젬 조합 찾기
      for (let gemCount = 1; gemCount <= 4; gemCount++) {
        const combos = getCombinations(availableGems, gemCount);
        
        for (const combo of combos) {
          const totalCost = combo.reduce((s, g) => s + g.cost, 0);
          const totalPoints = combo.reduce((s, g) => s + g.points, 0);
          
          if (totalCost <= core.limit && totalPoints >= targetPoints[coreIndex]) {
            // 이 조합을 사용해보기
            combo.forEach(gem => usedGems.add(gem.id));
            
            const coreTotalPower = calculateCoreTotalPower(combo, core, currentPage, playerType);
            const assignment = {
              core: core,
              gems: combo,
              power: coreTotalPower.totalPower,
              gemPower: coreTotalPower.gemPower,
              coeff: coreTotalPower.coeff,
              cost: totalCost,
              corePoints: totalPoints,
              isEffectActive: isCoreEffectActive(totalPoints),
              pointPriority: getPointPriority(totalPoints)
            };
            
            currentAssignment[coreIndex] = assignment;
            findGlobalOptimalAssignment(coreIndex + 1, usedGems, currentAssignment);
            
            // 되돌리기
            combo.forEach(gem => usedGems.delete(gem.id));
            currentAssignment[coreIndex] = null;
          }
        }
      }
    }
  }
  
  // 전역 최적화 시작
  findGlobalOptimalAssignment(0, new Set(), new Array(cores.length).fill(null));
  
  return bestAssignment;
}

export function ArkGridOptimization(cores, gems, currentPage = '질서', playerType = '딜러') {
  // 모든 코어 포인트 조합 생성
  const allCombinations = generateCorePointCombinations(cores);
  
  const feasibleCombinations = [];
  
  // 각 조합이 달성 가능한지 확인하고 최적 젬 배치 찾기
  allCombinations.forEach((combination, index) => {
    // 달성 가능성 확인
    const isFeasible = isCombinationFeasible(cores, gems, combination);
    
    if (isFeasible) {
      // 전역 최적화로 최대 총 전투력 찾기
      const optimalPlacement = findOptimalGemPlacement(cores, gems, combination, currentPage, playerType);
      
      if (optimalPlacement && optimalPlacement.some(result => result !== null)) {
        const totalPower = optimalPlacement.reduce((sum, result) => sum + (result ? result.power : 0), 0);
        const totalPointPriority = optimalPlacement.reduce((sum, result) => sum + (result ? result.pointPriority : 0), 0);
        
        feasibleCombinations.push({
          combination: combination,
          results: optimalPlacement,
          totalPower: totalPower,
          totalPointPriority: totalPointPriority
        });
      }
    }
  });
  
  // 우선순위 정렬: totalPower > totalPointPriority
  feasibleCombinations.sort((a, b) => {
    if (a.totalPower !== b.totalPower) {
      return b.totalPower - a.totalPower;
    }
    return b.totalPointPriority - a.totalPointPriority;
  });
  
  console.log(`달성 가능한 조합 수: ${feasibleCombinations.length}`);
  
  // 상위 3개 조합 반환
  return feasibleCombinations.slice(0, 3);
}
