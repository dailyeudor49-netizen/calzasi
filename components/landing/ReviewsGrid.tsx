"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

interface Review { name: string; rating: number; text: string; avatar?: string; }

const REVIEWS: Review[] = [
  { name: "Maria P.",     rating: 5, text: "Le uso per andare al lavoro e per fare la spesa. Cammino più dritta e alla sera non ho le gambe distrutte. Belle anche dal vivo." },
  { name: "Laura M.",     rating: 5, text: "Arrivate in 2 giorni. Calzano bene, ho preso il mio numero abituale. La suola curva si nota ma in modo naturale." },
  { name: "Valentina C.", rating: 5, text: "Dopo una settimana noto i glutei più attivi quando cammino, zero dolore alle ginocchia. Consigliatissime." },
  { name: "Antonella S.", rating: 5, text: "60 anni e mai trovate scarpe così. Cammino un'ora al giorno con la mia amica, finalmente senza dolore al ginocchio." },
  { name: "Daniela P.",   rating: 5, text: "Lavoro come infermiera, 8 ore in piedi. Da quando le porto, la schiena ringrazia. Migliori delle classiche da lavoro." },
  { name: "Francesca M.", rating: 5, text: "Le ho prese per provare e ho ordinato il secondo paio dopo 10 giorni. Il pagamento alla consegna mi ha tranquillizzata." },
];

const EXTRA: Review[] = [
  { name: "Elena R.",     rating: 4, text: "Mi aiutano tantissimo con la postura in ufficio. Esteticamente stanno bene con jeans e leggings. Vorrei più colori." },
  { name: "Carmen L.",    rating: 5, text: "Ho un bimbo piccolo, sono sempre in giro: piede asciutto e senza odori. Ordinate anche per mia sorella." },
  { name: "Isabel T.",    rating: 4, text: "All'inizio sensazione nuova, dopo due uscite non riesco più a farne a meno. Consegna rapida." },
  { name: "Giulia D.",    rating: 4, text: "Belle e comode. Io ho il piede largo, mi sarebbe stata meglio una mezza taglia sopra. Consiglio di prenderle mezza taglia in più se siete tra due numeri." },
  { name: "Roberta V.",   rating: 5, text: "Pacco arrivato in 2 giorni, corriere gentile, pagato e via. Le scarpe sono comode dal primo passo. Consiglio." },
  { name: "Patrizia G.",  rating: 5, text: "Camminando in città ho notato che mi spingono in avanti senza sforzo. Dopo un mese, sento davvero glutei e gambe più tonici." },
];

const BG = ["#E85D3F","#2D6A4F","#C73E5F","#F4B860","#8B5CF6","#0891B2","#D97706","#BE185D","#2D6A4F","#E85D3F","#C73E5F","#F4B860"];

function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5].map((i) => (
        <svg key={i} width={16} height={16} viewBox="0 0 20 20" fill={i <= n ? "#F4B860" : "#E8DFD1"}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ r, idx }: { r: Review; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
      style={{
        borderRadius: 16,
        backgroundColor: "var(--ml-white-pure)",
        padding: 24,
        boxShadow: "0 2px 8px rgba(30,27,24,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", flexShrink: 0, backgroundColor: BG[idx % BG.length], display: "flex", alignItems: "center", justifyContent: "center" }}>
          {r.avatar
            ? <Image src={r.avatar} alt={r.name} width={48} height={48} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ color: "#fff", fontWeight: 700, fontFamily: FONT, fontSize: 15 }}>{r.name[0]}</span>
          }
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "var(--ml-text-primary)", marginBottom: 2 }}>{r.name}</p>
          <Stars n={r.rating} />
        </div>
      </div>
      <p style={{ fontFamily: FONT, fontSize: 16, color: "var(--ml-text-primary)", lineHeight: 1.65 }}>
        &ldquo;{r.text}&rdquo;
      </p>
      <div style={{ marginTop: 14 }}>
        <span style={{ backgroundColor: "var(--ml-green-trust-soft)", color: "var(--ml-green-trust)", fontSize: 12, fontWeight: 600, fontFamily: FONT, padding: "4px 10px", borderRadius: 999, border: "1px solid var(--ml-green-trust)" }}>
          ✓ Acquisto verificato
        </span>
      </div>
    </motion.div>
  );
}

export default function ReviewsGrid() {
  const [showMore, setShowMore] = useState(false);
  const visible = showMore ? [...REVIEWS, ...EXTRA] : REVIEWS;

  return (
    <section id="recensioni" style={{ backgroundColor: "var(--ml-cream-soft)", padding: "56px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ml-text-secondary)", fontFamily: FONT, marginBottom: 16 }}>
          OLTRE 2.000 CLIENTI SODDISFATTE
        </p>
        <h2 style={{ textAlign: "center", fontFamily: FONT, fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 800, color: "var(--ml-text-primary)", marginBottom: 16, lineHeight: 1.15 }}>
          Cosa dicono le clienti che le indossano
        </h2>
        <div style={{ textAlign: "center", marginBottom: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Stars n={5} />
          <span style={{ fontFamily: FONT, fontSize: 19, fontWeight: 800, color: "var(--ml-text-primary)" }}>4,8/5</span>
          <span style={{ fontFamily: FONT, fontSize: 16, color: "var(--ml-text-secondary)" }}>2.134 recensioni verificate</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {visible.map((r, i) => <ReviewCard key={r.name} r={r} idx={i} />)}
        </div>

        {!showMore && (
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <button
              onClick={() => setShowMore(true)}
              style={{
                borderRadius: 12, border: "2px solid var(--ml-terra-cta)",
                backgroundColor: "transparent", color: "var(--ml-terra-cta)",
                fontSize: 16, fontWeight: 700, fontFamily: FONT,
                padding: "14px 32px", cursor: "pointer", transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--ml-terra-cta)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--ml-white-pure)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "var(--ml-terra-cta)"; }}
            >
              Mostra altre 6 recensioni
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
