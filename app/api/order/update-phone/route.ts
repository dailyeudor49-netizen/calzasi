import { NextRequest, NextResponse } from "next/server";
import { updatePhone } from "@/lib/db";
import { validateToken } from "@/lib/csrf";

const FULLSHIP_API_URL =
  process.env.FULLSHIP_API_URL ||
  "https://fullship-proxy.marco-quaranta-info.workers.dev";

function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host") || "";

  if (origin) {
    try { if (new URL(origin).host === host) return true; } catch {}
  }
  if (referer) {
    try { if (new URL(referer).host === host) return true; } catch {}
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { oldPhone, newPhone, payload, csrfToken } = body;

    if (!validateToken(csrfToken)) {
      return NextResponse.json({ error: "Token non valido" }, { status: 403 });
    }

    if (!oldPhone || !newPhone || !payload) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    try {
      await updatePhone(oldPhone, newPhone);
    } catch {
      // DB down — proceed to re-send anyway
    }

    payload.customer.phoneNumber = newPhone;
    if (payload.cart) {
      payload.cart.code = String(Date.now());
    }

    const res = await fetch(FULLSHIP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "FullShip ha rifiutato l'ordine", detail: data },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore di rete";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
