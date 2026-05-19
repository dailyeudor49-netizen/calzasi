"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  config: Record<string, string>;
}

const REASONS = [
  "Ordine in corso",
  "Spedizione e tracking",
  "Reso o rimborso",
  "Cambio taglia o modello",
  "Informazioni prodotto",
  "Pagamento alla consegna",
  "Altro",
];

const FAQ = [
  { q: "In quanto tempo ricevo il mio ordine?", a: "Spediamo con corriere espresso GLS. La consegna avviene in 2-5 giorni lavorativi in tutta Italia. Riceverai un SMS con il link di tracciamento appena il pacco viene affidato al corriere." },
  { q: "Devo pagare in anticipo?", a: "No. Con il pagamento alla consegna, paghi direttamente al corriere in contanti quando ricevi il pacco. Nessun anticipo e nessuna carta di credito richiesta." },
  { q: "Come posso effettuare un reso?", a: "Hai 30 giorni dalla ricezione per restituire il prodotto. Contattaci con il numero ordine: organizziamo il ritiro a domicilio e ti rimborsiamo l'intero importo." },
  { q: "La taglia non va bene. Cosa faccio?", a: "Scrivici con il numero ordine e una foto del prodotto. Ti spediamo la taglia corretta e ci occupiamo del ritiro di quella sbagliata, tutto senza costi aggiuntivi." },
  { q: "Posso modificare o annullare un ordine?", a: "Se l'ordine non è ancora stato spedito, sì. Contattaci il prima possibile. Dopo la spedizione puoi comunque procedere con il reso gratuito." },
  { q: "Non ho ricevuto la conferma dell'ordine.", a: "Controlla la cartella spam o posta indesiderata. Se non trovi nulla, scrivici indicando il tuo nome e ti reinviamo la conferma." },
];

const SIDEBAR_SECTIONS = [
  {
    title: "Servizio Clienti",
    links: [
      { href: "/contatti", label: "Contattaci" },
      { href: "/spedizioni", label: "Spedizioni" },
      { href: "/politica-resi", label: "Resi e Rimborsi" },
    ],
  },
  {
    title: "Termini e Condizioni",
    links: [
      { href: "/termini-e-condizioni", label: "Condizioni di Vendita" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/cookie-policy", label: "Cookie Policy" },
    ],
  },
];

export default function ContattiClient({ config }: Props) {
  const pathname = usePathname();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", order: "", reason: "", message: "", privacy: false,
  });
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const email = config.shop_email || "info@calzasi.com";

  return (
    <div>
      {/* ── Main layout: sidebar + content ── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4 lg:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] mb-4 lg:mb-6" style={{ fontFamily: "var(--font-body)" }}>
          <Link href="/" className="transition-colors hover:opacity-70" style={{ color: "var(--color-accent, #ab1a1a)", fontWeight: 500 }}>
            HOME
          </Link>
          <span style={{ color: "#ccc" }}>/</span>
          <span style={{ color: "var(--color-text, #1a1a1a)", fontWeight: 600 }}>SERVIZIO CLIENTI</span>
        </nav>
        <div className="flex gap-10 lg:gap-14">

          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden lg:block w-[240px] flex-shrink-0">
            {SIDEBAR_SECTIONS.map((section) => (
              <div key={section.title} className="mb-7">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-accent, #ab1a1a)" }}
                >
                  {section.title}
                </h3>
                <div className="flex flex-col">
                  {section.links.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="py-2 text-[13px] transition-colors hover:opacity-70"
                        style={{
                          fontFamily: "var(--font-body)",
                          color: active ? "var(--color-text, #1a1a1a)" : "var(--color-text-secondary, #666)",
                          fontWeight: active ? 600 : 400,
                          borderBottom: "1px solid var(--color-border, #E5E5E5)",
                        }}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          {/* ── Content ── */}
          <div className="flex-1 min-w-0">
            {/* Title + description */}
            <h1
              className="font-bold mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                color: "var(--color-text, #1a1a1a)",
              }}
            >
              Servizio Clienti
            </h1>
            <p
              className="mb-2 leading-relaxed"
              style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-text-secondary, #666)", lineHeight: "1.7" }}
            >
              Hai bisogno di assistenza? Consulta le domande frequenti qui sotto oppure scrivici compilando il modulo.
            </p>
            <p
              className="mb-8 leading-relaxed"
              style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-text-secondary, #666)", lineHeight: "1.7" }}
            >
              Puoi anche scriverci <strong style={{ color: "var(--color-text, #1a1a1a)" }}>via email</strong> a{" "}
              <a href={`mailto:${email}`} className="font-semibold underline underline-offset-2" style={{ color: "var(--color-accent, #ab1a1a)" }}>
                {email}
              </a>.
            </p>

            {/* ── Info cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                {
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" />
                    </svg>
                  ),
                  title: "Email",
                  desc: email,
                },
                {
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  title: "Orari",
                  desc: "Lun - Ven, 09:00 - 17:00",
                },
                {
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                  title: "Risposta",
                  desc: "Entro 24h lavorative",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border p-5 text-center"
                  style={{ borderColor: "var(--color-border, #E5E5E5)" }}
                >
                  <div className="flex justify-center mb-2" style={{ color: "var(--color-accent, #ab1a1a)" }}>
                    {card.icon}
                  </div>
                  <h3 className="text-[12px] font-bold uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}>
                    {card.title}
                  </h3>
                  <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary, #666)" }}>
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Punto vendita ── */}
            <div
              className="rounded-xl border overflow-hidden mb-10"
              style={{ borderColor: "var(--color-border, #E5E5E5)" }}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-2/5 relative aspect-[4/3]">
                  <img
                    src="/images/rimborso.webp"
                    alt="Punto vendita Calzasi"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-center">
                  <h3
                    className="font-bold mb-3"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(1rem, 2vw, 1.3rem)",
                      color: "var(--color-text, #1a1a1a)",
                    }}
                  >
                    Punto Vendita
                  </h3>
                  <div className="flex items-start gap-3 mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" style={{ color: "var(--color-accent, #ab1a1a)" }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    <p className="text-[14px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary, #666)" }}>
                      Via dei Tessitori 7, Cantù (CO)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" style={{ color: "var(--color-accent, #ab1a1a)" }}>
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    <div>
                      <p className="text-[14px] font-semibold mb-0.5" style={{ fontFamily: "var(--font-body)", color: "var(--color-text, #1a1a1a)" }}>
                        Orari di apertura
                      </p>
                      <p className="text-[13px]" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary, #666)" }}>
                        Lunedì – Sabato: 9:00 – 20:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Mobile sidebar links ── */}
            <div className="lg:hidden mb-10">
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border, #E5E5E5)" }}>
                {SIDEBAR_SECTIONS.map((section) => (
                  <div key={section.title}>
                    <div
                      className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em]"
                      style={{
                        fontFamily: "var(--font-heading)",
                        color: "var(--color-accent, #ab1a1a)",
                        backgroundColor: "var(--color-bg-alt, #F5F5F5)",
                      }}
                    >
                      {section.title}
                    </div>
                    {section.links.map((link) => {
                      const active = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center justify-between px-4 py-3 text-[13px] transition-colors"
                          style={{
                            fontFamily: "var(--font-body)",
                            color: active ? "var(--color-text, #1a1a1a)" : "var(--color-text-secondary, #666)",
                            fontWeight: active ? 600 : 400,
                            borderBottom: "1px solid var(--color-border, #E5E5E5)",
                          }}
                        >
                          {link.label}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-border, #E5E5E5)" }}>
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* ── FAQ ── */}
            <div className="mb-10">
              <h2
                className="font-bold mb-5"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1rem, 2vw, 1.3rem)", color: "var(--color-text, #1a1a1a)" }}
              >
                Domande frequenti
              </h2>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border, #E5E5E5)" }}>
                {FAQ.map((f, i) => {
                  const open = openFaq === i;
                  return (
                    <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? "1px solid var(--color-border, #E5E5E5)" : "none" }}>
                      <button
                        onClick={() => setOpenFaq(open ? null : i)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left group"
                      >
                        <span
                          className="text-[13px] font-semibold pr-6 group-hover:underline underline-offset-4"
                          style={{ fontFamily: "var(--font-body)", color: "var(--color-text, #1a1a1a)" }}
                        >
                          {f.q}
                        </span>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2.5" strokeLinecap="round"
                          className="shrink-0 transition-transform duration-200"
                          style={{ color: "var(--color-accent, #ab1a1a)", transform: open ? "rotate(45deg)" : "rotate(0)" }}
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <div
                        className="overflow-hidden transition-all duration-200"
                        style={{ maxHeight: open ? "300px" : "0", opacity: open ? 1 : 0 }}
                      >
                        <p
                          className="px-5 pb-4 text-[13px] leading-relaxed pr-12"
                          style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary, #666)", lineHeight: "1.7" }}
                        >
                          {f.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Contact Form ── */}
            <div>
              <h2
                className="font-bold mb-5"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1rem, 2vw, 1.3rem)", color: "var(--color-text, #1a1a1a)" }}
              >
                Scrivici
              </h2>

              {sent ? (
                <div className="rounded-xl border text-center py-16 px-6" style={{ borderColor: "var(--color-border, #E5E5E5)" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4" style={{ color: "var(--color-accent, #ab1a1a)" }}>
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}>
                    Messaggio inviato
                  </h3>
                  <p className="text-[13px] max-w-xs mx-auto" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary, #666)" }}>
                    Ti risponderemo all&apos;indirizzo email indicato entro 24 ore lavorative.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border p-5 sm:p-7" style={{ borderColor: "var(--color-border, #E5E5E5)" }}>
                  <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}>
                          Nome e cognome <span style={{ color: "var(--color-accent, #ab1a1a)" }}>*</span>
                        </label>
                        <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Es. Mario Rossi"
                          className="w-full h-11 px-3 text-[13px] outline-none rounded-md border transition-colors focus:border-gray-400"
                          style={{ fontFamily: "var(--font-body)", borderColor: "var(--color-border, #E5E5E5)", color: "var(--color-text, #1a1a1a)" }} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}>
                          Email <span style={{ color: "var(--color-accent, #ab1a1a)" }}>*</span>
                        </label>
                        <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="mario@email.com"
                          className="w-full h-11 px-3 text-[13px] outline-none rounded-md border transition-colors focus:border-gray-400"
                          style={{ fontFamily: "var(--font-body)", borderColor: "var(--color-border, #E5E5E5)", color: "var(--color-text, #1a1a1a)" }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}>
                          Telefono <span className="font-normal text-[10px] normal-case tracking-normal" style={{ color: "var(--color-text-secondary, #666)" }}>opzionale</span>
                        </label>
                        <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+39 333 1234567"
                          className="w-full h-11 px-3 text-[13px] outline-none rounded-md border transition-colors focus:border-gray-400"
                          style={{ fontFamily: "var(--font-body)", borderColor: "var(--color-border, #E5E5E5)", color: "var(--color-text, #1a1a1a)" }} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}>
                          N. ordine <span className="font-normal text-[10px] normal-case tracking-normal" style={{ color: "var(--color-text-secondary, #666)" }}>opzionale</span>
                        </label>
                        <input value={form.order} onChange={(e) => set("order", e.target.value)} placeholder="Es. #12345"
                          className="w-full h-11 px-3 text-[13px] outline-none rounded-md border transition-colors focus:border-gray-400"
                          style={{ fontFamily: "var(--font-body)", borderColor: "var(--color-border, #E5E5E5)", color: "var(--color-text, #1a1a1a)" }} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}>
                        Motivo <span style={{ color: "var(--color-accent, #ab1a1a)" }}>*</span>
                      </label>
                      <select required value={form.reason} onChange={(e) => set("reason", e.target.value)}
                        className="w-full h-11 px-3 text-[13px] outline-none rounded-md border appearance-none cursor-pointer transition-colors focus:border-gray-400"
                        style={{ fontFamily: "var(--font-body)", borderColor: "var(--color-border, #E5E5E5)", color: form.reason ? "var(--color-text, #1a1a1a)" : "#999", backgroundColor: "#fff" }}>
                        <option value="" disabled>Seleziona un motivo</option>
                        {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}>
                        Messaggio <span style={{ color: "var(--color-accent, #ab1a1a)" }}>*</span>
                      </label>
                      <textarea required value={form.message} onChange={(e) => set("message", e.target.value)} rows={4}
                        placeholder="Descrivi la tua richiesta..."
                        className="w-full px-3 py-2.5 text-[13px] outline-none rounded-md border resize-y transition-colors focus:border-gray-400"
                        style={{ fontFamily: "var(--font-body)", borderColor: "var(--color-border, #E5E5E5)", color: "var(--color-text, #1a1a1a)", minHeight: 110 }} />
                    </div>

                    <label className="flex gap-2.5 items-start">
                      <input type="checkbox" required checked={form.privacy} onChange={(e) => set("privacy", e.target.checked)}
                        className="mt-0.5 w-4 h-4 shrink-0" style={{ accentColor: "var(--color-accent, #ab1a1a)" }} />
                      <span className="text-[12px] leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary, #666)" }}>
                        Confermo di aver letto l&apos;<Link href="/privacy-policy" className="underline underline-offset-2">informativa sulla privacy</Link> e acconsento al trattamento dei miei dati.
                      </span>
                    </label>

                    <div>
                      <button type="submit"
                        className="w-full sm:w-auto px-10 py-3 rounded-full text-[12px] font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "var(--color-accent, #ab1a1a)", fontFamily: "var(--font-heading)" }}>
                        Invia messaggio
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
