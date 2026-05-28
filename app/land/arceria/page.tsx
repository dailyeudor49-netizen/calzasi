import type { Metadata } from "next";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { getProductBySlug, getReviewsBySlug, getShopConfig } from "@/lib/db";
import { getOrderConfig } from "@/lib/order-config";
import {
  HeroGallery,
  ReviewsSection,
  FeatureCard,
  SolutionBridgeAnimated,
  InstaCarousel,
  CtaOrderButton,
  ArceriaSelector,
  OrderSteps,
} from "./client";
import { OrderSection } from "@/components/OrderSection";
import { StickyOrderButton } from "@/components/StickyOrderButton";
import HowToOrder from "@/components/HowToOrder";
import RefundGuarantee from "@/components/RefundGuarantee";
import LandingShipping from "@/components/LandingShipping";
import LandingFAQ from "@/components/LandingFAQ";
import Link from "next/link";

export const dynamic = "force-dynamic";

const orderConfig = getOrderConfig("arceria");

/* ── Helpers ── */

function getCarouselImages(): string[] {
  const dir = path.join(process.cwd(), "public/images/land/arceria/carosello");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(webp|jpg|jpeg|png|avif)$/i.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((f) => `/images/land/arceria/carosello/${f}`);
}

function imgExists(publicPath: string): boolean {
  try { return fs.existsSync(path.join(process.cwd(), "public", publicPath)); } catch { return false; }
}

function ImgPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className ?? "aspect-video w-full"}`}
      style={{ backgroundColor: "#F6F7F8", border: "1px dashed #D7DCE2", borderRadius: "inherit" }}>
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#C4C0B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span className="text-xs font-medium" style={{ color: "#C4C0B8" }}>{label}</span>
    </div>
  );
}

function ImgWithFallback({
  src, alt, label, width, height, className, loading = "lazy", style,
}: {
  src: string; alt: string; label: string;
  width: number; height: number; className?: string; loading?: "lazy" | "eager"; style?: React.CSSProperties;
}) {
  if (imgExists(src)) {
    return <Image src={src} alt={alt} width={width} height={height} className={className} loading={loading} style={style} />;
  }
  return <ImgPlaceholder label={label} className={className} />;
}

/* ── Metadata ── */

export async function generateMetadata(): Promise<Metadata> {
  const product = await getProductBySlug("arceria");
  return {
    title: product ? `${product.name} — Sandalo Ortopedico Elastico | Calzasi` : "Arceria | Calzasi",
    description: "Sandalo ortopedico elastico che si infila come un calzino: tomaia a maglia che si adatta al piede, supporto alla caviglia, soletta memory foam e suola curva che scarica ginocchia e schiena.",
  };
}

/* ── Design tokens ── */
const DS = {
  brand:       "#1B3A5C",
  brandLight:  "#2D5A87",
  brandSubtle: "#E8EEF5",
  brandDark:   "#0F2540",
  cta:         "#1B3A5C",
  ctaHover:    "#0F2540",
  text:        "#1A1917",
  textSec:     "#5A5752",
  textMuted:   "#9B9790",
  bg:          "#FCFCFA",
  surface:     "#FFFFFF",
  muted:       "#FCFCFA",
  trust:       "#4D6E58",
  trustLight:  "#F0F4F1",
  border:      "#E2E4E8",
  borderMed:   "#D7DCE2",
} as const;

/* ════════════════════════════════════════════════════════════
   HERO SECTION
   ════════════════════════════════════════════════════════════ */

async function HeroSection() {
  const [product, reviews, shopConfig] = await Promise.all([
    getProductBySlug("arceria"),
    getReviewsBySlug("arceria"),
    getShopConfig(),
  ]);

  const reviewCount = (reviews as any[]).length;
  const avgRating = reviewCount > 0
    ? Number(((reviews as any[]).reduce((sum, r) => sum + Number(r.rating), 0) / reviewCount).toFixed(1))
    : 4.8;

  const images = getCarouselImages();
  const price = product ? Number(product.price) : 44.99;
  const originalPrice = product ? Number(product.original_price) : 89.98;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <section style={{ backgroundColor: "#fcfeff" }} className="w-full px-4 pt-0 pb-6 sm:px-6 lg:px-8 md:pt-5 md:pb-10">
      <div className="mx-auto max-w-7xl">
      <div className="grid items-start gap-4 md:gap-6 md:grid-cols-2 lg:[grid-template-columns:1.15fr_1fr]">

        {/* ── Gallery ── */}
        <HeroGallery images={images} />

        {/* ── Product info ── */}
        <div>
          {/* Label + Rating */}
          <div style={{ marginBottom: 14 }} className="flex items-center gap-3">
            <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
              style={{ backgroundColor: DS.brandSubtle, color: DS.brandDark }}>
              Sandalo Ortopedico Elastico
            </span>
            <a href="#recensioni" className="flex items-center gap-1.5 no-underline">
              <span className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" className="h-[15px] w-[15px]" fill="#D97706">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </span>
              <span className="text-[13px] font-bold" style={{ color: DS.text }}>{avgRating.toFixed(1).replace(".", ",")}</span>
              <span className="text-[13px] text-gray-400 underline underline-offset-2">({reviewCount})</span>
            </a>
          </div>

          {/* Title */}
          <h1 style={{ marginBottom: 12, color: "#1B1B1B", fontFamily: "var(--font-heading)", fontSize: 28, lineHeight: 1.1, letterSpacing: "-0.02em" }}
            className="font-extrabold md:text-[44px]">
            ARCERIA — <span style={{ color: "#4A4A4A" }}>Lo infili come un calzino. Comfort ortopedico.</span>
          </h1>

          {/* Description */}
          <p style={{ marginBottom: 32, color: DS.textSec }} className="text-[16px] leading-[1.65]">
            Tomaia elastica, supporto caviglia e suola curva che scarica ginocchia e schiena: <strong>comfort dal primo passo</strong>.
          </p>

          {/* Price block */}
          <div style={{ marginBottom: 5 }} className="flex items-baseline">
            <span className="text-[36px] font-extrabold leading-[1.20]" style={{ color: "#1B3A5C", fontFamily: "var(--font-heading)" }}>
              &euro;{price.toFixed(2).replace(".", ",")}
            </span>
            <span className="ml-4 text-[20px] font-normal line-through" style={{ color: "#B8B3AB" }}>&euro;{originalPrice.toFixed(2).replace(".", ",")}</span>
            <span className="ml-2 self-center rounded-md px-2.5 py-1 text-[15px] font-bold leading-none"
              style={{ backgroundColor: "#FDE8E8", color: "#D63031" }}>
              -{discount}%
            </span>
          </div>
          <p className="text-[11px]" style={{ color: "#B8B3AB", marginTop: -2, marginBottom: 18 }}>IVA inclusa</p>

          <div className="mb-3 h-px" style={{ backgroundColor: DS.border }} />

          {/* Feature bullets — 2-column grid */}
          <div className="mb-3.5 grid grid-cols-2 gap-x-5 gap-y-4 rounded-xl border p-4" style={{ borderColor: DS.border, backgroundColor: "#FCFCFA" }}>
            {[
              {
                icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#1B3A5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12s1.5 2 4 2 4-2 4-2"/><path d="M8 8h.01M16 8h.01"/></svg>,
                bold: "Tomaia a maglia elastica",
                rest: "Si adatta al piede come un calzino, senza punti di pressione",
              },
              {
                icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
                bold: "Calzata immediata",
                rest: "Senza lacci né fibbie: infili il piede e sei pronta",
              },
              {
                icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z"/><path d="M12 6v6"/><path d="M8 10h8"/></svg>,
                bold: "Caviglia protetta",
                rest: "Struttura stabile che sostiene caviglia e arco plantare",
              },
              {
                icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 00-1.66 0L2.6 6.08a1 1 0 000 1.83l8.58 3.91a2 2 0 001.66 0l8.58-3.9a1 1 0 000-1.83z"/><path d="m22 17.65-9.17 4.16a2 2 0 01-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 01-1.66 0L2 12.65"/></svg>,
                bold: "Memory foam anatomico",
                rest: "Si modella al piede e allevia la pressione sulla pianta",
              },
              {
                icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#1B3A5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 01.5-.87l7-3.5a1 1 0 011 0l7 3.5A1 1 0 0120 6z"/><path d="m9 12 2 2 4-4"/></svg>,
                bold: "Punta ampia e comoda",
                rest: "Spazio naturale per le dita, ideale con alluce valgo",
              },
              {
                icon: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#1B3A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13c1 3 5 6 9 6s8-3 9-6"/><line x1="7" y1="5" x2="17" y2="5"/><polyline points="14 2 17 5 14 8"/></svg>,
                bold: "Suola curva rocker",
                rest: "Scarica schiena e ginocchia, attiva i glutei camminando",
              },
            ].map((f, i) => (
              <div key={f.bold} className={`flex items-start gap-2.5${i >= 2 ? " border-t pt-4" : ""}`} style={i >= 2 ? { borderColor: "#E2E4E8" } : undefined}>
                <span className="mt-0.5 shrink-0">{f.icon}</span>
                <div>
                  <p className="text-[15px] font-bold leading-tight" style={{ color: DS.text }}>{f.bold}</p>
                  <p className="mt-0.5 text-[14px] leading-snug" style={{ color: DS.textSec }}>{f.rest}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Selector (color + size + scarcity + CTA) */}
          <div className="mt-6">
            <ArceriaSelector />
          </div>

          {/* Hidden OrderSection: riceve "sticky-order" e apre il modal */}
          <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
            <OrderSection config={orderConfig} image={images[0] || ""} />
          </div>

          {/* Microtrust */}
          <div className="mt-8 mb-8 flex justify-between gap-2 text-center">
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke={DS.trust} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, text: "Spedizione rapida" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke={DS.trust} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M17 2H7a2 2 0 00-2 2v16l7-3 7 3V4a2 2 0 00-2-2z"/><path d="M9 10l2 2 4-4"/></svg>, text: "Paghi alla consegna" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke={DS.trust} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.81.36 1.6.68 2.35a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.75.32 1.54.55 2.35.68A2 2 0 0122 16.92z"/></svg>, text: "Conferma telefonica" },
            ].map((item) => (
              <div key={item.text} className="flex flex-1 flex-col items-center gap-1.5">
                {item.icon}
                <span className="text-[13px] font-semibold leading-tight" style={{ color: DS.textSec }}>{item.text}</span>
              </div>
            ))}
          </div>

          <RefundGuarantee accentColor={DS.brand} />
          <HowToOrder accentColor={DS.trust} />
        </div>
      </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   TRUST STRIP
   ════════════════════════════════════════════════════════════ */

function TrustStrip() {
  const items = [
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
      title: "Spedizione rapida • 2-5 gg",
      sub: "Corriere espresso in tutta Italia",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
      title: "Paghi Solo al Corriere",
      sub: "Nessun pagamento anticipato, zero rischi",
    },
    {
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0"><path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
      title: "Reso Entro 30 Giorni",
      sub: "Soddisfatto o rimborsato, senza domande",
    },
  ];

  return (
    <div style={{ backgroundColor: "#FCFCFA", borderTop: `1px solid ${DS.border}`, borderBottom: `1px solid ${DS.border}` }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="divide-y md:hidden" style={{ divideColor: DS.border } as React.CSSProperties}>
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3.5 py-3.5">
              <span style={{ color: DS.trust }}>{item.icon}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: DS.text, fontFamily: "var(--font-heading)" }}>{item.title}</p>
                <p className="text-xs" style={{ color: DS.textMuted }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.title} className="flex items-center gap-3.5 py-4"
              style={{ borderRight: i < items.length - 1 ? `1px solid ${DS.border}` : "none", paddingLeft: i === 0 ? 0 : "2rem", paddingRight: i === items.length - 1 ? 0 : "2rem" }}>
              <span style={{ color: DS.trust }}>{item.icon}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: DS.text, fontFamily: "var(--font-heading)" }}>{item.title}</p>
                <p className="text-xs" style={{ color: DS.textMuted }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   WHY SECTION
   ════════════════════════════════════════════════════════════ */

function WhySection() {
  const rows = [
    {
      img: "/images/land/arceria/why/1.webp",
      alt: "Suola basculante Arceria",
      title: "Suola basculante",
      desc: "La curvatura della suola attiva i muscoli e redistribuisce il carico ad ogni passo, anche d'estate.",
      bg: "#FFFFFF",
    },
    {
      img: "/images/land/arceria/why/2.webp",
      alt: "Soletta memory foam Arceria",
      title: "Soletta in memory foam",
      desc: "Si adatta alla forma del piede e sostiene l'arco plantare: comfort costante anche a piedi nudi nel sandalo.",
      bg: "#FFFFFF",
    },
    {
      img: "/images/land/arceria/why/3.webp",
      alt: "Effetto tonificante Arceria",
      title: "Tonifica camminando",
      desc: "Glutei e gambe lavorano di più ad ogni passo: muscoli sodi e definiti senza rinunciare alla freschezza estiva.",
      bg: "#FFFFFF",
    },
  ];

  return (
    <section className="mx-auto max-w-3xl px-4 pt-10 pb-2 sm:px-6 lg:px-8 md:pt-14 md:pb-4" aria-labelledby="why-title">
      <div
        className="rounded-3xl p-5 md:p-8"
        style={{ border: `1px solid ${DS.border}`, backgroundColor: "#E8EEF5" }}
      >
        <div className="mb-6 text-center md:mb-8">
          <h2
            id="why-title"
            className="md:text-[34px]"
            style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 700, color: DS.text, marginBottom: 8, lineHeight: 1.3, letterSpacing: "-0.01em" }}
          >
            Perché <span style={{ color: DS.brand }}>Arceria</span> funziona
          </h2>
          <p className="mx-auto max-w-lg text-[16px]" style={{ color: DS.textSec, lineHeight: 1.6 }}>
            Suola curva, soletta anatomica e design aperto per il massimo comfort estivo.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {rows.map((r, i) => {
            const imgRight = i % 2 === 0;
            return (
              <div
                key={r.title}
                className={`flex flex-row items-center gap-4 overflow-hidden rounded-2xl p-4 md:gap-8 md:p-7${imgRight ? " flex-row-reverse" : ""}`}
                style={{ backgroundColor: r.bg, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
              >
                <div className="h-[90px] w-[90px] shrink-0 sm:h-[110px] sm:w-[110px] md:h-[140px] md:w-[140px]">
                  <ImgWithFallback
                    src={r.img}
                    alt={r.alt}
                    label={`Foto: ${r.alt}`}
                    width={280}
                    height={280}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h3
                    className="mb-2 text-[20px] font-extrabold md:text-[22px]"
                    style={{ fontFamily: "var(--font-heading)", color: DS.text, lineHeight: 1.2, letterSpacing: "-0.01em" }}
                  >
                    {r.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: DS.textSec, margin: 0 }}>
                    {r.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 md:mt-8">
          <div className="text-center">
            <CtaOrderButton
              className="inline-flex items-center justify-center px-8 py-3.5 text-[16px] font-bold transition-opacity hover:opacity-90 cursor-pointer"
              style={{ background: "linear-gradient(180deg, #FFB347 0%, #FF9900 100%)", color: "#111", borderRadius: 8, border: "1px solid #E68A00", boxShadow: "0 4px 12px rgba(255,153,0,0.40)", fontFamily: "'Poppins', system-ui, sans-serif", letterSpacing: "0.02em", textTransform: "uppercase" }}
            >
              Ordina ora → Paghi alla consegna
            </CtaOrderButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   FEATURES SECTION
   ════════════════════════════════════════════════════════════ */

const features = [
  {
    img: "/images/land/arceria/angle/1.webp",
    animated: true,
    alt: "Tomaia elastica resistente Arceria",
    title: "Si adatta, senza stringere",
    badge: "Elastica e resistente",
    tags: ["Come un calzino", "Zero pressione"],
    text: "La tomaia è <b>resistente ma elastica come un calzino</b>: avvolge il piede seguendo la sua forma naturale, <b>senza stringere</b> e senza creare punti di pressione — anche su piedi larghi, gonfi o sensibili.",
  },
  {
    img: "/images/land/arceria/angle/2.webp",
    alt: "Le infili e via Arceria",
    title: "Le infili e via",
    badge: "Zero allacciature",
    tags: ["Niente lacci", "Niente velcro"],
    text: "Niente lacci, fibbie o velcro: <b>infili il piede e sei pronta</b>. Ideale per chi fatica a chinarsi, ha dolori alla schiena o semplicemente vuole <b>uscire in un attimo</b>.",
  },
  {
    img: "/images/land/arceria/angle/3.webp",
    alt: "Supporto caviglia e arco plantare Arceria",
    title: "Supporto caviglia e arco plantare",
    badge: "Passo stabile",
    tags: ["Anti-storte", "Arco sostenuto"],
    text: "La struttura <b>sostiene l'arco plantare</b> e avvolge la caviglia proteggendola: <b>meno rischio di storte e slogamenti</b>, passo più stabile su qualsiasi superficie.",
  },
  {
    img: "/images/land/arceria/angle/4.webp",
    alt: "Soletta memory foam Arceria",
    title: "Soletta in memory foam",
    badge: "Sollievo plantare",
    tags: ["Anatomica", "Allevia il dolore"],
    text: "Soletta <b>anatomica in memory foam</b> che si modella al piede, <b>supporta l'arco plantare</b> e allevia il dolore: meno pressione sulla pianta, più comfort ad ogni passo.",
  },
  {
    img: "/images/land/arceria/angle/5.webp",
    alt: "Dita libere non compresse Arceria",
    title: "Dita libere, non compresse",
    badge: "Alluce valgo",
    tags: ["Dita nella posizione naturale", "Zero compressione"],
    text: "La punta ampia <b>non comprime le dita</b>: restano nella loro posizione naturale, senza pressione sull'alluce. <b>Aiuta ad alleviare l'alluce valgo</b> e il fastidio che ne deriva.",
  },
  {
    img: "/images/land/arceria/angle/6.webp",
    alt: "Benefici postura Arceria",
    title: "Benefici per la postura",
    badge: "Postura e glutei",
    tags: ["Scarica ginocchia e schiena", "Tonifica i glutei"],
    text: "Il peso viene <b>distribuito in modo uniforme</b>, scaricando ginocchia e schiena dal carico. La <b>suola rocker</b> attiva i glutei durante la camminata e aiuta a <b>tonificarli</b> passo dopo passo.",
  },
];

function FeaturesSection() {
  return (
    <section className="pt-20 pb-12 md:pt-28 md:pb-16" id="benefici-arceria" aria-label="Caratteristiche Arceria" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SolutionBridgeAnimated
        bg="transparent"
        textColor={DS.text}
        brandColor={DS.brand}
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <FeatureCard key={f.title} id={f.title}>
            <article
              className="flex h-full flex-col overflow-hidden"
              style={{ backgroundColor: "#fff", borderRadius: 14, boxShadow: "0 1px 3px rgba(26,25,23,0.04)" }}
            >
              <div className="relative">
                {f.animated ? (
                  imgExists(f.img)
                    ? <img src={f.img} alt={f.alt} className="aspect-square w-full object-cover" style={{ borderRadius: "14px 14px 0 0", display: "block" }} loading="lazy" />
                    : <ImgPlaceholder label={`Foto: ${f.alt}`} className="aspect-square w-full" />
                ) : (
                  <ImgWithFallback src={f.img} alt={f.alt} label={`Foto: ${f.alt}`} width={600} height={600} className="aspect-square w-full object-cover" style={{ borderRadius: "14px 14px 0 0", display: "block" }} />
                )}
                <svg className="absolute left-0 w-full" viewBox="0 0 400 24" preserveAspectRatio="none" style={{ height: 26, bottom: -2, display: "block" }}>
                  <path d="M0 24 C0 11 50 0 110 0 L290 0 C350 0 400 11 400 24 Z" fill="#fff" />
                </svg>
              </div>
              <div className="px-4 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
                    style={{ backgroundColor: DS.brandSubtle, color: DS.brandDark, borderRadius: 5 }}>
                    {f.badge}
                  </span>
                  {f.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium"
                      style={{ backgroundColor: "#ECEEF2", color: DS.textSec, borderRadius: 5 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-5 pt-3">
                <h3 className="mb-2 text-[23px] font-extrabold leading-snug" style={{ color: DS.text, fontFamily: "var(--font-heading)", letterSpacing: "-0.018em" }}>{f.title}</h3>
                <p className="text-[16px] leading-relaxed" style={{ color: DS.textSec }} dangerouslySetInnerHTML={{ __html: f.text }} />
              </div>
            </article>
          </FeatureCard>
        ))}
      </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   INSTA EXPERIENCES SECTION
   ════════════════════════════════════════════════════════════ */

function InstaExperiencesSection() {
  const instaDir = path.join(process.cwd(), "public/images/land/arceria/insta");
  let photos: string[] = [];
  try {
    photos = fs.readdirSync(instaDir)
      .filter((f: string) => /\.(webp|jpg|jpeg|png)$/i.test(f))
      .sort((a: string, b: string) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f: string) => `/images/land/arceria/insta/${f}`);
  } catch { /* cartella non esiste ancora */ }

  if (photos.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-16" id="insta-experiences" aria-label="Insta Experiences">
      <div className="rounded-3xl border p-4 md:p-6" style={{ borderColor: DS.border, backgroundColor: DS.bg }}>
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <linearGradient id="ig-grad-ar" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FCAF45" />
              <stop offset="25%" stopColor="#F77737" />
              <stop offset="50%" stopColor="#E1306C" />
              <stop offset="75%" stopColor="#C13584" />
              <stop offset="100%" stopColor="#833AB4" />
            </linearGradient>
          </defs>
        </svg>

        <header className="mb-6 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="url(#ig-grad-ar)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-grad-ar)" stroke="none" />
            </svg>
            <span className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{
              background: "linear-gradient(135deg, #833AB4, #C13584, #E1306C, #F77737, #FCAF45)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Insta Experiences</span>
          </div>
          <h2 className="mb-1 text-xl font-extrabold md:text-2xl" style={{ color: DS.text, fontFamily: "var(--font-heading)" }}>
            Le nostre clienti ci taggano
          </h2>
          <p className="text-[15px]" style={{ color: DS.textSec }}>
            Foto reali di chi ha scelto <b>Arceria</b> e condivide la propria esperienza.
          </p>
        </header>

        <InstaCarousel photos={photos} />

        <p className="mt-4 text-center text-[13px] leading-relaxed" style={{ color: DS.textMuted }}>
          Pubblica una foto dopo l&apos;acquisto e usa l&apos;hashtag{" "}
          <span className="font-bold" style={{
            background: "linear-gradient(135deg, #833AB4, #C13584, #E1306C, #F77737, #FCAF45)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>#arceria</span>{" "}
          per essere pubblicata sul nostro sito.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE ROOT
   ════════════════════════════════════════════════════════════ */

export default async function ArceriaLanding() {
  const [reviews, shopConfig] = await Promise.all([
    getReviewsBySlug("arceria"),
    getShopConfig(),
  ]);

  const reviewCount = (reviews as any[]).length;
  const avgRating = reviewCount > 0
    ? Number(((reviews as any[]).reduce((sum, r) => sum + Number(r.rating), 0) / reviewCount).toFixed(1))
    : 4.8;
  const stats = { count: reviewCount, avg: avgRating };
  const shopEmail = shopConfig.shop_email || "info@calzasi.com";

  return (
    <div>
      <StickyOrderButton config={orderConfig} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes arTopBar { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}} />

      {/* TopBar ticker */}
      <div style={{ backgroundColor: "#1A3D28", color: "#A8D8B8", padding: "9px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-flex", gap: 56, animation: "arTopBar 28s linear infinite", willChange: "transform" }}>
          {[...Array(3)].map((_, k) =>
            ["Pagamento alla consegna", "Spedizione 2-5 giorni", "Reso 30 giorni", "Assistenza italiana"].map((t, j) => (
              <span key={`${k}-${j}`} style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.03em" }}>
                {t}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Header sticky */}
      <header style={{ borderBottom: "1px solid #E9DED0", padding: "14px 20px", backgroundColor: "rgba(254,254,254,0.96)", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 10px 30px rgba(46,31,20,0.06)", backdropFilter: "blur(14px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <Image src="/images/shop/logo.webp" alt="Calzasi" width={160} height={54} style={{ height: 48, width: "auto", objectFit: "contain" }} />
          </Link>
          <CtaOrderButton
            style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 14, fontWeight: 600, background: "linear-gradient(180deg, #FFB347 0%, #FF9900 100%)", color: "#111", padding: "11px 24px", borderRadius: 8, border: "1px solid #E68A00", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(255,153,0,0.35)" }}
          >
            Ordina ora
          </CtaOrderButton>
        </div>
      </header>

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Trust strip */}
      <TrustStrip />

      {/* 2b. Come ordinare (3 step animati) */}
      <OrderSteps />

      {/* 3. Why */}
      <div style={{ backgroundColor: "#FFFFFF" }}>
        <WhySection />
      </div>

      {/* 4. Features + Solution bridge */}
      <div style={{ backgroundColor: "#FCFCFA" }}>
        <FeaturesSection />
      </div>

      {/* 5. Insta Experiences */}
      <div style={{ backgroundColor: "#FFFFFF" }}>
        <InstaExperiencesSection />
      </div>

      {/* 6. Reviews */}
      <div style={{ backgroundColor: "#FFFFFF" }}>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
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
            accentColor={DS.brand}
            shopName={shopConfig.shop_name || "Calzasi"}
            slug="arceria"
          />
        </section>
      </div>

      {/* 7. FAQ */}
      <LandingFAQ shopEmail={shopEmail} accentColor={DS.brand} />

      {/* 8. Shipping */}
      <LandingShipping accentColor={DS.brand} />

      {/* 9. Resi & Assistenza */}
      <div style={{ backgroundColor: "#FFFCF7", padding: "58px 20px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gap: 26, gridTemplateColumns: "1.05fr 0.95fr", alignItems: "center" }} className="ar-resi-grid">
          <div style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 18px 54px rgba(30,27,24,0.12)" }}>
            <Image src="/images/shop/store-interior.webp" alt="Calzasi - il nostro negozio" width={640} height={360} style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} />
          </div>
          <div>
            <p style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9B5A22", marginBottom: 12 }}>Resi e assistenza</p>
            <h3 style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 700, color: "#17120E", marginBottom: 16, letterSpacing: "-0.035em", lineHeight: 1.06 }}>
              Non spariamo dopo l&apos;ordine. Rispondiamo davvero.
            </h3>
            <p style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 17, color: "#5F554C", lineHeight: 1.7, marginBottom: 18, maxWidth: 560 }}>
              Se qualcosa non va, scrivi a{" "}
              <a href={`mailto:${shopEmail}`} style={{ color: "#9B5A22", fontWeight: 600 }}>{shopEmail}</a>
              {" "}con numero ordine e motivo. Ricevi risposta entro 24 ore e, se serve, rimborso in 3-5 giorni lavorativi.
            </p>
            <p style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 15, fontWeight: 600, color: "#17120E", backgroundColor: "#F0E2CF", border: "1px solid #DFD0BD", borderRadius: 6, padding: "14px 16px", display: "inline-flex" }}>
              Hai 30 giorni dalla consegna per restituire il prodotto.
            </p>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 860px) {
            .ar-resi-grid { grid-template-columns: 1fr !important; }
          }
        `}} />
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#fefefe", borderTop: "1px solid #E9DED0", padding: "40px 20px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <Image src="/images/shop/logo.webp" alt="Calzasi" width={160} height={54} style={{ height: 48, width: "auto", objectFit: "contain", marginBottom: 12 }} />
              <p style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 13, color: "#6B655E", lineHeight: 1.6, maxWidth: 220 }}>
                Calzasi.com. Scarpe ortopediche e comfort online.
              </p>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A6E8A", marginBottom: 12 }}>Shop</p>
                {[["Catalogo", "/catalogo"], ["Spedizioni", "/spedizioni"], ["Resi", "/politica-resi"]].map(([l, h]) => (
                  <Link key={l} href={h} style={{ display: "block", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 14, color: "#4A5568", textDecoration: "none", marginBottom: 8 }}>{l}</Link>
                ))}
              </div>
              <div>
                <p style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5A6E8A", marginBottom: 12 }}>Legale</p>
                {[["Privacy", "/privacy-policy"], ["Cookie", "/cookie-policy"], ["Termini", "/termini-e-condizioni"]].map(([l, h]) => (
                  <Link key={l} href={h} style={{ display: "block", fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 14, color: "#4A5568", textDecoration: "none", marginBottom: 8 }}>{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #E9DED0", paddingTop: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 13, color: "#9CA3AF" }}>© 2026 Calzasi. Tutti i diritti riservati.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 18, fontWeight: 700, color: "#1E7A48" }}>€44,99</span>
              <CtaOrderButton
                style={{ fontFamily: "'Poppins', system-ui, sans-serif", fontSize: 14, fontWeight: 700, background: "linear-gradient(180deg, #FFB347 0%, #FF9900 100%)", color: "#111", padding: "10px 22px", borderRadius: 8, border: "1px solid #E68A00", cursor: "pointer", boxShadow: "0 4px 10px rgba(255,153,0,0.35)" }}
              >
                Ordina ora
              </CtaOrderButton>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
