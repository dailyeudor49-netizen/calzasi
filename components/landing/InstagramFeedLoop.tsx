"use client";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

const IMAGES = [
  "/images/land/modellia/RECENSIONI/ChatGPT%20Image%2012%20mag%202026%2C%2013_00_38.png",
  "/images/land/modellia/RECENSIONI/ChatGPT%20Image%2012%20mag%202026%2C%2013_03_08.png",
  "/images/land/modellia/RECENSIONI/ChatGPT%20Image%2012%20mag%202026%2C%2013_06_03.png",
  "/images/land/modellia/RECENSIONI/ChatGPT%20Image%2012%20mag%202026%2C%2013_09_17.png",
  "/images/land/modellia/RECENSIONI/ChatGPT%20Image%2012%20mag%202026%2C%2013_14_30.png",
  "/images/land/modellia/RECENSIONI/ChatGPT%20Image%2012%20mag%202026%2C%2013_16_57.png",
  "/images/land/modellia/RECENSIONI/ChatGPT%20Image%2012%20mag%202026%2C%2013_18_28.png",
];

const ITEMS = [...IMAGES, ...IMAGES]; // duplicate for seamless loop
const DURATION = IMAGES.length * 5;  // ~35s

export default function InstagramFeedLoop() {
  return (
    <section style={{ backgroundColor: "var(--ml-cream-soft)", padding: "56px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", paddingInline: 20, marginBottom: 40 }}>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ml-text-secondary)", fontFamily: FONT, marginBottom: 16 }}>
          LE NOSTRE CLIENTI
        </p>
        <h2 style={{ textAlign: "center", fontFamily: FONT, fontSize: "clamp(26px,4.5vw,40px)", fontWeight: 800, color: "var(--ml-text-primary)", marginBottom: 10, lineHeight: 1.15 }}>
          Le storie di chi indossa Elaria ogni giorno
        </h2>
        <p style={{ textAlign: "center", fontSize: 17, color: "var(--ml-text-secondary)", fontFamily: FONT }}>
          Donne reali, città reali, momenti veri.
        </p>
      </div>

      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            gap: 16,
            paddingInline: 20,
            width: "max-content",
            animation: `igScroll ${DURATION}s linear infinite`,
            willChange: "transform",
            alignItems: "center",
          }}
        >
          {ITEMS.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={`Storia cliente ${(i % IMAGES.length) + 1}`}
              style={{
                height: "clamp(480px, 70vw, 720px)",
                width: "auto",
                borderRadius: 12,
                flexShrink: 0,
                display: "block",
              }}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes igScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
