import Link from "next/link";

export default function PromoSection() {
  return (
    <section style={{ backgroundColor: "#fefefe", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Desktop: side-by-side | Mobile: stacked */}
        <div className="cz-promo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

          {/* Immagine — adattiva, mai tagliata */}
          <div className="cz-promo-img-wrap" style={{ backgroundColor: "#F0EDE8", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img
              src="/images/land/belliva/carosello/1.webp"
              alt="Belliva — Calzasi"
              style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
              loading="lazy"
            />
          </div>

          {/* Copy */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(40px,6vw,88px) clamp(28px,5vw,72px)" }}>

            <span style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-cta)", display: "block", marginBottom: 18 }}>
              Promo attiva · -70%
            </span>

            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(1.8rem,3.2vw,3rem)", lineHeight: 1.08, letterSpacing: "-0.022em", color: "var(--color-text)", marginBottom: 18, maxWidth: 480 }}>
              Belliva. Cammini, attivi i glutei, vedi la differenza.
            </h2>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.9rem,1vw,1rem)", color: "var(--color-text-secondary)", marginBottom: 28, maxWidth: 400, lineHeight: 1.75 }}>
              Suola curva attiva che scolpisce glutei e silhouette ad ogni passo. Risultati visibili in circa 4 settimane — senza palestra.
            </p>

            {/* Prezzo */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 32 }}>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(2rem,3vw,2.8rem)", color: "var(--color-primary)", letterSpacing: "-0.03em" }}>
                €44,99
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--color-text-secondary)", textDecoration: "line-through" }}>
                €149,99
              </span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700, backgroundColor: "var(--color-cta)", color: "#fff", padding: "4px 9px", letterSpacing: "0.04em" }}>
                -70%
              </span>
            </div>

            {/* Trust */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
              {["Paghi alla consegna", "Reso 30 giorni", "Spedizione €4,99"].map((t) => (
                <span key={t} style={{ fontFamily: "var(--font-heading)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-primary)", backgroundColor: "rgba(27,58,92,0.06)", border: "1px solid rgba(27,58,92,0.14)", padding: "6px 12px" }}>
                  {t}
                </span>
              ))}
            </div>

            <Link href="/land/belliva"
              style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", backgroundColor: "var(--color-primary)", color: "#fff", padding: "16px 40px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "flex-start" }}
              className="hover:opacity-85 transition-opacity"
            >
              Scopri Belliva
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>

          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:767px){
          .cz-promo-grid{grid-template-columns:1fr!important}
          .cz-promo-img-wrap{order:-1}
        }
      `}</style>
    </section>
  );
}
