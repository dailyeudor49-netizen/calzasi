import { getShopConfig } from "./db";

export async function getTemplateConfig() {
  const config = await getShopConfig();
  return {
    template: config.template || "template-1",
    brand: {
      logo: config.brand_logo || "/images/logo.webp",
      favicon: config.brand_favicon || "/images/favicon.ico",
      name: config.shop_name || "Shop",
      company: config.shop_company || "",
    },
    colors: {
      primary: config.primary_color || "#1E3560",
      primaryLight: config.primary_light || "#2A4A7A",
      primaryDark: config.primary_dark || "#152847",
      accent: config.accent_color || "#AA7947",
      cta: config.cta_color || "#1E3560",
      ctaDark: config.cta_dark || "#152847",
      bg: config.bg_color || "#FFFFFF",
      bgAlt: config.bg_alt || "#F7F6F3",
      text: config.text_color || "#1A1917",
      textSecondary: config.text_secondary || "#5A5752",
      border: config.border_color || "#E3DED6",
    },
    fonts: {
      heading: config.font_heading || "Inter",
      body: config.font_body || "Inter",
      mono: config.font_mono || "Anonymous Pro",
    },
    hero: {
      title: config.hero_title || "",
      subtitle: config.hero_subtitle || "",
      ctaText: config.hero_cta_text || "Scopri",
      image: config.hero_image || "",
    },
    tracking: {
      facebookPixelId: config.facebook_pixel_id || "",
      googleAdsId: config.google_ads_id || "",
    },
    domain: config.domain || "",
    raw: config,
  };
}

export type TemplateConfig = Awaited<ReturnType<typeof getTemplateConfig>>;
