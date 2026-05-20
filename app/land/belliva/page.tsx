import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getReviewsBySlug, getReviewStats, getShopConfig } from "@/lib/db";
import { getOrderConfig } from "@/lib/order-config";
import { BellivaPage } from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Belliva - Scarpe ortopediche con suola attiva | Calzasi",
  description: "Belliva accompagna il passo e sostiene la postura: cammini più leggera, coinvolgi glutei e polpacci e paghi solo alla consegna. €49,99. Reso 30 giorni.",
  openGraph: {
    title: "Belliva - Scarpe ortopediche con suola attiva | Calzasi",
    description: "Passo guidato, appoggio stabile, comfort anti-urto. €49,99. Paghi solo alla consegna.",
    images: [{ url: "/images/categories/tabacca.webp", width: 1200, height: 630, alt: "Belliva - Calzasi" }],
    type: "website",
    locale: "it_IT",
  },
};

export default async function BellivaLanding() {
  let orderConfig;
  try {
    orderConfig = getOrderConfig("belliva");
  } catch {
    notFound();
  }

  const [product, reviews, shopConfig] = await Promise.all([
    getProductBySlug("belliva"),
    getReviewsBySlug("belliva"),
    getShopConfig(),
  ]);

  if (!product) notFound();

  const stats = await getReviewStats(product.id as number);

  return (
    <BellivaPage
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
