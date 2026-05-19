"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════
   HeroGallery — like zanardo: full-bleed mobile, grid thumbs
   ══════════════════════════════════════════════════════ */

const THUMBS_VISIBLE = 5;

export function HeroGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const total = images.length;
  const swipeRef = useRef<number | null>(null);
  const isDrag = useRef(false);

  // Keep active thumb visible in sliding window
  useEffect(() => {
    if (active < thumbStart) setThumbStart(active);
    else if (active >= thumbStart + THUMBS_VISIBLE) setThumbStart(active - THUMBS_VISIBLE + 1);
  }, [active, thumbStart]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || total <= 1) return;
    const id = setInterval(() => setActive((a) => (a === total - 1 ? 0 : a + 1)), 3000);
    return () => clearInterval(id);
  }, [autoplay, total]);

  const prev = () => { setAutoplay(false); setActive((a) => (a === 0 ? total - 1 : a - 1)); };
  const next = () => { setAutoplay(false); setActive((a) => (a === total - 1 ? 0 : a + 1)); };

  if (total === 0) return null;

  const visibleThumbs = images.slice(thumbStart, thumbStart + THUMBS_VISIBLE);

  return (
    <div className="md:sticky" style={{ top: 116 }}>
      {/* Main image — full bleed mobile, rounded desktop */}
      <div
        className="relative aspect-square overflow-hidden -mx-4 sm:-mx-6 md:mx-0 md:rounded-lg md:border md:border-gray-200 bg-white md:shadow-sm select-none"
        onTouchStart={(e) => { swipeRef.current = e.touches[0].clientX; isDrag.current = false; }}
        onTouchEnd={(e) => {
          if (swipeRef.current !== null && e.changedTouches.length > 0) {
            const dx = e.changedTouches[0].clientX - swipeRef.current;
            if (Math.abs(dx) > 50) { isDrag.current = true; if (dx < 0) next(); else prev(); }
          }
          swipeRef.current = null;
        }}
        onMouseDown={(e) => { swipeRef.current = e.clientX; isDrag.current = false; }}
        onMouseMove={(e) => { if (swipeRef.current !== null && Math.abs(e.clientX - swipeRef.current) > 5) isDrag.current = true; }}
        onMouseUp={(e) => {
          if (swipeRef.current !== null) {
            const dx = e.clientX - swipeRef.current;
            if (isDrag.current && Math.abs(dx) > 50) { if (dx < 0) next(); else prev(); }
          }
          swipeRef.current = null;
        }}
        onMouseLeave={() => { swipeRef.current = null; }}
      >
        <img
          key={active}
          src={images[active]}
          alt={`Foto ${active + 1}`}
          className="h-full w-full object-cover animate-fade-in cursor-zoom-in"
        />
        {/* Prev / Next */}
        <button onClick={prev} className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition hover:scale-105" style={{ backgroundColor: "rgba(255,255,255,0.82)", color: "#1A1917" }} aria-label="Precedente">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button onClick={next} className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition hover:scale-105" style={{ backgroundColor: "rgba(255,255,255,0.82)", color: "#1A1917" }} aria-label="Successiva">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      {/* Thumbnails — grid 5 col with sliding window, exactly like zanardo */}
      {total > 1 && <div className="mt-3 flex items-center gap-1.5 px-4 sm:px-6 md:px-0">
        {total > THUMBS_VISIBLE && (
          <button
            onClick={() => setThumbStart((s) => Math.max(0, s - 1))}
            disabled={thumbStart === 0}
            className="flex h-8 w-8 shrink-0 items-center justify-center transition disabled:opacity-30"
            style={{ borderRadius: 8, backgroundColor: "#faf8f5", color: "#5A5752" }}
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
                  border: isActive ? "2px solid var(--color-primary, #1A1917)" : "2px solid #EBE5DA",
                  boxShadow: isActive ? "0 0 0 1px var(--color-primary, #1A1917)" : "none",
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
            style={{ borderRadius: 8, backgroundColor: "#faf8f5", color: "#5A5752" }}
            aria-label="Miniature successive"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
      </div>}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FeatureCard
   ══════════════════════════════════════════════════════ */

export function FeatureCard({
  image, badge, tags, description, accentColor,
}: {
  image: string; badge: string; tags: string[]; description: string; accentColor: string;
}) {
  const brandBg = `${accentColor}14`;
  return (
    <article className="feature-card-desktop group overflow-hidden rounded-2xl bg-white flex flex-col" style={{ border: "1px solid #EBE5DA", boxShadow: "0 1px 3px rgba(26,25,23,0.04)" }}>
      <div className="p-3 sm:p-4 pb-0">
        <img src={image} alt={badge} className="w-full rounded-xl" loading="lazy" />
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide" style={{ backgroundColor: brandBg, color: accentColor, borderRadius: 5 }}>{badge}</span>
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 text-[10px] sm:text-[11px] font-medium" style={{ backgroundColor: "#ECEEF2", color: "#5A5752", borderRadius: 5 }}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-5 pt-3">
        <h3 className="mb-2 font-bold" style={{ fontSize: 18, color: "#1A1917", fontFamily: "var(--font-heading)" }}>{badge}</h3>
        <p className="leading-relaxed" style={{ fontSize: 14, color: "#5A5752", fontFamily: "var(--font-body)" }} dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      <style jsx>{`
        .feature-card-desktop { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        @media (hover: hover) and (min-width: 768px) {
          .feature-card-desktop:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06); }
        }
      `}</style>
    </article>
  );
}

/* ══════════════════════════════════════════════════════
   StatsSection — animated survey progress bars
   ══════════════════════════════════════════════════════ */

interface StatItem { question: string; percentage: number; responses: number; }

const SURVEY_DATA: StatItem[] = [
  { question: "Hai notato i glutei più tonici dopo 4 settimane?", percentage: 95, responses: 2028 },
  { question: "Hai percepito maggiore comfort quotidiano?", percentage: 97, responses: 2070 },
  { question: "Hai notato miglioramenti nella postura?", percentage: 92, responses: 1963 },
];

function AnimatedBar({ item, accentColor, inView }: { item: StatItem; accentColor: string; inView: boolean }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (inView) { const raf = requestAnimationFrame(() => setWidth(item.percentage)); return () => cancelAnimationFrame(raf); }
    else setWidth(0);
  }, [inView, item.percentage]);

  return (
    <div className="mb-5 sm:mb-6">
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <p className="text-[18px] font-semibold" style={{ color: "#5A5752", fontFamily: "var(--font-body)" }}>{item.question}</p>
        <span className="text-[16px] sm:text-[18px] font-extrabold ml-2 shrink-0" style={{ color: accentColor, fontFamily: "var(--font-heading)" }}>{item.percentage}% sì</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${width}%`, backgroundColor: accentColor, transition: inView ? "width 1.2s cubic-bezier(0.22,1,0.36,1)" : "none" }} />
      </div>
      <p className="text-xs mt-1" style={{ color: "#9B9790" }}>{item.responses.toLocaleString("it-IT")} risposte</p>
    </div>
  );
}

export function StatsSection({ image, accentColor }: { image: string; accentColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch overflow-hidden rounded-2xl border shadow-sm" style={{ borderColor: "#EBE5DA" }}>
      <div className="overflow-hidden">
        <img src={image} alt="Sondaggio" className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="p-5 sm:p-6 md:p-8" style={{ backgroundColor: "#faf8f5" }}>
        <div className="mb-5 sm:mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold" style={{ color: "#1A1917", fontFamily: "var(--font-heading)" }}>Sondaggio post-acquisto</h2>
            <p className="text-xs text-gray-400">2.134 clienti intervistati</p>
          </div>
          <span className="rounded-full border bg-white px-2.5 py-1 text-xs font-bold" style={{ borderColor: "#EBE5DA", color: "#5A5752" }}>2025</span>
        </div>
        <div className="h-px mb-5" style={{ backgroundColor: "#EBE5DA" }} />
        {SURVEY_DATA.map((item, i) => (
          <AnimatedBar key={i} item={item} accentColor={accentColor} inView={inView} />
        ))}
        <div className="h-px mt-4 mb-3" style={{ backgroundColor: "#EBE5DA" }} />
        <p className="text-xs text-gray-400">*Sondaggio interno via email su clienti con almeno 4 settimane di utilizzo. Le esperienze individuali possono variare.</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ReviewImageCarousel — infinite loop Instagram-style
   ══════════════════════════════════════════════════════ */

export function ReviewImageCarousel({ images }: { images: string[] }) {
  if (images.length === 0) return null;
  const items = [...images, ...images]; // duplicate for seamless loop
  const duration = images.length * 5;

  return (
    <div style={{ overflow: "hidden", position: "relative", userSelect: "none" }}>
      <div
        style={{
          display: "flex",
          gap: 16,
          animation: `reviewScroll ${duration}s linear infinite`,
          width: "max-content",
          willChange: "transform",
          alignItems: "center",
        }}
      >
        {items.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Foto ${(i % images.length) + 1}`}
            style={{
              height: "clamp(260px, 35vw, 420px)",
              width: "auto",
              borderRadius: 12,
              flexShrink: 0,
              display: "block",
            }}
            loading="lazy"
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes reviewScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ReviewsSection — zanardo-style vertical list with pagination
   ══════════════════════════════════════════════════════ */

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
    border: "#EBE5DA", muted: "#faf8f5", surface: "#FFFFFF",
    trust: "#2B6E44", trustLight: "#E6F4EC",
  };

  return (
    <div ref={sectionRef} id="recensioni">
      {/* Badge */}
      <div className="mb-3 flex justify-center">
        <span className="rounded px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.1em]"
          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
          Recensioni
        </span>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold md:text-3xl" style={{ color: rv.text, fontFamily: "var(--font-heading)" }}>
          Recensioni dei clienti
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <StarRow count={Math.round(stats.avg)} />
          <span className="font-bold" style={{ color: rv.text }}>{stats.avg.toFixed(1)}/5</span>
          <span style={{ color: rv.textMuted }}>&middot;</span>
          <span style={{ color: rv.textSec }}>{stats.count} recensioni</span>
          <span className="rounded px-2 py-0.5 text-[12px] font-semibold"
            style={{ backgroundColor: rv.trustLight, color: rv.trust }}>
            verificate
          </span>
        </div>
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-center text-sm py-8" style={{ color: rv.textMuted }}>Nessuna recensione ancora</p>
      ) : (
        <>
          <div className={`transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}
            style={{ border: `1px solid ${rv.border}`, borderRadius: 16, overflow: "hidden", backgroundColor: rv.surface }}>
            {visible.map((r, i) => (
              <div key={r.id} className="p-5" style={{ borderBottom: i < visible.length - 1 ? `1px solid ${rv.border}` : "none" }}>
                {/* Author row */}
                <div className="mb-2 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                    {r.author_name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-semibold" style={{ color: rv.text }}>{r.author_name}</span>
                  </div>
                </div>
                {/* Stars + badge */}
                <div className="mb-2 flex items-center gap-2">
                  <StarRow count={r.rating} size={16} />
                  <span className="rounded px-2 py-0.5 text-[12px] font-semibold"
                    style={{ backgroundColor: rv.trustLight, color: rv.trust }}>
                    Acquisto verificato
                  </span>
                </div>
                {/* Body */}
                <p className="text-[15px] leading-relaxed" style={{ color: rv.textSec }}>{r.body}</p>
                {/* Reply */}
                {r.reply && (
                  <div className="mt-3 rounded-xl p-3.5" style={{ backgroundColor: rv.muted, borderLeft: `3px solid ${accentColor}` }}>
                    <p className="mb-1 text-xs font-bold" style={{ color: rv.text }}>Risposta di {brand}</p>
                    <p className="text-[14px] leading-relaxed" style={{ color: rv.textSec }}>{r.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
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
                <button onClick={() => goTo(page + 1)} className="flex items-center gap-1.5 text-[15px] font-medium transition-colors hover:opacity-80"
                  style={{ color: rv.textSec }}>
                  Mostra altre recensioni
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Divider */}
      <div className="mt-6 h-px" style={{ backgroundColor: rv.border }} />

      {/* Review form */}
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
                <label htmlFor="rv-name" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: rv.textMuted }}>Nome *</label>
                <input type="text" id="rv-name" name="rv-name" placeholder="Il tuo nome" required
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
                <label htmlFor="rv-text" className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: rv.textMuted }}>Recensione *</label>
                <textarea id="rv-text" name="rv-text" placeholder="Raccontaci la tua esperienza..." required minLength={10}
                  className="w-full outline-none resize-y" style={{ border: `1px solid ${rv.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, fontFamily: "var(--font-body)", color: rv.text, minHeight: 80 }} />
              </div>
              <button type="submit" className="rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: accentColor }}>
                Invia recensione
              </button>
            </form>
          </>
        )}
        {formSubmitted && (
          <div className="py-6 text-center">
            <p className="text-sm" style={{ color: rv.textSec }}>
              <b style={{ color: rv.trust }}>Grazie per la tua recensione!</b><br />Sara pubblicata dopo la verifica.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
