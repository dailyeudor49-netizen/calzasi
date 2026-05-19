"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const ACCENT = "#1B5E6B";
const BG = "#f6f6f7";

interface BlockedIp {
  id: number;
  ip: string;
  blocked_at: string;
  reason: string | null;
}

export default function IpBlocksPage() {
  const [ips, setIps] = useState<BlockedIp[]>([]);
  const [loading, setLoading] = useState(true);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [confirmUnblockId, setConfirmUnblockId] = useState<number | null>(null);

  const fetchIps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ip-blocks");
      const data = await res.json();
      setIps(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  const fetchRateSetting = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/ip-rate-settings");
      const data = await res.json();
      setRateLimitEnabled(data.enabled);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchIps();
    fetchRateSetting();
  }, [fetchIps, fetchRateSetting]);

  const toggleRateLimit = async () => {
    setToggling(true);
    try {
      await fetch("/api/admin/ip-rate-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !rateLimitEnabled }),
      });
      setRateLimitEnabled(!rateLimitEnabled);
    } catch (e) {
      console.error(e);
    }
    setToggling(false);
  };

  const handleUnblock = async (id: number) => {
    if (confirmUnblockId !== id) {
      setConfirmUnblockId(id);
      return;
    }
    try {
      await fetch("/api/admin/ip-blocks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setConfirmUnblockId(null);
      fetchIps();
    } catch (e) {
      console.error(e);
    }
  };

  const thStyle: React.CSSProperties = {
    padding: "0.6rem 0.75rem",
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
    padding: "0.6rem 0.75rem",
    fontSize: "0.85rem",
    color: "#333",
    borderBottom: "1px solid #f0f0f0",
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
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
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
              Gestione IP Bloccati
            </h1>
          </div>

          {/* Rate limit toggle */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "1rem 1.25rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #eee",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#333" }}>
                Rate Limiting IP
              </div>
              <div style={{ fontSize: "0.8rem", color: "#888", marginTop: 2 }}>
                Blocca automaticamente gli IP con troppe richieste
              </div>
            </div>
            <button
              onClick={toggleRateLimit}
              disabled={toggling}
              style={{
                padding: "0.45rem 1.25rem",
                background: rateLimitEnabled ? "#e8f5e9" : "#ffebee",
                color: rateLimitEnabled ? "#2e7d32" : "#c62828",
                border: `1.5px solid ${rateLimitEnabled ? "#4caf50" : "#ef5350"}`,
                borderRadius: 20,
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: toggling ? "default" : "pointer",
                opacity: toggling ? 0.6 : 1,
                minWidth: 100,
              }}
            >
              {toggling ? "..." : rateLimitEnabled ? "Attivo" : "Disattivo"}
            </button>
          </div>

          {/* IP Table */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #eee",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                padding: "0.85rem 1rem",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#333" }}>
                IP Bloccati ({ips.length})
              </span>
              <button
                onClick={() => {
                  setConfirmUnblockId(null);
                  fetchIps();
                }}
                style={{
                  padding: "0.3rem 0.65rem",
                  background: ACCENT,
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                Aggiorna
              </button>
            </div>

            {loading ? (
              <p style={{ padding: "2rem", color: "#888", textAlign: "center" }}>
                Caricamento...
              </p>
            ) : ips.length === 0 ? (
              <p style={{ padding: "2rem", color: "#888", textAlign: "center" }}>
                Nessun IP bloccato.
              </p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 500,
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>IP</th>
                    <th style={thStyle}>Data blocco</th>
                    <th style={thStyle}>Motivo</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {ips.map((ip) => (
                    <tr key={ip.id}>
                      <td style={{ ...tdStyle, fontFamily: "monospace", fontWeight: 500 }}>
                        {ip.ip}
                      </td>
                      <td style={tdStyle}>
                        {new Date(ip.blocked_at).toLocaleDateString("it-IT", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Europe/Rome",
                        })}
                      </td>
                      <td style={{ ...tdStyle, color: "#666" }}>
                        {ip.reason || "-"}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <button
                          onClick={() => handleUnblock(ip.id)}
                          style={{
                            padding: "0.25rem 0.7rem",
                            background:
                              confirmUnblockId === ip.id ? "#2e7d32" : "#f5f5f5",
                            color:
                              confirmUnblockId === ip.id ? "#fff" : "#2e7d32",
                            border:
                              confirmUnblockId === ip.id
                                ? "1px solid #2e7d32"
                                : "1px solid #ddd",
                            borderRadius: 5,
                            fontSize: "0.78rem",
                            cursor: "pointer",
                            fontWeight: 500,
                          }}
                        >
                          {confirmUnblockId === ip.id ? "Conferma" : "Sblocca"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
