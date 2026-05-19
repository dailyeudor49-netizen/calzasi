import { NextRequest, NextResponse } from "next/server";
import { getOrders, getOrderStats, deleteOrder, getSmsLogsForOrders, getDistinctProducts, getDistinctSources } from "@/lib/db";

const ADMIN_PASS = process.env.ADMIN_PASS || "";

function isAdmin(req: NextRequest): boolean {
  return req.cookies.get("admin_token")?.value === ADMIN_PASS && ADMIN_PASS !== "";
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "0", 10);
  const perPage = parseInt(searchParams.get("perPage") || "20", 10);

  // Filter parameters
  const day = searchParams.get("day") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const hourFromStr = searchParams.get("hourFrom");
  const hourToStr = searchParams.get("hourTo");
  const hourFrom = hourFromStr !== null ? parseInt(hourFromStr, 10) : undefined;
  const hourTo = hourToStr !== null ? parseInt(hourToStr, 10) : undefined;
  const search = searchParams.get("search") || undefined;
  const product = searchParams.get("product") || undefined;
  const source = searchParams.get("source") || undefined;

  console.log("[API] GET /api/admin/orders - Filters received:", { day, from, to, hourFrom, hourTo, search, product, source });

  const [orders, stats, products, sources] = await Promise.all([
    getOrders(page, perPage, {
      day,
      from,
      to,
      hourFrom,
      hourTo,
      search,
      product,
      source,
    }),
    getOrderStats(from, to),
    getDistinctProducts(),
    getDistinctSources(),
  ]);

  // Attach SMS status to each order
  const orderIds = orders.orders.map((o) => o.id as number);
  const smsMap = await getSmsLogsForOrders(orderIds);
  const ordersWithSms = orders.orders.map((o) => ({
    ...o,
    sms_status: smsMap[o.id as number] || null,
  }));

  return NextResponse.json({
    orders: { orders: ordersWithSms, total: orders.total },
    stats,
    products,
    sources,
  });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await deleteOrder(body.id);

  return NextResponse.json({ success: true });
}
