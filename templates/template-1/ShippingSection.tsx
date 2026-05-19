export default function ShippingSection() {
  return (
    <section
      className="relative overflow-hidden py-0"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: "460px" }}>

          {/* Image panel (left) */}
          <div className="relative overflow-hidden" style={{ minHeight: "340px" }}>
            <img
              src="/images/shop/store-sneakers.webp"
              alt="Spedizione rapida — Calzasi"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, transparent 55%, var(--color-primary) 100%)" }}
            />
          </div>

          {/* Text panel (right) */}
          <div className="flex flex-col justify-center px-8 py-14 lg:px-14 lg:py-16 relative z-10">
            <p
              className="uppercase tracking-[0.22em] mb-5 font-bold"
              style={{ fontFamily: "var(--font-accent)", color: "rgba(155,114,247,0.9)", fontSize: "11px" }}
            >
              Spedizione & Cura
            </p>
            <h2
              className="font-extrabold leading-[1.1] mb-6 text-white"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.7rem, 2.8vw, 2.5rem)",
              }}
            >
              Ogni ordine è<br />preparato con le nostre mani.
            </h2>
            <p
              className="mb-8"
              style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.70)", fontSize: "0.97rem", lineHeight: "1.8" }}
            >
              Non spediamo scatole anonime. Ogni ordine viene preparato personalmente, controllato, confezionato con cura e spedito con corriere tracciato. Sai sempre dov'è il tuo pacco.
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  ),
                  title: "Spedizione tracciata",
                  desc: "Corriere espresso, 2-5 giorni lavorativi",
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
                  ),
                  title: "Paghi alla consegna",
                  desc: "Nessun pagamento anticipato richiesto",
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                  ),
                  title: "Reso in 30 giorni",
                  desc: "Non ti piace? Rimborso completo garantito",
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  ),
                  title: "Packaging curato",
                  desc: "Confezione premium, pronta anche come regalo",
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-col gap-1.5">
                  <span style={{ color: "rgba(255,255,255,0.85)" }} aria-hidden="true">{item.icon}</span>
                  <p
                    className="text-xs font-bold text-white uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs"
                    style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.55)", lineHeight: "1.6" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
