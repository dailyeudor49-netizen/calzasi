import Hero from "./Hero";
import CollectionsSection from "./CollectionsSection";
import FeaturedProducts from "./FeaturedProducts";
import AllProductsGrid from "./AllProductsGrid";
import ShippingSection from "./ShippingSection";
import Newsletter from "./Newsletter";
import type { TemplateConfig } from "@/lib/template";

interface HomepageProps {
  config: TemplateConfig;
  products: any[];
  categories: any[];
  reviews: any[];
  reviewStats: { count: number; avg: number };
}

export default function Homepage({ config, products }: HomepageProps) {
  return (
    <>
      <Hero
        title={config.hero.title}
        subtitle={config.hero.subtitle}
        ctaText={config.hero.ctaText}
        ctaHref="/catalogo"
      />
      <CollectionsSection />
      <FeaturedProducts products={products} />
      <ShippingSection />
      <AllProductsGrid products={products} />
      <Newsletter />
    </>
  );
}
