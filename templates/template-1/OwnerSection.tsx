import Link from "next/link";

export default function OwnerSection() {
  return (
    <section style={{ overflow: "hidden", backgroundColor: "var(--color-bg-alt)" }}>
      <div className="max-w-7xl mx-auto">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 580 }}>

          {/* Image panel — left (opposto a lacalzoleria che ha immagine a destra) */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: 460, order: 1 }}>
            <img
              src="/images/shop/store-interior.webp"
              alt="Calzasi — selezione con cura"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              loading="lazy"
            />
            <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "30%", background: "linear-gradient(to left, #fff, transparent)" }} />

            {/* Amber badge bottom-right */}
            <div style={{ position: "absolute", top: 28, right: 28, backgroundColor: "var(--color-cta)", padding: "14px 20px", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", marginBottom: 4 }}>
                Garanzia
              </p>
              <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 16, color: "#fff", lineHeight: 1.2 }}>
                Paghi solo<br />alla consegna
              </p>
            </div>
          </div>

          {/* Text panel — right */}
          <div
            className="flex flex-col justify-center"
            style={{ padding: "clamp(48px,6vw,96px) clamp(20px,5vw,80px) clamp(48px,6vw,96px) clamp(28px,4vw,64px)", order: 2 }}
          >
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-cta)", display: "block", marginBottom: 20 }}>
              Il nostro impegno
            </span>

            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(1.7rem,2.8vw,2.6rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "var(--color-text)", marginBottom: 28 }}>
              Ogni paio passa<br />dai nostri occhi.
            </h2>

            {/* Quote — diverso da lacalzoleria */}
            <blockquote
              style={{ borderLeft: "3px solid var(--color-cta)", paddingLeft: 20, marginBottom: 24 }}
            >
              <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)", fontSize: "1.03rem", lineHeight: 1.85, fontStyle: "italic" }}>
                "Da Calzasi non trovi tutto: trovi solo quello che vale. Ogni modello viene selezionato di persona, testato sul campo e approvato prima di andare online. Se non lo indosseremmo noi, non te lo vendiamo."
              </p>
            </blockquote>

            <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)", fontSize: "0.96rem", lineHeight: 1.8, marginBottom: 36 }}>
              Siamo un team piccolo, attento e appassionato di calzature. Rispondere alle domande, risolvere i problemi e garantire la qualità promessa — questo è il nostro lavoro ogni giorno.
            </p>

            {/* Trust badges — navy invece di viola */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
              {[
                "Selezione artigianale",
                "Reso senza domande",
                "Pagamento alla consegna",
              ].map((badge) => (
                <span
                  key={badge}
                  style={{
                    fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.06em",
                    color: "var(--color-primary)",
                    backgroundColor: "rgba(27,58,92,0.07)",
                    border: "1px solid rgba(27,58,92,0.18)",
                    padding: "7px 14px",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>

            <Link
              href="/contatti"
              style={{
                fontFamily: "var(--font-heading)", fontSize: 11.5, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--color-primary)",
                border: "1.5px solid var(--color-primary)",
                padding: "12px 28px", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start",
              }}
              className="hover:opacity-70 transition-opacity"
            >
              Scrivici
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .cz-owner-grid { grid-template-columns: 1fr !important; }
          .cz-owner-grid > div:first-child { min-height: 300px !important; order: -1 !important; }
        }
      `}</style>
    </section>
  );
}
