import { NextResponse } from 'next/server';
import { fetchGoogleSheetsCsv } from '@/lib/warroom/sheets';
import { calculateSemaforoStatus } from '@/lib/warroom/semaforo';
import { suggestAction } from '@/lib/warroom/actions';
import type { CampaignMetrics, GlobalLeadMetrics, WarRoomData } from '@/lib/warroom/types';
import { getSQL } from '@/lib/db';

const CPL_TARGET = parseFloat(process.env.CPL_TARGET || '8');

export async function GET() {
  try {
    const sheetsUrl = process.env.GOOGLE_SHEETS_CSV_URL;

    if (!sheetsUrl) {
      return NextResponse.json(
        { error: 'GOOGLE_SHEETS_CSV_URL not configured' },
        { status: 500 }
      );
    }

    console.log('[War Room] Fetching CSV from Google Sheets...');

    // Step 1: Fetch CSV from Sheets (updated hourly by Google Ads Script)
    const adsData = await fetchGoogleSheetsCsv(sheetsUrl);

    console.log('[War Room] CSV fetched, querying lead DB...');

    // Step 2: Fetch global lead metrics from PostgreSQL
    const sql = getSQL();
    const leadsRaw = await sql`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') as today,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as last_7d,
        COUNT(*) FILTER (WHERE status = 'confermata') as confirmed,
        COUNT(*) FILTER (WHERE status = 'rifiutata') as rejected,
        COUNT(*) FILTER (WHERE status = 'invalida') as invalid,
        COUNT(*) FILTER (WHERE status = 'doppia') as duplicate,
        SUM(CASE WHEN status = 'confermata' THEN payout ELSE 0 END) as revenue
      FROM leads
    `;

    const globalLeads: GlobalLeadMetrics = {
      total: Number(leadsRaw[0]?.total) || 0,
      today: Number(leadsRaw[0]?.today) || 0,
      last_7d: Number(leadsRaw[0]?.last_7d) || 0,
      confirmed: Number(leadsRaw[0]?.confirmed) || 0,
      rejected: Number(leadsRaw[0]?.rejected) || 0,
      invalid: Number(leadsRaw[0]?.invalid) || 0,
      duplicate: Number(leadsRaw[0]?.duplicate) || 0,
      revenue: Number(leadsRaw[0]?.revenue) || 0,
    };

    console.log('[War Room] Fetching campaign settings...');

    // Step 3: Fetch campaign settings from DB
    const settingsRaw = await sql`SELECT campaign_id, bidding_strategy, cpl_target, notes FROM campaign_settings`;
    const settingsMap = new Map(
      settingsRaw.map((row) => [
        row.campaign_id as string,
        {
          bidding_strategy: row.bidding_strategy as string | null,
          cpl_target: row.cpl_target ? Number(row.cpl_target) : null,
          notes: row.notes as string | null,
        },
      ])
    );

    console.log('[War Room] Calculating campaign metrics...');

    // Step 4: Calculate metrics for each campaign with settings merge
    const campaigns: CampaignMetrics[] = adsData.map((ads) => {
      const settings = settingsMap.get(ads.campaign_id);
      const cplTarget = settings?.cpl_target || CPL_TARGET;
      const status = calculateSemaforoStatus(ads, cplTarget);
      const actionData = suggestAction(ads, cplTarget);

      return {
        campaign: ads.campaign,
        campaign_id: ads.campaign_id,
        status,
        budget: ads.budget,
        spend_today: ads.spend_today,
        spend_7d: ads.spend_7d,
        spend_14d: ads.spend_14d,
        ctr: ads.ctr,
        ctr_7d: ads.ctr_7d,
        cpc: ads.cpc,
        cpc_7d: ads.cpc_7d,
        clicks: ads.clicks,
        clicks_7d: ads.clicks_7d,
        conversions: ads.conversions,
        action: actionData.action,
        action_detail: actionData.detail,
        bidding_strategy: settings?.bidding_strategy,
        cpl_target_custom: settings?.cpl_target,
        notes: settings?.notes,
      };
    });

    const data: WarRoomData = {
      campaigns,
      global_leads: globalLeads,
      last_updated: new Date().toISOString(),
      cpl_target: CPL_TARGET,
    };

    console.log('[War Room] Refresh complete');

    return NextResponse.json(data);
  } catch (error) {
    console.error('[War Room Refresh] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
