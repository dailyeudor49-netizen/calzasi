import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getReviewsBySlug, getReviewStats, getShopConfig } from "@/lib/db";
import { getOrderConfig } from "@/lib/order-config";
import { BellaviaPage } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bellavia — Scarpe ortopediche con suola attiva | Calzasi",
  description: "Suola curva attiva che ti spinge in avanti: cammini più leggera, attivi i glutei ad ogni passo, migliori la postura. €49,99 — Pagamento alla consegna — Reso 30 giorni.",
  openGraph: {
    title: "Bellavia — Scarpe ortopediche con suola attiva | Calzasi",
    description: "Suola curva, effetto scolpente, plantare anatomico. €49,99 — Paghi solo alla consegna.",
    images: [{ url: "/images/land/bellavia/carosello/1.webp", width: 1200, height: 630, alt: "Bellavia — Calzasi" }],
    type: "website",
    locale: "it_IT",
  },
};

export default async function BellaviaLanding() {
  let orderConfig;
  try {
    orderConfig = getOrderConfig("bellavia");
  } catch {
    notFound();
  }

  const [product, reviews, shopConfig] = await Promise.all([
    getProductBySlug("bellavia"),
    getReviewsBySlug("bellavia"),
    getShopConfig(),
  ]);

  if (!product) notFound();

  const stats = await getReviewStats(product.id as number);

  return (
    <BellaviaPage
      orderConfig={orderConfig}
      reviews={(reviews as any[]).map((r) => ({
        id: r.id as number,
        author_name: r.author_name as string,
        rating: r.rating as number,
        body: r.body as string,
        created_at: r.created_at as string,
        reply: (r.reply as string) || null,
      }))}
      stats={{ count: stats.count, avg: stats.avg }}
      shopEmail={shopConfig.shop_email || "info@calzasi.com"}
    />
  );
}
