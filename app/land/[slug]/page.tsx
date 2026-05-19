import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getProductBySlug, getReviewsBySlug, getReviewStats, getShopConfig } from "@/lib/db";
import { getOrderConfig } from "@/lib/order-config";
import { HeroGallery, ReviewsSection, FeatureCard, StatsSection, ReviewImageCarousel } from "./client";
import { OrderSection } from "@/components/OrderSection";
import { StickyOrderButton } from "@/components/StickyOrderButton";
import HowToOrder from "@/components/HowToOrder";
import RefundGuarantee from "@/components/RefundGuarantee";
import LandingShipping from "@/components/LandingShipping";
import LandingRefund from "@/components/LandingRefund";
import LandingFAQ from "@/components/LandingFAQ";

export const dynamic = "force-dynamic";

/* ══════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════ */

function getCarouselImages(slug: string): string[] {
  const dir = path.join(process.cwd(), `public/images/land/${slug}/carosello`);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((f) => `/images/land/${slug}/carosello/${f}`);
}

function getReviewImages(slug: string): string[] {
  const candidates = ["RECENSIONI", "recensioni", "Recensioni"];
  for (const folder of candidates) {
    const dir = path.join(process.cwd(), `public/images/land/${slug}/${folder}`);
    if (fs.existsSync(dir)) {
      return fs
        .readdirSync(dir)
        .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))
        .sort()
        .map((f) => `/images/land/${slug}/${folder}/${encodeURIComponent(f)}`);
    }
  }
  return [];
}

function imgExists(slug: string, filename: string): boolean {
  return fs.existsSync(path.join(process.cwd(), `public/images/land/${slug}/${filename}`));
}

/* ══════════════════════════════════════════════════════
   Metadata
   ══════════════════════════════════════════════════════ */

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.name} - ${product.subtitle}` : slug,
    description: (product?.description as string) || "",
  };
}

/* ══════════════════════════════════════════════════════
   Feature card data — conditional on image existence
   ══════════════════════════════════════════════════════ */

interface FeatureCardData {
  file: string;
  badge: string;
  tags: string[];
  description: string;
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    // tech-1 (rocker ortopedico) ↔ scambiato con anti-scivolo
    file: "scivolo.webp",
    badge: "Suola curva",
    tags: ["Impulso in avanti", "Meno stress articolare"],
    description: "La <b>suola curva</b> favorisce l'oscillazione e ti spinge in avanti: cammini con <b>meno stress</b> su ginocchia e schiena.",
  },
  {
    file: "tech-2.webp",
    badge: "Attiva i glutei",
    tags: ["Attiva i glutei", "Estensione dell'anca"],
    description: "Il rocker stimola l'<b>estensione dell'anca</b> e l'attivazione dei glutei: li senti <b>lavorare di più</b> ad ogni passo.",
  },
  {
    file: "plantare.webp",
    badge: "Supporto arco",
    tags: ["Anti-dolore", "Tallone stabile"],
    description: "Supporto mirato a <b>arco</b> e <b>tallone</b> per appoggio stabile, postura più allineata e minori sovraccarichi. <b>Mai più dolore e piedi gonfi.</b>",
  },
  {
    file: "tech-4.webp",
    badge: "Anti-urto",
    tags: ["Doppio ammortizzamento", "Comfort prolungato"],
    description: "<b>Doppio strato ammortizzante</b> che assorbe gli impatti: comfort superiore anche nelle camminate più lunghe.",
  },
  {
    file: "tech-5.webp",
    badge: "Piede asciutto",
    tags: ["Termoregolante", "Antiodore"],
    description: "Tomaia premium <b>traspirante e termoregolante</b>, antiodore: piede asciutto e comfort costante.",
  },
  {
    // tech-6 (anti-scivolo) ↔ scambiato con rocker ortopedico
    file: "ortopedic.webp",
    badge: "Grip sicuro",
    tags: ["Aderenza su bagnato", "Aderenza certificata"],
    description: "<b>Aderenza avanzata</b> e tasselli profondi: passi sicuri su più superfici, anche su bagnato.",
  },
];

/* ══════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════ */

export default async function DynamicLanding({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Validate: slug must exist in order-config
  let orderConfig;
  try {
    orderConfig = getOrderConfig(slug);
  } catch {
    notFound();
  }

  const [product, reviews, shopConfig] = await Promise.all([
    getProductBySlug(slug),
    getReviewsBySlug(slug),
    getShopConfig(),
  ]);
  if (!product) notFound();

  const stats = await getReviewStats(product.id as number);
  const images = getCarouselImages(slug);
  const reviewImages = getReviewImages(slug);
  const price = Number(product.price);
  const originalPrice = Number(product.original_price);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
  const productName = product.name as string;
  const accentColor = (product.color as string) || "#16a34a";
  const features = (product.features as string[]) || [];

  // Feature cards: show only those whose image exists in the product folder
  const availableFeatureCards = FEATURE_CARDS.filter((fc) => imgExists(slug, fc.file));

  // Stats section: show only if stats.webp exists
  const hasStats = imgExists(slug, "stats.webp");

  return (
    <div className="overflow-x-hidden" data-pa-font style={{ backgroundColor: "#ffffff", fontFamily: "var(--font-body)" }}>
      <style>{`
        [data-pa-font] { font-family: var(--font-body) !important; }
        [data-pa-font] h1, [data-pa-font] h2, [data-pa-font] h3, [data-pa-font] h4 { font-family: var(--font-heading) !important; letter-spacing: -0.015em; font-weight: 700 !important; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        [data-pa-font] h1 { font-size: 1.6875rem !important; }
        [data-pa-font] h2 { font-size: 1.5rem !important; }
        @media (min-width: 768px) { [data-pa-font] h1 { font-size: 2.0625rem !important; } [data-pa-font] h2 { font-size: 1.875rem !important; } }

        [data-pa-font] #ordina > span { font-size: 1.125rem !important; }
        [data-pa-font] button.rounded-full[style*="border-color"]:not(.w-\\[50px\\]) { padding: 0.625rem 1.25rem !important; font-size: 1rem !important; }
        [data-pa-font] button.rounded-full[style*="border-color"] > span.rounded-full { width: 1.25rem !important; height: 1.25rem !important; }
        .feature-card-desktop { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .feature-card-desktop:hover { transform: translateY(-4px) scale(1.05); box-shadow: 0 8px 30px rgba(0,0,0,0.18) !important; }
      `}</style>
      <StickyOrderButton config={orderConfig} />

      {/* ── HERO SECTION ── */}
      <section className="mx-auto max-w-7xl px-4 pt-2 pb-10 md:pt-10 md:pb-14 sm:px-6 lg:px-8 overflow-hidden">
        {/* Review bar */}
        {stats.count > 0 && (
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 rounded-md py-2 px-3 text-xs sm:text-sm" style={{ backgroundColor: `${accentColor}14` }}>
            <strong style={{ color: "#333" }}>{stats.avg}</strong>
            <span className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill={i <= Math.round(stats.avg) ? "#D97706" : "#D6D6D6"}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            <span style={{ color: "#333" }}>Valutato <strong>Eccellente</strong></span>
            <span className="hidden sm:inline" style={{ color: "#666" }}>&mdash; <strong>{stats.count}</strong> recensioni verificate</span>
          </div>
        )}

        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          {/* Gallery (client) */}
          <HeroGallery images={images} />

          {/* Product Info */}
          <div>
            {/* Label + Rating */}
            <div style={{ marginBottom: 12 }} className="flex flex-wrap items-center gap-y-2">
              <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em]"
                style={{ backgroundColor: `${accentColor}18`, color: accentColor, marginRight: 20 }}>
                {(product.category_label as string) || "Scarpe Ortopediche"}
              </span>
              <a href="#recensioni" className="flex items-center gap-1.5 no-underline">
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="#D97706">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </span>
                <span className="text-xs font-bold" style={{ color: "#1A1917" }}>{stats.avg}</span>
                <span className="text-sm text-gray-400 underline underline-offset-2">({stats.count} recensioni)</span>
              </a>
            </div>

            {/* Title */}
            <h1 style={{ marginBottom: 14, color: "#1A1917", fontFamily: "var(--font-heading)", lineHeight: 1.22, letterSpacing: "-0.015em" }}
              className="font-bold text-[27px] md:text-[33px]">
              <span style={{ color: accentColor }}>{productName}</span> &mdash; {product.subtitle as string}
            </h1>
            <p style={{ marginBottom: 18, color: "#5A5752", fontFamily: "var(--font-body)" }} className="text-[16px] leading-[1.65]">
              {product.description as string}
            </p>

            {/* Price */}
            <div style={{ marginBottom: 5 }} className="flex items-baseline">
              <span className="text-[36px] font-extrabold leading-none" style={{ color: "#15803d", fontFamily: "var(--font-heading)" }}>&euro;{price.toFixed(2).replace(".", ",")}</span>
              {discount > 0 && (
                <>
                  <span className="ml-4 text-[16px] font-normal line-through" style={{ color: "#B8B3AB" }}>&euro;{originalPrice.toFixed(2).replace(".", ",")}</span>
                  <span className="ml-2 self-center rounded-md px-2.5 py-1 text-[15px] font-bold leading-none"
                    style={{ backgroundColor: "#FDE8E8", color: "#D63031" }}>-{discount}%</span>
                </>
              )}
            </div>
            <div style={{ marginBottom: 6 }} className="flex items-center gap-1.5">
              <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: "#D63031", opacity: 0.45 }} />
                <span className="absolute inset-0 rounded-full" style={{ backgroundColor: "#D63031", boxShadow: "0 0 4px #D63031" }} />
              </span>
              <span className="text-[13px] font-semibold" style={{ color: "#D63031" }}>Disponibilit&agrave; limitata</span>
            </div>

            {/* Divider */}
            <div className="mb-3 h-px" style={{ backgroundColor: "#EBE5DA" }} />

            {/* Feature bullets — from DB features[] */}
            {features.length > 0 && (
              <>
                <h3 className="text-lg font-extrabold mb-3" style={{ color: accentColor, fontFamily: "var(--font-heading)" }}>Perch&eacute; scegliere <span style={{ color: accentColor }}>{productName}</span>?</h3>
                <div className="mb-3.5 overflow-hidden border" style={{ borderColor: "#EBE5DA", backgroundColor: "#faf8f5", borderRadius: 12 }}>
                  {features.map((feat, i) => (
                    <div key={feat} className={`flex items-start gap-3 px-4 py-3 ${i > 0 ? "border-t" : ""}`} style={{ borderColor: "#EBE5DA", backgroundColor: i % 2 === 0 ? "#faf8f5" : "#FFFFFF" }}>
                      <span className="flex h-7 w-7 min-w-[28px] shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${accentColor}14` }}>
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-[15px] leading-snug" style={{ color: "#5A5752", fontFamily: "var(--font-body)" }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Order section */}
            <OrderSection config={orderConfig} image={images[0] || ""} />

            {/* Microtrust */}
            <div className="mt-2.5 flex flex-col sm:flex-row gap-2 sm:gap-4">
              {["Pagamento contanti alla consegna", "Conferma via chiamata o messaggio", "Spedizione 4,99 € • 2-5 gg"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[12px] font-medium leading-snug" style={{ color: "#5A5752" }}>
                  <svg viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill={accentColor}>
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.35 5.35l-4 4a.5.5 0 01-.7 0l-2-2a.5.5 0 01.7-.7L7 9.29l3.65-3.64a.5.5 0 01.7.7z"/>
                  </svg>
                  {t}
                </span>
              ))}
            </div>

            {/* How to order */}
            <HowToOrder accentColor={accentColor} />

            {/* Refund guarantee */}
            <RefundGuarantee accentColor={accentColor} />

          </div>
        </div>
      </section>

      {/* ── WHY SECTION — first 3 features ── */}
      {features.length >= 3 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                I vantaggi
              </p>
              <h2
                className="text-2xl font-extrabold sm:text-3xl"
                style={{ fontFamily: "var(--font-heading)", color: "#1A1917" }}
              >
                Perch&eacute; scegliere {productName}
              </h2>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {features.slice(0, 3).map((feat) => (
                <div
                  key={feat}
                  className="rounded-2xl p-4 sm:p-5 text-center"
                  style={{ backgroundColor: "#faf8f5", border: "1px solid #EBE5DA" }}
                >
                  <div className="flex justify-center mb-3">
                    <div
                      className="rounded-full p-2.5"
                      style={{ backgroundColor: `${accentColor}15` }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3
                    className="font-extrabold mb-2"
                    style={{ fontSize: 18, fontFamily: "var(--font-heading)", color: "#1A1917" }}
                  >
                    {feat}
                  </h3>
                  <p className="text-[16px] leading-relaxed" style={{ color: "#5A5752", fontFamily: "var(--font-body)" }}>
                    Una caratteristica pensata per il tuo comfort quotidiano e il benessere dei tuoi piedi.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURES SECTION — conditional on images ── */}
      {availableFeatureCards.length > 0 && (
        <section className="py-12 sm:py-16" style={{ backgroundColor: "#faf8f5" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                Caratteristiche
              </p>
              <h2
                className="text-2xl font-extrabold sm:text-3xl"
                style={{ fontFamily: "var(--font-heading)", color: "#1A1917" }}
              >
                Tecnologie {productName}
              </h2>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {availableFeatureCards.map((fc) => (
                <FeatureCard
                  key={fc.file}
                  image={`/images/land/${slug}/${fc.file}`}
                  badge={fc.badge}
                  tags={fc.tags}
                  description={fc.description}
                  accentColor={accentColor}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COMPARE SECTION ── */}
      {features.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 flex justify-center">
              <span className="rounded px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.1em]"
                style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                Confronto
              </span>
            </div>
            <header className="mb-10 text-center">
              <h2 className="mb-3 text-2xl font-bold md:text-3xl" style={{ color: "#1A1917", fontFamily: "var(--font-heading)" }}>
                Perch&eacute; scegliere {productName}
              </h2>
              <p className="mx-auto max-w-xl text-[15px]" style={{ color: "#5A5752", fontFamily: "var(--font-body)" }}>
                Il confronto onesto tra ci&ograve; di cui hai veramente bisogno per camminare meglio e una scarpa qualunque.
              </p>
            </header>

            <div className="overflow-x-auto rounded-2xl border shadow-sm" style={{ borderColor: "#EBE5DA", backgroundColor: "#FFFFFF" }}>
              {/* Table Header */}
              <div className="grid grid-cols-[1fr_90px_72px] sm:grid-cols-[1fr_120px_100px] md:grid-cols-[1fr_170px_150px]" style={{ backgroundColor: "#011d3a" }}>
                <div className="flex items-center px-3 py-3.5 text-[11px] font-bold uppercase tracking-wider sm:px-5 sm:py-4 sm:text-xs" style={{ color: "#ffffff" }}>
                  Caratteristiche
                </div>
                <div className="flex flex-col items-center justify-center border-l border-white/10 py-3.5 text-center text-xs font-extrabold sm:py-4 sm:text-sm" style={{ color: "#ffffff", fontFamily: "var(--font-heading)" }}>
                  {productName}
                </div>
                <div className="flex flex-col items-center justify-center border-l border-white/10 py-3.5 text-center text-xs font-extrabold sm:py-4 sm:text-sm" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-heading)" }}>
                  Scarpa comune
                </div>
              </div>

              {/* Rows — max 6 features */}
              {features.slice(0, 6).map((feature, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_90px_72px] transition hover:bg-[#faf8f5] sm:grid-cols-[1fr_120px_100px] md:grid-cols-[1fr_170px_150px]"
                  style={{ borderTop: "1px solid #EBE5DA", backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#faf8f5" }}
                >
                  <div className="flex items-center px-3 py-3 sm:px-5 sm:py-4">
                    <span className="text-[13px] leading-snug sm:text-[16px] font-medium" style={{ color: "#1A1917", fontFamily: "var(--font-body)" }}>
                      {feature}
                    </span>
                  </div>
                  <div className="flex items-center justify-center border-l-[3px] py-3 sm:py-4" style={{ borderColor: accentColor }}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full shadow-sm sm:h-10 sm:w-10" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-center border-l py-3 sm:py-4" style={{ borderColor: "#EBE5DA" }}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full shadow-sm sm:h-10 sm:w-10" style={{ backgroundColor: "#FEE2E2", color: "#EF4444" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:h-5 sm:w-5">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-gray-400" style={{ fontFamily: "var(--font-body)" }}>
              Valutazioni interne su comfort e distribuzione delle pressioni del piede. Le esperienze possono variare.
            </p>
          </div>
        </section>
      )}

      {/* ── STATS SECTION — conditional ── */}
      {hasStats && (
        <section className="py-12 sm:py-16" style={{ backgroundColor: "#faf8f5" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <StatsSection
              accentColor={accentColor}
              image={`/images/land/${slug}/stats.webp`}
            />
          </div>
        </section>
      )}

      {/* ── LE STORIE — infinity loop carousel of customer photos ── */}
      {reviewImages.length > 0 && (
        <section className="py-12 sm:py-16 overflow-hidden" style={{ backgroundColor: "#faf8f5" }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                Community
              </p>
              <h2 className="text-2xl font-extrabold sm:text-3xl" style={{ fontFamily: "var(--font-heading)", color: "#1A1917" }}>
                Le storie di chi indossa {productName} ogni giorno
              </h2>
            </div>
          </div>
          <ReviewImageCarousel images={reviewImages} />
        </section>
      )}

      {/* ── REVIEWS SECTION ── */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ReviewsSection
            reviews={(reviews as any[]).map((r) => ({
              id: r.id as number,
              author_name: r.author_name as string,
              rating: r.rating as number,
              body: r.body as string,
              created_at: r.created_at as string,
              reply: (r.reply as string) || null,
            }))}
            stats={stats}
            accentColor={accentColor}
            shopName={shopConfig.shop_name || "Calzasi"}
            slug={slug}
          />
        </div>
      </section>

      {/* ── SHARED: FAQ ── */}
      <LandingFAQ shopEmail={shopConfig.shop_email || "info@calzasi.com"} accentColor={accentColor} />

      {/* ── SHARED: SHIPPING ── */}
      <LandingShipping accentColor={accentColor} />

      {/* ── SHARED: REFUND ── */}
      <LandingRefund accentColor={accentColor} />
    </div>
  );
}
