import { getProducts, getCategories } from "@/lib/db";
import CatalogoClient from "./CatalogoClient";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <CatalogoClient products={products as any[]} categories={categories as any[]} />;
}
