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

// 특정 코어 포인트 조합이 달성 가능한지 확인 (전체 최적화 방식)
export function isCombinationFeasible(cores, gems, targetPoints) {
  // 0이 아닌 포인트 코어들만 필터링
  const nonZeroCores = cores.map((core, index) => ({
    ...core,
    index,
    targetPoint: targetPoints[index]
  })).filter(core => core.targetPoint > 0);
  
  // 의지력한도가 낮은 코어부터 정렬 (최적화 우선순위)
  nonZeroCores.sort((a, b) => a.limit - b.limit);
  
  // 백트래킹으로 모든 가능한 젬 배치 조합 찾기
  const usedGems = new Set();
  const assignments = [];
  
  function findGemAssignment(coreIndex) {
    if (coreIndex >= nonZeroCores.length) {
      console.log('✅ 모든 코어에 젬 배치 완료');
      return true;
    }
    
    const core = nonZeroCores[coreIndex];
    const availableGems = gems.filter(gem => !usedGems.has(gem.id));
    
    // 1개부터 4개까지 젬 조합 시도
    for (let gemCount = 1; gemCount <= 4; gemCount++) {
      const combos = getCombinations(availableGems, gemCount);
      
      for (const combo of combos) {
        const totalCost = combo.reduce((s, g) => s + g.cost, 0);
        const totalPoints = combo.reduce((s, g) => s + g.points, 0);
        
        if (totalCost <= core.limit && totalPoints >= core.targetPoint) {
          // 이 조합을 사용해보기
          combo.forEach(gem => usedGems.add(gem.id));
          assignments.push({
            coreIndex: core.index,
            coreName: core.name,
            gems: combo,
            totalCost,
            totalPoints
          });
          
          // 다음 코어로 재귀 호출
          if (findGemAssignment(coreIndex + 1)) {
            return true;
          }
          
          // 실패 시 이 조합을 되돌리기
          combo.forEach(gem => usedGems.delete(gem.id));
          assignments.pop();
        }
      }
    }
    
    return false;
  }
  
  const result = findGemAssignment(0);
  
  if (result) {
    console.log('\n✅ 모든 코어 달성 가능');
    console.log('최종 젬 배치:');
    assignments.forEach(assignment => {
      console.log(`  코어 ${assignment.coreIndex + 1}: 젬 ${assignment.gems.length}개, 총의지력 ${assignment.totalCost}, 총포인트 ${assignment.totalPoints}`);
    });
  }
  
  return result;
}

// 특정 코어 포인트 조합의 최적 젬 배치 찾기 (백트래킹 방식)
export function findOptimalGemPlacement(cores, gems, targetPoints, currentPage = '질서', playerType = '딜러') {
  // 0이 아닌 포인트 코어들만 필터링
  const nonZeroCores = cores.map((core, index) => ({
    ...core,
    index,
    targetPoint: targetPoints[index]
  })).filter(core => core.targetPoint > 0);
  
  // 의지력한도가 낮은 코어부터 정렬 (최적화 우선순위)
  nonZeroCores.sort((a, b) => a.limit - b.limit);
  
  // 백트래킹으로 모든 가능한 젬 배치 조합 찾기
  const usedGems = new Set();
  const assignments = [];
  const results = new Array(cores.length).fill(null);
  
  function findGemAssignment(coreIndex) {
    if (coreIndex >= nonZeroCores.length) {
      // 모든 코어에 젬 배치 완료
      return true;
    }
    
    const core = nonZeroCores[coreIndex];
    const availableGems = gems.filter(gem => !usedGems.has(gem.id));
    
    // 1개부터 4개까지 젬 조합 시도
    for (let gemCount = 1; gemCount <= 4; gemCount++) {
      const combos = getCombinations(availableGems, gemCount);
      
      for (const combo of combos) {
        const totalCost = combo.reduce((s, g) => s + g.cost, 0);
        const totalPoints = combo.reduce((s, g) => s + g.points, 0);
        
        if (totalCost <= core.limit && totalPoints >= core.targetPoint) {
          // 이 조합을 사용해보기
          combo.forEach(gem => usedGems.add(gem.id));
          
          // 코어 계수 적용한 총 전투력 계산
          const coreTotalPower = calculateCoreTotalPower(combo, core, currentPage, playerType);
          const isEffectActive = isCoreEffectActive(totalPoints);
          const pointPriority = getPointPriority(totalPoints);
          
          assignments.push({
            coreIndex: core.index,
            coreName: core.name,
            gems: combo,
            totalCost,
            totalPoints,
            power: coreTotalPower.totalPower,
            gemPower: coreTotalPower.gemPower,
            coeff: coreTotalPower.coeff,
            isEffectActive,
            pointPriority
          });
          
          // 다음 코어로 재귀 호출
          if (findGemAssignment(coreIndex + 1)) {
            return true;
          }
          
          // 실패 시 이 조합을 되돌리기
          combo.forEach(gem => usedGems.delete(gem.id));
          assignments.pop();
        }
      }
    }
    
    return false;
  }
  
  const result = findGemAssignment(0);
  
  if (result) {
    // 성공한 경우 results 배열 구성
    assignments.forEach(assignment => {
      results[assignment.coreIndex] = {
        core: cores[assignment.coreIndex],
        gems: assignment.gems,
        power: assignment.power,
        gemPower: assignment.gemPower,
        coeff: assignment.coeff,
        cost: assignment.totalCost,
        corePoints: assignment.totalPoints,
        isEffectActive: assignment.isEffectActive,
        pointPriority: assignment.pointPriority
      };
    });
    
    // 0포인트 코어들에 남은 젬들로 최대 전투력 구성
    for (let i = 0; i < cores.length; i++) {
      if (targetPoints[i] === 0) {
        const core = cores[i];
        const availableGems = gems.filter(gem => !usedGems.has(gem.id));
        let bestCombo = null;
        
        // 1개부터 4개까지 젬 조합 시도 (의지력 한도 내에서 최대 전투력)
        for (let gemCount = 1; gemCount <= 4; gemCount++) {
          const allCombos = getCombinations(availableGems, gemCount);
          
          for (const combo of allCombos) {
            const totalCost = combo.reduce((s, g) => s + g.cost, 0);
            
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
          results[i] = {
            core: core,
            ...bestCombo
          };
        } else {
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
    }
    
    return results;
  } else {
    return null; // 달성 불가능
  }
}

export function ArkGridOptimization(cores, gems, currentPage = '질서', playerType = '딜러') {
  // 모든 코어 포인트 조합 생성
  const allCombinations = generateCorePointCombinations(cores);
  
  const feasibleCombinations = [];
  
  // 각 조합이 달성 가능한지 확인
  allCombinations.forEach((combination, index) => {
    let result = isCombinationFeasible(cores, gems, combination);
    console.log('ArkGridOptimization result : ', result);
    if (result) {
      const optimalPlacement = findOptimalGemPlacement(cores, gems, combination, currentPage, playerType);
      console.log('findOptimalGemPlacement 결과:', optimalPlacement);
      
      if (optimalPlacement && optimalPlacement.length > 0) {
        const totalPower = optimalPlacement.reduce((sum, result) => sum + result.power, 0);
        const totalPointPriority = optimalPlacement.reduce((sum, result) => sum + result.pointPriority, 0);
        
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
