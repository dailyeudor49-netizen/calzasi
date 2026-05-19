import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/csrf";

function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host") || "";

  // Same-origin: origin or referer matches the host
  if (origin) {
    try { if (new URL(origin).host === host) return true; } catch {}
  }
  if (referer) {
    try { if (new URL(referer).host === host) return true; } catch {}
  }

  // No origin/referer (same-origin fetch on some browsers) → allow
  if (!origin && !referer) return true;

  return false;
}

export async function GET(req: NextRequest) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const token = generateToken();
  return NextResponse.json({ token });
}
