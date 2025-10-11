import { calculateGemPower, calculateCorePoints, isCoreEffectActive, getPointPriority } from './gemCalculations';

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

export function optimize(cores, gems) {
  const results = [];
  const usedGems = new Set();
  
  console.log('=== 최적화 시작 ===');
  console.log('총 젬 수:', gems.length);
  
  cores.forEach((core, coreIndex) => {
    console.log(`\n--- 코어 ${coreIndex + 1} (${core.name}) 최적화 ---`);
    
    const availableGems = gems.filter(gem => !usedGems.has(gem.id));
    console.log('사용 가능한 젬 수:', availableGems.length);
    
    let bestCombo = null;

    for (let gemCount = 1; gemCount <= 4; gemCount++) {
      const allCombos = getCombinations(availableGems, gemCount);
      
      allCombos.forEach(combo => {
        const totalCost = combo.reduce((s, g) => s + g.cost, 0);
        if (totalCost <= core.limit) {
          const totalPower = combo.reduce((s, g) => s + calculateGemPower(g), 0);
          const corePoints = calculateCorePoints(combo);
          const isEffectActive = isCoreEffectActive(corePoints);
          const pointPriority = getPointPriority(corePoints);
          
          let isBetter = false;
          if (!bestCombo) {
            isBetter = true;
          } else {
            const bestIsEffectActive = isCoreEffectActive(calculateCorePoints(bestCombo.gems));
            const bestPointPriority = getPointPriority(calculateCorePoints(bestCombo.gems));
            
            if (isEffectActive && !bestIsEffectActive) {
              isBetter = true;
            } else if (isEffectActive === bestIsEffectActive) {
              if (isEffectActive) {
                isBetter = pointPriority > bestPointPriority;
              } else {
                isBetter = totalPower > bestCombo.power;
              }
            }
          }
          
          if (isBetter) {
            bestCombo = { 
              gems: combo, 
              power: totalPower, 
              cost: totalCost, 
              core: core,
              corePoints: corePoints,
              isEffectActive: isEffectActive,
              pointPriority: pointPriority
            };
          }
        }
      });
    }

    if (bestCombo) {
      console.log('선택된 젬 조합:', bestCombo.gems.map(g => ({ id: g.id, gemNumber: g.gemNumber })));
      
      bestCombo.gems.forEach(gem => {
        usedGems.add(gem.id);
      });
      
      // Gem replacement optimization
      let improvedCombo = { ...bestCombo };
      let hasImprovement = true;
      
      while (hasImprovement) {
        const unusedGems = gems.filter(gem => !usedGems.has(gem.id));
        
        const replacement = findBetterReplacement(
          improvedCombo.gems, 
          improvedCombo.corePoints, 
          unusedGems
        );
        
        if (replacement && replacement.improvement > 0) {
          console.log(`젬 교체: 젬 ${replacement.oldGem.gemNumber} → 젬 ${replacement.newGem.gemNumber}`);
          
          const newGems = [...improvedCombo.gems];
          newGems[replacement.index] = replacement.newGem;
          
          const newCorePoints = calculateCorePoints(newGems);
          const newPower = newGems.reduce((s, g) => s + calculateGemPower(g), 0);
          const newIsEffectActive = isCoreEffectActive(newCorePoints);
          
          improvedCombo = {
            ...improvedCombo,
            gems: newGems,
            corePoints: newCorePoints,
            power: newPower,
            isEffectActive: newIsEffectActive
          };
          
          usedGems.delete(replacement.oldGem.id);
          usedGems.add(replacement.newGem.id);
        } else {
          hasImprovement = false;
        }
      }
      
      results.push(improvedCombo);
    }
  });

  return results;
}
