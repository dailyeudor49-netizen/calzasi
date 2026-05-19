import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Email non valida" }, { status: 400 });
    }

    const isNew = await subscribeNewsletter(email);

    return NextResponse.json({
      success: true,
      message: isNew ? "Iscrizione completata!" : "Sei gia iscritto.",
    });
  } catch {
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
