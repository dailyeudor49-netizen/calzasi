export default function RefundSection() {
  const steps = [
    {
      n: "1",
      title: "Verifica condizioni",
      body: "Hai 30 giorni dalla consegna. Il prodotto deve essere integro, non usato, con imballaggio originale.",
    },
    {
      n: "2",
      title: "Scrivi all'assistenza resi",
      body: <span>Manda email a <a href="mailto:info@calzasi.com" style={{ color: "var(--ml-terra-cta)", fontWeight: 600 }}>info@calzasi.com</a> indicando: numero ordine, nome, telefono, indirizzo, motivo del reso ed eventualmente foto.</span>,
    },
    {
      n: "3",
      title: "Ricevi le istruzioni e il rimborso",
      body: "Rispondiamo in 24h con le istruzioni. Rimborso entro 3-5 giorni lavorativi dopo verifica della merce ricevuta.",
    },
  ];

  return (
    <section style={{ backgroundColor: "var(--ml-sand-base)", padding: "56px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ml-text-secondary)", fontFamily: "Inter, system-ui, sans-serif", marginBottom: 16 }}>
          RESI E RIMBORSI
        </p>
        <h2 style={{ textAlign: "center", fontFamily: "Newsreader, Georgia, serif", fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, color: "var(--ml-text-primary)", marginBottom: 12, lineHeight: 1.2 }}>
          Come richiedere un rimborso
        </h2>
        <p style={{ textAlign: "center", fontFamily: "Inter, system-ui, sans-serif", fontSize: 17, color: "var(--ml-text-secondary)", marginBottom: 40 }}>
          Hai 30 giorni dalla consegna per cambiare idea. Procedura semplice in 3 passi.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {steps.map((s) => (
            <div
              key={s.n}
              style={{
                borderRadius: 12,
                backgroundColor: "var(--ml-white-pure)",
                padding: 24,
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "var(--ml-terra-cta)", color: "#fff", fontFamily: "Inter, system-ui, sans-serif", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.n}
              </div>
              <div>
                <h3 style={{ fontFamily: "Newsreader, Georgia, serif", fontSize: 20, fontWeight: 600, color: "var(--ml-text-primary)", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 17, color: "var(--ml-text-secondary)", lineHeight: 1.6 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 32 }}>
          {["🛡️ Soddisfatta o rimborsata", "📧 Risposta in 24h", "⚡ Procedure semplici"].map((p) => (
            <span key={p} style={{ backgroundColor: "var(--ml-green-trust-soft)", color: "var(--ml-green-trust)", fontSize: 15, fontWeight: 600, fontFamily: "Inter, system-ui, sans-serif", padding: "8px 16px", borderRadius: 999, border: "1px solid var(--ml-green-trust)" }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
