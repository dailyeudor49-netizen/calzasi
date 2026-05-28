"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

/* ───────────────────────── Hero Badge ───────────────────────── */

const HERO_BADGE_MESSAGES = [
  "Alta richiesta oggi",
  "Ultimi pezzi in alcune taglie",
  "Vendute 20+ in 24h",
];

function HeroBadge() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % HERO_BADGE_MESSAGES.length);
        setFading(false);
      }, 350);
    }, 3750);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="absolute top-3 right-3 z-10 max-w-fit select-none"
      style={{
        backgroundColor: "rgba(26,25,23,0.78)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        borderRadius: 6,
        padding: "3px 7px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        transition: "opacity 350ms ease",
        opacity: fading ? 0 : 1,
      }}
    >
      <span
        className="whitespace-nowrap text-[13px] font-semibold leading-none md:text-[14px]"
        style={{ color: "#FFFFFF", letterSpacing: "0.01em" }}
      >
        {HERO_BADGE_MESSAGES[index]}
      </span>
    </div>
  );
}

/* ───────────────────────── Hero Gallery ───────────────────────── */

const THUMBS_VISIBLE = 5;

export function HeroGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const total = images.length;
  const swipeRef = useRef<number | null>(null);
  const isDrag = useRef(false);

  useEffect(() => {
    if (active < thumbStart) setThumbStart(active);
    else if (active >= thumbStart + THUMBS_VISIBLE) setThumbStart(active - THUMBS_VISIBLE + 1);
  }, [active, thumbStart]);

  useEffect(() => {
    if (!autoplay || total <= 1) return;
    const id = setInterval(() => {
      setActive((a) => (a === total - 1 ? 0 : a + 1));
    }, 5000);
    return () => clearInterval(id);
  }, [autoplay, total]);

  const prev = () => { setAutoplay(false); setActive((a) => (a === 0 ? total - 1 : a - 1)); };
  const next = () => { setAutoplay(false); setActive((a) => (a === total - 1 ? 0 : a + 1)); };

  if (total === 0) return (
    <div className="md:sticky md:top-24">
      <div className="relative aspect-square overflow-hidden rounded-2xl -mx-4 sm:-mx-6 md:mx-0 md:rounded-2xl md:border"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E4E8" }}>
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl" style={{ backgroundColor: "#E2E4E8" }}>
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="#9B9790" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: "#9B9790" }}>Arceria</p>
            <p className="mt-1 text-xs" style={{ color: "#C4C0B8" }}>Foto prodotto in arrivo</p>
          </div>
          <HeroBadge />
        </div>
      </div>
    </div>
  );

  const visibleThumbs = images.slice(thumbStart, thumbStart + THUMBS_VISIBLE);

  return (
    <div className="md:sticky md:top-24">
      <div
        className="relative aspect-square overflow-hidden -mx-4 sm:-mx-6 md:mx-0 md:rounded-lg md:border md:border-gray-200 bg-white md:shadow-sm select-none"
        onTouchStart={(e) => { swipeRef.current = e.touches[0].clientX; isDrag.current = false; }}
        onTouchEnd={(e) => { if (swipeRef.current !== null && e.changedTouches.length > 0) { const dx = e.changedTouches[0].clientX - swipeRef.current; if (Math.abs(dx) > 50) { isDrag.current = true; if (dx < 0) next(); else prev(); } } swipeRef.current = null; }}
        onMouseDown={(e) => { swipeRef.current = e.clientX; isDrag.current = false; }}
        onMouseMove={(e) => { if (swipeRef.current !== null && Math.abs(e.clientX - swipeRef.current) > 5) isDrag.current = true; }}
        onMouseUp={(e) => { if (swipeRef.current !== null) { const dx = e.clientX - swipeRef.current; if (isDrag.current && Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); } } swipeRef.current = null; }}
        onMouseLeave={() => { swipeRef.current = null; }}
      >
        <img
          key={active}
          src={images[active]}
          alt={`Arceria - Foto ${active + 1}`}
          className="h-full w-full object-cover animate-fade-in"
        />
        <button onClick={prev} className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition hover:scale-105" style={{ backgroundColor: "rgba(255,255,255,0.82)", color: "#1A1917" }} aria-label="Immagine precedente">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={next} className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition hover:scale-105" style={{ backgroundColor: "rgba(255,255,255,0.82)", color: "#1A1917" }} aria-label="Immagine successiva">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <HeroBadge />
      </div>
      {/* Thumbnails */}
      <div className="mt-3 flex items-center gap-1.5 px-4 sm:px-6 md:px-0">
        {total > THUMBS_VISIBLE && (
          <button
            onClick={() => setThumbStart((s) => Math.max(0, s - 1))}
            disabled={thumbStart === 0}
            className="flex h-8 w-8 shrink-0 items-center justify-center transition disabled:opacity-30"
            style={{ borderRadius: 8, backgroundColor: "#FCFCFA", color: "#5A5752" }}
            aria-label="Miniature precedenti"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <div className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(total, THUMBS_VISIBLE)}, 1fr)` }}>
          {visibleThumbs.map((src, i) => {
            const realIndex = thumbStart + i;
            const isActive = realIndex === active;
            return (
              <button
                key={realIndex}
                onClick={() => { setAutoplay(false); setActive(realIndex); }}
                className="aspect-square overflow-hidden transition-all duration-200"
                style={{
                  borderRadius: 10,
                  border: isActive ? "2px solid #1B3A5C" : "2px solid #E2E4E8",
                  boxShadow: isActive ? "0 0 0 1px #1B3A5C" : "none",
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                <img src={src} alt={`Miniatura ${realIndex + 1}`} className="h-full w-full object-cover" loading="lazy" />
              </button>
            );
          })}
        </div>
        {total > THUMBS_VISIBLE && (
          <button
            onClick={() => setThumbStart((s) => Math.min(total - THUMBS_VISIBLE, s + 1))}
            disabled={thumbStart >= total - THUMBS_VISIBLE}
            className="flex h-8 w-8 shrink-0 items-center justify-center transition disabled:opacity-30"
            style={{ borderRadius: 8, backgroundColor: "#FCFCFA", color: "#5A5752" }}
            aria-label="Miniature successive"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Feature Card ───────────────────────── */

export function FeatureCard({ id, children }: { id: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activate = useCallback(() => {
    setActive(true);
    window.dispatchEvent(new CustomEvent("feature-active", { detail: id }));
  }, [id]);

  useEffect(() => {
    if (!isMobile) return;
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail !== id) setActive(false);
    };
    window.addEventListener("feature-active", handler);
    return () => window.removeEventListener("feature-active", handler);
  }, [id, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const rect = el.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const mid = window.innerHeight / 2;
      if (cardCenter <= mid && cardCenter >= 0) activate();
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, [activate, isMobile]);

  if (!isMobile) {
    return (
      <div ref={ref} className="feature-card-desktop" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: "14px" }}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onClick={() => { if (active) setActive(false); else activate(); }}
      style={{
        transition: "transform 0.4s ease, box-shadow 0.4s ease",
        transform: active ? "translateY(-4px) scale(1.04)" : "scale(1)",
        boxShadow: active ? "0 6px 20px rgba(0,0,0,0.14)" : "0 2px 12px rgba(0,0,0,0.08)",
        borderRadius: "14px",
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── Solution Bridge Animated ───────────────────────── */

export function SolutionBridgeAnimated({
  textColor,
  brandColor,
  bg,
}: {
  textColor: string;
  brandColor: string;
  bg: string;
}) {
  const brandRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        labelRef.current && (labelRef.current.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out");
        brandRef.current && (brandRef.current.style.transition = "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)");
        subRef.current && (subRef.current.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out");
      });
    });

    const entries = [
      { el: labelRef.current, delay: 0 },
      { el: brandRef.current, delay: 140 },
      { el: subRef.current, delay: 280 },
    ];

    const observers = entries.map(({ el, delay }) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "scale(1) translateY(0)";
            }, delay);
            obs.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div className="text-center" style={{ backgroundColor: bg }}>
      <div
        ref={labelRef}
        className="mb-3 flex justify-center"
        style={{ opacity: 0, transform: "translateY(10px)" }}
      >
        <span className="rounded px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.1em]"
          style={{ backgroundColor: "#E8EEF5", color: "#0F2540" }}>
          Caratteristiche
        </span>
      </div>
      <p
        ref={brandRef}
        className="text-5xl font-extrabold leading-none tracking-tight sm:text-6xl md:text-7xl"
        style={{ color: textColor, fontFamily: "var(--font-heading)", opacity: 0, transform: "scale(0.72)" }}
      >
        Arceria
      </p>
      <p
        ref={subRef}
        className="mt-1.5 text-base sm:text-[17px]"
        style={{ color: brandColor, opacity: 0, transform: "translateY(10px)" }}
      >
        Lo infili come un calzino. Comfort ortopedico vero.
      </p>
    </div>
  );
}

/* ───────────────────────── Insta Carousel ───────────────────────── */

export function InstaCarousel({ photos }: { photos: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => { el.removeEventListener("scroll", updateArrows); window.removeEventListener("resize", updateArrows); };
  }, [updateArrows]);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
      >
        {photos.map((src, i) => (
          <figure
            key={src}
            className="relative shrink-0 overflow-hidden"
            style={{ width: "65%", maxWidth: 300, borderRadius: 12, scrollSnapAlign: "start" }}
          >
            <Image
              src={src}
              alt={`Esperienza cliente ${i + 1}`}
              width={896}
              height={1200}
              className="w-full"
              style={{ aspectRatio: "3/4", objectFit: "cover", display: "block" }}
              loading="lazy"
              unoptimized
            />
          </figure>
        ))}
      </div>

      {canLeft && (
        <button onClick={() => scroll(-1)} className="absolute left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white" aria-label="Precedente">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="#1A1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}
      {canRight && (
        <button onClick={() => scroll(1)} className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:bg-white" aria-label="Successivo">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="#1A1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── CTA Order Button ───────────────────────── */

export function CtaOrderButton({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("open-sticky-popup"))}
      className={className}
      style={style}
    >
      {children}
    </button>
  );
}

/* ───────────────────────── Reviews Section ───────────────────────── */

function StarRow({ count, size = 16 }: { count: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} style={{ width: size, height: size }} className={i < count ? "text-amber-400" : "text-gray-200"} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

interface Review { id: number; author_name: string; rating: number; body: string; created_at: string; reply?: string | null; }

const PER_PAGE = 5;

export function ReviewsSection({ reviews, stats, accentColor, shopName, slug }: { reviews: Review[]; stats: { count: number; avg: number }; accentColor: string; shopName?: string; slug?: string }) {
  const [page, setPage] = useState(0);
  const [fading, setFading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(reviews.length / PER_PAGE);
  const visible = reviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const brand = shopName || "Calzasi";

  const goTo = (p: number) => {
    if (p === page || p < 0 || p >= totalPages) return;
    setFading(true);
    setTimeout(() => { setPage(p); setFading(false); sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 200);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("rv-name") as HTMLInputElement).value;
    const body = (form.elements.namedItem("rv-text") as HTMLTextAreaElement).value;
    if (!formRating || !name || !body || !slug) return;
    try {
      await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, authorName: name, rating: formRating, body }),
      });
    } catch {}
    setFormSubmitted(true);
  };

  const rv = {
    text: "#1A1917", textSec: "#5A5752", textMuted: "#9B9790",
    border: "#E2E4E8", muted: "#FCFCFA", surface: "#FFFFFF",
    trust: "#4D6E58", trustLight: "#F0F4F1",
    brand: accentColor, brandSubtle: "#E8EEF5", brandDark: "#0F2540",
    cta: "#1B3A5C",
  };

  return (
    <div ref={sectionRef} id="recensioni">
      <div className="mb-3 flex justify-center">
        <span className="rounded px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.1em]"
          style={{ backgroundColor: rv.brandSubtle, color: rv.brandDark }}>
          Recensioni
        </span>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold md:text-3xl" style={{ color: rv.text, fontFamily: "var(--font-heading)" }}>
          Recensioni delle clienti
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <StarRow count={Math.round(stats.avg)} />
          <span className="font-bold" style={{ color: rv.text }}>{stats.avg.toFixed(1).replace(".", ",")}/5</span>
          <span style={{ color: rv.textMuted }}>&middot;</span>
          <span style={{ color: rv.textSec }}>{stats.count} recensioni</span>
          <span className="rounded px-2 py-0.5 text-[12px] font-semibold"
            style={{ backgroundColor: rv.trustLight, color: rv.trust }}>
            verificate
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-center text-sm py-8" style={{ color: rv.textMuted }}>Nessuna recensione ancora</p>
      ) : (
        <>
          <div className={`space-y-0 transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}
            style={{ border: `1px solid ${rv.border}`, borderRadius: 16, overflow: "hidden", backgroundColor: rv.surface }}>
            {visible.map((r, i) => (
              <div key={r.id} className="p-5" style={{ borderBottom: i < visible.length - 1 ? `1px solid ${rv.border}` : "none" }}>
                <div className="mb-2 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: rv.brandSubtle, color: rv.brandDark }}>
                    {r.author_name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-semibold" style={{ color: rv.text }}>{r.author_name}</span>
                    {r.created_at && (
                      <span className="ml-2 text-xs" style={{ color: rv.textMuted }}>
                        {new Date(r.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <StarRow count={r.rating} size={16} />
                  <span className="rounded px-2 py-0.5 text-[12px] font-semibold"
                    style={{ backgroundColor: rv.trustLight, color: rv.trust }}>
                    Acquisto verificato
                  </span>
                </div>
                <p className="text-[15px] leading-relaxed" style={{ color: rv.textSec }}>{r.body}</p>
                {r.reply && (
                  <div className="mt-3 rounded-xl p-3.5" style={{ backgroundColor: rv.muted, borderLeft: `3px solid ${rv.brand}` }}>
                    <p className="mb-1 text-xs font-bold" style={{ color: rv.text }}>Risposta di {brand}</p>
                    <p className="text-[14px] leading-relaxed" style={{ color: rv.textSec }}>{r.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <button onClick={() => goTo(page - 1)} disabled={page === 0}
                  className="flex h-8 w-8 items-center justify-center border transition disabled:opacity-25"
                  style={{ borderRadius: 10, borderColor: rv.border, color: rv.textMuted, backgroundColor: rv.surface }} aria-label="Precedente">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                {(() => {
                  const maxV = 5; let start = 0; let end = totalPages;
                  if (totalPages > maxV) { start = Math.max(0, page - Math.floor(maxV / 2)); end = start + maxV; if (end > totalPages) { end = totalPages; start = end - maxV; } }
                  return Array.from({ length: end - start }, (_, idx) => { const i = start + idx; return (
                    <button key={i} onClick={() => goTo(i)}
                      className="flex h-8 w-8 items-center justify-center text-[15px] font-semibold transition"
                      style={i === page
                        ? { backgroundColor: rv.text, color: "#fff", borderRadius: 10 }
                        : { border: `1px solid ${rv.border}`, color: rv.textMuted, borderRadius: 10, backgroundColor: rv.surface }}>
                      {i + 1}
                    </button>
                  ); });
                })()}
                <button onClick={() => goTo(page + 1)} disabled={page === totalPages - 1}
                  className="flex h-8 w-8 items-center justify-center border transition disabled:opacity-25"
                  style={{ borderRadius: 10, borderColor: rv.border, color: rv.textMuted, backgroundColor: rv.surface }} aria-label="Successiva">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              {page < totalPages - 1 && (
                <button onClick={() => goTo(page + 1)} className="flex items-center gap-1.5 text-[15px] font-medium cursor-pointer transition-colors hover:opacity-80"
                  style={{ color: rv.textSec }}>
                  Mostra altre recensioni
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </button>
              )}
            </div>
          )}
        </>
      )}

      <div className="mt-6 h-px" style={{ backgroundColor: rv.border }} />

      <div className="mt-5">
        {!showForm && !formSubmitted && (
          <button onClick={() => setShowForm(true)}
            className="w-full px-4 py-2.5 text-[15px] font-semibold transition-all hover:bg-gray-50"
            style={{ borderRadius: 12, backgroundColor: rv.surface, color: rv.text, border: `1px solid ${rv.border}`, fontFamily: "var(--font-heading)" }}>
            <span className="flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke={rv.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Scrivi una recensione
            </span>
          </button>
        )}
        {showForm && !formSubmitted && (
          <>
            <h3 className="mb-4 text-base font-bold" style={{ color: rv.text, fontFamily: "var(--font-heading)" }}>
              Scrivi una recensione
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="ar-rv-name" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: rv.textMuted }}>Nome *</label>
                <input type="text" id="ar-rv-name" name="rv-name" placeholder="Il tuo nome" required
                  className="w-full outline-none" style={{ border: `1px solid ${rv.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-body)", color: rv.text }} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: rv.textMuted }}>Valutazione *</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((v) => (
                    <button key={v} type="button" onClick={() => setFormRating(v)}
                      className="text-[28px] leading-none transition-colors"
                      style={{ color: v <= formRating ? "#f59e0b" : "#d1d5db" }}>
                      &#9733;
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="ar-rv-text" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: rv.textMuted }}>Recensione *</label>
                <textarea id="ar-rv-text" name="rv-text" placeholder="Raccontaci la tua esperienza con i sandali Arceria…" required
                  className="w-full outline-none resize-y" style={{ border: `1px solid ${rv.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-body)", color: rv.text, minHeight: 80 }} />
              </div>
              <button type="submit" className="rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: rv.cta }}>
                Invia recensione
              </button>
            </form>
          </>
        )}
        {formSubmitted && (
          <div className="py-6 text-center">
            <p className="text-sm" style={{ color: rv.textSec }}>
              <b style={{ color: rv.trust }}>Grazie per la tua recensione!</b><br />Sarà pubblicata dopo la verifica.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
