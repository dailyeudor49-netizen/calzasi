"use client";
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

export default function Hero({ ctaHref }: HeroProps) {
  return (
    <>
      {/* ── SPLIT HERO ── */}
      <section style={{ backgroundColor: "#fefefe", overflow: "hidden" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "clamp(480px,72vh,820px)" }} className="cz-hero-grid">

          {/* Left — copy */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(40px,6vw,96px) clamp(20px,4vw,72px) clamp(40px,6vw,96px) clamp(20px,5vw,80px)" }}>

            <span style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-cta)", display: "block", marginBottom: 20 }}>
              Collezione 2026 &nbsp;·&nbsp; Nuovi arrivi
            </span>

            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(2.4rem,4.5vw,4.4rem)", lineHeight: 1.04, letterSpacing: "-0.025em", color: "var(--color-text)", marginBottom: 20, maxWidth: 540 }}>
              Scarpe che non dimentichi.
            </h1>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.9rem,1.1vw,1.05rem)", color: "var(--color-text-secondary)", marginBottom: 36, maxWidth: 400, lineHeight: 1.75 }}>
              19 modelli selezionati. Pagamento alla consegna. Reso gratuito 30 giorni.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44 }}>
              <Link
                href={ctaHref || "/catalogo"}
                style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", backgroundColor: "var(--color-primary)", color: "#fff", padding: "16px 40px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}
                className="hover:opacity-85 transition-opacity"
              >
                Scopri la Collezione
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <Link
                href="/land/bellavia"
                style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", border: "1.5px solid var(--color-border)", color: "var(--color-text)", padding: "16px 32px", textDecoration: "none" }}
                className="hover:bg-gray-50 transition-colors"
              >
                Bellavia — €44,99
              </Link>
            </div>

            {/* Category chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "Eleganti", href: "/catalogo?cat=eleganti" },
                { label: "Sportive", href: "/catalogo?cat=sportive" },
                { label: "Sandali",  href: "/catalogo?cat=sandali" },
              ].map((c) => (
                <Link key={c.label} href={c.href}
                  style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-secondary)", backgroundColor: "var(--color-bg-alt)", border: "1px solid var(--color-border)", padding: "7px 16px", textDecoration: "none", borderRadius: 2 }}
                  className="hover:text-[var(--color-primary)] transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right — product image */}
          <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#F0EDE8" }}>
            <img
              src="/images/land/bellavia/carosello/1.webp"
              alt="Bellavia — Calzasi"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
              loading="eager"
            />
            {/* Promo badge */}
            <div style={{ position: "absolute", top: 24, right: 24, backgroundColor: "var(--color-cta)", color: "#fff", padding: "10px 16px", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 2 }}>Promo</p>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 18, lineHeight: 1 }}>-70%</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section style={{ backgroundColor: "#fff", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }} className="cz-trust-grid">
            {[
              { label: "Spedizione 4,99 €",       sub: "Consegna in 2-5 giorni" },
              { label: "Pagamento alla Consegna", sub: "Nessun anticipo richiesto" },
              { label: "Reso entro 30 giorni",    sub: "Rimborso completo garantito" },
              { label: "Acquisto Sicuro",          sub: "Paghi solo quando ricevi" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "16px 12px", borderRight: i < 3 ? "1px solid var(--color-border)" : "none", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-primary)", marginBottom: 2 }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: "var(--color-text-secondary)" }}>
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:767px){
          .cz-hero-grid{grid-template-columns:1fr!important}
          .cz-hero-grid>div:last-child{min-height:280px;position:relative}
          .cz-trust-grid{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>
    </>
  );
}
