"use client";
import { useState, useEffect, useCallback, Fragment } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const ACCENT = "#1B5E6B";
const BG = "#f6f6f7";
const PER_PAGE = 20;

interface Order {
  id: number;
  product: string;
  phone: string;
  email: string | null;
  created_at: string;
  upsell: boolean;
  ip: string | null;
  first_name: string | null;
  last_name: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  shipping_notes: string | null;
  selected_size: string | null;
  selected_color: string | null;
  source: string | null;
  sms_status: string | null;
}

const SMS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: "#e0e0e0", color: "#555",    label: "In attesa" },
  sent:      { bg: "#e3f2fd", color: "#1565c0", label: "Inviato" },
  delivered: { bg: "#e8f5e9", color: "#2e7d32", label: "Consegnato" },
  failed:    { bg: "#ffebee", color: "#c62828", label: "Fallito" },
  invalid:   { bg: "#fff3e0", color: "#e65100", label: "Non valido" },
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });
}

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [products, setProducts] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);

  // Read filters from URL
  const page = parseInt(searchParams.get("page") || "0", 10);
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const hourFrom = searchParams.get("hourFrom") || "";
  const hourTo = searchParams.get("hourTo") || "";
  const search = searchParams.get("search") || "";
  const product = searchParams.get("product") || "";
  const source = searchParams.get("source") || "";

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  // Helper to update URL params
  const updateFilters = useCallback((updates: Record<string, string | number>) => {
    console.log("[FRONTEND] updateFilters called with:", updates);
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    const newUrl = `/admin/orders?${params.toString()}`;
    console.log("[FRONTEND] Pushing to URL:", newUrl);
    router.push(newUrl);
  }, [searchParams, router]);

  const fetchOrders = useCallback(async (
    p: number,
    fromDate?: string,
    toDate?: string,
    hFrom?: string,
    hTo?: string,
    searchTerm?: string,
    prodFilter?: string,
    srcFilter?: string
  ) => {
    console.log("[FRONTEND] fetchOrders called with filters:", { p, fromDate, toDate, hFrom, hTo, searchTerm, prodFilter, srcFilter });
    setLoading(true);
    try {
      let url = `/api/admin/orders?page=${p}&perPage=${PER_PAGE}`;
      if (fromDate) url += `&from=${fromDate}`;
      if (toDate) url += `&to=${toDate}`;
      if (hFrom) url += `&hourFrom=${hFrom}`;
      if (hTo) url += `&hourTo=${hTo}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
      if (prodFilter) url += `&product=${encodeURIComponent(prodFilter)}`;
      if (srcFilter) url += `&source=${encodeURIComponent(srcFilter)}`;
      console.log("[FRONTEND] Fetching URL:", url);
      const res = await fetch(url);
      const data = await res.json();
      console.log("[FRONTEND] Received data:", { ordersCount: data.orders.orders.length, total: data.orders.total });
      setOrders(data.orders.orders);
      setTotal(data.orders.total);
      if (data.products) setProducts(data.products);
      if (data.sources) setSources(data.sources);
    } catch (e) {
      console.error("[FRONTEND] Fetch error:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("[FRONTEND] useEffect triggered with params from URL:", { page, from, to, hourFrom, hourTo, search, product, source });
    fetchOrders(
      page,
      from || undefined,
      to || undefined,
      hourFrom || undefined,
      hourTo || undefined,
      search || undefined,
      product || undefined,
      source || undefined
    );
  }, [page, from, to, hourFrom, hourTo, search, product, source, fetchOrders]);

  const handleDelete = async (id: number) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    try {
      await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setConfirmDeleteId(null);
      fetchOrders(
        page,
        from || undefined,
        to || undefined,
        hourFrom || undefined,
        hourTo || undefined,
        search || undefined,
        product || undefined,
        source || undefined
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefresh = () => {
    setConfirmDeleteId(null);
    fetchOrders(
      page,
      from || undefined,
      to || undefined,
      hourFrom || undefined,
      hourTo || undefined,
      search || undefined,
      product || undefined,
      source || undefined
    );
  };

  const handleQuickDateFilter = useCallback((filter: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formatDate = (d: Date) => d.toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });

    let fromDate = "";
    let toDate = "";

    switch (filter) {
      case "today":
        fromDate = formatDate(today);
        toDate = formatDate(today);
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        fromDate = formatDate(yesterday);
        toDate = formatDate(yesterday);
        break;
      case "last3days":
        const last3 = new Date(today);
        last3.setDate(last3.getDate() - 2);
        fromDate = formatDate(last3);
        toDate = formatDate(today);
        break;
      case "lastweek":
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 6);
        fromDate = formatDate(lastWeek);
        toDate = formatDate(today);
        break;
      case "thismonth":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        fromDate = formatDate(monthStart);
        toDate = formatDate(today);
        break;
    }

    updateFilters({ from: fromDate, to: toDate, page: 0 });
    setExpandedId(null);
    setConfirmDeleteId(null);
  }, [updateFilters]);

  const handleResetFilters = useCallback(() => {
    router.push("/admin/orders");
    setExpandedId(null);
    setConfirmDeleteId(null);
  }, [router]);

  const thStyle: React.CSSProperties = {
    padding: "0.6rem 0.5rem",
    textAlign: "left",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    borderBottom: "2px solid #e0e0e0",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "0.55rem 0.5rem",
    fontSize: "0.82rem",
    color: "#333",
    borderBottom: "1px solid #f0f0f0",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          background: BG,
          minHeight: "100vh",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link
                href="/admin"
                style={{
                  color: ACCENT,
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                &larr; Dashboard
              </Link>
              <h1
                style={{
                  fontFamily: "'Poppins', system-ui, sans-serif",
                  fontSize: "1.35rem",
                  fontWeight: 700,
                  color: ACCENT,
                  margin: 0,
                }}
              >
                Ordini
              </h1>
              <span style={{ fontSize: "0.8rem", color: "#888" }}>
                ({total} totali)
              </span>
            </div>
            <button
              onClick={handleRefresh}
              style={{
                padding: "0.4rem 0.75rem",
                background: ACCENT,
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: "0.82rem",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Aggiorna
            </button>
          </div>

          {/* Filtri */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "1rem",
              marginBottom: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #eee",
            }}
          >
            {/* Filtri rapidi data */}
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#666", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                Filtri rapidi
              </label>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                <button onClick={() => handleQuickDateFilter("today")} style={quickBtnStyle}>Oggi</button>
                <button onClick={() => handleQuickDateFilter("yesterday")} style={quickBtnStyle}>Ieri</button>
                <button onClick={() => handleQuickDateFilter("last3days")} style={quickBtnStyle}>Ultimi 3 giorni</button>
                <button onClick={() => handleQuickDateFilter("lastweek")} style={quickBtnStyle}>Ultima settimana</button>
                <button onClick={() => handleQuickDateFilter("thismonth")} style={quickBtnStyle}>Mese corrente</button>
              </div>
            </div>

            {/* Ricerca e filtri principali */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div>
                <label style={labelStyle}>Cerca</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => updateFilters({ search: e.target.value, page: 0 })}
                  placeholder="Nome, telefono, email..."
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Prodotto</label>
                <select
                  value={product}
                  onChange={(e) => updateFilters({ product: e.target.value, page: 0 })}
                  style={inputStyle}
                >
                  <option value="">Tutti</option>
                  {products.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Sorgente</label>
                <select
                  value={source}
                  onChange={(e) => updateFilters({ source: e.target.value, page: 0 })}
                  style={inputStyle}
                >
                  <option value="">Tutte</option>
                  <option value="organica">organica</option>
                  {sources.filter((s) => s !== "organica").map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date e ore */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.75rem" }}>
              <div>
                <label style={labelStyle}>Da data</label>
                <input
                  type="date"
                  value={from}
                  onChange={(e) => updateFilters({ from: e.target.value, page: 0 })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>A data</label>
                <input
                  type="date"
                  value={to}
                  onChange={(e) => updateFilters({ to: e.target.value, page: 0 })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Da ora</label>
                <select
                  value={hourFrom}
                  onChange={(e) => updateFilters({ hourFrom: e.target.value, page: 0 })}
                  style={inputStyle}
                >
                  <option value="">Tutte</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={String(i)}>{String(i).padStart(2, "0")}:00</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>A ora</label>
                <select
                  value={hourTo}
                  onChange={(e) => updateFilters({ hourTo: e.target.value, page: 0 })}
                  style={inputStyle}
                >
                  <option value="">Tutte</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={String(i)}>{String(i).padStart(2, "0")}:00</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottone reset */}
            {(from || to || hourFrom || hourTo || search || product || source) && (
              <div style={{ marginTop: "0.75rem" }}>
                <button
                  onClick={handleResetFilters}
                  style={{
                    padding: "0.4rem 0.75rem",
                    background: "#e0e0e0",
                    color: "#333",
                    border: "none",
                    borderRadius: 6,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Reset filtri
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #eee",
              overflowX: "auto",
            }}
          >
            {loading ? (
              <p style={{ padding: "2rem", color: "#888", textAlign: "center" }}>
                Caricamento...
              </p>
            ) : orders.length === 0 ? (
              <p style={{ padding: "2rem", color: "#888", textAlign: "center" }}>
                Nessun ordine trovato.
              </p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 800,
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>Prodotto</th>
                    <th style={thStyle}>Nome</th>
                    <th style={thStyle}>Telefono</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Taglia / Colore</th>
                    <th style={thStyle}>Data</th>
                    <th style={thStyle}>Sorgente</th>
                    <th style={thStyle}>SMS</th>
                    <th style={thStyle}>IP</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <Fragment key={o.id}>
                      <tr
                        onClick={() =>
                          setExpandedId(expandedId === o.id ? null : o.id)
                        }
                        style={{
                          cursor: "pointer",
                          background:
                            expandedId === o.id ? "#f0fafb" : "transparent",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          if (expandedId !== o.id)
                            (e.currentTarget as HTMLElement).style.background =
                              "#fafafa";
                        }}
                        onMouseLeave={(e) => {
                          if (expandedId !== o.id)
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                        }}
                      >
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 500 }}>{o.product}</span>
                          {o.upsell && (
                            <span
                              style={{
                                marginLeft: 6,
                                background: "#e8f5e9",
                                color: "#2e7d32",
                                fontSize: "0.68rem",
                                padding: "1px 6px",
                                borderRadius: 4,
                                fontWeight: 600,
                              }}
                            >
                              +plantare
                            </span>
                          )}
                        </td>
                        <td style={tdStyle}>
                          {o.first_name || o.last_name
                            ? `${o.first_name || ""} ${o.last_name || ""}`.trim()
                            : "-"}
                        </td>
                        <td style={tdStyle}>{o.phone}</td>
                        <td style={{ ...tdStyle, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {o.email || "-"}
                        </td>
                        <td style={tdStyle}>
                          {[o.selected_size, o.selected_color]
                            .filter(Boolean)
                            .join(" / ") || "-"}
                        </td>
                        <td style={{ ...tdStyle, fontSize: "0.78rem" }}>
                          {fmtDate(o.created_at)}
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            display: "inline-block",
                            padding: "0.15rem 0.5rem",
                            borderRadius: 999,
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            background: (o.source || "organica") === "organica" ? "#e8f5e9" : "#e3f2fd",
                            color: (o.source || "organica") === "organica" ? "#2e7d32" : "#1565c0",
                          }}>
                            {o.source || "organica"}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {o.sms_status ? (() => {
                            const b = SMS_BADGE[o.sms_status] || SMS_BADGE.pending;
                            return (
                              <span style={{
                                display: "inline-block",
                                padding: "0.15rem 0.5rem",
                                borderRadius: 999,
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                background: b.bg,
                                color: b.color,
                              }}>
                                {b.label}
                              </span>
                            );
                          })() : (
                            <span style={{ color: "#ccc", fontSize: "0.75rem" }}>&mdash;</span>
                          )}
                        </td>
                        <td style={{ ...tdStyle, fontSize: "0.75rem", color: "#888" }}>
                          {o.ip || "-"}
                        </td>
                        <td
                          style={{ ...tdStyle, textAlign: "center" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleDelete(o.id)}
                            style={{
                              padding: "0.25rem 0.6rem",
                              background:
                                confirmDeleteId === o.id ? "#c00" : "#f5f5f5",
                              color:
                                confirmDeleteId === o.id ? "#fff" : "#c00",
                              border:
                                confirmDeleteId === o.id
                                  ? "1px solid #c00"
                                  : "1px solid #ddd",
                              borderRadius: 5,
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                          >
                            {confirmDeleteId === o.id ? "Conferma" : "Elimina"}
                          </button>
                        </td>
                      </tr>
                      {expandedId === o.id && (
                        <tr key={`${o.id}-detail`}>
                          <td
                            colSpan={10}
                            style={{
                              padding: "0.75rem 1rem 1rem",
                              background: "#f0fafb",
                              borderBottom: "1px solid #e0e0e0",
                            }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "0.5rem 1.5rem",
                                fontSize: "0.82rem",
                              }}
                            >
                              <Detail
                                label="Nome completo"
                                value={
                                  [o.first_name, o.last_name]
                                    .filter(Boolean)
                                    .join(" ") || "-"
                                }
                              />
                              <Detail label="Telefono" value={o.phone} />
                              <Detail label="Email" value={o.email || "-"} />
                              <Detail
                                label="Indirizzo"
                                value={o.address || "-"}
                              />
                              <Detail
                                label="Citta'"
                                value={
                                  [o.city, o.province].filter(Boolean).join(", ") ||
                                  "-"
                                }
                              />
                              <Detail label="CAP" value={o.zip || "-"} />
                              <Detail
                                label="Taglia"
                                value={o.selected_size || "-"}
                              />
                              <Detail
                                label="Colore"
                                value={o.selected_color || "-"}
                              />
                              <Detail
                                label="Note spedizione"
                                value={o.shipping_notes || "-"}
                              />
                              <Detail
                                label="Upsell"
                                value={o.upsell ? "+Plantare" : "No"}
                              />
                              <Detail label="IP" value={o.ip || "-"} />
                              <Detail
                                label="Data ordine"
                                value={fmtDate(o.created_at)}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1.25rem",
              }}
            >
              <button
                onClick={() => {
                  updateFilters({ page: Math.max(0, page - 1) });
                  setExpandedId(null);
                  setConfirmDeleteId(null);
                }}
                disabled={page === 0}
                style={{
                  padding: "0.4rem 0.8rem",
                  background: page === 0 ? "#e0e0e0" : ACCENT,
                  color: page === 0 ? "#999" : "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                  cursor: page === 0 ? "default" : "pointer",
                }}
              >
                &larr; Prec
              </button>
              <span style={{ fontSize: "0.82rem", color: "#555" }}>
                Pagina {page + 1} di {totalPages}
              </span>
              <button
                onClick={() => {
                  updateFilters({ page: Math.min(totalPages - 1, page + 1) });
                  setExpandedId(null);
                  setConfirmDeleteId(null);
                }}
                disabled={page >= totalPages - 1}
                style={{
                  padding: "0.4rem 0.8rem",
                  background: page >= totalPages - 1 ? "#e0e0e0" : ACCENT,
                  color: page >= totalPages - 1 ? "#999" : "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: "0.82rem",
                  cursor: page >= totalPages - 1 ? "default" : "pointer",
                }}
              >
                Succ &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ color: "#888", fontSize: "0.75rem" }}>{label}</span>
      <div style={{ fontWeight: 500, marginTop: 1 }}>{value}</div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#666",
  marginBottom: "0.25rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.4rem 0.5rem",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: "0.82rem",
  background: "#fff",
};

const quickBtnStyle: React.CSSProperties = {
  padding: "0.35rem 0.7rem",
  background: "#f5f5f5",
  color: "#333",
  border: "1px solid #ddd",
  borderRadius: 6,
  fontSize: "0.75rem",
  cursor: "pointer",
  fontWeight: 500,
};
