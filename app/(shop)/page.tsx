import { getTemplateConfig } from "@/lib/template";
import { getProducts, getCategories } from "@/lib/db";
import Homepage from "@/templates/template-1/Homepage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [config, products, categories] = await Promise.all([
    getTemplateConfig(),
    getProducts(),
    getCategories(),
  ]);

  return (
    <Homepage
      config={config}
      products={products}
      categories={categories}
      reviews={[]}
      reviewStats={{ count: 0, avg: 0 }}
    />
  );
}
