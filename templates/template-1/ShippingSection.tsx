export default function ShippingSection() {
  const items = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      ),
      title: "Spedizione tracciata",
      sub: "Corriere espresso, 2–5 giorni lavorativi. Tracki il pacco in tempo reale.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/>
        </svg>
      ),
      title: "Paghi alla consegna",
      sub: "Nessuna carta, nessun anticipo. Paghi solo quando tieni le scarpe in mano.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
        </svg>
      ),
      title: "Reso in 30 giorni",
      sub: "Non ti convince? Rimborso completo garantito. Nessuna domanda.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Acquisto protetto",
      sub: "Ogni ordine è verificato e confermato prima della spedizione.",
    },
  ];

  return (
    <section style={{ backgroundColor: "#fafafa", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", padding: "52px 20px" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }} className="cz-ship-grid">
          {items.map((item, i) => (
            <div key={item.title} style={{ padding: "0 32px", borderRight: i < 3 ? "1px solid var(--color-border)" : "none", display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ color: "var(--color-primary)" }}>{item.icon}</span>
              <div>
                <p style={{ fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--color-text)", marginBottom: 6 }}>
                  {item.title}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:767px){.cz-ship-grid{grid-template-columns:repeat(2,1fr)!important;gap:28px!important}.cz-ship-grid>div{border-right:none!important;padding:0 16px!important}}`}</style>
    </section>
  );
}
