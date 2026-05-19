import Link from "next/link";

interface Product {
  id: number;
  slug: string;
  name: string;
  subtitle?: string;
  price: number | string;
  original_price?: number | string;
  image: string | null;
  category_slug?: string;
}

interface Props {
  products: Product[];
}

function fmtPrice(n: number | string) {
  const v = typeof n === "string" ? parseFloat(n) : n;
  if (isNaN(v)) return "";
  return v.toFixed(2).replace(".", ",") + " €";
}

export default function AllProductsGrid({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-14 md:py-20 border-t" style={{ borderColor: "var(--color-border)" }}>
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8 md:mb-10">
          <div>
            <p
              className="uppercase tracking-[0.22em] mb-3 font-semibold"
              style={{ fontFamily: "var(--font-accent)", color: "var(--color-primary)", fontSize: "11px" }}
            >
              Tutto il catalogo
            </p>
            <h2
              className="font-bold leading-tight"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text)",
                fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
              }}
            >
              Tutti i modelli
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
            >
              {products.length} {products.length === 1 ? "modello disponibile" : "modelli disponibili"} · Pagamento alla consegna · Reso 30 giorni
            </p>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition"
            style={{ color: "var(--color-text)", fontFamily: "var(--font-heading)", letterSpacing: "0.04em" }}
          >
            Vai al catalogo completo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((p) => {
            const price = typeof p.price === "string" ? parseFloat(p.price) : p.price;
            const original = p.original_price ? (typeof p.original_price === "string" ? parseFloat(p.original_price) : p.original_price) : null;
            const hasDiscount = original && original > price;
            return (
              <Link key={p.id} href={`/land/${p.slug}`} className="group block">
                <div className="relative overflow-hidden" style={{ paddingBottom: "118%", backgroundColor: "#f5f5f5" }}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                  {hasDiscount && (
                    <span
                      className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1"
                      style={{ backgroundColor: "var(--color-primary)", color: "#fff", fontFamily: "var(--font-heading)" }}
                    >
                      Promo
                    </span>
                  )}
                </div>
                <div className="mt-3 px-1">
                  <p
                    className="text-[14px] font-semibold leading-tight"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
                  >
                    {p.name}
                  </p>
                  {p.subtitle && (
                    <p
                      className="text-[12px] mt-0.5 line-clamp-1"
                      style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}
                    >
                      {p.subtitle}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-[14px] font-bold tabular-nums" style={{ color: "var(--color-text)" }}>
                      {fmtPrice(price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-[12px] line-through tabular-nums" style={{ color: "var(--color-text-secondary)" }}>
                        {fmtPrice(original!)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
