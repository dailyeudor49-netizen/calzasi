interface HowToOrderProps {
  accentColor?: string;
}

export default function HowToOrder({ accentColor = "#2B6E44" }: HowToOrderProps) {
  const steps = [
    { num: "1", title: "Scegli taglia e colore", desc: "Seleziona la tua misura EU. Se sei tra due taglie, scegli la più grande." },
    { num: "2", title: "Clicca Ordina ora", desc: "Inserisci i dati di spedizione. Nessun pagamento anticipato." },
    { num: "3", title: "Conferma e spedizione", desc: "Ti contattiamo per conferma. Se non rispondi, spediamo direttamente." },
    { num: "4", title: "Ricevi e paga al corriere", desc: "Arriva in 2-5 giorni con GLS. Paghi in contanti alla consegna." },
  ];

  return (
    <div className="mt-5 rounded-xl border p-4" style={{ borderColor: "#E2E4E8", backgroundColor: "#FFFFFF" }}>
      <p className="mb-3.5 font-bold" style={{ fontSize: 16, color: "#1A1917", fontFamily: "var(--font-heading)" }}>
        Come funziona l&apos;ordine?
      </p>
      <div className="space-y-3.5">
        {steps.map((s) => (
          <div key={s.num} className="flex items-start gap-3">
            <span
              className="flex h-6 w-6 min-w-[24px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: accentColor }}
            >
              {s.num}
            </span>
            <div className="min-w-0">
              <p className="font-semibold leading-snug" style={{ fontSize: 15, color: "#1A1917" }}>{s.title}</p>
              <p className="leading-relaxed" style={{ fontSize: 14, color: "#9B9790" }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
