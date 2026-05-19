/* ═══════════════════ Order Config ═══════════════════ */

export interface ColorOption {
  name: string;
  bg: string;
  border: string;
  text?: string;
  dot?: string;
  image?: string;
}

export interface OrderConfig {
  title: string;
  slug: string;
  price: number;
  comparePrice: number;
  colors: ColorOption[];
  sizes: string[];
  sizeToFullship: Record<string, number>;
  upsellPrice: number;
  upsellFullshipId: number;
  accentColor?: string;
}

/* ─── Shared constants ─── */

const SIZES_35_44 = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

const FULLSHIP_5901: Record<string, number> = {
  "35": 5901, "36": 5902, "37": 5903, "38": 5904, "39": 5905,
  "40": 5906, "41": 5907, "42": 5908, "43": 5909, "44": 5910,
};

const FULLSHIP_5911: Record<string, number> = {
  "35": 5911, "36": 5912, "37": 5913, "38": 5914, "39": 5915,
  "40": 5916, "41": 5917, "42": 5918, "43": 5919, "44": 5920,
};

const FULLSHIP_5921: Record<string, number> = {
  "35": 5921, "36": 5922, "37": 5923, "38": 5924, "39": 5925,
  "40": 5926, "41": 5927, "42": 5928, "43": 5929, "44": 5930,
};

/* ─── Prodotti ─── */

const ORDER_CONFIGS: Record<string, OrderConfig> = {
  "ambra": {
    title: "Ambra", slug: "ambra", price: 69.99, comparePrice: 139.99,
    colors: [{ name: "Beige", bg: "#D9C4A5", border: "#B89F7E", image: "/images/categories/ambra.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5901, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#A87B50",
  },
  "noir": {
    title: "Noir", slug: "noir", price: 59.99, comparePrice: 59.99,
    colors: [{ name: "Nero", bg: "#1A1917", border: "#000", image: "/images/categories/noir.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5901, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#333333",
  },
  "miele": {
    title: "Miele", slug: "miele", price: 74.99, comparePrice: 149.99,
    colors: [{ name: "Cuoio", bg: "#A0633A", border: "#7A4727", image: "/images/categories/miele.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5911, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#A0633A",
  },
  "perla": {
    title: "Perla", slug: "perla", price: 79.99, comparePrice: 79.99,
    colors: [{ name: "Bianco", bg: "#F0EBE0", border: "#D9D0C0", image: "/images/categories/perla.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5911, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#B89F6F",
  },
  "corsa": {
    title: "Corsa", slug: "corsa", price: 89.99, comparePrice: 179.99,
    colors: [{ name: "Bianco/Rosa", bg: "#F5EBF5", border: "#D9B0D9", image: "/images/categories/corsa.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5921, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#9B7BC8",
  },
  "sabbia": {
    title: "Sabbia", slug: "sabbia", price: 99.99, comparePrice: 199.99,
    colors: [{ name: "Beige", bg: "#D9C4A5", border: "#B89F7E", image: "/images/categories/sabbia.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5921, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#A0875E",
  },
  "carbone": {
    title: "Carbone", slug: "carbone", price: 94.99, comparePrice: 94.99,
    colors: [{ name: "Nero", bg: "#1A1917", border: "#000", image: "/images/categories/carbone.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5921, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#444444",
  },
  "nobile": {
    title: "Nobile", slug: "nobile", price: 129.99, comparePrice: 259.99,
    colors: [{ name: "Bordeaux", bg: "#7B2238", border: "#5A1528", image: "/images/categories/nobile.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5901, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#7B2238",
  },
  "grazia": {
    title: "Grazia", slug: "grazia", price: 109.99, comparePrice: 109.99,
    colors: [{ name: "Beige cipria", bg: "#E8D8C4", border: "#C9B89F", image: "/images/categories/grazia.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5901, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#C9A882",
  },
  "estate": {
    title: "Estate", slug: "estate", price: 84.99, comparePrice: 169.99,
    colors: [{ name: "Cuoio/Rafia", bg: "#C4A07A", border: "#A07A50", image: "/images/categories/estate.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5911, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#8B5C30",
  },
  "notte": {
    title: "Notte", slug: "notte", price: 89.99, comparePrice: 179.99,
    colors: [{ name: "Nero", bg: "#1A1917", border: "#000", image: "/images/categories/notte.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5911, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#444444",
  },
  "cielo": {
    title: "Cielo", slug: "cielo", price: 119.99, comparePrice: 239.99,
    colors: [{ name: "Bianco/Azzurro", bg: "#D0E8F5", border: "#90C0E8", image: "/images/categories/cielo.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5921, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#5B9BD5",
  },
  "confetto": {
    title: "Confetto", slug: "confetto", price: 59.99, comparePrice: 59.99,
    colors: [{ name: "Rosa antico", bg: "#E8C4C4", border: "#C98888", image: "/images/categories/confetto.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5921, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#C9A0A0",
  },
  "splendore": {
    title: "Splendore", slug: "splendore", price: 109.99, comparePrice: 219.99,
    colors: [{ name: "Bianco/Oro", bg: "#F5F0E0", border: "#D9C88F", image: "/images/categories/splendore.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5921, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#B89F6F",
  },
  "avventura": {
    title: "Avventura", slug: "avventura", price: 119.99, comparePrice: 239.99,
    colors: [{ name: "Verde salvia", bg: "#8CAA7C", border: "#6A8A5A", image: "/images/categories/avventura.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5921, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#6B8C5A",
  },
  "cipria": {
    title: "Cipria", slug: "cipria", price: 54.99, comparePrice: 54.99,
    colors: [{ name: "Rosa cipria", bg: "#E8C4C4", border: "#C98888", image: "/images/categories/cipria.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5901, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#C98888",
  },
  "bianca": {
    title: "Bianca", slug: "bianca", price: 74.99, comparePrice: 74.99,
    colors: [{ name: "Bianco", bg: "#F0EBE0", border: "#D9D0C0", image: "/images/categories/bianca.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5911, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#1B3A5C",
  },
  "tabacca": {
    title: "Tabacca", slug: "tabacca", price: 84.99, comparePrice: 84.99,
    colors: [{ name: "Tortora", bg: "#C4B49A", border: "#A0906F", image: "/images/categories/tabacca.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5901, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#8B7355",
  },
  "viola": {
    title: "Viola", slug: "viola", price: 79.99, comparePrice: 79.99,
    colors: [{ name: "Bianco/Lilla", bg: "#E8E0F5", border: "#C0A8E8", image: "/images/categories/viola.webp" }],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5921, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#9B7BC8",
  },
  "bellavia": {
    title: "Bellavia", slug: "bellavia", price: 49.99, comparePrice: 149.99,
    colors: [
      { name: "Tortora", bg: "#C4A882", border: "#A68B5E", dot: "#C4A882", image: "/images/land/bellavia/carosello/1.webp" },
      { name: "Bianco",  bg: "#F0EDE8", border: "#D0C8BE", dot: "#FFFFFF", image: "/images/land/bellavia/carosello/2.webp" },
      { name: "Nero",    bg: "#1A1A1A", border: "#000000", dot: "#1A1A1A", image: "/images/land/bellavia/carosello/3.webp" },
      { name: "Verde",   bg: "#4A7C59", border: "#2D5A3D", dot: "#4A7C59", image: "/images/land/bellavia/carosello/extra.webp" },
    ],
    sizes: SIZES_35_44, sizeToFullship: FULLSHIP_5901, upsellPrice: 4.99, upsellFullshipId: 5932,
    accentColor: "#C9813A",
  },
};

export function getOrderConfig(slug: string): OrderConfig {
  const cfg = ORDER_CONFIGS[slug];
  if (!cfg) throw new Error(`OrderConfig not found for slug: ${slug}`);
  return cfg;
}

export function getVariantImages(slug: string): string[] {
  const cfg = ORDER_CONFIGS[slug];
  if (!cfg || cfg.colors.length === 0) return [];
  return cfg.colors
    .slice(0, 4)
    .map((c, i) => c.image || `/images/land/${slug}/carosello/${i + 1}.webp`);
}
