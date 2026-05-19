import { NextRequest, NextResponse } from "next/server";
import { getBlockedIps, unblockIp } from "@/lib/db";

const ADMIN_PASS = process.env.ADMIN_PASS || "";

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get("admin_token")?.value === ADMIN_PASS && ADMIN_PASS !== "";
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ips = await getBlockedIps();
  return NextResponse.json(ips);
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await unblockIp(body.id);

  return NextResponse.json({ success: true });
}
