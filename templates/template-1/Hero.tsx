"use client";
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

export default function Hero({ title, ctaHref }: HeroProps) {
  return (
    <>
      {/* ── FULL-BLEED BANNER ── */}
      <section style={{ position: "relative", minHeight: "clamp(520px, 86vh, 940px)", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Background image */}
        <img
          src="/images/shop/store-exterior.webp"
          alt="Calzasi — Vigevano"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
          loading="eager"
        />

        {/* Gradient overlay — heavy left, fades right */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, rgba(10,24,42,0.82) 0%, rgba(10,24,42,0.55) 45%, rgba(10,24,42,0.12) 100%)",
        }} />

        {/* Content — anchored bottom-left */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div className="max-w-7xl mx-auto w-full" style={{ padding: "0 clamp(20px,5vw,80px) clamp(52px,7vw,96px)" }}>

            <span style={{
              fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.24em", textTransform: "uppercase",
              color: "var(--color-cta)", display: "block", marginBottom: 20,
            }}>
              Vigevano &nbsp;·&nbsp; Dal 1990 &nbsp;·&nbsp; Made in Italy
            </span>

            <h1 style={{
              fontFamily: "var(--font-heading)", fontWeight: 800,
              fontSize: "clamp(2.6rem, 5.5vw, 5.2rem)",
              lineHeight: 1.02, letterSpacing: "-0.025em",
              color: "#fff", marginBottom: 22,
              maxWidth: 700,
            }}>
              {title || "Scarpe che\nnon dimentichi."}
            </h1>

            <p style={{
              fontFamily: "var(--font-body)", fontSize: "clamp(0.88rem, 1.1vw, 1.05rem)",
              color: "rgba(255,255,255,0.78)", marginBottom: 44,
              maxWidth: 420, lineHeight: 1.75,
            }}>
              19 modelli selezionati a mano. Paghi solo alla consegna. Reso gratuito entro 30 giorni.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href={ctaHref || "/catalogo"}
                style={{
                  fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  backgroundColor: "var(--color-cta)", color: "#fff",
                  padding: "17px 44px", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: 10,
                }}
                className="hover:opacity-85 transition-opacity"
              >
                Scopri la Collezione
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="#nuovi-arrivi"
                style={{
                  fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  border: "1.5px solid rgba(255,255,255,0.55)", color: "#fff",
                  padding: "17px 36px", textDecoration: "none",
                }}
                className="hover:bg-white/10 transition-colors"
              >
                Nuovi Arrivi
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom edge indicator */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: "var(--color-cta)" }} />
      </section>

      {/* ── TRUST STRIP ── */}
      <section style={{ backgroundColor: "#fff", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {[
              { label: "Spedizione 4,99 €",       sub: "Consegna in 2-5 giorni" },
              { label: "Pagamento alla Consegna", sub: "Nessun anticipo richiesto" },
              { label: "Reso entro 30 giorni",    sub: "Rimborso completo garantito" },
              { label: "Acquisto Sicuro",          sub: "Paghi solo quando ricevi" },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "17px 12px",
                borderRight: i < 3 ? "1px solid var(--color-border)" : "none",
                textAlign: "center",
              }}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-primary)", marginBottom: 3 }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: "var(--color-text-secondary)" }}>
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:639px){.cz-trust-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
      </section>
    </>
  );
}
