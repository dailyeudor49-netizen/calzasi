import { NextRequest, NextResponse } from "next/server";
import { exportOrdersSQL } from "@/lib/db";

const ADMIN_PASS = process.env.ADMIN_PASS || "";

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get("admin_token")?.value === ADMIN_PASS && ADMIN_PASS !== "";
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = await exportOrdersSQL();

  return new NextResponse(sql, {
    headers: {
      "Content-Type": "application/sql",
      "Content-Disposition": "attachment; filename=orders_export.sql",
    },
  });
}
