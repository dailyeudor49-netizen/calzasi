import Link from "next/link";

interface Collection {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  count?: number;
}

interface Props {
  collections?: Collection[];
}

const DEFAULTS: Collection[] = [
  { slug: "sandali",   name: "Sandali",   tagline: "Comfort estivo, eleganza intramontabile", image: "/images/categories/miele.webp" },
  { slug: "classiche", name: "Classiche", tagline: "Modelli essenziali per ogni occasione",   image: "/images/categories/nobile.webp" },
  { slug: "sportive",  name: "Sportive",  tagline: "Stile dinamico per il quotidiano",        image: "/images/categories/sabbia.webp" },
];

export default function CollectionsSection({ collections }: Props) {
  const list = collections && collections.length > 0 ? collections : DEFAULTS;

  return (
    <section style={{ padding: "64px 0 72px", backgroundColor: "var(--color-bg-alt)" }}>
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, gap: 12, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-cta)", display: "block", marginBottom: 10 }}>
              Categorie
            </span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(1.4rem,2.4vw,2rem)", letterSpacing: "-0.02em", color: "var(--color-text)", margin: 0 }}>
              Sfoglia per categoria
            </h2>
          </div>
          <Link
            href="/catalogo"
            style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
            className="hover:opacity-65 transition-opacity"
          >
            Tutto il catalogo
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* 3-col cards — landscape ratio */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="cz-cat-grid">
          {list.map((c) => (
            <Link
              key={c.slug}
              href={`/catalogo?cat=${c.slug}`}
              className="group"
              style={{ display: "block", position: "relative", overflow: "hidden", aspectRatio: "4/3", backgroundColor: "#f0ede8", textDecoration: "none" }}
            >
              <img
                src={c.image}
                alt={c.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", transition: "transform 0.6s ease" }}
                className="group-hover:scale-[1.05]"
                loading="lazy"
              />
              {/* Gradient bottom */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(10,24,42,0.65) 0%, rgba(10,24,42,0.15) 55%, transparent 100%)" }} />

              {/* Text */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 22px" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(1.15rem,1.8vw,1.4rem)", color: "#fff", marginBottom: 4, letterSpacing: "-0.01em" }}>
                  {c.name}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "rgba(255,255,255,0.78)" }}>
                    {c.tagline}
                  </p>
                  <span style={{
                    width: 30, height: 30, borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    border: "1.5px solid rgba(255,255,255,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginLeft: 12,
                    transition: "background-color 0.2s",
                  }} className="group-hover:[background-color:rgba(255,255,255,0.25)]">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:639px){.cz-cat-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
