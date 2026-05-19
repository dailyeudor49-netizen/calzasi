import type { GoogleAdsData } from './types';

export function calculateSemaforoStatus(
  adsData: GoogleAdsData,
  cplTarget: number
): 'Verde' | 'Giallo' | 'Rosso' | 'Nero' {
  // Nero: campagna attiva ma spesa 0, oppure spesa ma 0 conversioni
  if (adsData.status.toLowerCase() === 'enabled' && adsData.spend_7d === 0) {
    return 'Nero';
  }
  if (adsData.spend_7d > 0 && adsData.conversions === 0) {
    return 'Nero';
  }

  // Calcola CPL da conversioni Google Ads
  const cpl7d = adsData.conversions > 0 ? adsData.spend_7d / adsData.conversions : 999;
  const ctrDrop = adsData.ctr_7d > 0 ? ((adsData.ctr - adsData.ctr_7d) / adsData.ctr_7d) * 100 : 0;
  const cpcIncrease = adsData.cpc_7d > 0 ? ((adsData.cpc - adsData.cpc_7d) / adsData.cpc_7d) * 100 : 0;
  const budgetUsage = adsData.budget > 0 ? (adsData.spend_today / adsData.budget) * 100 : 0;

  // Rosso: CPL sopra target >30%, oppure CTR cala >30% e CPC sale >30%
  const cplIncrease = ((cpl7d - cplTarget) / cplTarget) * 100;
  if (cplIncrease > 30 || (ctrDrop < -30 && cpcIncrease > 30)) {
    return 'Rosso';
  }

  // Giallo: CPL peggiora 15-30%, oppure CTR cala >15%
  if ((cplIncrease >= 15 && cplIncrease <= 30) || ctrDrop < -15) {
    return 'Giallo';
  }

  // Verde: CPL sotto target, CTR stabile, budget usato >85%
  if (cpl7d < cplTarget && ctrDrop > -15 && budgetUsage > 85) {
    return 'Verde';
  }

  // Default: Giallo
  return 'Giallo';
}

export function getSemaforoColor(status: 'Verde' | 'Giallo' | 'Rosso' | 'Nero'): string {
  const colors = {
    Verde: '#10b981',
    Giallo: '#f59e0b',
    Rosso: '#ef4444',
    Nero: '#1f2937',
  };
  return colors[status];
}

export function getSemaforoEmoji(status: 'Verde' | 'Giallo' | 'Rosso' | 'Nero'): string {
  const emojis = {
    Verde: '🟢',
    Giallo: '🟡',
    Rosso: '🔴',
    Nero: '⚫',
  };
  return emojis[status];
}
