import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug, submitReview } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { slug, authorName, rating, body } = await req.json();

    if (!slug || !authorName || !rating || !body) {
      return NextResponse.json({ error: "Campi mancanti" }, { status: 400 });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating non valido" }, { status: 400 });
    }

    if (body.length < 10 || body.length > 1000) {
      return NextResponse.json({ error: "Recensione troppo corta o troppo lunga" }, { status: 400 });
    }

    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ error: "Prodotto non trovato" }, { status: 404 });
    }

    await submitReview(product.id as number, authorName.trim(), rating, body.trim());

    return NextResponse.json({
      success: true,
      message: "Recensione inviata. Sarà visibile dopo approvazione.",
    });
  } catch {
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
