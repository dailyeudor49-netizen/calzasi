import { getOrderStats } from "@/lib/db";
import AdminProductList from "@/components/AdminProductList";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ from?: string; to?: string; hourFrom?: string; hourTo?: string }>;
}

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const rawFrom = params.from || "";
  const rawTo = params.to || "";
  const rawHourFrom = params.hourFrom || "";
  const rawHourTo = params.hourTo || "";
  const hourFrom = rawHourFrom ? parseInt(rawHourFrom, 10) : undefined;
  const hourTo = rawHourTo ? parseInt(rawHourTo, 10) : undefined;
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
  const from = rawFrom || rawTo || ((rawHourFrom || rawHourTo) ? today : "");
  const to = rawTo || rawFrom || ((rawHourFrom || rawHourTo) ? today : "");

  const refreshParams = new URLSearchParams();
  if (from) refreshParams.set("from", from);
  if (to) refreshParams.set("to", to);
  if (rawHourFrom) refreshParams.set("hourFrom", rawHourFrom);
  if (rawHourTo) refreshParams.set("hourTo", rawHourTo);
  const refreshHref = refreshParams.toString() ? `/admin?${refreshParams.toString()}` : "/admin";

  let stats: Awaited<ReturnType<typeof getOrderStats>> | null = null;
  let error = "";

  try {
    stats = await getOrderStats(from || undefined, to || undefined, hourFrom, hourTo);
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : "Errore DB";
  }

  const peakHour = stats?.byHour.reduce<{ hour: number; count: number } | null>(
    (max, h) => (!max || h.count > max.count ? h : max),
    null
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f6f6f7", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header + Refresh */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 700 }}>
            Pannello Ordini
          </h1>
          <a
            href={refreshHref}
            title="Aggiorna dati"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 12, background: "#fff", border: "1px solid #e1e1e1", cursor: "pointer", textDecoration: "none", color: "#555" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </a>
        </div>
        <p style={{ color: "#5f6368", fontSize: 15, marginBottom: 32 }}>
          {from && to ? (from === to ? `Giorno: ${from}` : `Dal ${from} al ${to}`) : "Tutti gli ordini"}
          {hourFrom !== undefined && ` — Ore ${String(hourFrom).padStart(2, "0")}:00–${String(hourTo ?? hourFrom).padStart(2, "0")}:59`}
        </p>

        {/* Filtro date */}
        <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", marginBottom: 32, border: "1px solid #e1e1e1" }}>
          {/* Filtri rapidi */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Filtri rapidi</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <QuickFilterBtn label="Oggi" params={{ from: today, to: today }} />
              <QuickFilterBtn label="Ieri" params={{ from: getYesterday(), to: getYesterday() }} />
              <QuickFilterBtn label="Ultimi 3 giorni" params={{ from: getDaysAgo(2), to: today }} />
              <QuickFilterBtn label="Ultima settimana" params={{ from: getDaysAgo(6), to: today }} />
              <QuickFilterBtn label="Mese corrente" params={{ from: getMonthStart(), to: today }} />
            </div>
          </div>

          {/* Filtri manuali */}
          <form style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 5 }}>Da</label>
              <input type="date" name="from" defaultValue={from} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 5 }}>A</label>
              <input type="date" name="to" defaultValue={to} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 5 }}>Da ora</label>
              <select name="hourFrom" defaultValue={rawHourFrom} style={inputStyle}>
                <option value="">Tutte</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i)}>{String(i).padStart(2, "0")}:00</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 5 }}>A ora</label>
              <select name="hourTo" defaultValue={rawHourTo} style={inputStyle}>
                <option value="">Tutte</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i)}>{String(i).padStart(2, "0")}:00</option>
                ))}
              </select>
            </div>
            <button type="submit" style={btnStyle}>Filtra</button>
            {(from || to || rawHourFrom || rawHourTo) && (
              <a href="/admin" style={{ ...btnStyle, background: "#6b7280", textDecoration: "none", textAlign: "center" }}>Reset</a>
            )}
          </form>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: 14, marginBottom: 20, color: "#dc2626", fontSize: 13 }}>
            {error}
          </div>
        )}

        {stats && stats.blockedIpsCount > 0 && (
          <a href="/admin/ip-blocks" style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff7ed", border: "1px solid #fdba74", borderRadius: 12, padding: "14px 20px", marginBottom: 20, textDecoration: "none", color: "#9a3412" }}>
            <span style={{ fontSize: 22 }}>&#9888;</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {stats.blockedIpsCount} IP bloccati — Gestisci
            </span>
          </a>
        )}

        {stats && (
          <>
            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={cardStyle}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Ordini totali</div>
                <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: "#1a1a1a", marginTop: 6 }}>
                  {stats.total}
                </div>
              </div>

              <div style={cardStyle}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>Plantare upsell</div>
                <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: "#0e7490", marginTop: 6 }}>
                  {stats.upsellCount}
                </div>
                <div style={{ fontSize: 14, color: "#5f6368", marginTop: 4 }}>
                  su {stats.total} ({stats.total > 0 ? Math.round((stats.upsellCount / stats.total) * 100) : 0}%)
                </div>
              </div>
            </div>

            {/* Per prodotto */}
            <details style={detailsStyle}>
              <summary style={summaryStyle}>Per prodotto</summary>
              <AdminProductList products={stats.byProduct} />
            </details>

            {/* Per giorno */}
            <details style={detailsStyle}>
              <summary style={summaryStyle}>Per giorno</summary>
              <div style={{ padding: "14px 24px 24px", maxHeight: 400, overflowY: "auto" }}>
                {stats.byDay.length === 0 && <p style={{ color: "#888", fontSize: 14 }}>Nessun dato</p>}
                {stats.byDay.map((d) => (
                  <div key={d.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <span style={{ fontSize: 14, color: "#444" }}>{formatDay(d.day)}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: Math.max(4, (d.count / Math.max(...stats!.byDay.map(x => x.count))) * 160), height: 20, background: "#1B5E6B", borderRadius: 4, opacity: 0.8 }} />
                      <span style={{ fontSize: 16, fontWeight: 600, minWidth: 28, textAlign: "right" }}>{d.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </details>

            {/* Per fascia oraria */}
            <details style={detailsStyle}>
              <summary style={summaryStyle}>Per fascia oraria</summary>
              <div style={{ padding: "14px 24px 24px" }}>
                {peakHour && (
                  <p style={{ fontSize: 14, color: "#5f6368", marginBottom: 14 }}>
                    Picco: <strong>{peakHour.hour}:00–{peakHour.hour + 1}:00</strong> ({peakHour.count} ordini)
                  </p>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
                  {stats.byHour.map((h) => (
                    <div key={h.hour} style={{ textAlign: "center", padding: "10px 6px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                      <div style={{ fontSize: 12, color: "#888" }}>{String(h.hour).padStart(2, "0")}:00</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#1B5E6B" }}>{h.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Navigation */}
            <a href="/admin/orders" style={{ display: "block", textAlign: "center", padding: "16px 24px", background: "#1B5E6B", color: "#fff", borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: "none", marginTop: 10, marginBottom: 14 }}>
              Visualizza ordini
            </a>

            <a href="/admin/ip-blocks" style={{ display: "block", textAlign: "center", padding: "14px 24px", background: "#fff", color: "#1B5E6B", border: "1px solid #1B5E6B", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", marginBottom: 14 }}>
              Gestione IP bloccati
            </a>

            <a href="/api/admin/export" style={{ display: "block", textAlign: "center", padding: "14px 24px", background: "#fff", color: "#1B5E6B", border: "1px solid #1B5E6B", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Esporta database (SQL)
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
}

function getDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
}

function getMonthStart() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
}

function QuickFilterBtn({ label, params }: { label: string; params: Record<string, string> }) {
  const query = new URLSearchParams(params).toString();
  return (
    <a
      href={`/admin?${query}`}
      style={{
        display: "inline-block",
        padding: "8px 14px",
        background: "#f5f5f5",
        color: "#333",
        border: "1px solid #ddd",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      {label}
    </a>
  );
}

function formatDay(d: string) {
  try {
    return new Date(d).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return d;
  }
}

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  border: "1.5px solid #d1d5db",
  borderRadius: 10,
  fontSize: 15,
  fontFamily: "'Inter', sans-serif",
};

const btnStyle: React.CSSProperties = {
  padding: "10px 24px",
  background: "#1B5E6B",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "'Inter', sans-serif",
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e1e1e1",
  borderRadius: 12,
  padding: 28,
};

const detailsStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e1e1e1",
  borderRadius: 12,
  marginBottom: 14,
  overflow: "hidden",
};

const summaryStyle: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 16,
  fontWeight: 700,
  color: "#1a1a1a",
  padding: "18px 24px",
  cursor: "pointer",
  textTransform: "uppercase",
  letterSpacing: 0.4,
  listStyle: "none",
};
