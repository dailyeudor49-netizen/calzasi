import type { GoogleAdsData } from './types';

export async function fetchGoogleSheetsCsv(url: string): Promise<GoogleAdsData[]> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch Google Sheets CSV: ${res.statusText}`);
    }

    const csvText = await res.text();
    return parseCsv(csvText);
  } catch (error) {
    console.error('[War Room] Error fetching Google Sheets:', error);
    throw error;
  }
}

function parseCsv(csvText: string): GoogleAdsData[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Header: campaign_id, campaign_name, status, budget_daily, cost, impressions, clicks, ctr, cpc, conversions
  const rows = lines.slice(1); // Skip header

  return rows.map((line) => {
    const cols = line.split(',');
    const cost = parseFloat(cols[4]) || 0;
    const clicks = parseInt(cols[6]) || 0;
    const ctr = parseFloat(cols[7]) || 0;
    const cpc = parseFloat(cols[8]) || 0;

    return {
      campaign: cols[1]?.trim() || '', // campaign_name
      campaign_id: cols[0]?.trim() || '', // campaign_id
      status: cols[2]?.trim() || 'Unknown',
      budget: parseFloat(cols[3]) || 0, // budget_daily
      spend_today: cost, // cost (assumendo spesa totale campagna)
      spend_7d: cost, // No storico disponibile, uso cost
      spend_14d: cost, // No storico disponibile, uso cost
      clicks: clicks,
      clicks_7d: clicks, // No storico disponibile, uso clicks attuali
      impressions: parseInt(cols[5]) || 0,
      ctr: ctr,
      ctr_7d: ctr, // No storico disponibile, uso ctr attuale
      cpc: cpc,
      cpc_7d: cpc, // No storico disponibile, uso cpc attuale
      conversions: parseInt(cols[9]) || 0,
    };
  });
}
