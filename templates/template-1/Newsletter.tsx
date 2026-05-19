"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(data.message?.includes("gia") ? "already" : "success");
        if (!data.message?.includes("gia")) setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: "var(--color-primary-dark)" }}>
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left — text */}
          <div>
            <p
              className="uppercase tracking-[0.2em] mb-3 font-semibold"
              style={{ fontFamily: "var(--font-accent)", color: "var(--color-accent)", fontSize: "11px" }}
            >
              Newsletter
            </p>
            <h2
              className="font-extrabold leading-tight mb-4 text-white"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
              }}
            >
              Resta aggiornato sulle novità
            </h2>
            <p
              className="leading-relaxed max-w-md"
              style={{
                fontFamily: "var(--font-body)",
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
                lineHeight: "1.7",
              }}
            >
              Sconti esclusivi, nuovi arrivi e promozioni riservate. Niente spam, solo il meglio per te.
            </p>
          </div>

          {/* Right — form */}
          <div>
            {status === "success" ? (
              <div className="py-8 text-center" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                  Iscrizione completata!
                </p>
                <p className="text-white/40 text-xs mt-1" style={{ fontFamily: "var(--font-body)" }}>
                  Riceverai presto le nostre offerte.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="La tua email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (status !== "idle") setStatus("idle"); }}
                    className="flex-1 px-5 py-4 text-sm outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#fff",
                      fontFamily: "var(--font-body)",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-8 py-4 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-50 shrink-0"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "#fff",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {status === "loading" ? "..." : "Iscriviti Ora"}
                  </button>
                </div>

                {status === "already" && (
                  <p className="text-white/40 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                    Questa email è già registrata alla nostra newsletter.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-400 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                    Si è verificato un errore. Riprova.
                  </p>
                )}

                <p className="text-white/25 text-[11px]" style={{ fontFamily: "var(--font-body)" }}>
                  Iscrivendoti accetti la nostra{" "}
                  <a href="/privacy-policy" className="underline text-white/35 hover:text-white/50">Privacy Policy</a>.
                  Puoi disiscriverti in qualsiasi momento.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
