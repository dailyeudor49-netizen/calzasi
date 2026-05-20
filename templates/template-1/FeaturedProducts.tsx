import Link from "next/link";

interface Product {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  original_price: number;
  image: string | null;
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  const displayed = products.slice(0, 4).map(p => ({
    ...p,
    price: Number(p.price),
    original_price: Number(p.original_price),
  }));

  return (
    <section id="nuovi-arrivi" style={{ padding: "72px 0 80px", backgroundColor: "#fff" }}>
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, gap: 16, flexWrap: "wrap" }}>
          <div>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--color-cta)", display: "block", marginBottom: 10 }}>
              I più richiesti
            </span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(1.4rem,2.4vw,2rem)", letterSpacing: "-0.02em", color: "var(--color-text)", margin: 0 }}>
              Best Seller
            </h2>
          </div>
          <Link
            href="/catalogo"
            style={{ fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
            className="hover:opacity-65 transition-opacity"
          >
            Vedi tutti
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* 4-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}
          className="cz-feat-grid">
          {displayed.map((product) => (
            <Link key={product.id} href={`/land/${product.slug}`} style={{ textDecoration: "none", display: "block", borderRadius: 2, overflow: "hidden", transition: "box-shadow 0.25s ease", boxShadow: "0 0 0 1px var(--color-border)" }} className="group hover:[box-shadow:0_8px_32px_rgba(0,0,0,0.10)]">

              {/* Image — 3:4 portrait */}
              <div style={{ position: "relative", paddingBottom: "120%", backgroundColor: "var(--color-bg-alt)", overflow: "hidden" }}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.55s ease" }}
                    className="group-hover:scale-[1.04]"
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                {product.original_price > product.price && (
                  <div style={{ position: "absolute", top: 12, left: 12, backgroundColor: "var(--color-cta)", color: "#fff", padding: "4px 9px", fontFamily: "var(--font-heading)", fontSize: 10, fontWeight: 700, letterSpacing: "0.06em" }}>
                    -{Math.round((1 - product.price / product.original_price) * 100)}%
                  </div>
                )}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 16, opacity: 0, transition: "opacity 0.25s ease" }} className="group-hover:[opacity:1]">
                  <span style={{ fontFamily: "var(--font-heading)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", backgroundColor: "var(--color-primary)", color: "#fff", padding: "10px 24px", transform: "translateY(8px)", transition: "transform 0.25s ease", display: "inline-block" }} className="group-hover:[transform:translateY(0)]">
                    Acquista ora
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: "14px 16px 18px", backgroundColor: "#fff" }}>
                <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14, color: "var(--color-text)", marginBottom: 3, letterSpacing: "-0.01em" }}>
                  {product.name}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 10, lineHeight: 1.4 }}>
                  {product.subtitle}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 15, color: "var(--color-primary)" }}>
                    {product.price.toFixed(2).replace(".", ",")} €
                  </span>
                  {product.original_price > product.price && (
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-text-secondary)", textDecoration: "line-through" }}>
                      {product.original_price.toFixed(2).replace(".", ",")} €
                    </span>
                  )}
                </div>
              </div>

            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media(max-width:767px){.cz-feat-grid{grid-template-columns:repeat(2,1fr)!important;gap:16px!important}}
      `}</style>
    </section>
  );
}
