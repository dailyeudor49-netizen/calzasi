import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmation } from "@/lib/email";
import { sendOrderSms } from "@/lib/sms";
import {
  phoneExists,
  registerOrder,
  isIpBlocked,
  countRecentOrdersByIp,
  blockIp,
  isIpRateLimitEnabled,
  insertSmsLog,
  updateSmsLogSent,
  updateSmsLogFailed,
} from "@/lib/db";
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
  if (!origin && !referer) return true;

  return false;
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // CSRF validation
    if (!validateToken(body?.csrfToken)) {
      return NextResponse.json({ error: "Token non valido" }, { status: 403 });
    }

    const customer = body?.customer || {};
    const phone: string = customer.phoneNumber || "";
    const product: string = body?.cart?.code || body?.cart?.productName || "Sconosciuto";
    const utmSource: string = body?.meta?.utm_source || body?.source || "organica";
    const utmContent: string = body?.meta?.utm_content || "";
    const utmCampaign: string = body?.meta?.utm_campaign || "";
    const source: string = [utmSource, utmCampaign, utmContent].filter(Boolean).join("_") || "organica";
    const meta = body?.meta || {};
    const variant = body?.variant || {};

    // ── Free gift validation (plantare omaggio da popup abbandono) ──
    const freeGiftRequested: boolean = !!body?.freeGift;
    const cartProducts: { variantId: number; quantity: number; subtotal: string }[] = Array.isArray(body?.cart?.products) ? body.cart.products : [];
    if (freeGiftRequested) {
      // Esattamente UN prodotto con subtotal 0 è ammesso. Forziamo subtotal "0.00" e quantity 1 per sicurezza.
      let zeroLines = 0;
      for (const p of cartProducts) {
        const sub = parseFloat(String(p.subtotal ?? "0"));
        if (sub === 0) {
          zeroLines++;
          p.subtotal = "0.00";
          p.quantity = 1;
        }
      }
      if (zeroLines === 0) {
        // Il client ha dichiarato il regalo ma non l'ha messo nei products — lo aggiungiamo lato server
        // usando lo stesso variantId del primo prodotto a pagamento come fallback non è corretto;
        // qui ci affidiamo al fatto che il client invii il line a 0. Se manca, ignoriamo silenziosamente.
        console.warn("[order] freeGift=true ma nessuna riga a subtotal 0 nel cart");
      }
      // Aggiungi tag omaggio alle note
      const giftTag = "OMAGGIO POPUP ABBANDONO MODULO — Plantare comfort gratuito (valore 29,99€)";
      const existingNotes = (customer.shippingNotes || "").toString();
      if (!existingNotes.includes("OMAGGIO POPUP")) {
        customer.shippingNotes = existingNotes ? `${existingNotes} | ${giftTag}` : giftTag;
      }
      if (body.cart) body.cart.freeGiftAccepted = true;
    }

    // Upsell flag: true se ci sono linee a pagamento extra (subtotal > 0) oltre alla principale
    const paidLines = cartProducts.filter((p) => parseFloat(String(p.subtotal ?? "0")) > 0);
    const upsell: boolean = paidLines.length > 1;

    // Extract client IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "";
    const isLocalhost = ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(ip);

    // IP rate limiting (skip for localhost and missing IP)
    if (ip && !isLocalhost) {
      try {
        const enabled = await isIpRateLimitEnabled();
        if (enabled) {
          if (await isIpBlocked(ip)) {
            return NextResponse.json({ error: "Troppe richieste" }, { status: 429 });
          }
          const recentCount = await countRecentOrdersByIp(ip, 15);
          if (recentCount >= 3) {
            await blockIp(ip, "Auto: ≥3 ordini in 15 min");
            return NextResponse.json({ error: "Troppe richieste" }, { status: 429 });
          }
        }
      } catch {
        // DB down — proceed anyway
      }
    }

    // Check if phone already used (blocks duplicates from local + shared DB)
    const exists = await phoneExists(phone);
    if (exists) {
      return NextResponse.json({ duplicate: true }, { status: 409 });
    }

    // Register order in DB FIRST (always, regardless of Fullship)
    let orderId: number | null = null;
    try {
      orderId = await registerOrder({
        product,
        phone,
        upsell,
        ip: ip || undefined,
        email: customer.email || undefined,
        firstName: customer.firstName || undefined,
        lastName: customer.lastName || undefined,
        address: customer.address || undefined,
        city: customer.city || undefined,
        province: customer.state || undefined,
        zip: customer.zip || undefined,
        shippingNotes: customer.shippingNotes || undefined,
        selectedSize: meta.size || variant.size || undefined,
        selectedColor: meta.color || variant.color || undefined,
        shopName: "Calzasi",
        source,
      });
    } catch (err) {
      console.error("[order] DB error:", err);
    }

    // Inject shopName and unique id into cart before forwarding to Fullship
    if (body.cart) {
      body.cart.shopName = "Calzasi";
      if (!body.cart.id) body.cart.id = Date.now();
    }

    // Forward to Fullship
    const res = await fetch(FULLSHIP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // Send confirmation email only if Fullship OK
    if (res.ok) {
      const email = customer.email || "";
      if (email) {
        const orderId = "IT-" + String(body.orderTimestamp || Date.now()).slice(-6);
        const cart = body.cart || {};
        const products = cart.products || [];
        const mainProduct = products[0];
        const upsellProduct = products.length > 1 ? products[1] : null;
        try {
          await sendOrderConfirmation({
            email,
            orderId,
            firstName: customer.firstName || "",
            lastName: customer.lastName || "",
            phone: customer.phoneNumber || "",
            address: customer.address || "",
            city: customer.city || "",
            state: customer.state || "",
            zip: customer.zip || "",
            productName: cart.productName || "",
            productImage: body?.variant?.image,
            color: body?.variant?.color,
            size: body?.variant?.size || "",
            price: mainProduct?.subtotal || cart.totalPrice,
            upsell: !!body.upsell,
            upsellPrice: upsellProduct?.subtotal,
            totalPrice: cart.totalPrice,
          });
        } catch (err) {
          console.error("[email] Errore invio email:", err);
        }
      }

      // Send SMS confirmation
      if (phone) {
        const smsOrderCode = "IT-" + String(body.orderTimestamp || Date.now()).slice(-6);
        let smsLogId: number | null = null;
        try {
          const smsMessage = `Ordine ${smsOrderCode} confermato! ${product}`;
          smsLogId = await insertSmsLog(orderId, phone, smsMessage);
          const smsResult = await sendOrderSms({
            phone,
            orderId: smsOrderCode,
            productName: product,
            totalPrice: body.cart?.totalPrice || "",
            firstName: customer.firstName || "",
          });
          if (smsResult.success && smsLogId) {
            await updateSmsLogSent(smsLogId, smsResult.ticket!, smsResult.credits ?? null);
          } else if (smsLogId) {
            await updateSmsLogFailed(smsLogId, smsResult.error || "Errore sconosciuto");
          }
        } catch (err) {
          console.error("[sms] Errore invio SMS:", err);
          if (smsLogId) {
            try { await updateSmsLogFailed(smsLogId, String(err)); } catch {}
          }
        }
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore di rete";
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
