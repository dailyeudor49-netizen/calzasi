import { NextRequest, NextResponse } from "next/server";
import { isIpRateLimitEnabled, setIpRateLimit } from "@/lib/db";

const ADMIN_PASS = process.env.ADMIN_PASS || "";

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get("admin_token")?.value === ADMIN_PASS && ADMIN_PASS !== "";
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enabled = await isIpRateLimitEnabled();
  return NextResponse.json({ enabled });
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await setIpRateLimit(body.enabled);

  return NextResponse.json({ success: true });
}
