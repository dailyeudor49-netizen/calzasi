import { neon } from "@neondatabase/serverless";

/* ══════════════════════════════════════════════════════
   DB connections
   ══════════════════════════════════════════════════════ */

export function getSQL() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL non configurata");
  return neon(url);
}

function getSharedSQL() {
  const url = process.env.SHARED_DB_URL;
  if (!url) throw new Error("SHARED_DB_URL non configurata");
  return neon(url);
}

/* ══════════════════════════════════════════════════════
   Migration system — idempotent, additive only
   ══════════════════════════════════════════════════════ */

let migrated = false;

async function migrate() {
  if (migrated) return;
  const sql = getSQL();

  // Migration tracking table
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  const applied = await sql`SELECT version FROM schema_migrations ORDER BY version`;
  const done = new Set(applied.map((r) => r.version as number));

  // ── Migration 1: categories ──
  if (!done.has(1)) {
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id    SERIAL PRIMARY KEY,
        slug  TEXT NOT NULL UNIQUE,
        name  TEXT NOT NULL,
        label TEXT NOT NULL
      )
    `;
    await sql`INSERT INTO schema_migrations (version) VALUES (1) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 2: products ──
  if (!done.has(2)) {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id             SERIAL PRIMARY KEY,
        slug           TEXT NOT NULL UNIQUE,
        name           TEXT NOT NULL,
        subtitle       TEXT NOT NULL,
        price          NUMERIC(8,2) NOT NULL,
        original_price NUMERIC(8,2) NOT NULL,
        category_id    INT NOT NULL REFERENCES categories(id),
        description    TEXT NOT NULL,
        features       TEXT[] NOT NULL DEFAULT '{}',
        color          TEXT NOT NULL DEFAULT '#000000',
        accent_color   TEXT NOT NULL DEFAULT '#333333',
        sold_out       BOOLEAN NOT NULL DEFAULT false,
        image          TEXT,
        is_upsell      BOOLEAN NOT NULL DEFAULT false,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await sql`INSERT INTO schema_migrations (version) VALUES (2) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 3: reviews ──
  if (!done.has(3)) {
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id          SERIAL PRIMARY KEY,
        product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        author_name TEXT NOT NULL,
        rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        body        TEXT NOT NULL,
        verified    BOOLEAN NOT NULL DEFAULT true,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id)`;
    await sql`INSERT INTO schema_migrations (version) VALUES (3) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 4: orders ──
  if (!done.has(4)) {
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id         SERIAL PRIMARY KEY,
        product_id INT REFERENCES products(id),
        product    TEXT NOT NULL,
        phone      TEXT NOT NULL,
        email      TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        upsell     BOOLEAN NOT NULL DEFAULT false,
        ip         TEXT
      )
    `;
    await sql`INSERT INTO schema_migrations (version) VALUES (4) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 5: blocked_ips ──
  if (!done.has(5)) {
    await sql`
      CREATE TABLE IF NOT EXISTS blocked_ips (
        id         SERIAL PRIMARY KEY,
        ip         TEXT NOT NULL UNIQUE,
        blocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        reason     TEXT
      )
    `;
    await sql`INSERT INTO schema_migrations (version) VALUES (5) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 6: ip_rate_settings ──
  if (!done.has(6)) {
    await sql`
      CREATE TABLE IF NOT EXISTS ip_rate_settings (
        id      INT PRIMARY KEY DEFAULT 1,
        enabled BOOLEAN NOT NULL DEFAULT true
      )
    `;
    await sql`INSERT INTO ip_rate_settings (id, enabled) VALUES (1, true) ON CONFLICT DO NOTHING`;
    await sql`INSERT INTO schema_migrations (version) VALUES (6) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 7: shop_config ──
  if (!done.has(7)) {
    await sql`
      CREATE TABLE IF NOT EXISTS shop_config (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;
    await sql`INSERT INTO schema_migrations (version) VALUES (7) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 8: newsletter_subscribers ──
  if (!done.has(8)) {
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id         SERIAL PRIMARY KEY,
        email      TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await sql`INSERT INTO schema_migrations (version) VALUES (8) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 9: orders — full customer data ──
  if (!done.has(9)) {
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS first_name TEXT`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS last_name TEXT`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS city TEXT`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS province TEXT`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS zip TEXT`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_notes TEXT`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_size TEXT`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_color TEXT`;
    await sql`INSERT INTO schema_migrations (version) VALUES (9) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 10: reviews.approved ──
  if (!done.has(10)) {
    await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false`;
    await sql`INSERT INTO schema_migrations (version) VALUES (10) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 11: reviews.reply ──
  if (!done.has(11)) {
    await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply TEXT`;
    await sql`INSERT INTO schema_migrations (version) VALUES (11) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 12: ensure product_id exists (fix for DBs created without it) ──
  if (!done.has(12)) {
    await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS product_id INT REFERENCES products(id) ON DELETE CASCADE`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_id INT REFERENCES products(id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id)`;
    await sql`INSERT INTO schema_migrations (version) VALUES (12) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 13: source column on orders ──
  if (!done.has(13)) {
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'organica'`;
    await sql`INSERT INTO schema_migrations (version) VALUES (13) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 14: hidden column on products ──
  if (!done.has(14)) {
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS hidden BOOLEAN NOT NULL DEFAULT false`;
    await sql`INSERT INTO schema_migrations (version) VALUES (14) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 15: sms_logs table ──
  if (!done.has(15)) {
    await sql`
      CREATE TABLE IF NOT EXISTS sms_logs (
        id          SERIAL PRIMARY KEY,
        order_id    INT REFERENCES orders(id) ON DELETE CASCADE,
        phone       TEXT NOT NULL,
        message     TEXT NOT NULL,
        ticket      TEXT,
        status      TEXT NOT NULL DEFAULT 'pending',
        error       TEXT,
        credits     INT,
        dlr_status  INT,
        dlr_date    TIMESTAMPTZ,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_sms_logs_order ON sms_logs(order_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sms_logs_ticket ON sms_logs(ticket)`;
    await sql`INSERT INTO schema_migrations (version) VALUES (15) ON CONFLICT DO NOTHING`;
  }

  // ── Migration 16: campaign_settings table (War Room) ──
  if (!done.has(16)) {
    await sql`
      CREATE TABLE IF NOT EXISTS campaign_settings (
        campaign_id      TEXT PRIMARY KEY,
        bidding_strategy TEXT,
        cpl_target       NUMERIC(10, 2),
        notes            TEXT,
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
    await sql`INSERT INTO schema_migrations (version) VALUES (16) ON CONFLICT DO NOTHING`;
  }

  migrated = true;
}

/* ══════════════════════════════════════════════════════
   Products
   ══════════════════════════════════════════════════════ */

export async function getProducts(includeUpsell = false) {
  await migrate();
  const sql = getSQL();
  if (includeUpsell) {
    return await sql`
      SELECT p.*, c.slug AS category_slug, c.label AS category_label
      FROM products p JOIN categories c ON p.category_id = c.id
      WHERE p.hidden = false
      ORDER BY p.sold_out ASC, p.created_at DESC
    `;
  }
  return await sql`
    SELECT p.*, c.slug AS category_slug, c.label AS category_label
    FROM products p JOIN categories c ON p.category_id = c.id
    WHERE p.is_upsell = false AND p.hidden = false
    ORDER BY p.sold_out ASC, p.created_at DESC
  `;
}

export async function getProductBySlug(slug: string) {
  await migrate();
  const sql = getSQL();
  const rows = await sql`
    SELECT p.*, c.slug AS category_slug, c.label AS category_label
    FROM products p JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ${slug} LIMIT 1
  `;
  return rows[0] || null;
}

export async function getProductById(id: number) {
  await migrate();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;
  return rows[0] || null;
}

/* ══════════════════════════════════════════════════════
   Categories
   ══════════════════════════════════════════════════════ */

export async function getCategories() {
  await migrate();
  const sql = getSQL();
  return await sql`SELECT * FROM categories ORDER BY id`;
}

/* ── Prodotti suggeriti: 4 prodotti della stessa categoria escludendo il corrente ── */
export async function getSuggestedProducts(currentSlug: string, categoryId: number, limit = 4) {
  await migrate();
  const sql = getSQL();
  const sameCat = await sql`
    SELECT id, slug, name, subtitle, price, original_price, image, color
    FROM products
    WHERE category_id = ${categoryId} AND slug <> ${currentSlug} AND hidden = false AND is_upsell = false
    ORDER BY RANDOM()
    LIMIT ${limit}
  `;
  if (sameCat.length >= limit) return sameCat;
  // Fallback: completa con prodotti di altre categorie
  const need = limit - sameCat.length;
  const fromOthers = await sql`
    SELECT id, slug, name, subtitle, price, original_price, image, color
    FROM products
    WHERE category_id <> ${categoryId} AND slug <> ${currentSlug} AND hidden = false AND is_upsell = false
    ORDER BY RANDOM()
    LIMIT ${need}
  `;
  return [...sameCat, ...fromOthers];
}

/* ══════════════════════════════════════════════════════
   Reviews
   ══════════════════════════════════════════════════════ */

export async function getReviewsByProductId(productId: number) {
  await migrate();
  const sql = getSQL();
  return await sql`
    SELECT * FROM reviews WHERE product_id = ${productId} AND approved = true
    ORDER BY created_at DESC
  `;
}

export async function getReviewsBySlug(slug: string) {
  await migrate();
  const sql = getSQL();
  return await sql`
    SELECT r.* FROM reviews r
    JOIN products p ON r.product_id = p.id
    WHERE p.slug = ${slug} AND r.approved = true
    ORDER BY r.created_at DESC
  `;
}

export async function getReviewStats(productId: number) {
  await migrate();
  const sql = getSQL();
  const rows = await sql`
    SELECT COUNT(*)::int AS count, COALESCE(AVG(rating), 0)::numeric(2,1) AS avg
    FROM reviews WHERE product_id = ${productId} AND approved = true
  `;
  return { count: rows[0]?.count ?? 0, avg: parseFloat(rows[0]?.avg ?? "0") };
}

export async function submitReview(productId: number, authorName: string, rating: number, body: string) {
  await migrate();
  const sql = getSQL();
  await sql`INSERT INTO reviews (product_id, author_name, rating, body, approved)
            VALUES (${productId}, ${authorName}, ${rating}, ${body}, false)`;
}

/* ══════════════════════════════════════════════════════
   Orders
   ══════════════════════════════════════════════════════ */

export async function phoneExists(phone: string): Promise<boolean> {
  await migrate();
  const sql = getSQL();

  // Check local orders table first (always available)
  const localRows = await sql`SELECT 1 FROM orders WHERE phone = ${phone} LIMIT 1`;
  if (localRows.length > 0) return true;

  // Also check shared DB if configured
  if (process.env.SHARED_DB_URL) {
    try {
      const sharedSql = getSharedSQL();
      // Confronta gli ultimi 10 cifre — robusto a varianti di formato e prefisso (+39, 0039, nessuno)
      const sharedRows = await sharedSql`SELECT 1 FROM blocked_phones WHERE RIGHT(REGEXP_REPLACE(phone, '[^0-9]', '', 'g'), 10) = RIGHT(REGEXP_REPLACE(${phone}, '[^0-9]', '', 'g'), 10) LIMIT 1`;
      if (sharedRows.length > 0) return true;
    } catch {
      // shared DB down — local check already done
    }
  }

  return false;
}

export interface OrderData {
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
}

export async function registerOrder(data: OrderData): Promise<number | null> {
  await migrate();
  const sql = getSQL();
  const shop = data.shopName || "mondocalzature";

  // Always save locally — don't let shared DB failures lose the order
  const rows = await sql`INSERT INTO orders (
        product, phone, upsell, ip, email, product_id,
        first_name, last_name, address, city, province, zip,
        shipping_notes, selected_size, selected_color, source
      ) VALUES (
        ${data.product}, ${data.phone}, ${data.upsell ?? false},
        ${data.ip ?? null}, ${data.email ?? null}, ${data.productId ?? null},
        ${data.firstName ?? null}, ${data.lastName ?? null},
        ${data.address ?? null}, ${data.city ?? null},
        ${data.province ?? null}, ${data.zip ?? null},
        ${data.shippingNotes ?? null}, ${data.selectedSize ?? null},
        ${data.selectedColor ?? null},
        ${data.source ?? "organica"}
      ) RETURNING id`;

  // Shared DB for cross-shop phone dedup — best effort
  try {
    const sharedSql = getSharedSQL();
    await sharedSql`INSERT INTO blocked_phones (phone, shop, created_at)
                    VALUES (${data.phone}, ${shop}, now()) ON CONFLICT (phone) DO NOTHING`;
  } catch {
    // SHARED_DB_URL not set or shared DB down — local order already saved
  }

  return (rows[0]?.id as number) ?? null;
}

export async function updatePhone(oldPhone: string, newPhone: string): Promise<boolean> {
  await migrate();
  const sql = getSQL();
  const rows = await sql`UPDATE orders SET phone = ${newPhone} WHERE phone = ${oldPhone} RETURNING id`;
  try {
    const sharedSql = getSharedSQL();
    await sharedSql`UPDATE blocked_phones SET phone = ${newPhone} WHERE phone = ${oldPhone}`;
  } catch {
    // shared DB down — local already updated
  }
  return rows.length > 0;
}

export async function getOrders(
  page: number,
  perPage: number,
  filters?: {
    day?: string;
    from?: string;
    to?: string;
    hourFrom?: number;
    hourTo?: number;
    search?: string;
    product?: string;
    source?: string;
  }
) {
  await migrate();
  const sql = getSQL();
  const offset = page * perPage;

  console.log("[DB] getOrders called with filters:", filters);

  // Extract filter values
  const { day, from, to, hourFrom, hourTo, search, product, source } = filters || {};
  const searchLower = search ? `%${search.toLowerCase()}%` : '';

  // Execute queries with inline conditions
  const [rows, countRows] = await Promise.all([
    sql`
      SELECT id, product, phone, email, created_at, upsell, ip,
        first_name, last_name, address, city, province, zip,
        shipping_notes, selected_size, selected_color, source
      FROM orders
      WHERE 1=1
        ${from && to ? sql`AND (created_at AT TIME ZONE 'Europe/Rome')::date >= ${from}::date AND (created_at AT TIME ZONE 'Europe/Rome')::date <= ${to}::date` : sql``}
        ${day ? sql`AND (created_at AT TIME ZONE 'Europe/Rome')::date = ${day}::date` : sql``}
        ${hourFrom !== undefined ? sql`AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hourFrom}` : sql``}
        ${hourTo !== undefined ? sql`AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hourTo}` : sql``}
        ${product ? sql`AND product = ${product}` : sql``}
        ${source === 'organica' ? sql`AND (source IS NULL OR source = 'organica')` : source ? sql`AND source = ${source}` : sql``}
        ${search ? sql`AND (LOWER(first_name) LIKE ${searchLower} OR LOWER(last_name) LIKE ${searchLower} OR phone LIKE ${searchLower} OR LOWER(email) LIKE ${searchLower})` : sql``}
      ORDER BY created_at DESC
      LIMIT ${perPage}
      OFFSET ${offset}
    `,
    sql`
      SELECT COUNT(*)::int AS count FROM orders
      WHERE 1=1
        ${from && to ? sql`AND (created_at AT TIME ZONE 'Europe/Rome')::date >= ${from}::date AND (created_at AT TIME ZONE 'Europe/Rome')::date <= ${to}::date` : sql``}
        ${day ? sql`AND (created_at AT TIME ZONE 'Europe/Rome')::date = ${day}::date` : sql``}
        ${hourFrom !== undefined ? sql`AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hourFrom}` : sql``}
        ${hourTo !== undefined ? sql`AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hourTo}` : sql``}
        ${product ? sql`AND product = ${product}` : sql``}
        ${source === 'organica' ? sql`AND (source IS NULL OR source = 'organica')` : source ? sql`AND source = ${source}` : sql``}
        ${search ? sql`AND (LOWER(first_name) LIKE ${searchLower} OR LOWER(last_name) LIKE ${searchLower} OR phone LIKE ${searchLower} OR LOWER(email) LIKE ${searchLower})` : sql``}
    `,
  ]);

  console.log("[DB] Query returned:", rows.length, "rows");

  return {
    orders: rows,
    total: countRows[0]?.count ?? 0
  };
}

export async function deleteOrder(id: number) {
  await migrate();
  const sql = getSQL();
  const rows = await sql`DELETE FROM orders WHERE id = ${id} RETURNING id, phone`;
  if (rows.length > 0 && process.env.SHARED_DB_URL) {
    const phone = rows[0].phone as string;
    const still = await sql`SELECT 1 FROM orders WHERE phone = ${phone} LIMIT 1`;
    if (still.length === 0) {
      try {
        const sharedSql = getSharedSQL();
        await sharedSql`DELETE FROM blocked_phones WHERE phone = ${phone}`;
      } catch { /* shared DB unavailable */ }
    }
  }
  return rows.length > 0;
}

export async function getDistinctProducts() {
  await migrate();
  const sql = getSQL();
  const rows = await sql`SELECT DISTINCT product FROM orders WHERE product IS NOT NULL ORDER BY product`;
  return rows.map((r) => r.product as string);
}

export async function getDistinctSources() {
  await migrate();
  const sql = getSQL();
  const rows = await sql`SELECT DISTINCT source FROM orders WHERE source IS NOT NULL ORDER BY source`;
  return rows.map((r) => r.source as string);
}

/* ══════════════════════════════════════════════════════
   Newsletter
   ══════════════════════════════════════════════════════ */

export async function subscribeNewsletter(email: string): Promise<boolean> {
  await migrate();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO newsletter_subscribers (email)
    VALUES (${email.toLowerCase().trim()})
    ON CONFLICT (email) DO NOTHING
    RETURNING id
  `;
  return rows.length > 0;
}

export async function getNewsletterSubscribers() {
  await migrate();
  const sql = getSQL();
  return await sql`SELECT id, email, created_at FROM newsletter_subscribers ORDER BY created_at DESC`;
}

export async function getNewsletterCount(): Promise<number> {
  await migrate();
  const sql = getSQL();
  const rows = await sql`SELECT COUNT(*)::int AS count FROM newsletter_subscribers`;
  return rows[0]?.count ?? 0;
}

/* ══════════════════════════════════════════════════════
   Admin stats
   ══════════════════════════════════════════════════════ */

export async function getOrderStats(from?: string, to?: string, hourFrom?: number, hourTo?: number) {
  await migrate();
  const sql = getSQL();
  const hasRange = from && to;
  const hFrom = hourFrom ?? 0;
  const hTo = hourTo ?? hourFrom ?? 23;

  const [totalRows, byProductRows, byDayRows, byHourRows, upsellRows, blockedIpsRows] = await Promise.all([
    hasRange
      ? sql`SELECT COUNT(*)::int AS count FROM orders WHERE (created_at AT TIME ZONE 'Europe/Rome')::date >= ${from}::date AND (created_at AT TIME ZONE 'Europe/Rome')::date <= ${to}::date AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hFrom} AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hTo}`
      : sql`SELECT COUNT(*)::int AS count FROM orders WHERE EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hFrom} AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hTo}`,
    hasRange
      ? sql`SELECT product, COUNT(*)::int AS count FROM orders WHERE (created_at AT TIME ZONE 'Europe/Rome')::date >= ${from}::date AND (created_at AT TIME ZONE 'Europe/Rome')::date <= ${to}::date AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hFrom} AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hTo} GROUP BY product ORDER BY count DESC`
      : sql`SELECT product, COUNT(*)::int AS count FROM orders WHERE EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hFrom} AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hTo} GROUP BY product ORDER BY count DESC`,
    hasRange
      ? sql`SELECT (created_at AT TIME ZONE 'Europe/Rome')::date AS day, COUNT(*)::int AS count FROM orders WHERE (created_at AT TIME ZONE 'Europe/Rome')::date >= ${from}::date AND (created_at AT TIME ZONE 'Europe/Rome')::date <= ${to}::date AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hFrom} AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hTo} GROUP BY day ORDER BY day DESC LIMIT 60`
      : sql`SELECT (created_at AT TIME ZONE 'Europe/Rome')::date AS day, COUNT(*)::int AS count FROM orders WHERE EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hFrom} AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hTo} GROUP BY day ORDER BY day DESC LIMIT 60`,
    hasRange
      ? sql`SELECT EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int AS hour, COUNT(*)::int AS count FROM orders WHERE (created_at AT TIME ZONE 'Europe/Rome')::date >= ${from}::date AND (created_at AT TIME ZONE 'Europe/Rome')::date <= ${to}::date AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hFrom} AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hTo} GROUP BY hour ORDER BY hour`
      : sql`SELECT EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int AS hour, COUNT(*)::int AS count FROM orders WHERE EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hFrom} AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hTo} GROUP BY hour ORDER BY hour`,
    hasRange
      ? sql`SELECT COUNT(*)::int AS count FROM orders WHERE upsell = true AND (created_at AT TIME ZONE 'Europe/Rome')::date >= ${from}::date AND (created_at AT TIME ZONE 'Europe/Rome')::date <= ${to}::date AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hFrom} AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hTo}`
      : sql`SELECT COUNT(*)::int AS count FROM orders WHERE upsell = true AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int >= ${hFrom} AND EXTRACT(HOUR FROM created_at AT TIME ZONE 'Europe/Rome')::int <= ${hTo}`,
    sql`SELECT COUNT(*)::int AS count FROM blocked_ips`,
  ]);

  return {
    total: totalRows[0]?.count ?? 0,
    byProduct: byProductRows as { product: string; count: number }[],
    byDay: byDayRows as { day: string; count: number }[],
    byHour: byHourRows as { hour: number; count: number }[],
    upsellCount: upsellRows[0]?.count ?? 0,
    blockedIpsCount: blockedIpsRows[0]?.count ?? 0,
  };
}

/* ══════════════════════════════════════════════════════
   IP rate limiting
   ══════════════════════════════════════════════════════ */

export async function isIpBlocked(ip: string): Promise<boolean> {
  const sql = getSQL();
  const rows = await sql`SELECT 1 FROM blocked_ips WHERE ip = ${ip} LIMIT 1`;
  return rows.length > 0;
}

export async function countRecentOrdersByIp(ip: string, windowMinutes: number): Promise<number> {
  const sql = getSQL();
  const rows = await sql`SELECT COUNT(*)::int AS count FROM orders WHERE ip = ${ip} AND created_at > now() - ${windowMinutes + " minutes"}::interval`;
  return rows[0]?.count ?? 0;
}

export async function blockIp(ip: string, reason?: string) {
  const sql = getSQL();
  await sql`INSERT INTO blocked_ips (ip, reason) VALUES (${ip}, ${reason ?? null}) ON CONFLICT DO NOTHING`;
}

export async function getBlockedIps() {
  const sql = getSQL();
  return await sql`SELECT id, ip, blocked_at, reason FROM blocked_ips ORDER BY blocked_at DESC`;
}

export async function unblockIp(id: number) {
  const sql = getSQL();
  await sql`DELETE FROM blocked_ips WHERE id = ${id}`;
}

export async function isIpRateLimitEnabled(): Promise<boolean> {
  await migrate();
  const sql = getSQL();
  const rows = await sql`SELECT enabled FROM ip_rate_settings WHERE id = 1`;
  return rows[0]?.enabled ?? true;
}

export async function setIpRateLimit(enabled: boolean) {
  await migrate();
  const sql = getSQL();
  await sql`UPDATE ip_rate_settings SET enabled = ${enabled} WHERE id = 1`;
}

/* ══════════════════════════════════════════════════════
   Shop Config
   ══════════════════════════════════════════════════════ */

export async function getShopConfig(): Promise<Record<string, string>> {
  await migrate();
  const sql = getSQL();
  const rows = await sql`SELECT key, value FROM shop_config`;
  const config: Record<string, string> = {};
  for (const r of rows) config[r.key as string] = r.value as string;
  return config;
}

export async function setShopConfig(key: string, value: string) {
  await migrate();
  const sql = getSQL();
  await sql`INSERT INTO shop_config (key, value) VALUES (${key}, ${value})
            ON CONFLICT (key) DO UPDATE SET value = ${value}`;
}

/* ══════════════════════════════════════════════════════
   SMS Logs
   ══════════════════════════════════════════════════════ */

export async function insertSmsLog(orderId: number | null, phone: string, message: string): Promise<number> {
  await migrate();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO sms_logs (order_id, phone, message, status)
    VALUES (${orderId}, ${phone}, ${message}, 'pending')
    RETURNING id
  `;
  return rows[0].id as number;
}

export async function updateSmsLogSent(id: number, ticket: string, credits: number | null) {
  const sql = getSQL();
  await sql`
    UPDATE sms_logs
    SET status = 'sent', ticket = ${ticket}, credits = ${credits}, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function updateSmsLogFailed(id: number, error: string) {
  const sql = getSQL();
  await sql`
    UPDATE sms_logs
    SET status = 'failed', error = ${error}, updated_at = now()
    WHERE id = ${id}
  `;
}

export async function updateSmsLogDlr(ticket: string, dlrStatus: number, dlrDate: string) {
  const sql = getSQL();
  const statusMap: Record<number, string> = {
    0: "sent",       // NOT_SENT (pending)
    1: "sent",       // SENT (in transit)
    2: "failed",     // NOT_DELIVERED
    3: "delivered",  // DELIVERED
    4: "failed",     // NOT_ALLOWED
    5: "failed",     // INVALID_DESTINATION
    6: "failed",     // INVALID_SENDER
    7: "failed",     // ROUTE_NOT_AVAILABLE
    9: "failed",     // REJECTED
    11: "failed",    // NETWORK_ERROR
    12: "failed",    // EXPIRED
  };
  const mappedStatus = statusMap[dlrStatus] || "failed";
  await sql`
    UPDATE sms_logs
    SET dlr_status = ${dlrStatus}, dlr_date = ${dlrDate}, status = ${mappedStatus}, updated_at = now()
    WHERE ticket = ${ticket}
  `;
}

export async function getSmsLogsForOrders(orderIds: number[]): Promise<Record<number, string>> {
  if (orderIds.length === 0) return {};
  const sql = getSQL();
  const rows = await sql`
    SELECT order_id, status FROM sms_logs WHERE order_id = ANY(${orderIds})
  `;
  const map: Record<number, string> = {};
  for (const r of rows) {
    map[r.order_id as number] = r.status as string;
  }
  return map;
}

/* ══════════════════════════════════════════════════════
   Export SQL
   ══════════════════════════════════════════════════════ */

export async function exportOrdersSQL(): Promise<string> {
  await migrate();
  const sql = getSQL();
  const [rows, blockedIpsData, rateSettingsData] = await Promise.all([
    sql`SELECT id, product, phone, email, created_at, upsell, ip FROM orders ORDER BY id`,
    sql`SELECT id, ip, blocked_at, reason FROM blocked_ips ORDER BY id`,
    sql`SELECT id, enabled FROM ip_rate_settings`,
  ]);

  let dump = "-- Shop orders export\n";
  dump += `-- Generated: ${new Date().toISOString()}\n\n`;

  for (const r of rows) {
    const product = String(r.product).replace(/'/g, "''");
    const phone = String(r.phone).replace(/'/g, "''");
    const createdAt = new Date(r.created_at as string).toISOString();
    const ipVal = r.ip ? `'${String(r.ip).replace(/'/g, "''")}'` : "NULL";
    const emailVal = r.email ? `'${String(r.email).replace(/'/g, "''")}'` : "NULL";
    dump += `INSERT INTO orders (id, product, phone, email, created_at, upsell, ip) VALUES (${r.id}, '${product}', '${phone}', ${emailVal}, '${createdAt}', ${r.upsell}, ${ipVal});\n`;
  }

  dump += "\n-- Blocked IPs\n";
  for (const r of blockedIpsData) {
    const ip = String(r.ip).replace(/'/g, "''");
    const blockedAt = new Date(r.blocked_at as string).toISOString();
    const reasonVal = r.reason ? `'${String(r.reason).replace(/'/g, "''")}'` : "NULL";
    dump += `INSERT INTO blocked_ips (id, ip, blocked_at, reason) VALUES (${r.id}, '${ip}', '${blockedAt}', ${reasonVal}) ON CONFLICT DO NOTHING;\n`;
  }

  dump += "\n-- IP Rate Settings\n";
  for (const r of rateSettingsData) {
    dump += `INSERT INTO ip_rate_settings (id, enabled) VALUES (${r.id}, ${r.enabled}) ON CONFLICT (id) DO UPDATE SET enabled = ${r.enabled};\n`;
  }

  return dump;
}
