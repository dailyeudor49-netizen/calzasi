import type { GoogleAdsData } from './types';

export function suggestAction(
  adsData: GoogleAdsData,
  cplTarget: number
): { action: string; detail?: string } {
  if (adsData.conversions === 0) {
    return { action: 'Non toccare', detail: 'Nessuna conversione ancora' };
  }

  const cpl7d = adsData.spend_7d / adsData.conversions;
  const ctrDrop = adsData.ctr_7d > 0 ? ((adsData.ctr - adsData.ctr_7d) / adsData.ctr_7d) * 100 : 0;
  const cpcIncrease = adsData.cpc_7d > 0 ? ((adsData.cpc - adsData.cpc_7d) / adsData.cpc_7d) * 100 : 0;
  const budgetUsage = adsData.budget > 0 ? (adsData.spend_7d / (adsData.budget * 7)) * 100 : 0;

  // Scala se: CPL 7gg sotto target, CTR non cala >15%, CPC non sale >15%, spesa/budget >85%
  if (cpl7d < cplTarget && ctrDrop > -15 && cpcIncrease < 15 && budgetUsage > 85) {
    const increase = calculateBudgetIncrease(adsData.budget);
    return {
      action: 'Scala',
      detail: `Aumenta budget di +${increase}% (${(adsData.budget * increase / 100).toFixed(2)}€)`,
    };
  }

  // Aggiungi creative se: CTR 7gg cala >20% o CPC sale >15% ma CPL ancora sotto target +15%
  const cplIncrease = ((cpl7d - cplTarget) / cplTarget) * 100;
  if ((ctrDrop < -20 || cpcIncrease > 15) && cplIncrease < 15) {
    return { action: 'Aggiungi creative', detail: 'CTR/CPC peggiora, serve refresh creativo' };
  }

  // Riduci budget -25% se: CPL sopra target >30%
  if (cplIncrease > 30) {
    return {
      action: 'Riduci budget',
      detail: `Riduci di -25% (${(adsData.budget * 0.75).toFixed(2)}€)`,
    };
  }

  // Non toccare se: tutto stabile
  return { action: 'Non toccare', detail: 'Performance stabile' };
}

function calculateBudgetIncrease(currentBudget: number): number {
  if (currentBudget < 100) return 40; // +30-50%
  if (currentBudget < 300) return 25; // +20-30%
  if (currentBudget < 600) return 12; // +10-15%
  return 7; // +5-10%
}
