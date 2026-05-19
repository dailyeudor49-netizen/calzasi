import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, numero_ordine, stelle, titolo, testo } = body;

    if (!nome || !numero_ordine || !stelle || !testo) {
      return NextResponse.json({ error: "Campi obbligatori mancanti" }, { status: 400 });
    }

    console.log("[REVIEW SUBMISSION]", { nome, numero_ordine, stelle, titolo, testo, ts: new Date().toISOString() });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
