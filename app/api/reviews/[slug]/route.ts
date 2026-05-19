import { NextRequest, NextResponse } from "next/server";
import { getReviewsBySlug, getProductBySlug } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const reviews = await getReviewsBySlug(slug);

  const count = reviews.length;
  const total = reviews.reduce((sum: number, r) => sum + Number(r.rating), 0);
  const average = count > 0 ? total / count : 0;

  return NextResponse.json({
    reviews,
    stats: { count, average: Math.round(average * 10) / 10 },
  });
}
