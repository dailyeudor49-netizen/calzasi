"use client";
import { useState } from "react";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

const FAQS = [
  {
    q: "Quali sono i tempi e i costi di spedizione?",
    a: "Consegna in 24-72h dalla conferma telefonica con corriere espresso GLS. Costo spedizione: €4,99.",
  },
  {
    q: "Come funziona il pagamento alla consegna?",
    a: "Quando il corriere GLS ti consegna il pacco, paghi €49,99 direttamente a lui in contanti. Nessun pagamento anticipato, niente carta.",
  },
  {
    q: "Cosa succede se al momento della consegna non sono in casa?",
    a: "GLS ti chiama al numero indicato. Se non rispondi, riprova il giorno successivo e ti lascia un avviso di giacenza. Nessun costo aggiuntivo.",
  },
  {
    q: "Posso restituire il prodotto?",
    a: "Sì, hai 30 giorni dalla consegna. Devono essere integre e con imballaggio originale. Scrivi a info@calzasi.com per le istruzioni.",
  },
  {
    q: "Come scelgo la taglia corretta?",
    a: "La calzata è regolare. Scegli la tua taglia abituale. Se sei tra due numeri o hai il piede largo, prendi la mezza taglia superiore.",
  },
  {
    q: "In quanto tempo vedrò i risultati Sollevamento?",
    a: "La maggior parte delle clienti percepisce comfort dal primo giorno. I benefici sulla silhouette iniziano a essere visibili in circa 4 settimane camminando 20-30 minuti al giorno.",
  },
  {
    q: "Sono adatte a chi ha problemi alla schiena o alle ginocchia?",
    a: "La suola Rocker e il plantare OrtoLift™ sono pensati per ridurre stress su schiena e ginocchia. Non sostituiscono un parere medico: in caso di patologie consulta il tuo specialista.",
  },
  {
    q: "La suola è antiscivolo anche su bagnato?",
    a: "Sì, è dotata di tasselli profondi e mescola con aderenza certificata anche su superfici bagnate.",
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid var(--ml-border-subtle)" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "22px 0", background: "none", border: "none", textAlign: "left", cursor: "pointer", gap: 16,
        }}
        aria-expanded={open}
      >
        <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: "var(--ml-text-primary)", lineHeight: 1.4 }}>
          {q}
        </span>
        <span style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
          backgroundColor: open ? "var(--ml-terra-cta)" : "var(--ml-border-subtle)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: open ? "#fff" : "var(--ml-text-secondary)",
          fontSize: 18, fontWeight: 700, transition: "background 0.2s",
          fontFamily: FONT,
        }}>
          {open ? "−" : "+"}
        </span>
      </button>
      <div style={{ overflow: "hidden", maxHeight: open ? 400 : 0, transition: "max-height 0.3s ease" }}>
        <p style={{ fontFamily: FONT, fontSize: 16, color: "var(--ml-text-secondary)", lineHeight: 1.7, paddingBottom: 20 }}>
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQAccordion() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section style={{ backgroundColor: "var(--ml-white-pure)", padding: "56px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ml-text-secondary)", fontFamily: FONT, marginBottom: 16 }}>
          DOMANDE FREQUENTI
        </p>
        <h2 style={{ textAlign: "center", fontFamily: FONT, fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 800, color: "var(--ml-text-primary)", marginBottom: 48, lineHeight: 1.15 }}>
          Le risposte che ci chiedono ogni giorno
        </h2>

        {FAQS.map((f, i) => (
          <Item
            key={f.q}
            q={f.q}
            a={f.a}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}

        <div style={{ marginTop: 40, borderRadius: 12, backgroundColor: "var(--ml-cream-soft)", padding: 24, textAlign: "center" }}>
          <p style={{ fontFamily: FONT, fontSize: 16, color: "var(--ml-text-secondary)", lineHeight: 1.6 }}>
            Hai un&apos;altra domanda? Scrivici a{" "}
            <a href="mailto:info@calzasi.com" style={{ color: "var(--ml-terra-cta)", fontWeight: 600 }}>
              info@calzasi.com
            </a>
            {" "}— rispondiamo entro 24 ore.
          </p>
        </div>
      </div>
    </section>
  );
}
