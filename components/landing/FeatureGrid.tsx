"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";
const SERIF = "Newsreader, Georgia, 'Times New Roman', serif";

const techs = [
  {
    img: "/images/land/modellia/tech-1.webp",
    tags: ["Impulso in avanti", "Meno stress"],
    title: "Rocker ortopedico",
    body: "La suola curva Elaria favorisce l'oscillazione e ti spinge in avanti: cammini con meno stress su ginocchia e schiena.",
  },
  {
    img: "/images/land/modellia/tech-2.webp",
    tags: ["Attiva glutei", "Estensione anca"],
    title: "Effetto Sollevamento",
    body: "Il rocker stimola l'estensione dell'anca e l'attivazione dei glutei: li senti lavorare ad ogni passo.",
  },
  {
    img: "/images/land/modellia/tech-3.webp",
    tags: ["Supporto arco", "Tallone stabile"],
    title: "Plantare OrtoLift™",
    body: "Supporto mirato ad arco e tallone per appoggio stabile, postura allineata, sovraccarichi ridotti.",
  },
  {
    img: "/images/land/modellia/tech-4.webp",
    tags: ["Anti-urto", "Comfort prolungato"],
    title: "Cushion+ doppio ammortizzamento",
    body: "Doppio strato che assorbe gli impatti: comfort superiore anche nelle camminate lunghe.",
  },
  {
    img: "/images/land/modellia/tech-5.webp",
    tags: ["Termoregolante", "Antiodore"],
    title: "ThermoBalance™",
    body: "Tomaia premium traspirante e termoregolante, antiodore: piede asciutto sempre.",
  },
  {
    img: "/images/land/modellia/tech-6.webp",
    tags: ["Aderenza bagnato", "Tasselli profondi"],
    title: "Suola antiscivolo certificata",
    body: "Aderenza avanzata e tasselli profondi: passi sicuri su asfalto bagnato e marciapiedi scivolosi.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="tecnologie" style={{ backgroundColor: "var(--ml-white-pure)", padding: "64px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ml-text-secondary)", marginBottom: 14 }}>
          LE 6 TECNOLOGIE ELARIA™
        </p>
        <h2 style={{ textAlign: "center", fontFamily: FONT, fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 800, color: "var(--ml-text-primary)", marginBottom: 12, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Sei tecnologie che la rendono diversa da qualsiasi altra scarpa
        </h2>
        <p style={{ textAlign: "center", fontFamily: FONT, fontSize: 18, color: "var(--ml-text-secondary)", marginBottom: 48, lineHeight: 1.6 }}>
          Non è marketing. Sono i sei brevetti che fanno funzionare ogni componente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
          {techs.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              style={{
                borderRadius: 16,
                border: "1.5px solid var(--ml-border-subtle)",
                backgroundColor: "var(--ml-sand-base)",
                overflow: "hidden",
              }}
            >
              {/* Image — 4:3 */}
              <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "#ece3d6" }}>
                <Image
                  src={t.img}
                  alt={t.title}
                  fill
                  className="object-cover"
                  sizes="(min-width:1024px) 380px, (min-width:768px) 50vw, 100vw"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                  {t.tags.map((tag) => (
                    <span key={tag} style={{ backgroundColor: "var(--ml-white-pure)", color: "var(--ml-text-primary)", fontSize: 13, fontWeight: 600, fontFamily: FONT, padding: "4px 10px", borderRadius: 999 }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: "var(--ml-text-primary)", marginBottom: 10, lineHeight: 1.2 }}>
                  {t.title}
                </h3>
                <p style={{ fontFamily: FONT, fontSize: 16, color: "var(--ml-text-secondary)", lineHeight: 1.55 }}>
                  {t.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
