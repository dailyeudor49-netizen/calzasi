"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

const steps = [
  {
    n: "01",
    title: "Conferma telefonica o email",
    body: "Ti contattiamo entro poche ore per confermare l'ordine prima di spedire. Zero attesa.",
  },
  {
    n: "02",
    title: "Spedizione in 24-72h dalla conferma",
    body: "Una volta confermato telefonicamente, il pacco parte con GLS Express. Ricevi SMS di tracking ad ogni passaggio.",
  },
  {
    n: "03",
    title: "Paghi al corriere in contanti",
    body: "Il corriere arriva a casa tua e paghi in contanti. Nessuna carta, nessun anticipo.",
  },
];


export default function CardSteps() {
  return (
    <section style={{ backgroundColor: "var(--ml-white-pure)", padding: "36px 20px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontFamily: FONT, fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, color: "var(--ml-text-primary)", marginBottom: 4, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          Semplice, sicuro, senza pagamento anticipato
        </h2>
        <p style={{ textAlign: "center", fontFamily: FONT, fontSize: 14, color: "var(--ml-text-secondary)", marginBottom: 20, lineHeight: 1.5 }}>
          Ordini in 30 secondi. Paghi solo quando ricevi il pacco a casa.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              style={{
                borderRadius: 10,
                border: "1.5px solid var(--ml-border-subtle)",
                padding: "12px 16px",
                backgroundColor: "var(--ml-white-pure)",
                display: "flex",
                gap: 14,
                alignItems: "center",
                borderLeft: "4px solid var(--ml-terra-cta)",
              }}
            >
              <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: "var(--ml-terra-cta)", lineHeight: 1, flexShrink: 0, letterSpacing: "-0.03em", minWidth: 32 }}>
                {s.n}
              </div>
              <div>
                <h3 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "var(--ml-text-primary)", marginBottom: 2, letterSpacing: "-0.01em" }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: FONT, fontSize: 13, color: "var(--ml-text-secondary)", lineHeight: 1.5 }}>
                  {s.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* GLS mini-block — brand colors: blu navy + giallo + bianco */}
        <div style={{
          marginTop: 20, borderRadius: 14, overflow: "hidden",
          border: "2px solid #1A3668",
          display: "flex", flexWrap: "wrap",
        }}>
          {/* Blue header strip */}
          <div style={{
            width: "100%", backgroundColor: "#1A3668",
            padding: "10px 20px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif", fontSize: 20, fontWeight: 900, color: "#FFCC00", letterSpacing: "0.06em", flexShrink: 0 }}>GLS</span>
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#fff", opacity: 0.92 }}>Spediamo con GLS Express</span>
          </div>
          {/* Body */}
          <div style={{
            width: "100%", backgroundColor: "#F0F4FA",
            padding: "14px 20px",
            display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          }}>
            <p style={{ fontFamily: FONT, fontSize: 14, color: "#1A3668", flex: 1, minWidth: 180, lineHeight: 1.55, fontWeight: 500 }}>
              Consegna 24-72h dalla conferma · Tracking SMS · Il corriere ti chiama prima
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["€4,99 spedizione", "24-72h", "Tracking SMS"].map((t) => (
                <span key={t} style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, backgroundColor: "#FFCC00", color: "#1A3668", padding: "5px 12px", borderRadius: 999 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Founder block */}
        <div style={{ marginTop: 16, borderRadius: 12, overflow: "hidden", border: "1.5px solid var(--ml-border-subtle)", display: "flex" }}>
          {/* Shop image 1:1 */}
          <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
            <Image
              src="/images/land/modellia/hero-2.webp"
              alt="Calzasi — selezione artigianale"
              fill
              style={{ objectFit: "cover" }}
              sizes="96px"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(75,58,158,0.15) 0%, rgba(30,18,64,0.08) 100%)" }} />
          </div>
          {/* Text */}
          <div style={{ padding: "14px 16px", backgroundColor: "var(--ml-sand-base)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
            <Link href="/" tabIndex={-1} style={{ lineHeight: 0, display: "inline-block", marginBottom: 2 }}>
              <Image
                src="/images/shop/logo.webp"
                alt="Calzasi"
                width={72}
                height={28}
                style={{ height: 22, width: "auto", objectFit: "contain", opacity: 0.80 }}
              />
            </Link>
            <p style={{ fontFamily: FONT, fontSize: 13, color: "var(--ml-text-secondary)", lineHeight: 1.6, fontStyle: "italic" }}>
              &ldquo;Dal 1990 selezioniamo calzature che fanno bene al piede e alla postura. Elaria è la nostra proposta più innovativa.&rdquo;
              {" "}<strong style={{ color: "var(--ml-text-primary)", fontStyle: "normal" }}>— Maria, fondatrice</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
