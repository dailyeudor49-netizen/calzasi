"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { motion } from "framer-motion";
import { OrderSection } from "@/components/OrderSection";
import { StickyOrderButton } from "@/components/StickyOrderButton";
import type { OrderConfig } from "@/lib/order-config";

/* ─── Typography ─── */
const F = "'Manrope', 'Inter', system-ui, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

/* ─── Colors ─── */
const COLORS = [
  { name: "Tortora", img: "/images/land/bellavia/carosello/1.webp", swatch: "#C4A882", border: "#A68B5E" },
  { name: "Bianco",  img: "/images/land/bellavia/carosello/2.webp", swatch: "#FFFFFF", border: "#D0C8BE" },
  { name: "Nero",    img: "/images/land/bellavia/carosello/3.webp", swatch: "#1A1A1A", border: "#333333" },
];

/* ─── Sizes ─── */
const SIZES   = ["35","36","37","38","39","40","41","42","43","44"];
const SOLDOUT = ["35","44"];

/* ─── Scarcity ─── */
const STOCK: Record<string, Record<string, number>> = {
  "Tortora": { "36": 3, "37": 5, "38": 2, "39": 4, "40": 6, "41": 3, "42": 5, "43": 2 },
  "Bianco":  { "36": 5, "37": 2, "38": 4, "39": 1, "40": 3, "41": 6, "42": 2, "43": 4 },
  "Nero":    { "36": 2, "37": 4, "38": 6, "39": 3, "40": 5, "41": 2, "42": 4, "43": 3 },
};

/* ─── Benefits ─── */
const BENEFITS = [
  { name: "Suola curva attiva",     rest: " — oscillazione naturale, cammini con meno fatica" },
  { name: "Effetto scolpente",      rest: " — attiva glutei e polpacci ad ogni passo" },
  { name: "Plantare anatomico",     rest: " — arco e tallone supportati, postura allineata" },
  { name: "Doppio ammortizzamento", rest: " — impatti assorbiti, comfort tutto il giorno" },
  { name: "Tomaia traspirante",     rest: " — piede asciutto, fresco e senza odori" },
  { name: "Suola anti-scivolo",     rest: " — aderenza sicura su qualsiasi superficie" },
];

/* ─── Tecnologie ─── */
const TECHS = [
  { img: "/images/land/bellavia/tech/1.webp", tags: ["Impulso in avanti","Meno stress"], title: "Suola curva attiva", body: "La suola sagomata favorisce l'oscillazione del piede e ti spinge avanti naturalmente, riducendo lo stress su ginocchia e schiena." },
  { img: "/images/land/bellavia/tech/2.webp", tags: ["Attiva i glutei","Tonifica i polpacci"], title: "Effetto scolpente", body: "Il profilo a dondolo stimola l'estensione dell'anca: i glutei si attivano ad ogni passo, senti i muscoli lavorare." },
  { img: "/images/land/bellavia/tech/3.webp", tags: ["Supporto arco","Tallone stabile"], title: "Plantare anatomico", body: "Supporto mirato all'arco plantare e al tallone: appoggio stabile, postura allineata, sovraccarichi ridotti." },
  { img: "/images/land/bellavia/tech/4.webp", tags: ["Anti-urto","Comfort prolungato"], title: "Doppio ammortizzamento", body: "Doppio strato che assorbe gli impatti: comfort superiore anche durante le camminate più lunghe su asfalto." },
  { img: "/images/land/bellavia/tech/5.webp", tags: ["Termoregolante","Antiodore"], title: "Tomaia traspirante", body: "Tomaia premium che regola la temperatura interna: piede asciutto, fresco e senza odori per tutto il giorno." },
  { img: "/images/land/bellavia/tech/6.webp", tags: ["Aderenza bagnato","Tasselli profondi"], title: "Suola anti-scivolo", body: "Mescola con aderenza avanzata e tasselli profondi: passi sicuri su asfalto bagnato e superfici scivolose." },
];

/* ─── FAQ ─── */
const FAQS = [
  { q: "Quali sono i tempi e i costi di spedizione?",               a: "Consegna in 2-5 giorni dalla conferma dell'ordine. Il costo di spedizione è €4,99." },
  { q: "Come funziona il pagamento alla consegna?",                 a: "Paghi €49,99 direttamente al corriere quando ricevi il pacco. Nessun pagamento anticipato, nessuna carta di credito richiesta." },
  { q: "Cosa succede se al momento della consegna non sono in casa?", a: "Il corriere ti contatta prima di consegnare. Se non sei disponibile lascia un avviso di giacenza e riprova il giorno successivo, senza costi aggiuntivi." },
  { q: "Posso restituire il prodotto?",                             a: "Sì, hai 30 giorni dalla consegna. Il prodotto deve essere integro e nell'imballaggio originale. Scrivi a info@calzasi.com per ricevere le istruzioni di reso." },
  { q: "Come scelgo la taglia corretta?",                          a: "La calzata è regolare. Scegli la tua taglia abituale. Se sei tra due numeri o hai il piede largo, prendi la taglia superiore." },
  { q: "In quanto tempo vedrò i benefici?",                        a: "La maggior parte delle clienti percepisce comfort immediato dal primo utilizzo. I benefici sulla postura e la tonificazione diventano visibili in circa 4 settimane camminando 20-30 minuti al giorno." },
  { q: "Sono adatte a chi ha problemi alla schiena o alle ginocchia?", a: "La suola curva e il plantare anatomico sono progettati per ridurre lo stress su schiena e ginocchia. Non sostituiscono un parere medico: in caso di patologie consulta il tuo specialista." },
  { q: "La suola è antiscivolo anche su bagnato?",                 a: "Sì. I tasselli profondi e la mescola antiscivolo garantiscono aderenza sicura su superfici bagnate e scivolose." },
];

/* ─── Clienti loop ─── */
const CLIENTI = [1,2,3,4,5,6,7].map((n) => `/images/land/bellavia/clienti/${n}.webp`);

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
  const [pct, setPct]       = useState(50);
  const [drag, setDrag]     = useState(false);
  const boxRef              = useRef<HTMLDivElement>(null);
  const clamp               = (v: number) => Math.max(5, Math.min(95, v));
  const updateX             = useCallback((x: number) => {
    if (!boxRef.current) return;
    const { left, width } = boxRef.current.getBoundingClientRect();
    setPct(clamp(((x - left) / width) * 100));
  }, []);
  useEffect(() => {
    const mm = (e: MouseEvent)  => { if (drag) updateX(e.clientX); };
    const mu = ()               => setDrag(false);
    const tm = (e: TouchEvent)  => { if (drag) updateX(e.touches[0].clientX); };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup",   mu);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend",  mu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup",   mu);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend",  mu);
    };
  }, [drag, updateX]);

  return (
    <section style={{ backgroundColor: "#FAF6F0", padding: "72px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#7B2238", fontFamily: F, marginBottom: 16 }}>
          LA TRASFORMAZIONE BELLAVIA
        </p>
        <h2 style={{ textAlign: "center", fontFamily: SERIF, fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, color: "#1E1B18", marginBottom: 16, lineHeight: 1.2 }}>
          Da silhouette rilassata a silhouette modellata
        </h2>
        <p style={{ textAlign: "center", fontSize: 19, color: "#6B655E", fontFamily: F, maxWidth: 600, margin: "0 auto 40px" }}>
          Cammina 20-30 minuti al giorno con Bellavia.{" "}
          <strong style={{ color: "#C9813A" }}>Risultati visibili in circa 4 settimane.</strong>
        </p>

        {/* Slider */}
        <div
          ref={boxRef}
          style={{ position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "4/3", userSelect: "none", cursor: "ew-resize", touchAction: "none" }}
          onMouseDown={(e) => { setDrag(true); updateX(e.clientX); }}
          onTouchStart={(e) => { setDrag(true); updateX(e.touches[0].clientX); }}
        >
          {/* AFTER */}
          <Image src="/images/land/bellavia/after.webp" alt="Dopo Bellavia — silhouette modellata" fill className="object-cover" sizes="90vw" loading="lazy" />
          <div style={{ position: "absolute", top: 12, right: 12, backgroundColor: "rgba(45,106,79,0.9)", borderRadius: 6, padding: "4px 12px", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: F }}>DOPO</div>

          {/* BEFORE */}
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
            <Image src="/images/land/bellavia/before.webp" alt="Prima di Bellavia" fill className="object-cover" sizes="90vw" loading="lazy" />
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(42,38,34,0.22)" }} />
          </div>
          <div style={{ position: "absolute", top: 12, left: 12, backgroundColor: "rgba(42,38,34,0.75)", borderRadius: 6, padding: "4px 12px", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: F }}>PRIMA</div>

          {/* Handle */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pct}%`, transform: "translateX(-50%)", width: 4, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#C9813A", border: "3px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.28)", color: "#fff", fontSize: 14, fontWeight: 700 }}>↔</div>
          </div>
        </div>

        {/* Pillole */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 20 }}>
          {["Foto reali — senza ritocchi", "Benefici visibili in 4 settimane"].map((p) => (
            <span key={p} style={{ backgroundColor: "#7B2238", color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: F, padding: "8px 16px", borderRadius: 999 }}>{p}</span>
          ))}
        </div>

        {/* Bullets */}
        <ul style={{ margin: "24px auto 0", maxWidth: 480, display: "flex", flexDirection: "column", gap: 8, padding: 0, listStyle: "none" }}>
          {["Oscillazione guidata, cammini meglio", "Attivazione dei glutei ad ogni passo", "Meno stress su ginocchia e schiena"].map((b) => (
            <li key={b} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: F, fontSize: 16, fontWeight: 600, color: "#1E1B18", backgroundColor: "#F0F7F4", border: "1px solid #C6E8D8", borderRadius: 10, padding: "11px 16px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#2D6A4F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
              </div>
              {b}
            </li>
          ))}
        </ul>

        {/* Timeline settimane */}
        <div style={{ marginTop: 48, paddingTop: 40, borderTop: "1px solid #E8DFD1" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
            {[
              "Settimana 1",
              "Settimana 2",
              "Settimana 3",
              "Settimana 4",
            ].map((w, i) => (
              <motion.div key={w} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} style={{ textAlign: "center" }}>
                <p style={{ fontSize: i === 3 ? 18 : 16, fontWeight: i === 3 ? 700 : 400, color: i === 3 ? "#C9813A" : "#6B655E", fontFamily: F }}>{w}</p>
              </motion.div>
            ))}
          </div>
          <div style={{ height: 6, borderRadius: 999, backgroundColor: "#E8DFD1", overflow: "hidden", marginBottom: 10 }}>
            <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} style={{ height: "100%", background: "linear-gradient(to right, #6B655E, #C9813A)", borderRadius: 999 }} />
          </div>
          <p style={{ textAlign: "center", fontSize: 15, fontStyle: "italic", color: "#6B655E", fontFamily: F }}>Inizio ──────► Risultati visibili</p>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "#6B655E", fontStyle: "italic", fontFamily: F, marginTop: 24 }}>
          *Tempi indicativi. I risultati variano in base a costanza d&apos;uso, peso, intensità della camminata e stile di vita.
        </p>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */
export function BellaviaPage({ orderConfig, reviews, stats, shopEmail }: Props) {
  const [selColor, setSelColor]       = useState("Tortora");
  const [selSize,  setSelSize]        = useState("");
  const [pulseSize, setPulseSize]     = useState(false);
  const [faqOpen,  setFaqOpen]        = useState<number>(0);
  const [showMore, setShowMore]       = useState(false);
  const sizeRef                       = useRef<HTMLDivElement>(null);

  const heroImg = COLORS.find((c) => c.name === selColor)?.img || COLORS[0].img;

  /* Notify StickyOrderButton when hero selection changes */
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("hero-variant", { detail: { color: selColor, size: selSize } }));
  }, [selColor, selSize]);

  const handleCTA = () => {
    if (!selSize) {
      setPulseSize(true);
      setTimeout(() => setPulseSize(false), 2400);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    window.dispatchEvent(new CustomEvent("sticky-order", { detail: { size: selSize, color: selColor } }));
  };

  const visibleReviews = showMore ? reviews : reviews.slice(0, 6);
  const AVATAR_COLORS  = ["#C9813A","#2D6A4F","#7B2238","#1B3A5C","#D4693E","#8B5CF6","#0891B2","#D97706","#BE185D"];

  return (
    <div style={{ overflowX: "hidden", fontFamily: F }}>

      {/* CSS vars + animations */}
      <style>{`
        .bv-size-pulse { animation: bvPulse 0.6s ease 4; }
        @keyframes bvPulse { 0%,100%{box-shadow:none}50%{box-shadow:0 0 0 4px rgba(201,129,58,0.45)} }
        @keyframes bvTopBar { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes bvClienti { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>

      {/* JSON-LD */}
      <Script id="bellavia-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Bellavia — Scarpe ortopediche con suola attiva",
        "brand": { "@type": "Brand", "name": "Calzasi" },
        "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "49.99", "priceValidUntil": "2026-12-31", "availability": "https://schema.org/InStock" },
        ...(stats.count > 0 ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": String(stats.avg), "reviewCount": String(stats.count), "bestRating": "5", "worstRating": "1" } } : {}),
      }) }} />

      {/* ── 1. TopBar ── */}
      <div style={{ backgroundColor: "#1B3A5C", color: "#fff", padding: "9px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-flex", gap: 56, animation: "bvTopBar 28s linear infinite", willChange: "transform" }}>
          {[...Array(3)].flatMap(() =>
            ["Pagamento alla consegna", "Spedizione 2-5 giorni", "Reso 30 giorni gratuito", "Calzasi — boutique calzature"].map((t) => (
              <span key={`${Math.random()}-${t}`} style={{ fontFamily: F, fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#C9813A", fontSize: 10 }}>✦</span> {t}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── 2. Header ── */}
      <header style={{ borderBottom: "1px solid #E8DFD1", padding: "14px 20px", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 10px rgba(30,27,24,0.07)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <Image src="/images/shop/logo.webp" alt="Calzasi" width={120} height={40} style={{ height: 34, width: "auto", objectFit: "contain" }} />
          </Link>
          <button onClick={handleCTA} style={{ fontFamily: F, fontSize: 14, fontWeight: 700, backgroundColor: "#C9813A", color: "#fff", padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
            Ordina ora
          </button>
        </div>
      </header>

      {/* ── 3. HERO ── */}
      <section style={{ backgroundColor: "#fff", padding: "28px 20px 52px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px 56px", alignItems: "start" }}>

            {/* Gallery — sticky */}
            <div style={{ position: "sticky", top: 76 }}>
              {/* Main image */}
              <div style={{ position: "relative", aspectRatio: "4/5", borderRadius: 16, overflow: "hidden", backgroundColor: "#F5F0EA" }}>
                <Image src={heroImg} alt={`Bellavia — ${selColor}`} fill className="object-cover" sizes="(min-width:1024px) 50vw, 100vw" priority />
                <span style={{ position: "absolute", top: 14, left: 14, backgroundColor: "#C9813A", color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 6 }}>−67%</span>
              </div>
              {/* Thumbnail colori */}
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {COLORS.map((c) => {
                  const sel = selColor === c.name;
                  return (
                    <button key={c.name} onClick={() => setSelColor(c.name)} aria-label={`Colore ${c.name}`}
                      style={{ flex: 1, borderRadius: 10, border: sel ? "2.5px solid #C9813A" : "2px solid #E8DFD1", overflow: "hidden", padding: 0, backgroundColor: "transparent", cursor: "pointer", boxShadow: sel ? "0 0 0 3px rgba(201,129,58,0.2)" : "none", transition: "border 0.2s, box-shadow 0.2s" }}>
                      <div style={{ aspectRatio: "4/3", position: "relative", backgroundColor: "#F5F0EA" }}>
                        <Image src={c.img} alt={c.name} fill className="object-cover" sizes="100px" />
                      </div>
                      <div style={{ padding: "6px 4px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: sel ? "#FFF3E8" : "#fff" }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: c.swatch, border: `1.5px solid ${c.border}`, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1E1B18", fontFamily: F }}>{c.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info column */}
            <div>
              {/* Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
                <span style={{ backgroundColor: "#FEF3C7", color: "#92400E", fontSize: 13, fontWeight: 600, fontFamily: F, padding: "5px 12px", borderRadius: 999 }}>Bestseller 2026</span>
                <span style={{ backgroundColor: "#F0F7F4", color: "#2D6A4F", fontSize: 13, fontWeight: 600, fontFamily: F, padding: "5px 12px", borderRadius: 999 }}>Novità</span>
              </div>

              {/* H1 */}
              <h1 style={{ fontFamily: F, fontSize: "clamp(30px,4.5vw,48px)", fontWeight: 800, lineHeight: 1.08, color: "#1E1B18", marginBottom: 18, letterSpacing: "-0.028em" }}>
                <span style={{ color: "#C9813A" }}>Bellavia</span>{" "}— Scarpe ortopediche con suola attiva
              </h1>

              {/* Subheadline */}
              <p style={{ fontFamily: F, fontSize: "clamp(17px,2.5vw,19px)", color: "#6B655E", lineHeight: 1.65, marginBottom: 20 }}>
                Suola <strong style={{ color: "#1E1B18", fontWeight: 700 }}>curva attiva</strong> che ti spinge in avanti: cammini con meno fatica,{" "}
                <strong style={{ color: "#1E1B18", fontWeight: 700 }}>attivi i glutei</strong> ad ogni passo,{" "}
                <strong style={{ color: "#1E1B18", fontWeight: 700 }}>migliori la postura</strong>.
              </p>

              {/* Rating */}
              {stats.count > 0 && (
                <a href="#recensioni" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 20 }}>
                  <Stars n={5} size={18} />
                  <span style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: "#1E1B18" }}>{stats.avg}/5</span>
                  <span style={{ fontFamily: F, fontSize: 15, color: "#6B655E", textDecoration: "underline", textUnderlineOffset: 2 }}>{stats.count} recensioni</span>
                </a>
              )}

              <div style={{ height: 1, backgroundColor: "#E8DFD1", margin: "4px 0 22px" }} />

              {/* Price */}
              <div style={{ marginBottom: 6, display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontFamily: F, fontSize: 18, fontWeight: 500, color: "#6B655E", textDecoration: "line-through" }}>€149,99</span>
                <span style={{ fontFamily: F, fontSize: "clamp(36px,5.5vw,52px)", fontWeight: 800, color: "#1E1B18", lineHeight: 1, letterSpacing: "-0.03em" }}>€49,99</span>
                <span style={{ backgroundColor: "#D4693E", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: F, padding: "5px 12px", borderRadius: 999 }}>−67%</span>
              </div>
              <p style={{ fontFamily: F, fontSize: 14, color: "#6B655E", marginBottom: 14 }}>+ €4,99 spedizione · Paghi tutto alla consegna</p>

              <div style={{ height: 1, backgroundColor: "#E8DFD1", margin: "4px 0 24px" }} />

              {/* Benefits */}
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 8 }}>
                {BENEFITS.map((b) => (
                  <li key={b.name} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: F, fontSize: "clamp(14px,2vw,15px)", fontWeight: 500, color: "#1E1B18", lineHeight: 1.4, backgroundColor: "#F0F7F4", border: "1px solid #C6E8D8", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "#2D6A4F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <span><strong>{b.name}</strong>{b.rest}</span>
                  </li>
                ))}
              </ul>

              <div style={{ height: 1, backgroundColor: "#E8DFD1", margin: "0 0 24px" }} />

              {/* Color selector */}
              <div style={{ marginBottom: 22 }}>
                <p style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: "#6B655E", marginBottom: 12 }}>
                  Colore: <strong style={{ color: "#1E1B18", fontWeight: 700 }}>{selColor}</strong>
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  {COLORS.map((c) => {
                    const sel = selColor === c.name;
                    return (
                      <button key={c.name} onClick={() => setSelColor(c.name)} aria-label={`Colore ${c.name}`}
                        style={{ flex: 1, borderRadius: 12, border: sel ? "2.5px solid #C9813A" : "2px solid #E8DFD1", overflow: "hidden", padding: 0, backgroundColor: "transparent", cursor: "pointer", boxShadow: sel ? "0 0 0 3px rgba(201,129,58,0.18)" : "none", transition: "border 0.2s, box-shadow 0.2s" }}>
                        <div style={{ aspectRatio: "4/3", position: "relative", backgroundColor: "#F5F0EA" }}>
                          <Image src={c.img} alt={c.name} fill className="object-cover" sizes="120px" />
                        </div>
                        <div style={{ padding: "7px 6px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: sel ? "#FFF3E8" : "#fff" }}>
                          <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: c.swatch, border: `1.5px solid ${c.border}`, flexShrink: 0 }} />
                          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: "#1E1B18" }}>{c.name}</span>
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
                <div className={pulseSize ? "bv-size-pulse" : ""} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, borderRadius: 10, padding: 2 }}>
                  {SIZES.map((s) => {
                    const so  = SOLDOUT.includes(s);
                    const sel = selSize === s;
                    return (
                      <button key={s} onClick={() => !so && setSelSize(s)} disabled={so}
                        style={{ height: 56, borderRadius: 10, fontSize: "clamp(16px,2vw,18px)", fontWeight: 700, fontFamily: F, border: sel ? "2.5px solid #1E1B18" : "2px solid #E8DFD1", backgroundColor: sel ? "#1E1B18" : "#fff", color: sel ? "#fff" : so ? "#C9B89C" : "#1E1B18", opacity: so ? 0.38 : 1, position: "relative", overflow: "hidden", cursor: so ? "not-allowed" : "pointer", transition: "background 0.15s, border 0.15s, color 0.15s" }}>
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
                  const color   = qty <= 2 ? "#C53030" : qty <= 4 ? "#B45309" : "#2D6A4F";
                  const bg      = qty <= 2 ? "#FFF5F5" : qty <= 4 ? "#FFFBEB" : "#F0F7F4";
                  const brd     = qty <= 2 ? "#FED7D7" : qty <= 4 ? "#FDE68A" : "#C6E8D8";
                  return (
                    <div style={{ overflow: "hidden", maxHeight: visible ? 80 : 0, marginTop: visible ? 14 : 0, transition: "max-height 0.3s ease, margin-top 0.3s ease" }}>
                      <div style={{ borderRadius: 10, border: `1.5px solid ${brd}`, backgroundColor: bg, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: F, fontSize: "clamp(13px,1.8vw,14px)", fontWeight: 700, color }}>
                          Solo {qty} {qty === 1 ? "paio rimasto" : "paia rimaste"} — {selColor} taglia {selSize || "—"}
                        </span>
                        <span style={{ fontFamily: F, fontSize: 13, color: "#6B655E" }}>
                          — aggiornato pochi minuti fa
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div style={{ height: 1, backgroundColor: "#E8DFD1", margin: "4px 0 24px" }} />

              {/* CTA */}
              <button onClick={handleCTA}
                style={{ width: "100%", height: 68, borderRadius: 14, background: "linear-gradient(135deg, #E8922A 0%, #C47818 100%)", color: "#fff", fontSize: "clamp(17px,2.5vw,19px)", fontWeight: 800, letterSpacing: "0.02em", fontFamily: F, border: "none", boxShadow: "0 6px 20px rgba(232,146,42,0.35)", cursor: "pointer", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                ORDINA ORA → PAGHI ALLA CONSEGNA
              </button>

              {/* Microcopy */}
              <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
                {["Spedizione €4,99", "Paghi al corriere", "Reso 30 giorni"].map((t) => (
                  <span key={t} style={{ fontFamily: F, fontSize: "clamp(13px,1.8vw,15px)", fontWeight: 500, color: "#6B655E" }}>{t}</span>
                ))}
              </div>

              {/* OrderSection (sorgente del modal — invisibile nella pagina) */}
              <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
                <OrderSection config={orderConfig} image={heroImg} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Come ordinare (3 step) ── */}
      <section style={{ backgroundColor: "#fff", padding: "36px 20px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontFamily: F, fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, color: "#1E1B18", marginBottom: 4, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Semplice, sicuro, senza pagamento anticipato
          </h2>
          <p style={{ textAlign: "center", fontFamily: F, fontSize: 14, color: "#6B655E", marginBottom: 20, lineHeight: 1.5 }}>
            Ordini in 30 secondi. Paghi solo quando il pacco è nelle tue mani.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { n: "01", title: "Seleziona colore, taglia e inserisci i dati",  body: "Compila il modulo in 30 secondi. Nessuna carta, nessun anticipo richiesto." },
              { n: "02", title: "Ti contattiamo per confermare l'ordine",        body: "Entro poche ore ricevi una chiamata o un messaggio per confermare prima della spedizione." },
              { n: "03", title: "Paghi al corriere in contanti",                  body: "Il corriere arriva a casa tua. Paghi solo quando il pacco è in mano. Nessuna sorpresa." },
            ].map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.08 }}
                style={{ borderRadius: 10, border: "1.5px solid #E8DFD1", padding: "12px 16px", backgroundColor: "#fff", display: "flex", gap: 14, alignItems: "center", borderLeft: "4px solid #C9813A" }}>
                <div style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: "#C9813A", lineHeight: 1, flexShrink: 0, letterSpacing: "-0.03em", minWidth: 32 }}>{s.n}</div>
                <div>
                  <h3 style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: "#1E1B18", marginBottom: 2, letterSpacing: "-0.01em" }}>{s.title}</h3>
                  <p style={{ fontFamily: F, fontSize: 13, color: "#6B655E", lineHeight: 1.5 }}>{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Founder block */}
          <div style={{ marginTop: 20, borderRadius: 12, overflow: "hidden", border: "1.5px solid #E8DFD1", display: "flex" }}>
            <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
              <Image src="/images/shop/store-counter.webp" alt="Calzasi — boutique calzature" fill style={{ objectFit: "cover" }} sizes="96px" />
            </div>
            <div style={{ padding: "14px 16px", backgroundColor: "#FAF6F0", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
              <Link href="/" style={{ lineHeight: 0, display: "inline-block", marginBottom: 2 }}>
                <Image src="/images/shop/logo.webp" alt="Calzasi" width={72} height={28} style={{ height: 22, width: "auto", objectFit: "contain", opacity: 0.80 }} />
              </Link>
              <p style={{ fontFamily: F, fontSize: 13, color: "#6B655E", lineHeight: 1.6, fontStyle: "italic" }}>
                &ldquo;Selezioniamo calzature che fanno bene al piede e alla postura. Bellavia è il nostro modello più innovativo.&rdquo;{" "}
                <strong style={{ color: "#1E1B18", fontStyle: "normal" }}>— Team Calzasi</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. 6 Tecnologie ── */}
      <section id="tecnologie" style={{ backgroundColor: "#fff", padding: "64px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontFamily: F, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6B655E", marginBottom: 14 }}>
            LE 6 CARATTERISTICHE BELLAVIA
          </p>
          <h2 style={{ textAlign: "center", fontFamily: F, fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 800, color: "#1E1B18", marginBottom: 12, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Sei ragioni per cui Bellavia è diversa da qualsiasi altra scarpa
          </h2>
          <p style={{ textAlign: "center", fontFamily: F, fontSize: 18, color: "#6B655E", marginBottom: 48, lineHeight: 1.6 }}>
            Non è marketing. Sono i sei elementi che fanno funzionare ogni componente.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
            {TECHS.map((t, i) => (
              <motion.div key={t.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}
                style={{ borderRadius: 16, border: "1.5px solid #E8DFD1", backgroundColor: "#FAF6F0", overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#ECE3D6" }}>
                  <Image src={t.img} alt={t.title} fill className="object-cover" sizes="(min-width:1024px) 380px, (min-width:768px) 50vw, 100vw" loading="lazy" />
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {t.tags.map((tag) => (
                      <span key={tag} style={{ backgroundColor: "#fff", color: "#1E1B18", fontSize: 13, fontWeight: 600, fontFamily: F, padding: "4px 10px", borderRadius: 999 }}>{tag}</span>
                    ))}
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: "#1E1B18", marginBottom: 10, lineHeight: 1.2 }}>{t.title}</h3>
                  <p style={{ fontFamily: F, fontSize: 16, color: "#6B655E", lineHeight: 1.55 }}>{t.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Prima/Dopo ── */}
      <BeforeAfter />

      {/* ── 7. COD block ── */}
      <section style={{ backgroundColor: "#1B3A5C", padding: "52px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>ACQUISTO SENZA RISCHIO</p>
          <h2 style={{ fontFamily: F, fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, color: "#fff", marginBottom: 20, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Nessuna carta. Nessun anticipo. Paghi solo quando il pacco è tuo.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { icon: "💳", title: "Pagamento alla consegna", sub: "Nessun pagamento anticipato" },
              { icon: "📦", title: "Spedizione 2-5 giorni",   sub: "Tracking incluso" },
              { icon: "↩️", title: "Reso 30 giorni",          sub: "Soddisfatta o rimborsata" },
              { icon: "📞", title: "Supporto reale",           sub: "Risposta entro 24h" },
            ].map((b) => (
              <div key={b.title} style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "20px 16px" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{b.icon}</div>
                <p style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{b.title}</p>
                <p style={{ fontFamily: F, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{b.sub}</p>
              </div>
            ))}
          </div>
          <button onClick={handleCTA} style={{ fontFamily: F, fontSize: 18, fontWeight: 800, backgroundColor: "#C9813A", color: "#fff", padding: "18px 44px", borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 6px 20px rgba(201,129,58,0.4)" }}>
            ORDINA ORA → PAGHI ALLA CONSEGNA
          </button>
        </div>
      </section>

      {/* ── 8. Foto clienti loop ── */}
      <section style={{ backgroundColor: "#F2EDE4", padding: "56px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingInline: 20, marginBottom: 40 }}>
          <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B655E", fontFamily: F, marginBottom: 16 }}>LE NOSTRE CLIENTI</p>
          <h2 style={{ textAlign: "center", fontFamily: F, fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 800, color: "#1E1B18", marginBottom: 10, lineHeight: 1.15 }}>
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
          <h2 style={{ textAlign: "center", fontFamily: F, fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 800, color: "#1E1B18", marginBottom: 16, lineHeight: 1.15 }}>
            Cosa dicono le clienti che le indossano
          </h2>
          {stats.count > 0 && (
            <div style={{ textAlign: "center", marginBottom: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Stars n={5} />
              <span style={{ fontFamily: F, fontSize: 19, fontWeight: 800, color: "#1E1B18" }}>{stats.avg}/5</span>
              <span style={{ fontFamily: F, fontSize: 16, color: "#6B655E" }}>{stats.count} recensioni verificate</span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {visibleReviews.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                style={{ borderRadius: 16, backgroundColor: "#fff", padding: 24, boxShadow: "0 2px 8px rgba(30,27,24,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontWeight: 700, fontFamily: F, fontSize: 15 }}>{r.author_name[0]}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: "#1E1B18", marginBottom: 2 }}>{r.author_name}</p>
                    <Stars n={r.rating} />
                  </div>
                </div>
                <p style={{ fontFamily: F, fontSize: 16, color: "#1E1B18", lineHeight: 1.65 }}>&ldquo;{r.body}&rdquo;</p>
                {r.reply && (
                  <div style={{ marginTop: 14, borderTop: "1px solid #E8DFD1", paddingTop: 12 }}>
                    <p style={{ fontFamily: F, fontSize: 13, color: "#6B655E", lineHeight: 1.6 }}>
                      <strong style={{ color: "#C9813A" }}>Calzasi:</strong> {r.reply}
                    </p>
                  </div>
                )}
                <div style={{ marginTop: 14 }}>
                  <span style={{ backgroundColor: "#F0F7F4", color: "#2D6A4F", fontSize: 12, fontWeight: 600, fontFamily: F, padding: "4px 10px", borderRadius: 999, border: "1px solid #C6E8D8" }}>
                    ✓ Acquisto verificato
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {!showMore && reviews.length > 6 && (
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <button onClick={() => setShowMore(true)}
                style={{ borderRadius: 12, border: "2px solid #C9813A", backgroundColor: "transparent", color: "#C9813A", fontSize: 16, fontWeight: 700, fontFamily: F, padding: "14px 32px", cursor: "pointer" }}>
                Mostra altre recensioni
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section id="faq" style={{ backgroundColor: "#fff", padding: "56px 20px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6B655E", fontFamily: F, marginBottom: 16 }}>DOMANDE FREQUENTI</p>
          <h2 style={{ textAlign: "center", fontFamily: F, fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 800, color: "#1E1B18", marginBottom: 48, lineHeight: 1.15 }}>
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
              {" "}— rispondiamo entro 24 ore.
            </p>
          </div>
        </div>
      </section>

      {/* ── 11. Resi & Assistenza ── */}
      <div style={{ backgroundColor: "#FAF6F0", padding: "48px 20px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 28px rgba(30,27,24,0.12)", marginBottom: 28 }}>
            <Image src="/images/shop/store-interior.webp" alt="Calzasi — il nostro negozio" width={640} height={360} style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
          </div>
          <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6B655E", marginBottom: 10 }}>RESI &amp; ASSISTENZA</p>
          <h3 style={{ fontFamily: F, fontSize: "clamp(22px,3.5vw,32px)", fontWeight: 800, color: "#1E1B18", marginBottom: 14, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            C&rsquo;è una persona reale dietro ogni ordine
          </h3>
          <p style={{ fontFamily: F, fontSize: 16, color: "#6B655E", lineHeight: 1.7, marginBottom: 16, maxWidth: 520, margin: "0 auto 16px" }}>
            Siamo un team appassionato di calzature. Se qualcosa non va, scrivi a{" "}
            <a href={`mailto:${shopEmail}`} style={{ color: "#C9813A", fontWeight: 600 }}>{shopEmail}</a>
            {" "}con numero ordine e motivo — risposta in 24h, rimborso in 3-5 giorni lavorativi.
          </p>
          <p style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: "#1E1B18" }}>
            Hai 30 giorni dalla consegna per restituire il prodotto, senza domande.
          </p>
        </div>
      </div>

      {/* ── 12. Final CTA ── */}
      <section style={{ backgroundColor: "#C9813A", padding: "88px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,252,248,0.75)", fontFamily: F, marginBottom: 20 }}>
            ULTIMI 7 PAIA A QUESTO PREZZO
          </p>
          <h2 style={{ fontFamily: F, fontSize: "clamp(30px,5.5vw,52px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.02em" }}>
            Cammina più leggera. Attiva i glutei. Paga solo quando il pacco è in mano.
          </h2>
          <p style={{ fontFamily: F, fontSize: 18, color: "rgba(255,252,248,0.88)", marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>
            Spedizione 2-5 giorni. Reso 30 giorni. Boutique reale.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: F, fontSize: 22, color: "rgba(255,252,248,0.65)", textDecoration: "line-through" }}>€149,99</span>
            <span style={{ fontFamily: F, fontSize: "clamp(44px,7vw,68px)", fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.03em" }}>€49,99</span>
            <span style={{ backgroundColor: "#FDEDB5", color: "#9B5A00", fontSize: 15, fontWeight: 700, fontFamily: F, padding: "6px 14px", borderRadius: 999 }}>−67%</span>
          </div>
          <p style={{ fontFamily: F, fontSize: 14, color: "rgba(255,252,248,0.70)", marginBottom: 32 }}>
            + €4,99 spedizione · Paghi tutto alla consegna
          </p>
          <button onClick={handleCTA}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, backgroundColor: "#fff", color: "#C9813A", fontSize: 20, fontWeight: 800, fontFamily: F, letterSpacing: "0.01em", padding: "22px 48px", borderRadius: 14, border: "none", boxShadow: "0 8px 32px rgba(30,27,24,0.22)", cursor: "pointer" }}>
            ORDINA ORA → PAGHI ALLA CONSEGNA
          </button>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16 }}>
            {["Paghi al corriere", "Reso 30 giorni", "Soddisfatta o rimborsata"].map((t) => (
              <span key={t} style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: "rgba(255,252,248,0.78)" }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. Footer ── */}
      <footer style={{ backgroundColor: "#1B3A5C", color: "#fff", padding: "40px 20px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <Image src="/images/shop/logo.webp" alt="Calzasi" width={100} height={36} style={{ height: 30, width: "auto", objectFit: "contain", filter: "brightness(10)", marginBottom: 12 }} />
              <p style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.60)", lineHeight: 1.6, maxWidth: 220 }}>
                Calzasi.com — scarpe ortopediche e comfort online.
              </p>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.50)", marginBottom: 12 }}>Shop</p>
                {[["Catalogo", "/catalogo"], ["Spedizioni", "/spedizioni"], ["Resi", "/politica-resi"]].map(([l, h]) => (
                  <Link key={l} href={h} style={{ display: "block", fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.75)", textDecoration: "none", marginBottom: 8 }}>{l}</Link>
                ))}
              </div>
              <div>
                <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.50)", marginBottom: 12 }}>Legale</p>
                {[["Privacy", "/privacy-policy"], ["Cookie", "/cookie-policy"], ["Termini", "/termini-e-condizioni"]].map(([l, h]) => (
                  <Link key={l} href={h} style={{ display: "block", fontFamily: F, fontSize: 14, color: "rgba(255,255,255,0.75)", textDecoration: "none", marginBottom: 8 }}>{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: F, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>© 2026 Calzasi. Tutti i diritti riservati.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontFamily: F, fontSize: 20, fontWeight: 800, color: "#fff" }}>€49,99</span>
              <button onClick={handleCTA} style={{ fontFamily: F, fontSize: 14, fontWeight: 700, backgroundColor: "#C9813A", color: "#fff", padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer" }}>
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
