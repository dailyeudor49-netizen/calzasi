"use client";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

export default function FinalCTA({ onOrder }: { onOrder: () => void }) {
  return (
    <section style={{ backgroundColor: "var(--ml-terra-cta)", padding: "88px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,252,248,0.75)", fontFamily: FONT, marginBottom: 20 }}>
          ULTIMI 7 PAIA A QUESTO PREZZO
        </p>
        <h2 style={{ fontFamily: FONT, fontSize: "clamp(30px,5.5vw,52px)", fontWeight: 800, color: "var(--ml-white-pure)", lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.02em" }}>
          Modella la silhouette. Cammina più leggera. Paga solo quando il pacco è in mano.
        </h2>
        <p style={{ fontFamily: FONT, fontSize: 18, color: "rgba(255,252,248,0.88)", marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>
          Consegna GLS 24-72h. Reso 30 giorni. Boutique reale dal 1990.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: FONT, fontSize: 22, color: "rgba(255,252,248,0.65)", textDecoration: "line-through" }}>€149,99</span>
          <span style={{ fontFamily: FONT, fontSize: "clamp(44px,7vw,68px)", fontWeight: 800, color: "var(--ml-white-pure)", lineHeight: 1, letterSpacing: "-0.03em" }}>€44,99</span>
          <span style={{ backgroundColor: "#FDEDB5", color: "#9B5A00", fontSize: 15, fontWeight: 700, fontFamily: FONT, padding: "6px 14px", borderRadius: 999 }}>−70%</span>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,252,248,0.70)", marginBottom: 32 }}>
          + €4,99 spedizione GLS · Paghi tutto alla consegna
        </p>

        <button
          onClick={onOrder}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            backgroundColor: "var(--ml-white-pure)",
            color: "var(--ml-terra-cta)",
            fontSize: 20,
            fontWeight: 800,
            fontFamily: FONT,
            letterSpacing: "0.01em",
            padding: "22px 48px",
            borderRadius: 14,
            border: "none",
            boxShadow: "0 8px 32px rgba(30,27,24,0.22)",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
        >
          ORDINA ORA → PAGHI ALLA CONSEGNA
        </button>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
          {["Paghi al corriere", "Reso 30 giorni", "Soddisfatta o rimborsata"].map((t) => (
            <span key={t} style={{ fontFamily: FONT, fontSize: 14, fontWeight: 500, color: "rgba(255,252,248,0.78)" }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
