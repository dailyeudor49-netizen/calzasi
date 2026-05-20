import Link from "next/link";

export default function StoreSection() {
  return (
    <section style={{ backgroundColor: "#fefefe", borderTop: "1px solid var(--color-border)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="cz-store-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

          {/* Mosaico immagini */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", minHeight: "clamp(400px,60vh,680px)" }}>
            {/* Foto esterna — occupa tutta la colonna sinistra */}
            <div style={{ gridRow: "1 / 3", overflow: "hidden" }}>
              <img
                src="/images/shop/store-exterior.webp"
                alt="Calzasi — negozio"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                loading="lazy"
              />
            </div>
            {/* Interno */}
            <div style={{ overflow: "hidden", borderLeft: "3px solid #fefefe", borderBottom: "1.5px solid #fefefe" }}>
              <img
                src="/images/shop/store-interior.webp"
                alt="Interno negozio Calzasi"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                loading="lazy"
              />
            </div>
            {/* Banco */}
            <div style={{ overflow: "hidden", borderLeft: "3px solid #fefefe", borderTop: "1.5px solid #fefefe" }}>
              <img
                src="/images/shop/store-counter.webp"
                alt="Banco Calzasi"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Testo */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(40px,6vw,88px) clamp(28px,5vw,72px)" }}>

            <span style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--color-cta)", display: "block", marginBottom: 18 }}>
              Il nostro negozio
            </span>

            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(1.8rem,3vw,2.8rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "var(--color-text)", marginBottom: 16 }}>
              Vieni a trovarci a Vigevano.
            </h2>

            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.9rem,1vw,1rem)", color: "var(--color-text-secondary)", lineHeight: 1.75, marginBottom: 36, maxWidth: 400 }}>
              Oltre 200 modelli in esposizione. Puoi provare, scegliere e ordinare online con ritiro in negozio — o farti consegnare direttamente a casa.
            </p>

            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                  label: "Indirizzo",
                  value: "Corso Cavour 14, 27029 Vigevano (PV)",
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  label: "Orari",
                  value: "Lun–Sab 9:30–13:00 · 15:30–19:30",
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
                  label: "Telefono",
                  value: "+39 0381 000000",
                },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span style={{ color: "var(--color-primary)", marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-heading)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--color-text)", lineHeight: 1.5 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/contatti"
              style={{ fontFamily: "var(--font-heading)", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-primary)", border: "1.5px solid var(--color-primary)", padding: "13px 28px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start" }}
              className="hover:opacity-70 transition-opacity"
            >
              Scrivici
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>

          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:767px){
          .cz-store-grid{grid-template-columns:1fr!important}
          .cz-store-grid>div:first-child{min-height:320px}
        }
      `}</style>
    </section>
  );
}
