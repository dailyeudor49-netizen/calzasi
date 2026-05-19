"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

const IMAGES = [
  // 3 varianti colore
  "/images/land/modellia/hero-1.webp",
  "/images/land/modellia/hero-2.webp",
  "/images/land/modellia/hero-3.webp",
  // Nuove immagini aggiuntive
  "/images/land/modellia/10.jpg",
  "/images/land/modellia/12.jpg",
  "/images/land/modellia/13.jpg",
  "/images/land/modellia/14.jpg",
  "/images/land/modellia/15.jpg",
  // Extra shots originali
  "/images/land/modellia/hero-4.webp",
  "/images/land/modellia/hero-5.webp",
];

export type HeroSelection = { color: string; size: string };

export default function HeroGallery() {
  const [active, setActive] = useState(0);
  const swipeX = useRef<number | null>(null);

  const prev = useCallback(() => setActive((a) => (a === 0 ? IMAGES.length - 1 : a - 1)), []);
  const next = useCallback(() => setActive((a) => (a + 1) % IMAGES.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div>
      {/* ── Desktop: flex-row con miniature verticali a sinistra ── */}
      {/* ── Mobile: stack verticale con miniature orizzontali sotto ── */}
      <div className="flex flex-col md:flex-row md:gap-3 md:items-start">

        {/* Miniature — orizzontali su mobile, verticali su desktop */}
        <div className="order-2 md:order-1 flex flex-row md:flex-col gap-2 mt-3 md:mt-0 md:w-[76px] overflow-x-auto md:overflow-x-visible md:overflow-y-auto scrollbar-hide pb-1 md:pb-0">
          {IMAGES.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Miniatura ${i + 1}`}
              style={{
                flexShrink: 0,
                width: 68,
                height: 68,
                borderRadius: 10,
                overflow: "hidden",
                border: i === active
                  ? "2.5px solid var(--ml-terra-cta)"
                  : "2px solid var(--ml-border-subtle)",
                padding: 0,
                backgroundColor: "transparent",
                cursor: "pointer",
                transition: "border 0.2s",
              }}
            >
              <Image src={src} alt="" width={68} height={68} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>

        {/* Immagine principale */}
        <div
          className="order-1 md:order-2 relative overflow-hidden flex-1"
          style={{ aspectRatio: "4/5", borderRadius: 14, background: "#FFFFFF" }}
          onTouchStart={(e) => { swipeX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (swipeX.current === null) return;
            const dx = e.changedTouches[0].clientX - swipeX.current;
            if (Math.abs(dx) > 44) { dx < 0 ? next() : prev(); }
            swipeX.current = null;
          }}
        >
          <Image
            src={IMAGES[active]}
            alt={`Elaria — foto ${active + 1}`}
            fill
            priority={active === 0}
            className="object-contain"
            sizes="(min-width:768px) 50vw, 100vw"
          />

          {/* Prev / Next */}
          {[
            { side: "left",  fn: prev, d: "M15 19l-7-7 7-7" },
            { side: "right", fn: next, d: "M9 5l7 7-7 7" },
          ].map(({ side, fn, d }) => (
            <button
              key={side}
              onClick={fn}
              aria-label={side === "left" ? "Precedente" : "Successiva"}
              className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{
                [side]: 10, width: 40, height: 40, borderRadius: "50%",
                backgroundColor: "rgba(255,252,248,0.88)", backdropFilter: "blur(4px)",
                border: "none", color: "#1E1B18", boxShadow: "0 2px 8px rgba(30,27,24,0.14)",
                cursor: "pointer",
              }}
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d={d} />
              </svg>
            </button>
          ))}

          {/* Dots */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
            {IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Foto ${i + 1}`}
                style={{
                  width: i === active ? 20 : 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: i === active ? "var(--ml-terra-cta)" : "rgba(30,27,24,0.22)",
                  border: "none",
                  transition: "width 0.3s ease, background 0.3s ease",
                  padding: 0,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          {/* Discount badge */}
          <div className="absolute top-3 left-3">
            <span style={{
              fontSize: 15, fontWeight: 900, letterSpacing: "0.01em",
              padding: "6px 12px", borderRadius: 8,
              background: "linear-gradient(135deg, #E8922A 0%, #C47818 100%)",
              color: "#fff",
              boxShadow: "0 3px 10px rgba(232,146,42,0.40)",
              display: "block",
            }}>−70%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
