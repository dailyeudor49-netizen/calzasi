"use client";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

const items = [
  {
    n: "01",
    label: "Ricevi il pacco",
    sub: "GLS suona al tuo citofono entro 24-72h dalla conferma telefonica.",
  },
  {
    n: "02",
    label: "30 giorni per il reso",
    sub: "Non sei soddisfatta? Scrivi a info@calzasi.com — rimborso completo, senza domande.",
  },
  {
    n: "03",
    label: "Paghi al corriere",
    sub: "€44,99 + €4,99 spedizione in contanti al corriere. Nessuna carta, nessuna app.",
  },
];

export default function CODBlock() {
  return (
    <section style={{ backgroundColor: "#F4F1ED", padding: "56px 20px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ml-text-secondary)", marginBottom: 14 }}>
          ACQUISTO SENZA RISCHIO
        </p>
        <h2 style={{ textAlign: "center", fontFamily: FONT, fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, color: "var(--ml-text-primary)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 48 }}>
          Niente carta. Niente anticipi. Nessun rischio.
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {items.map((it, i) => (
            <div
              key={it.n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                backgroundColor: "var(--ml-white-pure)",
                borderRadius: i === 0 ? "14px 14px 0 0" : i === items.length - 1 ? "0 0 14px 14px" : 0,
                padding: "24px 28px",
                borderBottom: i < items.length - 1 ? "1px solid var(--ml-border-subtle)" : "none",
              }}
            >
              <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: "var(--ml-terra-cta)", letterSpacing: "-0.03em", flexShrink: 0, width: 48, lineHeight: 1 }}>{it.n}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "var(--ml-text-primary)", marginBottom: 4 }}>{it.label}</p>
                <p style={{ fontFamily: FONT, fontSize: 15, color: "var(--ml-text-secondary)", lineHeight: 1.6 }}>{it.sub}</p>
              </div>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--ml-green-trust)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M5 13l4 4L19 7"/></svg>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, borderRadius: 12, border: "1.5px solid rgba(45,106,79,0.20)", padding: "18px 22px", backgroundColor: "var(--ml-white-pure)", display: "flex", gap: 14, alignItems: "flex-start" }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="var(--ml-green-trust)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: "var(--ml-text-primary)", lineHeight: 1.65 }}>
            <strong>Compri solo se vuoi davvero.</strong> Se cambi idea prima della spedizione, scrivi a{" "}
            <a href="mailto:info@calzasi.com" style={{ color: "var(--ml-green-trust)", fontWeight: 600 }}>info@calzasi.com</a>
            {" "}— annulliamo senza domande.
          </p>
        </div>
      </div>
    </section>
  );
}
