import { NextRequest, NextResponse } from "next/server";
import { updateSmsLogDlr } from "@/lib/db";

// SMSFactor server IPs (for optional IP whitelist)
const SMSFACTOR_IPS = ["51.159.7.123", "51.159.21.54"];

export async function POST(req: NextRequest) {
  try {
    // Optional: IP whitelist check
    const forwarded = req.headers.get("x-forwarded-for");
    const clientIp = forwarded ? forwarded.split(",")[0].trim() : "";
    if (clientIp && !SMSFACTOR_IPS.includes(clientIp)) {
      console.warn(`[sms-webhook] IP non autorizzato: ${clientIp}`);
      // Don't block — in case SMSFactor adds new IPs, just log
    }

    const body = await req.json();

    const { status, campaign_id, date } = body;

    if (!campaign_id) {
      return NextResponse.json({ error: "campaign_id mancante" }, { status: 400 });
    }

    await updateSmsLogDlr(
      String(campaign_id),
      typeof status === "number" ? status : parseInt(status, 10),
      date || new Date().toISOString()
    );

    console.log(`[sms-webhook] DLR ricevuto: ticket=${campaign_id}, status=${status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[sms-webhook] Errore:", err);
    // Always return 200 to prevent SMSFactor retries
    return NextResponse.json({ ok: true });
  }
}
