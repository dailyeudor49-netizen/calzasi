/* ══════════════════════════════════════════════════════
   Dati dello shop senza database.

   Catalogo, recensioni e configurazione sono file in lib/content, generati una
   volta dal vecchio database (C:/_neon-exit/export-content.mjs) e ora sono loro
   la fonte: per cambiare un prodotto o un testo si modifica il JSON e si rifà il
   deploy. Nessuna pagina apre connessioni esterne per mostrare lo shop.

   Gli ordini non vengono salvati qui: la route li inoltra al gestionale IKORU,
   che è l'unico archivio. Le funzioni che scrivevano sul database restano con la
   stessa firma, così le route non cambiano, ma non persistono nulla.
   ══════════════════════════════════════════════════════ */

import productsData from "./content/products.json";
import categoriesData from "./content/categories.json";
import productCategoriesData from "./content/product_categories.json";
import reviewsData from "./content/reviews.json";
import shopConfigData from "./content/shop_config.json";
import crossSellData from "./content/cross_sell.json";

type Row = Record<string, any>;

// Il vecchio driver restituiva i timestamp come Date: li ricostruiamo uguali.
function revive(rows: Row[]): Row[] {
  return rows.map((r) => {
    const o: Row = { ...r };
    for (const k of Object.keys(o)) {
      if (k.endsWith("_at") && typeof o[k] === "string") o[k] = new Date(o[k]);
    }
    return o;
  });
}

const PRODUCTS = revive(productsData as Row[]);
const CATEGORIES = revive(categoriesData as Row[]);
const PRODUCT_CATEGORIES = productCategoriesData as Row[];
const REVIEWS = revive(reviewsData as Row[]);
const SHOP_CONFIG = shopConfigData as Record<string, string>;

const categoryById = new Map(CATEGORIES.map((c) => [c.id, c]));

function withCategory(p: Row): Row | null {
  const c = categoryById.get(p.category_id);
  if (!c) return null; // era un INNER JOIN: senza categoria il prodotto non compariva
  return { ...p, category_slug: c.slug, category_label: c.label };
}

function categorySlugs(productId: number): string[] | null {
  const slugs = PRODUCT_CATEGORIES.filter((pc) => pc.product_id === productId)
    .map((pc) => categoryById.get(pc.category_id)?.slug)
    .filter(Boolean) as string[];
  return slugs.length ? slugs : null;
}

const time = (d: unknown) => (d instanceof Date ? d.getTime() : d ? new Date(d as string).getTime() : 0);

// ORDER BY sold_out ASC, created_at DESC
function catalogOrder(a: Row, b: Row) {
  if (!!a.sold_out !== !!b.sold_out) return a.sold_out ? 1 : -1;
  return time(b.created_at) - time(a.created_at);
}

const byNewest = (a: Row, b: Row) => time(b.created_at) - time(a.created_at);

/* ── Prodotti ─────────────────────────────────────────── */

export async function getProducts(includeUpsell = false) {
  return PRODUCTS.filter((p) => !p.hidden && (includeUpsell || !p.is_upsell))
    .map((p) => {
      const row = withCategory(p);
      return row && { ...row, category_slugs: categorySlugs(p.id) };
    })
    .filter(Boolean)
    .sort(catalogOrder as any) as Row[];
}

export async function getBestsellers() {
  return PRODUCTS.filter((p) => p.is_bestseller && !p.hidden)
    .map(withCategory)
    .filter(Boolean)
    .sort(catalogOrder as any) as Row[];
}

export async function getProductBySlug(slug: string) {
  const p = PRODUCTS.find((x) => x.slug === slug);
  return (p && withCategory(p)) || null;
}

export async function getProductById(id: number) {
  return PRODUCTS.find((x) => x.id === id) || null;
}

/* ── Categorie ────────────────────────────────────────── */

export async function getCategories() {
  return [...CATEGORIES].sort((a, b) => a.id - b.id);
}

/* ── Recensioni (nel file ci sono solo quelle approvate) ── */

export async function getReviewsByProductId(productId: number) {
  return REVIEWS.filter((r) => r.product_id === productId).sort(byNewest);
}

export async function getReviewsBySlug(slug: string) {
  const p = PRODUCTS.find((x) => x.slug === slug);
  return p ? getReviewsByProductId(p.id) : [];
}

export async function getReviewStats(productId: number) {
  const rows = REVIEWS.filter((r) => r.product_id === productId);
  if (!rows.length) return { count: 0, avg: 0 };
  const avg = rows.reduce((s, r) => s + Number(r.rating), 0) / rows.length;
  return { count: rows.length, avg: Math.round(avg * 10) / 10 };
}

const avg1 = (rows: Row[]) =>
  rows.length ? Math.round((rows.reduce((s, r) => s + Number(r.rating), 0) / rows.length) * 10) / 10 : 0;

/** Media e numero di tutte le recensioni (barra di fiducia in homepage). */
export async function getGlobalReviewStats() {
  return { count: REVIEWS.length, avg: avg1(REVIEWS) };
}

/** Media e numero per prodotto, per id (schede prodotto). */
export async function getReviewStatsByProduct(): Promise<Record<number, { count: number; avg: number }>> {
  const map: Record<number, { count: number; avg: number }> = {};
  const byProduct = new Map<number, Row[]>();
  for (const r of REVIEWS) byProduct.set(r.product_id, [...(byProduct.get(r.product_id) || []), r]);
  for (const [id, rows] of byProduct) map[id] = { count: rows.length, avg: avg1(rows) };
  return map;
}

/** Statistiche per tutti i prodotti in una volta (catalogo), media non arrotondata. */
export async function getAllReviewStats(): Promise<Record<number, { count: number; avg: number }>> {
  const map: Record<number, { count: number; avg: number }> = {};
  const byProduct = new Map<number, Row[]>();
  for (const r of REVIEWS) byProduct.set(r.product_id, [...(byProduct.get(r.product_id) || []), r]);
  for (const [id, rows] of byProduct) {
    map[id] = { count: rows.length, avg: rows.reduce((s, r) => s + Number(r.rating), 0) / rows.length };
  }
  return map;
}

/** Prodotti correlati: stessa categoria prima, poi i bestseller, poi i più nuovi. */
export async function getRelatedProducts(slug: string, limit = 8) {
  const current = PRODUCTS.find((p) => p.slug === slug);
  return PRODUCTS.filter((p) => !p.hidden && !p.is_upsell && !p.sold_out && p.slug !== slug)
    .map(withCategory)
    .filter(Boolean)
    .sort((a: any, b: any) =>
      Number(b.category_id === current?.category_id) - Number(a.category_id === current?.category_id) ||
      Number(!!b.is_bestseller) - Number(!!a.is_bestseller) ||
      time(b.created_at) - time(a.created_at))
    .slice(0, limit) as Row[];
}

/** Suggeriti: a caso nella stessa categoria, completati con altre categorie. */
export async function getSuggestedProducts(currentSlug: string, categoryId: number, limit = 4) {
  const shuffle = (rows: Row[]) => rows.map((r) => [Math.random(), r] as const).sort((a, b) => a[0] - b[0]).map(([, r]) => r);
  const pool = PRODUCTS.filter((p) => p.slug !== currentSlug && !p.hidden && !p.is_upsell);
  const same = shuffle(pool.filter((p) => p.category_id === categoryId)).slice(0, limit);
  if (same.length >= limit) return same;
  return [...same, ...shuffle(pool.filter((p) => p.category_id !== categoryId)).slice(0, limit - same.length)];
}

/** Alcune recensioni recenti da 5 stelle per le testimonianze in homepage. */
export async function getFeaturedReviews(limit = 6) {
  const nameById = new Map(PRODUCTS.map((p) => [p.id, p.name]));
  return REVIEWS.filter((r) => Number(r.rating) === 5 && nameById.has(r.product_id) &&
      String(r.body || "").length >= 60 && String(r.body || "").length <= 200)
    .sort(byNewest)
    .slice(0, limit)
    .map((r) => ({ author_name: r.author_name, rating: r.rating, body: r.body, product_name: nameById.get(r.product_id) }));
}

// Le recensioni inviate dai clienti andavano in moderazione nel pannello admin,
// che non esiste più: vengono solo registrate nei log.
export async function submitReview(productId: number, authorName: string, rating: number, body: string) {
  console.log("[review]", JSON.stringify({ productId, rating, length: String(body || "").length }));
}

/* ── Ordini ───────────────────────────────────────────── */

export interface OrderData {
  [key: string]: unknown;
  product: string;
  phone: string;
  upsell?: boolean;
  ip?: string;
  email?: string;
  productId?: number;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  province?: string;
  zip?: string;
  shippingNotes?: string;
  selectedSize?: string;
  selectedColor?: string;
  shopName?: string;
  source?: string;
  freeInsole?: boolean;
  paymentMethod?: string;
  formOpenedAt?: string;
  orderId?: string;
  clickSource?: string;
  price?: number;
}

// Il controllo dei doppioni per telefono lo fa il gestionale.
export async function phoneExists(_phone: string): Promise<boolean> {
  return false;
}

/* Dove finisce l'ordine.
   - FORWARD_ORDERS = false: la route stessa lo inoltra a IKORU (shop già collegati).
   - FORWARD_ORDERS = true: lo inoltra registerOrder, al posto del vecchio INSERT.
     Se IKORU non lo accetta, registerOrder lancia un errore: la route risponde
     errore come faceva quando falliva il salvataggio, e il cliente può riprovare. */
const FORWARD_ORDERS = false;

const IKORU_URL = process.env.IKORU_API_URL || "https://api-order.com/v1/orders";

// Nel carrello la route chiama registerOrder una volta per articolo con lo stesso
// orderId: a IKORU va una lead sola, con la prima scarpa (regola del gestionale).
const alreadySent = new Map<string, number>();

function findProduct(data: OrderData): Row | null {
  if (data.productId) {
    const p = PRODUCTS.find((x) => x.id === Number(data.productId));
    if (p) return p;
  }
  const name = String(data.product || "").trim().toLowerCase();
  return PRODUCTS.find((x) => String(x.name).trim().toLowerCase() === name) || null;
}

async function forwardToIkoru(data: OrderData) {
  const apiKey = process.env.IKORU_API_KEY || "";
  if (!apiKey) throw new Error("IKORU_API_KEY non configurata");
  const source = process.env.IKORU_SOURCE || SHOP_CONFIG.shop_identifier || "shop";
  const phone = String(data.phone || "").replace(/[^\d+]/g, "");
  const digits = phone.replace(/\D/g, "");

  const product = findProduct(data);
  const unitPrice = product ? Number(product.price) || 0 : Number(data.price) || 0;
  const shippingPrice = product ? Number(product.shipping_cost) || 0 : 0;
  const upsellPrice = data.upsell && product ? Number(product.upsell_price) || 0 : 0;
  const computed = unitPrice + upsellPrice + shippingPrice;
  const given = Number(data.price);
  // Il totale della route è già riprezzato lato server; se manca si ricalcola dal catalogo.
  const totalPrice = Number((given > 0 && given >= unitPrice + shippingPrice ? given : computed).toFixed(2));

  const notes = [
    upsellPrice ? `Cross-sell: Plantare Anatomico x1 a ${upsellPrice.toFixed(2)}` : "",
    data.paymentMethod && data.paymentMethod !== "cod" ? `Pagamento: ${data.paymentMethod}` : "",
    String(data.shippingNotes || ""),
  ].filter(Boolean).join(" | ");

  const body: Record<string, unknown> = {
    customerName: [data.firstName, data.lastName].filter((x) => x && x !== "-").join(" ").trim().slice(0, 200) || "Cliente",
    phone,
    email: data.email || undefined,
    address: String(data.address || "").slice(0, 500),
    city: String(data.city || "").slice(0, 100),
    province: String(data.province || "").toUpperCase().slice(0, 2),
    postalCode: String(data.zip || "").trim(),
    productType: "Scarpa",
    productName: String(data.product || "Prodotto").slice(0, 300),
    productVariant: [data.selectedColor, data.selectedSize].filter(Boolean).join(" / ") || undefined,
    externalProductId: product ? String(product.slug).slice(0, 50) : undefined,
    quantity: 1,
    unitPrice,
    shippingPrice,
    totalPrice,
    paymentMethod: "COD",
    source,
    utmSource: data.source && data.source !== "organica" ? String(data.source).slice(0, 100) : undefined,
    notesCustomer: notes.slice(0, 2000) || undefined,
    // Stabile nei retry del cliente; il telefono evita collisioni tra ordini diversi.
    externalOrderId: `${source}-${data.orderId || Date.now()}-${digits.slice(-6)}`,
  };
  for (const k of Object.keys(body)) if (body[k] === undefined || body[k] === "") delete body[k];

  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(IKORU_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
        body: JSON.stringify(body),
      });
      let out: Record<string, unknown> = {};
      try { out = await res.json(); } catch {}
      console.log("[ikoru]", JSON.stringify({ status: res.status, externalOrderId: body.externalOrderId, accepted: out.accepted ?? null, attempt: i + 1 }));
      if (res.ok || res.status === 409) return;
      if (res.status < 500 && res.status !== 429) break;
    } catch {
      /* errore di rete: si ritenta */
    }
    if (i < 2) await new Promise((r) => setTimeout(r, 600 * (i + 1) * (i + 1)));
  }
  throw new Error("Ordine non accettato dal gestionale");
}

// Restituisce un numero d'ordine: alcune route lo usavano come id della riga salvata.
export async function registerOrder(data: OrderData): Promise<number> {
  const id = Date.now() % 1000000000;
  console.log("[order]", JSON.stringify({
    orderId: data.orderId ?? null,
    product: data.product,
    source: data.source ?? null,
    upsell: !!data.upsell,
    price: data.price ?? null,
  }));
  if (!FORWARD_ORDERS) return id;

  const key = `${data.orderId || ""}|${String(data.phone || "").replace(/\D/g, "")}`;
  const now = Date.now();
  for (const [k, t] of alreadySent) if (now - t > 3_600_000) alreadySent.delete(k);
  if (data.orderId && alreadySent.has(key)) return id;

  await forwardToIkoru(data);
  if (data.orderId) alreadySent.set(key, now);
  return id;
}

export async function updatePhone(_oldPhone: string, _newPhone: string): Promise<boolean> {
  console.log("[order] correzione telefono richiesta dal cliente (non salvata: nessun database)");
  return false;
}

/* ── Stato di invio al vecchio gestionale e registro SMS: stavano nella tabella ordini ── */

export async function setGestionalePending(_orderId: number, _payload: unknown): Promise<void> {}
export async function markGestionaleResult(_orderId: number, _status: "ok" | "failed", _orderNumber?: string | null, _error?: string | null): Promise<void> {}
export async function markGestionaleSent(..._args: unknown[]): Promise<void> {}
export async function getPendingGestionale(_limit = 50): Promise<{ id: number; gestionale_payload: unknown }[]> {
  return [];
}

// Gli SMS di conferma partono ancora: solo il registro non viene più salvato.
export async function insertSmsLog(_orderId: number | null, _phone: string, _message: string): Promise<number> {
  return Date.now() % 1000000000;
}
export async function updateSmsLogSent(_id: number, _ticket: string, _credits: number | null) {}
export async function updateSmsLogFailed(_id: number, _error: string) {}
export async function updateSmsLogDlr(_ticket: string, _dlrStatus: number, _dlrDate: string) {}

/* ── Newsletter e assistenza ──────────────────────────── */

export async function subscribeNewsletter(_email: string): Promise<boolean> {
  console.log("[newsletter] iscrizione ricevuta");
  return true;
}

export interface SupportRequestData {
  type: string;
  name: string;
  email: string;
  phone?: string;
  orderNumber?: string;
  reason?: string;
  message: string;
}

/* Le richieste stavano nel pannello admin: ora arrivano all'assistenza per email.
   SUPPORT_EMAIL_REFUNDS = false quando la route /api/support manda già lei
   l'email dei resi, così non arrivano doppie. */
const SUPPORT_TO = "assistenzaclientinovo@gmail.com";
const SUPPORT_EMAIL_REFUNDS = true;

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sendSupportEmail(data: SupportRequestData, id: number) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[support] RESEND_API_KEY non configurata: richiesta non inoltrata", id);
    return;
  }
  const shop = SHOP_CONFIG.shop_name || "Shop";
  const domain = SHOP_CONFIG.domain || "example.com";
  const title = data.type === "refund" ? "Nuova richiesta di reso" : "Nuova richiesta di assistenza";
  const fields: [string, unknown][] = [
    ["Nome e cognome", data.name],
    ["Email", data.email],
    ["Telefono", data.phone || "—"],
    ["Numero ordine", data.orderNumber || "—"],
    ["Motivo", data.reason || "—"],
  ];
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
<p style="font-size:16px;font-weight:bold;margin:0 0 4px">${esc(title)}</p>
<p style="color:#6b7280;margin:0 0 14px">${esc(shop)}</p>
<table cellpadding="6" style="border-collapse:collapse">${fields
    .map(([k, v]) => `<tr><td style="color:#6b7280">${esc(k)}</td><td><b>${esc(v)}</b></td></tr>`)
    .join("")}</table>
<p style="color:#6b7280;margin:14px 0 4px">Messaggio</p>
<div style="white-space:pre-wrap;background:#f9fafb;border:1px solid #eee;padding:10px">${esc(data.message)}</div>
</div>`;
  const text = fields.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nMessaggio:\n${data.message}`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${shop} <ordini@${domain}>`,
        to: SUPPORT_TO,
        reply_to: data.email?.trim() || undefined,
        subject: `Richiesta assistenza ${data.name}`,
        html,
        text,
      }),
    });
    if (!res.ok) console.error("[support] invio email non riuscito:", res.status, id);
  } catch (err) {
    console.error("[support] invio email non riuscito:", err, id);
  }
}

export async function createSupportRequest(data: SupportRequestData) {
  const id = Date.now() % 1000000;
  console.log("[support]", JSON.stringify({ id, type: data.type }));
  if (data.type !== "refund" || SUPPORT_EMAIL_REFUNDS) await sendSupportEmail(data, id);
  return id;
}

/* ── Limite ordini per IP: richiedeva il database, disattivato ── */

export async function isIpBlocked(_ip: string): Promise<boolean> {
  return false;
}

export async function countRecentOrdersByIp(_ip: string, _windowMinutes: number): Promise<number> {
  return 0;
}

export async function blockIp(_ip: string, _reason?: string) {}

export async function isIpRateLimitEnabled(): Promise<boolean> {
  return false;
}

/* ── Configurazione ───────────────────────────────────── */

export async function getShopConfig(): Promise<Record<string, string>> {
  return { ...SHOP_CONFIG };
}

/* ── Statistiche che venivano dagli ordini ────────────── */

export async function getTopBestsellers(_limit = 3) {
  return [] as { product: string; count: number }[];
}

// Percentuale fissata al momento dell'esportazione dagli ordini di allora.
export async function getCrossSellPercentage(productSlug: string): Promise<number> {
  return (crossSellData as Record<string, number>)[productSlug] ?? 0;
}

/* ── Copie di sicurezza che stavano nel database (lead dei network, ordini da carrello) ── */

// Il lead parte comunque verso il network dalla route: qui restava solo una copia.
export async function registerNetworkLead(data: Record<string, unknown>) {
  console.log("[network-lead]", JSON.stringify({ slug: data.slug ?? null, lang: data.lang ?? null }));
}

// Ordini dal carrello: salvati solo nel database per il pannello, che non c'è più.
export async function registerCartOrder(data: Record<string, unknown>): Promise<number> {
  const id = Date.now() % 1000000000;
  console.log("[cart-order]", JSON.stringify({ id, items: Array.isArray(data.items) ? data.items.length : null }));
  return id;
}
