"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const WEEKS = [
  { label: "Settimana 1", body: "Il corpo si adatta al Rocker: il passo diventa più fluido, si percepisce subito il comfort." },
  { label: "Settimana 2", body: "La postura migliora progressivamente. Schiena e ginocchia iniziano ad alleggerirsi." },
  { label: "Settimana 3", body: "I glutei si attivano regolarmente durante ogni camminata. La silhouette inizia a definirsi." },
  { label: "Settimana 4", body: "Postura visibilmente più dritta, glutei più tonici, passi più leggeri. Risultati visibili." },
];

export default function BeforeAfterSlider() {
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const clamp = (v: number) => Math.max(5, Math.min(95, v));

  const updateFromX = useCallback((clientX: number) => {
    if (!boxRef.current) return;
    const { left, width } = boxRef.current.getBoundingClientRect();
    setPct(clamp(((clientX - left) / width) * 100));
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { setDragging(true); updateFromX(e.clientX); };
  const onTouchStart = (e: React.TouchEvent) => { setDragging(true); updateFromX(e.touches[0].clientX); };

  useEffect(() => {
    const mm = (e: MouseEvent) => { if (dragging) updateFromX(e.clientX); };
    const mu = () => setDragging(false);
    const tm = (e: TouchEvent) => { if (dragging) updateFromX(e.touches[0].clientX); };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", mu);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", mu);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", mu);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", mu);
    };
  }, [dragging, updateFromX]);

  return (
    <section style={{ backgroundColor: "var(--ml-sand-base)", padding: "72px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ml-burgundy-deep)", fontFamily: "Inter, system-ui, sans-serif", marginBottom: 16 }}>
          LA TRASFORMAZIONE ELARIA™
        </p>
        <h2 style={{ textAlign: "center", fontFamily: "Newsreader, Georgia, serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, color: "var(--ml-text-primary)", marginBottom: 16, lineHeight: 1.2 }}>
          Da silhouette rilassata a silhouette modellata
        </h2>
        <p style={{ textAlign: "center", fontSize: 19, color: "var(--ml-text-secondary)", fontFamily: "Inter, system-ui, sans-serif", marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
          Cammina 20-30 minuti al giorno con Elaria.{" "}
          <strong style={{ color: "var(--ml-terra-cta)" }}>Risultati visibili in circa 4 settimane.</strong>
        </p>

        {/* Slider */}
        <div
          ref={boxRef}
          className="ba-handle"
          style={{
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            aspectRatio: "4/3",
            userSelect: "none",
            cursor: "ew-resize",
            touchAction: "none",
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          {/* AFTER (full) */}
          <Image src="/images/land/modellia/after.webp" alt="Dopo Elaria — silhouette modellata" fill className="object-cover" sizes="90vw" loading="lazy" />
          {/* Label Dopo */}
          <div style={{ position: "absolute", top: 12, right: 12, backgroundColor: "rgba(45,106,79,0.85)", borderRadius: 6, padding: "4px 10px", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui, sans-serif" }}>DOPO</div>

          {/* BEFORE (clipped) */}
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
            <Image src="/images/land/modellia/before.webp" alt="Prima — silhouette rilassata" fill className="object-cover" sizes="90vw" loading="lazy" />
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(42,38,34,0.20)" }} />
          </div>
          {/* Label Prima */}
          <div style={{ position: "absolute", top: 12, left: 12, backgroundColor: "rgba(42,38,34,0.75)", borderRadius: 6, padding: "4px 10px", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Inter, system-ui, sans-serif" }}>PRIMA</div>

          {/* Handle */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${pct}%`,
              transform: "translateX(-50%)",
              width: 4,
              backgroundColor: "var(--ml-white-pure)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "var(--ml-terra-cta)", border: "3px solid var(--ml-white-pure)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.25)", color: "#fff", fontSize: 14, fontWeight: 700 }}>↔</div>
          </div>
        </div>

        {/* Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 20 }}>
          {["Foto reali / senza ritocchi", "Beneficio Sollevamento™"].map((p) => (
            <span key={p} style={{ backgroundColor: "var(--ml-burgundy-deep)", color: "var(--ml-white-pure)", fontSize: 14, fontWeight: 600, fontFamily: "Inter, system-ui, sans-serif", padding: "8px 16px", borderRadius: 999 }}>{p}</span>
          ))}
        </div>

        {/* Bullets */}
        <ul style={{ margin: "24px auto 0", maxWidth: 480, display: "flex", flexDirection: "column", gap: 8, padding: 0, listStyle: "none" }}>
          {["Oscillazione guidata, cammini meglio", "Attivazione dei glutei ad ogni passo", "Meno stress su ginocchia e schiena"].map((b) => (
            <li key={b} style={{
              display: "flex", alignItems: "center", gap: 14,
              fontFamily: "Inter, system-ui, sans-serif", fontSize: 16, fontWeight: 600, color: "var(--ml-text-primary)",
              backgroundColor: "#F0F7F4", border: "1px solid #C6E8D8",
              borderRadius: 10, padding: "11px 16px",
            }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--ml-green-trust)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              {b}
            </li>
          ))}
        </ul>

        {/* Timeline */}
        <div style={{ marginTop: 48, paddingTop: 40, borderTop: "1px solid var(--ml-border-subtle)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
            {WEEKS.map((w, i) => (
              <motion.div
                key={w.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                style={{ textAlign: "center" }}
              >
                <p style={{ fontSize: i === 3 ? 18 : 16, fontWeight: i === 3 ? 700 : 400, color: i === 3 ? "var(--ml-terra-cta)" : "var(--ml-text-secondary)", fontFamily: "Inter, system-ui, sans-serif", marginBottom: 6 }}>{w.label}</p>
                <p style={{ fontSize: 13, color: "var(--ml-text-secondary)", fontFamily: "Inter, system-ui, sans-serif", lineHeight: 1.5, display: "none" }} className="hidden sm:block">{w.body}</p>
              </motion.div>
            ))}
          </div>
          {/* Progress bar */}
          <div style={{ height: 6, borderRadius: 999, backgroundColor: "var(--ml-border-subtle)", overflow: "hidden", marginBottom: 10 }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{ height: "100%", background: "linear-gradient(to right, var(--ml-text-secondary), var(--ml-terra-cta))", borderRadius: 999 }}
            />
          </div>
          <p style={{ textAlign: "center", fontSize: 15, fontStyle: "italic", color: "var(--ml-text-secondary)", fontFamily: "Inter, system-ui, sans-serif" }}>
            Inizio ──────► Risultati visibili
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--ml-text-secondary)", fontStyle: "italic", fontFamily: "Inter, system-ui, sans-serif", marginTop: 24 }}>
          *Tempi indicativi. I risultati variano in base a costanza d&apos;uso, peso, intensità della camminata e stile di vita.
        </p>
      </div>
    </section>
  );
}
