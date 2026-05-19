"use client";

import { useState } from "react";

interface Props {
  shopEmail: string;
  accentColor?: string;
  items?: { q: string; a: string }[];
}

const buildFAQs = (email: string) => [
  {
    q: "Quali sono i tempi e i costi di spedizione?",
    a: `Consegna in 2-5 giorni lavorativi con corriere espresso GLS. Spedizione a soli 4,99 € su tutti gli ordini in tutta Italia.`,
  },
  {
    q: "Come funziona il pagamento alla consegna?",
    a: "Compili il modulo d'ordine, ti contattiamo per conferma, il pacco parte e paghi comodamente in contanti al corriere alla consegna. Nessun pagamento anticipato.",
  },
  {
    q: "Posso restituire il prodotto?",
    a: `Hai 30 giorni dalla ricezione per il reso. Scrivi a ${email} con il numero d'ordine e il motivo: rispondiamo in 24h con le istruzioni. Mandiamo noi il corriere per il ritiro.`,
  },
  {
    q: "Come scelgo la taglia corretta?",
    a: "Le taglie corrispondono alla numerazione europea standard. Se sei indeciso tra due taglie, scegli quella più grande per maggiore comfort.",
  },
  {
    q: "Come funziona la conferma dell'ordine?",
    a: "Dopo aver compilato il modulo, il nostro team ti contatta telefonicamente o via messaggio per confermare l'ordine. Solo dopo la conferma il pacco viene spedito.",
  },
  {
    q: "Posso modificare o annullare un ordine?",
    a: `Se l'ordine non è ancora stato spedito, contattaci a ${email} il prima possibile. Faremo il possibile per modificarlo o annullarlo.`,
  },
  {
    q: "Cosa faccio se ricevo un articolo sbagliato o danneggiato?",
    a: `Contattaci subito a ${email} con il numero ordine e una foto del prodotto ricevuto. Provvederemo alla sostituzione o al rimborso entro 24 ore lavorative.`,
  },
  {
    q: "In quali zone d'Italia spedite?",
    a: "Spediamo in tutta Italia, isole comprese. La consegna avviene tramite corriere GLS Express in 2-5 giorni lavorativi.",
  },
  {
    q: "Gli ordini del venerdì quando vengono spediti?",
    a: "Gli ordini effettuati dopo venerdì alle 17:00 vengono confermati e spediti il lunedì successivo.",
  },
];

export default function LandingFAQ({ shopEmail, accentColor = "#16a34a", items }: Props) {
  const faqs = items || buildFAQs(shopEmail);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? faqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : faqs;

  return (
    <section className="py-10 sm:py-14" style={{ backgroundColor: "#faf8f5" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex justify-center">
          <span className="rounded px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.1em]"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
            FAQ
          </span>
        </div>
        <h2 className="mb-2 text-center text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "#1A1917", fontFamily: "var(--font-heading)" }}>
          Domande Frequenti
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: "#5A5752", fontFamily: "var(--font-body)" }}>
          Tutto quello che devi sapere su spedizioni, pagamento e resi.
        </p>

        <div className="mx-auto max-w-3xl">
          {/* Search */}
          <input
            type="search"
            placeholder="Cerca nelle FAQ (es. spedizione, reso, taglia...)"
            className="mb-5 w-full outline-none"
            style={{ border: "1px solid #EBE5DA", borderRadius: 12, padding: "12px 16px", fontSize: 14, fontFamily: "var(--font-body)", color: "#1A1917", backgroundColor: "#FFFFFF" }}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
          />

          {/* FAQ items */}
          <div className="grid gap-2.5 grid-cols-1 md:grid-cols-2">
            {filtered.map((f, i) => {
              const open = openIndex === i;
              return (
                <div key={i} className="overflow-hidden border transition-all" style={{ borderRadius: 12, borderColor: open ? "#D7DCE2" : "#EBE5DA", backgroundColor: "#FFFFFF" }}>
                  <button
                    className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span className="text-[13px] sm:text-[14px] font-semibold" style={{ color: "#1A1917", fontFamily: "var(--font-heading)" }}>{f.q}</span>
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: open ? accentColor : "#5A5752" }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {open && (
                    <div className="px-4 pb-4 pt-0.5 text-[13px] sm:text-[14px] leading-[1.7]" style={{ color: "#5A5752", fontFamily: "var(--font-body)" }}>
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && search.trim() && (
            <p className="text-center text-sm py-6" style={{ color: "#9B9790" }}>Nessun risultato</p>
          )}
        </div>
      </div>
    </section>
  );
}
