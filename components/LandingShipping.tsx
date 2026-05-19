interface Props {
  accentColor?: string;
}

export default function LandingShipping({ accentColor = "#16a34a" }: Props) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{ backgroundColor: "#faf8f5", border: "1px solid #EBE5DA" }}
        >
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
            <div
              className="shrink-0 rounded-xl p-3"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16,8 20,8 23,12 23,17 16,17 16,8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <h3
                className="text-lg font-bold mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "#1A1917" }}
              >
                Spediamo con GLS Express
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: "#5A5752", fontFamily: "var(--font-body)" }}>
                Tutti gli ordini vengono spediti tramite corriere <b style={{ color: "#1A1917" }}>GLS</b> con consegna in <b style={{ color: "#1A1917" }}>2-5 giorni lavorativi</b>.
                La spedizione costa solo <b style={{ color: "#137333" }}>4,99 €</b> per tutti gli ordini in tutta Italia.
              </p>
            </div>
          </div>

          <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
            {[
              {
                icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16,8 20,8 23,12 23,17 16,17 16,8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
                title: "Spedizione 4,99 €",
                desc: "Consegna in 2-5 giorni lavorativi in tutta Italia con GLS",
              },
              {
                icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>,
                title: "Conferma telefonica",
                desc: "Ti chiamiamo o ti scriviamo per confermare l'ordine prima della spedizione",
              },
              {
                icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
                title: "Ordini del venerdì",
                desc: "Dopo le 17:00 confermati e spediti il lunedì successivo",
              },
            ].map((card) => (
              <div key={card.title} className="flex items-start gap-3 rounded-xl border p-4"
                style={{ backgroundColor: "#fff", borderColor: "#EBE5DA" }}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-[15px] font-bold mb-0.5" style={{ color: "#1A1917", fontFamily: "var(--font-heading)" }}>{card.title}</p>
                  <p className="text-[14px] leading-relaxed" style={{ color: "#5A5752", fontFamily: "var(--font-body)" }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
