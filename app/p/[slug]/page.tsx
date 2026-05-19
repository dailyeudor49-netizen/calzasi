import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/db";
import { getOrderConfig } from "@/lib/order-config";
import { OrderSection } from "@/components/OrderSection";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const cfg = getOrderConfig(slug);
    return { title: `${cfg.title} — Calzasi` };
  } catch {
    return { title: "Prodotto" };
  }
}

export default async function SimpleLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let orderConfig;
  try {
    orderConfig = getOrderConfig(slug);
  } catch {
    notFound();
  }

  const product = await getProductBySlug(slug);
  const image = orderConfig.colors[0]?.image || product?.image || "";
  const discount = orderConfig.comparePrice > 0
    ? Math.round((1 - orderConfig.price / orderConfig.comparePrice) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-10 py-8 md:py-14">
        <a
          href="/catalogo"
          className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 mb-6 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Torna al catalogo
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
          {/* Immagine prodotto */}
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "1/1", backgroundColor: "#f5f5f5" }}
          >
            {image ? (
              <img
                src={image}
                alt={orderConfig.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                Immagine non disponibile
              </div>
            )}
            {discount > 0 && (
              <span
                className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 text-white"
                style={{ backgroundColor: "var(--color-primary, #1E3560)", fontFamily: "var(--font-heading)" }}
              >
                −{discount}%
              </span>
            )}
          </div>

          {/* Info + ordina */}
          <div className="md:pt-4">
            <p
              className="uppercase tracking-[0.22em] text-[11px] font-semibold mb-3"
              style={{ color: "var(--color-primary, #1E3560)", fontFamily: "var(--font-accent)" }}
            >
              Donna · Calzasi
            </p>
            <h1
              className="font-bold leading-tight text-gray-900 mb-3"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontFamily: "var(--font-heading)" }}
            >
              {orderConfig.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-[28px] font-extrabold text-gray-900 tabular-nums">
                {orderConfig.price.toFixed(2).replace(".", ",")} €
              </span>
              {orderConfig.comparePrice > orderConfig.price && (
                <span className="text-[16px] line-through text-gray-400 tabular-nums">
                  {orderConfig.comparePrice.toFixed(2).replace(".", ",")} €
                </span>
              )}
            </div>

            <ul className="space-y-2 mb-6 text-[14px] text-gray-700">
              {[
                "Pagamento alla consegna",
                "Spedizione express 2-5 giorni",
                "Reso entro 30 giorni",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>

            <OrderSection config={orderConfig} image={image} />
          </div>
        </div>
      </div>
    </main>
  );
}
