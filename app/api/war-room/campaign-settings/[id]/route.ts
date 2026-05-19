import { NextResponse } from 'next/server';
import { getSQL } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;
    const sql = getSQL();

    const rows = await sql`
      SELECT campaign_id, bidding_strategy, cpl_target, notes, updated_at
      FROM campaign_settings
      WHERE campaign_id = ${campaignId}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({
        campaign_id: campaignId,
        bidding_strategy: null,
        cpl_target: null,
        notes: null,
        updated_at: null,
      });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('[Campaign Settings GET] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;
    const body = await request.json();
    const { bidding_strategy, cpl_target, notes } = body;

    const sql = getSQL();

    await sql`
      INSERT INTO campaign_settings (campaign_id, bidding_strategy, cpl_target, notes, updated_at)
      VALUES (${campaignId}, ${bidding_strategy || null}, ${cpl_target || null}, ${notes || null}, NOW())
      ON CONFLICT (campaign_id)
      DO UPDATE SET
        bidding_strategy = ${bidding_strategy || null},
        cpl_target = ${cpl_target || null},
        notes = ${notes || null},
        updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Campaign Settings PUT] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
