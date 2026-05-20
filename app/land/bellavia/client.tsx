"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { motion } from "framer-motion";
import { OrderSection } from "@/components/OrderSection";
import { StickyOrderButton } from "@/components/StickyOrderButton";
import type { OrderConfig } from "@/lib/order-config";

/* ─── Typography ─── */
const F  = "'Poppins', system-ui, sans-serif";   /* body, label, UI */
const FT = "'Montserrat', system-ui, sans-serif";  /* titoli h1/h2 */

/* ─── Colors ─── */
const COLORS = [
  { name: "Panna Bordeaux", img: "/images/land/bellavia/carosello/1.webp",     swatch: "#F0E4D8", border: "#7A1F35" },
  { name: "Panna Cacao",    img: "/images/land/bellavia/carosello/2.webp",     swatch: "#F0E4D8", border: "#3D2314" },
  { name: "Greige Rosa",    img: "/images/land/bellavia/carosello/3.webp",     swatch: "#C8BAA8", border: "#8B6E78" },
  { name: "Verde Oliva",    img: "/images/land/bellavia/carosello/extra.webp", swatch: "#7A8A5A", border: "#4A5635" },
];

/* ─── Sizes ─── */
const SIZES   = ["35","36","37","38","39","40","41","42","43","44"];
const SOLDOUT = ["35","44"];

/* ─── Scarcity ─── */
const STOCK: Record<string, Record<string, number>> = {
  "Panna Bordeaux": { "36": 3, "37": 5, "38": 2, "39": 4, "40": 6, "41": 3, "42": 5, "43": 2 },
  "Panna Cacao":    { "36": 5, "37": 2, "38": 4, "39": 1, "40": 3, "41": 6, "42": 2, "43": 4 },
  "Greige Rosa":    { "36": 2, "37": 4, "38": 6, "39": 3, "40": 5, "41": 2, "42": 4, "43": 3 },
  "Verde Oliva":    { "36": 4, "37": 3, "38": 5, "39": 2, "40": 4, "41": 3, "42": 5, "43": 2 },
};

/* ─── Benefits ─── */
const BENEFITS = [
  { name: "Glutei attivi ad ogni passo", rest: "La suola curva forza i muscoli profondi a lavorare — senza palestra, senza sforzo aggiuntivo." },
  { name: "Silhouette definita in 4 settimane", rest: "20 minuti al giorno bastano. I risultati arrivano, e si vedono allo specchio." },
  { name: "Postura dritta, figura più slanciata", rest: "Il bacino si allinea, la schiena si raddrizza. Sembri più alta senza fare niente." },
  { name: "Gambe leggere, gonfiore azzerato", rest: "Arrivi a sera senza pesantezza. La circolazione lavora mentre cammini." },
  { name: "Zero palestra. Zero scuse.", rest: "Indossi una scarpa. Eppure i muscoli lavorano lo stesso — ogni singolo giorno." },
  { name: "Bruci più calorie senza accorgertene", rest: "Più muscoli attivi ad ogni passo = più calorie bruciate. Passivamente. Sempre." },
];

/* ─── Tecnologie ─── */
const TECHS = [
  { img: "/images/land/bellavia/tech/1.webp", metric: "01", tags: ["glutei attivi","cosce toniche"], title: "Scolpisce glutei e cosce ad ogni passo", body: "La suola curva crea un'instabilità guidata che richiama i muscoli profondi di glutei e cosce automaticamente — senza palestra, senza sforzo." },
  { img: "/images/land/bellavia/tech/2.webp", metric: "02", tags: ["ammortizzazione","protezione tallone"], title: "Tallone protetto ad ogni atterraggio", body: "Il sistema di cushioning al tallone assorbe gli impatti e distribuisce il carico uniformemente: meno stress sulle articolazioni, più energia ad ogni passo." },
  { img: "/images/land/bellavia/tech/3.webp", metric: "03", tags: ["tomaia traspirante","piede asciutto"], title: "Piede asciutto e fresco tutto il giorno", body: "La tomaia in mesh tecnico lascia respirare il piede, evacuando calore e umidità: niente sfregamenti, niente fastidi, anche nelle giornate più lunghe." },
  { img: "/images/land/bellavia/tech/4.webp", metric: "04", tags: ["antiscivolo","resistente all'acqua"], title: "Suola sicura: tiene sul bagnato e sul liscio", body: "I tasselli profondi e la mescola resistente garantiscono aderenza sicura su asfalto bagnato, piastrelle e superfici scivolose — in ogni stagione." },
  { img: "/images/land/bellavia/tech/5.webp", metric: "05", tags: ["suola rocker","postura corretta"], title: "Postura dritta: la suola lavora per te", body: "La base curva oscillante bilancia il bacino e raddrizza la colonna vertebrale ad ogni passo: meno tensione alla schiena, figura più slanciata." },
  { img: "/images/land/bellavia/tech/6.webp", metric: "06", tags: ["comfort prolungato","plantare morbido"], title: "Comfort al primo passo, e all'ultimo", body: "Il plantare sagomato distribuisce il peso su tutta la pianta del piede: zero punti di pressione, zero stanchezza, anche dopo ore di camminata." },
];

/* ─── Carosello hero (tutte le foto) ─── */
const HERO_GALLERY = Array.from({ length: 10 }, (_, i) => `/images/land/bellavia/carosello/${i + 1}.webp`);

/* ─── FAQ ─── */
const FAQS = [
  { q: "Quali sono i tempi e i costi di spedizione?",               a: "Consegna in 2-5 giorni dalla conferma dell'ordine. Il costo di spedizione è €4,99." },
  { q: "Come funziona il pagamento alla consegna?",                 a: "Paghi €44,99 direttamente al corriere quando ricevi il pacco. Nessun pagamento anticipato, nessuna carta di credito richiesta." },
  { q: "Cosa succede se al momento della consegna non sono in casa?", a: "Il corriere ti contatta prima di consegnare. Se non sei disponibile lascia un avviso di giacenza e riprova il giorno successivo, senza costi aggiuntivi." },
  { q: "Posso restituire il prodotto?",                             a: "Sì, hai 30 giorni dalla consegna. Il prodotto deve essere integro e nell'imballaggio originale. Scrivi a info@calzasi.com per ricevere le istruzioni di reso." },
  { q: "Come scelgo la taglia corretta?",                          a: "La calzata è regolare. Scegli la tua taglia abituale. Se sei tra due numeri o hai il piede largo, prendi la taglia superiore." },
  { q: "In quanto tempo vedrò i risultati sulla silhouette?",        a: "La maggior parte delle clienti nota i primi cambiamenti — glutei più tonici, gambe più sode — dopo 3-4 settimane camminando 20-30 minuti al giorno. L'effetto sulla silhouette diventa più evidente dopo 6-8 settimane di uso costante." },
  { q: "Davvero si scolpisce senza andare in palestra?",             a: "Sì. La suola curva crea un'instabilità controllata che richiama i muscoli profondi di glutei, cosce e addominali ad ogni passo. Non sostituisce un allenamento intenso, ma integra l'attività quotidiana trasformandola in esercizio." },
  { q: "La suola è antiscivolo anche su bagnato?",                 a: "Sì. I tasselli profondi e la mescola antiscivolo garantiscono aderenza sicura su superfici bagnate e scivolose." },
];

/* ─── Clienti loop ─── */
const CLIENTI = Array.from({ length: 10 }, (_, i) => `/images/land/bellavia/clienti/${i + 1}.webp`);

/* ─── Types ─── */
interface Review { id: number; author_name: string; rating: number; body: string; created_at: string; reply: string | null; }
interface Stats  { count: number; avg: number; }
interface Props  { orderConfig: OrderConfig; reviews: Review[]; stats: Stats; shopEmail: string; }

/* ─── Stars ─── */
function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={i <= Math.round(n) ? "#F4B860" : "#E8DFD1"}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

/* ─── BeforeAfter ─── */
function BeforeAfter() {
  const weeks = [
    { n: "Settimana 1", body: "Il corpo si adatta alla suola curva: il passo diventa più fluido e si percepisce subito il comfort in più." },
    { n: "Settimana 2", body: "La postura migliora progressivamente. Glutei e cosce iniziano ad attivarsi in modo più consapevole." },
    { n: "Settimana 3", body: "I glutei si attivano regolarmente durante ogni camminata. La silhouette inizia a definirsi." },
    { n: "Settimana 4", body: "Glutei più tonici, cosce più sode, postura più dritta. I risultati si vedono allo specchio." },
  ];
  return (
    <section className="bv-ba-section" style={{ background: "#F8FAFF", padding: "72px 20px 80px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A6E8A", fontFamily: F, marginBottom: 12 }}>
            La trasformazione Bellavia
          </p>
          <h2 style={{ fontFamily: FT, fontSize: "clamp(26px,4vw,44px)", fontWeight: 700, color: "#1B3A5C", marginBottom: 14, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            Da silhouette rilassata a silhouette modellata.
          </h2>
          <p style={{ fontSize: "clamp(15px,2vw,17px)", fontWeight: 400, color: "#4B5563", fontFamily: F, maxWidth: 560, lineHeight: 1.65, margin: "0 auto" }}>
            Cammina 20-30 minuti al giorno con Bellavia. Glutei attivi, cosce più sode, postura più alta. Risultati visibili in circa 4 settimane.
          </p>
        </div>

        {/* Grid: immagine + timeline */}
        <div className="bv-before-after-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 40, alignItems: "start" }}>

          {/* Immagine */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(27,58,92,0.15)" }}>
              <div className="bv-fade-frame" style={{ position: "relative" }}>
                <img src="/images/land/bellavia/before.webp" alt="Prima di Bellavia" className="bv-before-img" style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                <img src="/images/land/bellavia/after.webp" alt="Dopo Bellavia" className="bv-after-img" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} loading="lazy" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.72) 100%)" }} />
              </div>

              {/* Etichette PRIMA / DOPO */}
              <div style={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: F, backgroundColor: "rgba(0,0,0,0.65)", color: "#fff", borderRadius: 4, padding: "7px 12px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>PRIMA</span>
                <span style={{ fontFamily: F, backgroundColor: "#4D6E58", color: "#fff", borderRadius: 4, padding: "7px 12px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>DOPO</span>
              </div>

              {/* Caption glutei */}
              <div style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
                <div style={{ height: 5, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.25)", overflow: "hidden", marginBottom: 12 }}>
                  <div className="bv-progress-loop" style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #5A7D65, #8ABAAA)" }} />
                </div>
                <div style={{ backgroundColor: "rgba(0,0,0,0.72)", borderRadius: 8, padding: "14px 16px" }}>
                  <p style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: "#5A7D65", marginBottom: 4 }}>
                    Glutei attivi. Silhouette definita.
                  </p>
                  <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.85)", lineHeight: 1.45 }}>
                    La suola curva coinvolge glutei e cosce ad ogni passo — senza palestra, senza esercizi separati.
                  </p>
                </div>
              </div>
            </div>
            <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", fontStyle: "italic", fontFamily: F, marginTop: 12 }}>
              Risultati individuali. Variano in base a costanza d&apos;uso e stile di vita.
            </p>
          </div>

          {/* Timeline settimane */}
          <div>
            <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: "#5A6E8A", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
              Cosa succede settimana per settimana
            </p>
            <div style={{ display: "grid", gap: 12 }}>
              {weeks.map((w, i) => (
                <div key={w.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: i === 3 ? "#5A7D65" : "#E4E8EF", color: i === 3 ? "#fff" : "#4A5E7A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    {i < 3 && <div style={{ width: 2, height: 20, backgroundColor: "#E4E8EF", marginTop: 4 }} />}
                  </div>
                  <div style={{ paddingTop: 6, paddingBottom: i < 3 ? 0 : 0 }}>
                    <p style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: i === 3 ? "#4D6E58" : "#1B3A5C", marginBottom: 4 }}>{w.n}</p>
                    <p style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: "#4B5563", lineHeight: 1.55 }}>{w.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bullet risultati */}
            <ul style={{ margin: "24px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
              {[
                "Glutei e cosce più tonici dopo 4 settimane",
                "Silhouette più definita senza esercizi aggiuntivi",
                "Postura più alta, effetto snellente visibile subito",
              ].map((b) => (
                <li key={b} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: F, fontSize: 14, fontWeight: 400, color: "#1B3A5C", backgroundColor: "#F0F4F1", border: "1px solid #C4D4CA", borderLeft: "4px solid #5A7D65", borderRadius: 8, padding: "11px 14px" }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "#5A7D65", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 20 }}>
              {[
                { n: "4", t: "settimane per vedere i risultati", c: "#E4E8EF", a: "#4A5E7A" },
                { n: "+20%", t: "attivazione glutei vs scarpa piatta", c: "#E8EDEA", a: "#4D6E58" },
                { n: "0", t: "ore di palestra aggiuntive", c: "#FEF9C3", a: "#CA8A04" },
              ].map((s) => (
                <div key={s.t} style={{ borderRadius: 8, backgroundColor: s.c, padding: "14px 12px" }}>
                  <p style={{ fontFamily: F, fontSize: 26, fontWeight: 600, color: s.a, lineHeight: 1, marginBottom: 4 }}>{s.n}</p>
                  <p style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: "#374151", lineHeight: 1.3 }}>{s.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Helpers ─── */
const PER_PAGE = 5;

function formatItalianDate(iso: string): string {
  const d = new Date(iso);
  const months = ["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ─── Recensioni statiche (fallback) ─── */
const BELLAVIA_REVIEWS: Review[] = [
  { id: -1,  author_name: "Federica M.",       rating: 5, body: "Tre settimane e i glutei si sentono già più tonici. La suola curva si percepisce subito al passo. Pagamento alla consegna, zero pensieri.",                                      created_at: "2026-05-10T10:00:00Z", reply: "Grazie Federica! I risultati arrivano e si vedono. Continua così!" },
  { id: -2,  author_name: "carmela rosario",    rating: 5, body: "consegnata in 3 giorni. molto comode, ho problemi alla schiena e da quando le uso sto decisamente meglio",                                                                         created_at: "2026-05-07T14:00:00Z", reply: null },
  { id: -3,  author_name: "Valentina S.",       rating: 4, body: "Bella scarpa, comodissima per tutto il giorno. Devo ancora valutare i risultati sulla silhouette ma il comfort è già al top.",                                                     created_at: "2026-05-04T09:00:00Z", reply: "Ciao Valentina! Dai un mese e ci fai sapere. I risultati arrivano con costanza." },
  { id: -4,  author_name: "M. Gentile",         rating: 5, body: "Ne ho già preso un secondo paio. Pago sempre alla consegna, comodissimo come sistema. Le Bellavia sono diventate le mie scarpe quotidiane.",                                       created_at: "2026-04-29T11:00:00Z", reply: null },
  { id: -5,  author_name: "Giuseppina R.",      rating: 5, body: "Ho 62 anni e lavoro tutto il giorno in piedi. Con queste arrivo a sera senza gambe pesanti. Consiglio a tutte.",                                                                    created_at: "2026-04-22T08:00:00Z", reply: "Grazie di cuore Giuseppina, proprio il risultato che volevamo sentire!" },
  { id: -6,  author_name: "giada",              rating: 4, body: "carine e comode ma la taglia viene un filo larga, consiglio di prendere la stessa che usate di solito e non di più",                                                               created_at: "2026-04-17T16:00:00Z", reply: null },
  { id: -7,  author_name: "Rosa Pellegrini",    rating: 5, body: "Acquistata dopo aver visto i risultati di un'amica. Non me ne pento! Glutei e cosce si notano dopo un mese di uso quotidiano.",                                                    created_at: "2026-04-10T13:00:00Z", reply: "Grazie Rosa! Il passaparola è la nostra pubblicità migliore." },
  { id: -8,  author_name: "Lorenza T.",         rating: 5, body: "Scarpa solida, tiene bene il piede. Noto già miglioramenti alla postura dopo due settimane. E pagare alla consegna è comodissimo.",                                                created_at: "2026-03-28T10:00:00Z", reply: null },
  { id: -9,  author_name: "francesca l.",       rating: 5, body: "nn credevo funzionassero ma dopo 3 settimane i glutei si sentono davvero 💪 spedizione super veloce",                                                                              created_at: "2026-03-15T17:00:00Z", reply: "Grazie francesca, ci rende felici sentirlo!" },
  { id: -10, author_name: "Antonella D.",       rating: 5, body: "La suola è completamente diversa da qualsiasi scarpa abbia mai indossato. Il passo è fluido, i muscoli lavorano. Tornerò ad ordinare senza dubbio.",                              created_at: "2026-02-28T12:00:00Z", reply: null },
];

/* ─── ReviewsSection ─── */
function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const allReviews = reviews.length > 0 ? reviews : BELLAVIA_REVIEWS;
  const [page, setPage] = useState(0);
  const [fading, setFading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [rvName, setRvName] = useState("");
  const [rvRating, setRvRating] = useState(0);
  const [rvBody, setRvBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(allReviews.length / PER_PAGE);
  const visible = allReviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const goTo = (p: number) => {
    if (p === page) return;
    setFading(true);
    setTimeout(() => {
      setPage(p);
      setFading(false);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rvName || !rvRating || !rvBody) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "bellavia", authorName: rvName, rating: rvRating, body: rvBody }),
      });
    } catch {}
    setSubmitting(false);
    setFormSubmitted(true);
  };

  const rv = {
    text: "#1A1917",
    textSec: "#5A5752",
    textMuted: "#9B9790",
    border: "#E2E4E8",
    muted: "#FAFAF8",
    surface: "#FFFFFF",
    trust: "#2A7A50",
    trustLight: "#E6F4EC",
    brand: "#1B3A5C",
    brandSubtle: "#E8EEF5",
    brandDark: "#0F2340",
    cta: "#C9813A",
  };

  return (
    <div ref={sectionRef}>

        {/* Review list */}
        <div style={{ border: `1px solid ${rv.border}`, borderRadius: 12, overflow: "hidden", backgroundColor: rv.surface, opacity: fading ? 0 : 1, transition: "opacity 0.2s" }}>
          {visible.length > 0 ? visible.map((r, i) => (
            <div key={r.id} style={{ padding: "20px 24px", borderBottom: i < visible.length - 1 ? `1px solid ${rv.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: rv.brandSubtle, color: rv.brandDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: F, flexShrink: 0 }}>
                  {r.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: rv.text }}>{r.author_name}</span>
                  <span style={{ fontFamily: F, fontSize: 12, color: rv.textMuted, marginLeft: 8 }}>{formatItalianDate(r.created_at)}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Stars n={r.rating} size={15} />
                <span style={{ backgroundColor: rv.trustLight, color: rv.trust, borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 700, fontFamily: F }}>
                  Acquisto verificato
                </span>
              </div>
              <p style={{ fontFamily: F, fontSize: 15, color: rv.textSec, lineHeight: 1.65, margin: 0 }}>{r.body}</p>
              {r.reply && (
                <div style={{ marginTop: 12, borderRadius: 8, padding: "12px 16px", backgroundColor: rv.muted, borderLeft: `3px solid ${rv.brand}` }}>
                  <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: rv.text, marginBottom: 4 }}>Risposta di Calzasi</p>
                  <p style={{ fontFamily: F, fontSize: 14, color: rv.textSec, lineHeight: 1.6, margin: 0 }}>{r.reply}</p>
                </div>
              )}
            </div>
          )) : (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontFamily: F, fontSize: 15, color: rv.textMuted }}>Nessuna recensione ancora. Sii la prima!</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => goTo(page - 1)} disabled={page === 0}
                style={{ width: 32, height: 32, border: `1px solid ${rv.border}`, borderRadius: 8, backgroundColor: rv.surface, color: rv.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 0 ? "default" : "pointer", opacity: page === 0 ? 0.25 : 1 }}
                aria-label="Precedente">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {(() => {
                const maxVis = 5;
                let start = 0; let end = totalPages;
                if (totalPages > maxVis) {
                  start = Math.max(0, page - Math.floor(maxVis / 2));
                  end = start + maxVis;
                  if (end > totalPages) { end = totalPages; start = end - maxVis; }
                }
                return Array.from({ length: end - start }, (_, idx) => {
                  const pi = start + idx;
                  return (
                    <button key={pi} onClick={() => goTo(pi)}
                      style={pi === page
                        ? { width: 32, height: 32, backgroundColor: rv.text, color: "#fff", border: "none", borderRadius: 8, fontFamily: F, fontSize: 14, fontWeight: 700, cursor: "pointer" }
                        : { width: 32, height: 32, backgroundColor: rv.surface, color: rv.textMuted, border: `1px solid ${rv.border}`, borderRadius: 8, fontFamily: F, fontSize: 14, cursor: "pointer" }}>
                      {pi + 1}
                    </button>
                  );
                });
              })()}
              <button onClick={() => goTo(page + 1)} disabled={page === totalPages - 1}
                style={{ width: 32, height: 32, border: `1px solid ${rv.border}`, borderRadius: 8, backgroundColor: rv.surface, color: rv.textMuted, display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages - 1 ? "default" : "pointer", opacity: page === totalPages - 1 ? 0.25 : 1 }}
                aria-label="Successiva">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            {page < totalPages - 1 && (
              <button onClick={() => goTo(page + 1)} style={{ fontFamily: F, fontSize: 14, color: rv.textSec, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                Mostra altre recensioni
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </button>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: rv.border, margin: "24px 0" }} />

        {/* Form */}
        <div>
          {!showForm && !formSubmitted && (
            <button onClick={() => setShowForm(true)}
              style={{ width: "100%", padding: "12px 16px", backgroundColor: rv.surface, color: rv.text, border: `1px solid ${rv.border}`, borderRadius: 10, fontFamily: F, fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={rv.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Scrivi una recensione
            </button>
          )}
          {showForm && !formSubmitted && (
            <>
              <h3 style={{ fontFamily: FT, fontSize: 18, fontWeight: 700, color: rv.text, marginBottom: 20 }}>Scrivi una recensione</h3>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: rv.textMuted, marginBottom: 6 }}>
                    Nome *
                  </label>
                  <input type="text" value={rvName} onChange={e => setRvName(e.target.value)} placeholder="Il tuo nome" required
                    style={{ width: "100%", border: `1px solid ${rv.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, fontFamily: F, color: rv.text, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: rv.textMuted, marginBottom: 6 }}>
                    Valutazione *
                  </label>
                  <div style={{ display: "flex", flexDirection: "row-reverse", justifyContent: "flex-end", gap: 4 }}>
                    {[5,4,3,2,1].map((v) => (
                      <label key={v} style={{ cursor: "pointer", fontSize: 30, lineHeight: 1, color: rvRating >= v ? "#F4B860" : "#D1C9BB" }}>
                        <input type="radio" name="bv-rating" value={v} required onChange={() => setRvRating(v)} style={{ display: "none" }} />
                        &#9733;
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: rv.textMuted, marginBottom: 6 }}>
                    Recensione *
                  </label>
                  <textarea value={rvBody} onChange={e => setRvBody(e.target.value)} placeholder="Raccontaci la tua esperienza con le Bellavia..." required
                    style={{ width: "100%", border: `1px solid ${rv.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, fontFamily: F, color: rv.text, outline: "none", minHeight: 90, resize: "vertical", boxSizing: "border-box" }} />
                </div>
                <button type="submit" disabled={submitting}
                  style={{ alignSelf: "flex-start", backgroundColor: rv.brand, color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontFamily: F, fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Invio..." : "Invia recensione"}
                </button>
              </form>
            </>
          )}
          {formSubmitted && (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <p style={{ fontFamily: F, fontSize: 15, color: rv.textSec, lineHeight: 1.7 }}>
                <strong style={{ color: rv.trust }}>Grazie per la tua recensione!</strong><br />
                Sarà pubblicata dopo la verifica.
              </p>
            </div>
          )}
        </div>
    </div>
  );
}

/* ─── Main Page ─── */
export function BellaviaPage({ orderConfig, reviews, stats, shopEmail }: Props) {
  const [selColor, setSelColor]       = useState("Panna Bordeaux");
  const [selPhoto, setSelPhoto]       = useState<string | null>(null);
  const [selSize,  setSelSize]        = useState("");
  const [pulseSize, setPulseSize]     = useState(false);
  const [faqOpen,  setFaqOpen]        = useState<number>(0);

  const [activeStep, setActiveStep]   = useState(0);
  const sizeRef                       = useRef<HTMLDivElement>(null);

  const colorImg       = COLORS.find((c) => c.name === selColor)?.img || COLORS[0].img;
  const heroImg        = selPhoto ?? colorImg;
  const currentPhotoIdx = selPhoto ? HERO_GALLERY.indexOf(selPhoto) : HERO_GALLERY.indexOf(colorImg);
  const goNext = () => setSelPhoto(HERO_GALLERY[(currentPhotoIdx + 1) % HERO_GALLERY.length]);
  const goPrev = () => setSelPhoto(HERO_GALLERY[(currentPhotoIdx - 1 + HERO_GALLERY.length) % HERO_GALLERY.length]);

  /* Notify StickyOrderButton when hero selection changes */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("hero-variant", { detail: { color: selColor, size: selSize } }));
  }, [selColor, selSize]);

  /* Step animation — cicla 0→1→2 */
  useEffect(() => {
    const iv = setInterval(() => setActiveStep((p) => (p + 1) % 3), 1400);
    return () => clearInterval(iv);
  }, []);

  const handleCTA = () => {
    if (!selSize) {
      setPulseSize(true);
      setTimeout(() => setPulseSize(false), 2400);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    window.dispatchEvent(new CustomEvent("sticky-order", { detail: { size: selSize, color: selColor } }));
  };


  return (
    <div style={{ overflowX: "hidden", fontFamily: F }}>

      {/* CSS vars + animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Poppins:wght@400;600&display=swap');`}
      </style>
      <style>{`
        .bv-size-pulse { animation: bvPulse 0.6s ease 4; }
        @keyframes bvPulse { 0%,100%{box-shadow:none}50%{box-shadow:0 0 0 4px rgba(201,129,58,0.45)} }
        @keyframes bvTopBar { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes bvClienti { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes bvFadeAfter { 0%,38%{opacity:0} 50%,88%{opacity:1} 100%{opacity:0} }
        @keyframes bvProgress { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        .bv-after-img { opacity:0; animation:bvFadeAfter 5.4s ease-in-out infinite; }
        .bv-before-img { filter:saturate(0.82) contrast(0.95); }
        .bv-progress-loop { width:100%; transform:translateX(-100%); animation:bvProgress 5.4s linear infinite; }
        .bv-tech-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .bv-tech-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(55,38,20,0.16); border-color: rgba(201,129,58,0.45) !important; }
        .bv-proof-grid { grid-template-columns: 1.05fr 0.95fr; }
        .bv-final-grid { grid-template-columns: 0.95fr 1.05fr; }
        .bv-fineprint-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        @media (max-width: 860px) {
          .bv-before-after-grid { grid-template-columns: 1fr !important; }
          .bv-tech-grid { grid-template-columns: 1fr !important; }
          .bv-tech-card-featured { grid-column: auto !important; }
          .bv-tech-card { grid-column: auto !important; }
          .bv-proof-grid, .bv-final-grid, .bv-fineprint-grid { grid-template-columns: 1fr !important; }
          .bv-mobile-stack { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .bv-hero-info h1 { font-size: 28px !important; margin-bottom: 12px !important; }
          .bv-hero-info p { font-size: 15px !important; }
          .bv-hero-section { padding: 18px 16px 40px !important; }
          .bv-hero-grid { gap: 20px !important; }
          .bv-size-grid { grid-template-columns: repeat(5, 1fr) !important; gap: 6px !important; }
          .bv-size-btn { height: 48px !important; font-size: 14px !important; }
          .bv-step-grid { grid-template-columns: 1fr !important; }
          .bv-topbar { font-size: 12px !important; gap: 32px !important; }
          .bv-price-big { font-size: 44px !important; }
          .bv-stats-grid { grid-template-columns: 1fr !important; }
          .bv-tech-section { padding: 48px 16px !important; }
          .bv-ba-section { padding: 48px 16px !important; }
          .bv-cod-section { padding: 48px 16px !important; }
          .bv-final-section { padding: 48px 16px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .bv-after-img, .bv-progress-loop, .bv-tech-card { animation: none !important; transition: none !important; }
          .bv-after-img { opacity: 0.72; }
        }
      `}</style>

      {/* JSON-LD */}
      <Script id="bellavia-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Bellavia - Scarpe ortopediche con suola attiva",
        "brand": { "@type": "Brand", "name": "Calzasi" },
        "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "44.99", "priceValidUntil": "2026-12-31", "availability": "https://schema.org/InStock" },
        ...(stats.count > 0 ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": String(stats.avg), "reviewCount": String(stats.count), "bestRating": "5", "worstRating": "1" } } : {}),
      }) }} />

      {/* ── 1. TopBar ── */}
      <div style={{ backgroundColor: "#1A3D28", color: "#A8D8B8", padding: "9px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-flex", gap: 56, animation: "bvTopBar 28s linear infinite", willChange: "transform" }}>
          {[...Array(3)].flatMap(() =>
            ["Pagamento alla consegna", "Spedizione 2-5 giorni", "Reso 30 giorni", "Assistenza italiana"].map((t) => (
              <span key={`${Math.random()}-${t}`} style={{ fontFamily: F, fontSize: 13, fontWeight: 600, letterSpacing: "0.03em" }}>
                {t}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── 2. Header ── */}
      <header style={{ borderBottom: "1px solid #E9DED0", padding: "14px 20px", backgroundColor: "rgba(254,254,254,0.96)", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 10px 30px rgba(46,31,20,0.06)", backdropFilter: "blur(14px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <Image src="/images/shop/logo.webp" alt="Calzasi" width={160} height={54} style={{ height: 48, width: "auto", objectFit: "contain" }} />
          </Link>
          <button onClick={handleCTA} style={{ fontFamily: F, fontSize: 14, fontWeight: 600, background: "linear-gradient(180deg, #FFB347 0%, #FF9900 100%)", color: "#111", padding: "11px 24px", borderRadius: 8, border: "1px solid #E68A00", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(255,153,0,0.35)" }}>
            Ordina ora
          </button>
        </div>
      </header>

      {/* ── 3. HERO ── */}
      <section className="bv-hero-section" style={{ background: "#FFFFFF", padding: "28px 20px 62px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="bv-hero-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px 56px", alignItems: "start" }}>

            {/* Sticky gallery */}
            <div style={{ position: "sticky", top: 76 }}>
              {/* Main image */}
              <div style={{ borderRadius: 6, overflow: "hidden", backgroundColor: "#F5F0EA", boxShadow: "0 26px 70px rgba(52,35,21,0.14)", position: "relative" }}>
                <img src={heroImg} alt={`Bellavia - ${selColor}`} style={{ width: "100%", height: "auto", display: "block" }} fetchPriority="high" />
                <span style={{ position: "absolute", top: 14, left: 14, backgroundColor: "#7A5535", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "6px 12px", borderRadius: 4 }}>-70%</span>
                {/* Frecce navigazione */}
                <button onClick={goPrev} aria-label="Foto precedente" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", backgroundColor: "rgba(255,252,247,0.88)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", backdropFilter: "blur(4px)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button onClick={goNext} aria-label="Foto successiva" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", backgroundColor: "rgba(255,252,247,0.88)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", backdropFilter: "blur(4px)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>

              {/* Carosello thumbnail strip */}
              <div style={{ overflowX: "auto", display: "flex", gap: 8, marginTop: 10, paddingBottom: 4, scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                {HERO_GALLERY.map((src, i) => {
                  const active = heroImg === src;
                  return (
                    <div key={src} role="button" tabIndex={0} aria-label={`Foto ${i + 1}`}
                      onClick={() => setSelPhoto(src)}
                      onKeyDown={(e) => e.key === "Enter" && setSelPhoto(src)}
                      style={{ flexShrink: 0, width: 68, borderRadius: 6, border: active ? "2px solid #1B3A5C" : "1px solid #E3D8CA", overflow: "hidden", backgroundColor: "#F5F0EA", cursor: "pointer", touchAction: "manipulation", opacity: active ? 1 : 0.72, transition: "opacity 0.2s, border 0.2s" }}>
                      <img src={src} alt={`Bellavia foto ${i + 1}`} style={{ width: "100%", height: "auto", display: "block", pointerEvents: "none" }} loading="lazy" />
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Info column */}
            <div className="bv-hero-info">
              {/* Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                <span style={{ backgroundColor: "#A02828", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: F, padding: "7px 12px", borderRadius: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>Promo attiva oggi</span>
                <span style={{ backgroundColor: "#1E6840", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: F, padding: "7px 12px", borderRadius: 4, letterSpacing: "0.04em" }}>Pagamento alla consegna</span>
              </div>

              {/* H1 */}
              <h1 style={{ fontFamily: FT, fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 700, lineHeight: 1.1, color: "#17120E", marginBottom: 18, letterSpacing: "-0.01em" }}>
                <span style={{ color: "#A9692D" }}>Bellavia.</span>{" "}Cammini, attivi i glutei, vedi la differenza.
              </h1>

              {/* Subheadline */}
              <p style={{ fontFamily: F, fontSize: "clamp(16px,2vw,18px)", fontWeight: 400, color: "#554B43", lineHeight: 1.65, marginBottom: 20, maxWidth: 620 }}>
                Cammini, attivi i glutei ad ogni passo, scolpisci la silhouette. Risultati visibili in circa 4 settimane — senza palestra, senza esercizi separati.
              </p>

              {/* Rating */}
              {stats.count > 0 && (
                <a href="#recensioni" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 20 }}>
                  <Stars n={5} size={18} />
                  <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: "#1E1B18" }}>{stats.avg}/5</span>
                  <span style={{ fontFamily: F, fontSize: 15, color: "#6B655E", textDecoration: "underline", textUnderlineOffset: 2 }}>{stats.count} recensioni</span>
                </a>
              )}

              <div style={{ height: 1, backgroundColor: "#DDD0BF", margin: "4px 0 22px" }} />

              {/* Price */}
              <div style={{ marginBottom: 6, display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: F, fontSize: 18, fontWeight: 600, color: "#6A4A46", textDecoration: "line-through" }}>€149,99</span>
                <div style={{ position: "relative", display: "inline-flex", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: F, fontSize: "clamp(42px,6vw,60px)", fontWeight: 700, color: "#1E7A48", lineHeight: 1, letterSpacing: "-0.045em" }}>€44,99</span>
                  <span style={{ position: "absolute", top: -4, right: -54, backgroundColor: "#7A5535", color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: F, padding: "4px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>-70%</span>
                </div>
              </div>
              <p style={{ fontFamily: F, fontSize: 14, color: "#6B655E", marginBottom: 14 }}>+ €4,99 spedizione · Paghi tutto alla consegna</p>

              <div style={{ height: 1, backgroundColor: "#DDD0BF", margin: "4px 0 24px" }} />

              {/* Benefits */}
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "#1E7A48", marginBottom: 10 }}>
                Perché funziona davvero
              </p>
              <ul style={{ margin: "0 0 28px", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                {BENEFITS.map((b) => (
                  <li key={b.name} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontFamily: F, fontSize: 15, backgroundColor: "#fff", borderRadius: 10, border: "1px solid #E5E7EB", borderLeft: "4px solid #2A7A50", padding: "13px 16px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: "#2A7A50", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1.5 4.5L5 8L10.5 1.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span style={{ lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 600, color: "#17120E" }}>{b.name}</span>
                      <span style={{ fontWeight: 400, color: "#6B655E" }}> — {b.rest}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div style={{ height: 1, backgroundColor: "#DDD0BF", margin: "0 0 24px" }} />

              {/* Color selector */}
              <div style={{ marginBottom: 22 }}>
                <p style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "#6B655E", marginBottom: 12 }}>
                  Colore: <strong style={{ color: "#1E1B18", fontWeight: 700 }}>{selColor}</strong>
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  {COLORS.map((c) => {
                    const sel = selColor === c.name;
                    return (
                      <button key={c.name} onClick={() => setSelColor(c.name)} aria-label={`Colore ${c.name}`}
                        style={{ flex: 1, borderRadius: 8, border: sel ? `2px solid ${c.border}` : "1.5px solid #E2D4C3", overflow: "hidden", padding: 0, backgroundColor: "#F5F0EA", cursor: "pointer", boxShadow: sel ? "0 6px 18px rgba(33,25,20,0.14)" : "none", transition: "border 0.18s, box-shadow 0.18s" }}>
                        <img src={c.img} alt={c.name} style={{ width: "100%", height: "auto", display: "block", pointerEvents: "none" }} loading="lazy" />
                        <div style={{ padding: "7px 6px", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: sel ? "#1E1B18" : "#fff" }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c.swatch, border: `1.5px solid ${c.border}`, flexShrink: 0 }} />
                          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: sel ? "#fff" : "#1E1B18", lineHeight: 1.2 }}>{c.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size grid */}
              <div ref={sizeRef} style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "#6B655E", marginBottom: 12 }}>
                  Taglia: <strong style={{ color: "#1E1B18", fontWeight: 700 }}>{selSize || "non selezionata"}</strong>
                </p>
                <div className={`bv-size-grid${pulseSize ? " bv-size-pulse" : ""}`} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, borderRadius: 10, padding: 2 }}>
                  {SIZES.map((s) => {
                    const so  = SOLDOUT.includes(s);
                    const sel = selSize === s;
                    return (
                      <button key={s} onClick={() => !so && setSelSize(s)} disabled={so}
                        style={{ height: 56, borderRadius: 6, fontSize: "clamp(16px,2vw,18px)", fontWeight: 700, fontFamily: F, border: sel ? "2px solid #4A5E7A" : "1px solid #D1D5DB", backgroundColor: sel ? "#5A6E8A" : "#fff", color: sel ? "#fff" : so ? "#C9B89C" : "#1B3A5C", opacity: so ? 0.38 : 1, position: "relative", overflow: "hidden", cursor: so ? "not-allowed" : "pointer", transition: "background 0.15s, border 0.15s, color 0.15s" }}>
                        {s}
                        {so && <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#888", backgroundColor: "rgba(200,190,180,0.35)" }}>esaurita</span>}
                      </button>
                    );
                  })}
                </div>
                <p style={{ marginTop: 10, fontFamily: F, fontSize: 14, fontStyle: "italic", color: "#6B655E", lineHeight: 1.55 }}>
                  Calzata regolare. Scegli la tua taglia abituale. Se sei tra due numeri, scegli il numero superiore.
                </p>

                {/* Scarcity dinamica */}
                {(() => {
                  const visible = !!selSize && !SOLDOUT.includes(selSize);
                  const qty     = STOCK[selColor]?.[selSize] ?? 5;
                  const color   = qty <= 2 ? "#8E2D23" : qty <= 4 ? "#8B4A13" : "#2B4C3A";
                  const bg      = qty <= 2 ? "#FFF2EE" : qty <= 4 ? "#FFF4E2" : "#F1F4EC";
                  const brd     = qty <= 2 ? "#E8B9AE" : qty <= 4 ? "#EBCB8E" : "#CBD9C3";
                  return (
                    <div style={{ overflow: "hidden", maxHeight: visible ? 80 : 0, marginTop: visible ? 14 : 0, transition: "max-height 0.3s ease, margin-top 0.3s ease" }}>
                      <div style={{ borderRadius: 10, border: `1.5px solid ${brd}`, backgroundColor: bg, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: F, fontSize: "clamp(13px,1.8vw,14px)", fontWeight: 700, color }}>
                          Solo {qty} {qty === 1 ? "paio rimasto" : "paia rimaste"} per {selColor}, taglia {selSize || ""}
                        </span>
                        <span style={{ fontFamily: F, fontSize: 13, color: "#6B655E" }}>
                          Disponibilità aggiornata da poco
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div style={{ height: 1, backgroundColor: "#E8DFD1", margin: "4px 0 24px" }} />

              {/* CTA */}
              <button onClick={handleCTA}
                style={{ width: "100%", height: 70, borderRadius: 8, background: "linear-gradient(180deg, #FFB347 0%, #FF9900 100%)", color: "#111", fontSize: "clamp(16px,2.5vw,18px)", fontWeight: 600, letterSpacing: "0.02em", fontFamily: F, border: "1px solid #E68A00", boxShadow: "0 4px 12px rgba(255,153,0,0.40)", cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textTransform: "uppercase" }}>
                ORDINA ORA → PAGHI ALLA CONSEGNA
              </button>

              {/* Microcopy */}
              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 8 }}>
                {["Spedizione €4,99", "Paghi al corriere", "Reso 30 giorni"].map((t) => (
                  <span key={t} style={{ fontFamily: F, fontSize: "clamp(13px,1.8vw,14px)", fontWeight: 500, color: "#6B7280" }}>{t}</span>
                ))}
              </div>
              <p style={{ textAlign: "center", fontFamily: F, fontSize: 13, color: "#6B655E", marginBottom: 20 }}>
                Nessun pagamento anticipato — paghi solo al momento della consegna.
              </p>

              {/* OrderSection source for the hidden modal trigger */}
              <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
                <OrderSection config={orderConfig} image={heroImg} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Come ordinare (3 step compact) ── */}
      <section style={{ background: "#ECEEF2", padding: "32px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <span style={{ display: "inline-block", fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A96A8", marginBottom: 6 }}>
              Ordine protetto
            </span>
            <p style={{ fontFamily: FT, fontSize: "clamp(18px,2.8vw,24px)", fontWeight: 700, color: "#1B3A5C", margin: 0, lineHeight: 1.2 }}>
              Prenoti ora, paghi solo quando arriva
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 520, margin: "0 auto" }}>
            {[
              { n: "1", title: "Scegli taglia e colore", sub: "Seleziona la variante preferita dal modulo" },
              { n: "2", title: "Ti richiamiamo per confermare", sub: "Un operatore verifica il tuo ordine entro poche ore" },
              { n: "3", title: "Paghi al corriere all'arrivo", sub: "Nessuna carta, nessun anticipo — paghi solo quando ricevi" },
            ].map((s, i) => {
              const lit = activeStep === i;
              return (
                <div key={s.n} style={{ borderRadius: 10, backgroundColor: lit ? "#1B3A5C" : "#fff", border: lit ? "none" : "1px solid #C4CDD8", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: lit ? "0 8px 24px rgba(27,58,92,0.18)" : "0 2px 8px rgba(27,58,92,0.05)", transition: "background 0.35s, box-shadow 0.35s" }}>
                  <span style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: lit ? "#C9813A" : "#DDE2E8", color: lit ? "#fff" : "#7A8898", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F, fontSize: 14, fontWeight: 700, flexShrink: 0, transition: "background 0.35s, color 0.35s" }}>{s.n}</span>
                  <div>
                    <div style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: lit ? "#fff" : "#1B3A5C", lineHeight: 1.2, transition: "color 0.35s" }}>{s.title}</div>
                    <div style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: lit ? "rgba(255,255,255,0.72)" : "#6B655E", marginTop: 3, transition: "color 0.35s" }}>{s.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. 6 Tecnologie ── */}
      <section id="tecnologie" style={{ backgroundColor: "#FFFCF7", padding: "78px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 38 }}>
            <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A6E8A", marginBottom: 12 }}>
              come funziona
            </p>
            <h2 style={{ fontFamily: FT, fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: "#1B3A5C", marginBottom: 14, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              Non è una scarpa qualunque. È costruita per scolpire mentre la indossi.
            </h2>
            <p style={{ fontFamily: F, fontSize: "clamp(15px,2vw,18px)", fontWeight: 400, color: "#4B5563", lineHeight: 1.65 }}>
              Ogni dettaglio ha uno scopo preciso: attivare i glutei, modellare la silhouette, bruciare più calorie e migliorare la postura — tutto camminando.
            </p>
          </div>

          <div className="bv-tech-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 16 }}>
            {TECHS.map((t, i) => (
              <motion.div key={t.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}
                className={i < 2 ? "bv-tech-card bv-tech-card-featured" : "bv-tech-card"}
                style={{ gridColumn: i < 2 ? "span 3" : "span 2", borderRadius: 8, border: "1px solid #E4E8EF", background: i === 0 ? "#ECEEF2" : i === 1 ? "#F0F4F1" : "#fff", overflow: "hidden", boxShadow: "0 8px 24px rgba(27,58,92,0.07)" }}>
                <div style={{ position: "relative", backgroundColor: "#E8ECEF" }}>
                  <img src={t.img} alt={t.title} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.28) 100%)" }} />
                  <span style={{ position: "absolute", left: 16, bottom: 14, fontFamily: F, fontSize: 34, fontWeight: 600, color: "rgba(255,255,255,0.96)", letterSpacing: "-0.04em", lineHeight: 1 }}>{t.metric}</span>
                </div>
                <div style={{ padding: i < 2 ? 26 : 22 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {t.tags.map((tag) => (
                      <span key={tag} style={{ backgroundColor: i === 0 ? "#E4E8EF" : i === 1 ? "#E8EDEA" : "#F3F4F6", color: i === 0 ? "#4A5E7A" : i === 1 ? "#4D6E58" : "#374151", fontSize: 12, fontWeight: 700, fontFamily: F, padding: "5px 10px", borderRadius: 4 }}>{tag}</span>
                    ))}
                  </div>
                  <h3 style={{ fontFamily: F, fontSize: i < 2 ? "clamp(20px,2.8vw,26px)" : 19, fontWeight: 700, color: "#1B3A5C", marginBottom: 10, lineHeight: 1.2 }}>{t.title}</h3>
                  <p style={{ fontFamily: F, fontSize: i < 2 ? 16 : 14, fontWeight: 400, color: "#4B5563", lineHeight: 1.6 }}>{t.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Prima/Dopo ── */}
      <BeforeAfter />

      {/* ── 7. COD block ── */}
      <section style={{ backgroundColor: "#ECEEF2", padding: "68px 20px" }}>
        <div className="bv-proof-grid" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 22, alignItems: "stretch" }}>
          <div style={{ backgroundColor: "#1B3A5C", color: "#fff", borderRadius: 8, padding: "34px clamp(24px,4vw,44px)", minHeight: 380, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 24px 70px rgba(27,58,92,0.28)" }}>
            <div>
              <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#8AA8C8", marginBottom: 18 }}>Acquisto protetto</p>
              <h2 style={{ fontFamily: FT, fontSize: "clamp(26px,4vw,44px)", fontWeight: 700, color: "#fff", marginBottom: 18, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
                Inizia a scolpire oggi. Paghi solo quando arriva.
              </h2>
              <p style={{ fontFamily: F, fontSize: "clamp(15px,2vw,18px)", fontWeight: 400, color: "rgba(255,255,255,0.80)", lineHeight: 1.65, maxWidth: 520 }}>
                Ordina Bellavia adesso e inizia il tuo percorso di tonificazione. Noi ti contattiamo per confermare — paghi solo al corriere quando tieni il pacco in mano.
              </p>
            </div>
            <div>
              <button onClick={handleCTA} style={{ marginTop: 30, width: "100%", minHeight: 64, fontFamily: F, fontSize: "clamp(16px,2.4vw,18px)", fontWeight: 700, backgroundColor: "#5A7D65", color: "#fff", padding: "18px 28px", borderRadius: 6, border: "none", cursor: "pointer", boxShadow: "0 12px 30px rgba(34,197,94,0.35)", letterSpacing: "0.02em" }}>
                Ordina ora, paga alla consegna
              </button>
              {/* Blocco negozio */}
              <div style={{ marginTop: 16, borderRadius: 6, backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ position: "relative", width: 80, height: 80, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                  <Image src="/images/shop/store-counter.webp" alt="Calzasi" fill style={{ objectFit: "cover" }} sizes="80px" />
                </div>
                <div>
                  <Image src="/images/shop/logo.webp" alt="Calzasi" width={70} height={24} style={{ height: 18, width: "auto", objectFit: "contain", opacity: 0.9, marginBottom: 4, filter: "brightness(0) invert(1)" }} />
                  <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.72)", lineHeight: 1.4, fontStyle: "italic" }}>
                    &ldquo;Bellavia è pensata per chi vuole sentirsi più stabile e leggera ogni giorno.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bv-fineprint-grid" style={{ display: "grid", gap: 12 }}>
            {[
              { n: "01", title: "Conferma prima della spedizione", sub: "Ti chiamiamo o scriviamo prima che il pacco parta.", color: "#E4E8EF", accent: "#4A5E7A" },
              { n: "02", title: "Pagamento solo alla consegna", sub: "Non inserisci carte e non versi anticipi online.", color: "#E8EDEA", accent: "#4D6E58" },
              { n: "03", title: "Reso entro 30 giorni", sub: "Hai tempo per provarle con calma a casa.", color: "#FEF9C3", accent: "#CA8A04" },
            ].map((b) => (
              <div key={b.n} style={{ borderRadius: 8, backgroundColor: "#fff", border: `1px solid ${b.color}`, padding: "24px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 118, boxShadow: "0 8px 24px rgba(27,58,92,0.08)" }}>
                <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: b.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>{b.n}</p>
                <h3 style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: "#1B3A5C", lineHeight: 1.2, marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: "#4B5563", lineHeight: 1.5 }}>{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Foto clienti loop ── */}
      <section style={{ backgroundColor: "#F2EDE4", padding: "56px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingInline: 20, marginBottom: 40 }}>
          <p style={{ textAlign: "center", fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B4D2F", fontFamily: F, marginBottom: 16 }}>LE NOSTRE CLIENTI</p>
          <h2 style={{ textAlign: "center", fontFamily: FT, fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, color: "#1B3A5C", marginBottom: 10, lineHeight: 1.15 }}>
            Le storie di chi indossa Bellavia ogni giorno
          </h2>
          <p style={{ textAlign: "center", fontSize: 17, color: "#6B655E", fontFamily: F }}>Donne reali, città reali, momenti veri.</p>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 16, paddingInline: 20, width: "max-content", animation: `bvClienti ${CLIENTI.length * 5}s linear infinite`, willChange: "transform", alignItems: "center" }}>
            {[...CLIENTI, ...CLIENTI].map((src, i) => (
              <img key={i} src={src} alt={`Storia cliente ${(i % CLIENTI.length) + 1}`} style={{ height: "clamp(480px,70vw,720px)", width: "auto", borderRadius: 12, flexShrink: 0, display: "block" }} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Recensioni ── */}
      <section id="recensioni" style={{ backgroundColor: "#F2EDE4", padding: "56px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B655E", fontFamily: F, marginBottom: 16 }}>
            OLTRE {Math.max(stats.count, 500)} CLIENTI SODDISFATTE
          </p>
          <h2 style={{ textAlign: "center", fontFamily: FT, fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, color: "#1B3A5C", marginBottom: 16, lineHeight: 1.15 }}>
            Cosa dicono le clienti che le indossano
          </h2>
          {stats.count > 0 && (
            <div style={{ textAlign: "center", marginBottom: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Stars n={5} />
              <span style={{ fontFamily: F, fontSize: 19, fontWeight: 600, color: "#1E1B18" }}>{stats.avg}/5</span>
              <span style={{ fontFamily: F, fontSize: 16, color: "#6B655E" }}>{stats.count} recensioni verificate</span>
            </div>
          )}

          <ReviewsSection reviews={reviews} />
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section id="faq" style={{ backgroundColor: "#fff", padding: "56px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B655E", fontFamily: F, marginBottom: 16 }}>DOMANDE FREQUENTI</p>
          <h2 style={{ textAlign: "center", fontFamily: FT, fontSize: "clamp(24px,4vw,38px)", fontWeight: 700, color: "#1B3A5C", marginBottom: 48, lineHeight: 1.15 }}>
            Le risposte che ci chiedono ogni giorno
          </h2>
          {FAQS.map((f, i) => (
            <div key={f.q} style={{ borderBottom: "1px solid #E8DFD1" }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} aria-expanded={faqOpen === i}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 0", background: "none", border: "none", textAlign: "left", cursor: "pointer", gap: 16 }}>
                <span style={{ fontFamily: F, fontSize: 17, fontWeight: 600, color: "#1E1B18", lineHeight: 1.4 }}>{f.q}</span>
                <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: "50%", backgroundColor: faqOpen === i ? "#C9813A" : "#E8DFD1", display: "flex", alignItems: "center", justifyContent: "center", color: faqOpen === i ? "#fff" : "#6B655E", fontSize: 18, fontWeight: 700, transition: "background 0.2s", fontFamily: F }}>
                  {faqOpen === i ? "−" : "+"}
                </span>
              </button>
              <div style={{ overflow: "hidden", maxHeight: faqOpen === i ? 400 : 0, transition: "max-height 0.3s ease" }}>
                <p style={{ fontFamily: F, fontSize: 16, color: "#6B655E", lineHeight: 1.7, paddingBottom: 20 }}>{f.a}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 40, borderRadius: 12, backgroundColor: "#FAF6F0", padding: 24, textAlign: "center" }}>
            <p style={{ fontFamily: F, fontSize: 16, color: "#6B655E", lineHeight: 1.6 }}>
              Hai un&apos;altra domanda? Scrivici a{" "}
              <a href={`mailto:${shopEmail}`} style={{ color: "#C9813A", fontWeight: 600 }}>{shopEmail}</a>
              {" "}Rispondiamo entro 24 ore.
            </p>
          </div>
        </div>
      </section>

      {/* ── 11. Resi & Assistenza ── */}
      <div style={{ backgroundColor: "#FFFCF7", padding: "58px 20px" }}>
        <div className="bv-proof-grid" style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gap: 26, alignItems: "center" }}>
          <div style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 18px 54px rgba(30,27,24,0.12)" }}>
            <Image src="/images/shop/store-interior.webp" alt="Calzasi - il nostro negozio" width={640} height={360} style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
          </div>
          <div>
            <p style={{ fontFamily: F, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9B5A22", marginBottom: 12 }}>Resi e assistenza</p>
            <h3 style={{ fontFamily: F, fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#17120E", marginBottom: 16, letterSpacing: "-0.035em", lineHeight: 1.06 }}>
              Non spariamo dopo l'ordine. Rispondiamo davvero.
            </h3>
            <p style={{ fontFamily: F, fontSize: 17, color: "#5F554C", lineHeight: 1.7, marginBottom: 18, maxWidth: 560 }}>
              Se qualcosa non va, scrivi a{" "}
              <a href={`mailto:${shopEmail}`} style={{ color: "#9B5A22", fontWeight: 600 }}>{shopEmail}</a>
              {" "}con numero ordine e motivo. Ricevi risposta entro 24 ore e, se serve, rimborso in 3-5 giorni lavorativi.
            </p>
            <p style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "#17120E", backgroundColor: "#F0E2CF", border: "1px solid #DFD0BD", borderRadius: 6, padding: "14px 16px", display: "inline-flex" }}>
              Hai 30 giorni dalla consegna per restituire il prodotto.
            </p>
          </div>
        </div>
      </div>

      {/* ── 12. Final CTA ── */}
      <section style={{ backgroundColor: "#1B3A5C", padding: "72px 20px 80px", color: "#fff" }}>
        <div className="bv-final-grid" style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gap: 28, alignItems: "center" }}>
          <div>
            <span style={{ display: "inline-block", backgroundColor: "#7A3D38", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 4, marginBottom: 18 }}>Ultime disponibilità in promo</span>
            <h2 style={{ fontFamily: FT, fontSize: "clamp(26px,4vw,46px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.01em" }}>
              Scolpisci la silhouette.<br />Cammina più leggera.<br />Paga solo quando il pacco è in mano.
            </h2>
            <p style={{ fontFamily: F, fontSize: "clamp(14px,2vw,17px)", fontWeight: 400, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: 500 }}>
              Spedizione in 2-5 giorni. Reso 30 giorni. Puoi cancellare prima della spedizione senza domande.
            </p>
          </div>

          <div style={{ borderRadius: 8, backgroundColor: "#fff", color: "#17120E", padding: "28px", boxShadow: "0 28px 80px rgba(0,0,0,0.22)" }}>
            <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: 20, marginBottom: 22 }}>
              <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7A3D38", marginBottom: 10 }}>Prezzo promozionale</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: F, fontSize: 20, color: "#6A4A46", textDecoration: "line-through", fontWeight: 500 }}>€149,99</span>
                <span style={{ fontFamily: F, fontSize: "clamp(48px,7vw,68px)", fontWeight: 600, color: "#4A6858", lineHeight: 1, letterSpacing: "-0.04em" }}>€44,99</span>
                <span style={{ backgroundColor: "#7A5535", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: F, padding: "6px 11px", borderRadius: 4 }}>-70%</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: "#6B7280", marginTop: 8 }}>
                Spedizione €4,99 · Pagamento completo alla consegna
              </p>
            </div>
            <button onClick={handleCTA}
              style={{ width: "100%", minHeight: 64, background: "linear-gradient(180deg, #FFB347 0%, #FF9900 100%)", color: "#111", fontSize: "clamp(15px,2.4vw,18px)", fontWeight: 600, fontFamily: F, letterSpacing: "0.02em", padding: "18px 28px", borderRadius: 6, border: "1px solid #E68A00", boxShadow: "0 8px 24px rgba(255,153,0,0.40)", cursor: "pointer", textTransform: "uppercase" }}>
              ORDINA ORA → PAGHI ALLA CONSEGNA
            </button>
            <div className="bv-fineprint-grid" style={{ marginTop: 16, display: "grid", gap: 8 }}>
              {[
                { t: "Conferma telefonica", c: "#E4E8EF", tc: "#4A5E7A" },
                { t: "Reso 30 giorni", c: "#E8EDEA", tc: "#4D6E58" },
                { t: "Nessuna carta richiesta", c: "#E8EDEA", tc: "#4D6E58" },
              ].map((b) => (
                <span key={b.t} style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: b.tc, backgroundColor: b.c, borderRadius: 4, padding: "9px 12px", textAlign: "center" }}>{b.t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 13. Footer ── */}
      <footer style={{ backgroundColor: "#fefefe", borderTop: "1px solid #E9DED0", padding: "40px 20px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <Image src="/images/shop/logo.webp" alt="Calzasi" width={160} height={54} style={{ height: 48, width: "auto", objectFit: "contain", marginBottom: 12 }} />
              <p style={{ fontFamily: F, fontSize: 13, color: "#6B655E", lineHeight: 1.6, maxWidth: 220 }}>
                Calzasi.com. Scarpe ortopediche e comfort online.
              </p>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A6E8A", marginBottom: 12 }}>Shop</p>
                {[["Catalogo", "/catalogo"], ["Spedizioni", "/spedizioni"], ["Resi", "/politica-resi"]].map(([l, h]) => (
                  <Link key={l} href={h} style={{ display: "block", fontFamily: F, fontSize: 14, color: "#4A5568", textDecoration: "none", marginBottom: 8 }}>{l}</Link>
                ))}
              </div>
              <div>
                <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A6E8A", marginBottom: 12 }}>Legale</p>
                {[["Privacy", "/privacy-policy"], ["Cookie", "/cookie-policy"], ["Termini", "/termini-e-condizioni"]].map(([l, h]) => (
                  <Link key={l} href={h} style={{ display: "block", fontFamily: F, fontSize: 14, color: "#4A5568", textDecoration: "none", marginBottom: 8 }}>{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #E9DED0", paddingTop: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: F, fontSize: 13, color: "#9CA3AF" }}>© 2026 Calzasi. Tutti i diritti riservati.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: "#1E7A48" }}>€44,99</span>
              <button onClick={handleCTA} style={{ fontFamily: F, fontSize: 14, fontWeight: 700, background: "linear-gradient(180deg, #FFB347 0%, #FF9900 100%)", color: "#111", padding: "10px 22px", borderRadius: 8, border: "1px solid #E68A00", cursor: "pointer", boxShadow: "0 4px 10px rgba(255,153,0,0.35)" }}>
                Ordina ora
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Sticky ── */}
      <StickyOrderButton config={orderConfig} />
    </div>
  );
}
