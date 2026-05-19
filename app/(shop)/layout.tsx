import Footer from "@/components/Footer";
import TemplateHeader from "@/components/TemplateHeader";
import { getTemplateConfig } from "@/lib/template";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const config = await getTemplateConfig();
  return (
    <>
      <TemplateHeader brandName={config.brand.name} template={config.template} logoSrc="/images/shop/logo.webp" />
      {children}
      <Footer />
    </>
  );
}
