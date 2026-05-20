"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getVariantImages, getProductHref } from "@/lib/order-config";

interface Product {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  original_price: number;
  image: string | null;
  category_slug: string;
  category_label: string;
  sold_out: boolean;
}

interface Category {
  id: number;
  slug: string;
  name: string;
  label: string;
}

interface Props {
  products: Product[];
  categories: Category[];
}

type SortOption = "relevance" | "price_asc" | "price_desc" | "name";

const sortLabels: Record<SortOption, string> = {
  relevance: "Per rilevanza",
  price_asc: "Prezzo: basso-alto",
  price_desc: "Prezzo: alto-basso",
  name: "Nome A-Z",
};

/* ═══ Price Range Slider ═══ */
function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  const left = ((lo - min) / (max - min)) * 100;
  const right = ((max - hi) / (max - min)) * 100;

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .pr-slider { position: relative; height: 4px; background: #e5e5e5; border-radius: 2px; margin: 20px 0 12px; }
        .pr-slider-fill { position: absolute; height: 100%; background: var(--color-accent, #ab1a1a); border-radius: 2px; }
        .pr-slider input[type="range"] {
          position: absolute; width: 100%; top: -8px; height: 20px;
          -webkit-appearance: none; appearance: none; background: transparent;
          pointer-events: none; z-index: 2; margin: 0;
        }
        .pr-slider input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
          background: var(--color-accent, #ab1a1a); border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25); pointer-events: auto; cursor: pointer;
        }
        .pr-slider input[type="range"]::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%; border: 2px solid #fff;
          background: var(--color-accent, #ab1a1a);
          box-shadow: 0 1px 4px rgba(0,0,0,0.25); pointer-events: auto; cursor: pointer;
        }
      `,
        }}
      />
      <div className="pr-slider relative">
        <div className="pr-slider-fill" style={{ left: `${left}%`, right: `${right}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), hi - 1);
            onChange([v, hi]);
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), lo + 1);
            onChange([lo, v]);
          }}
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label
            className="text-[10px] uppercase tracking-wider mb-1 block"
            style={{ color: "var(--color-text-secondary, #666)" }}
          >
            Prezzo minimo
          </label>
          <div
            className="flex items-center border rounded-md px-2.5 py-2"
            style={{ borderColor: "var(--color-border, #E5E5E5)" }}
          >
            <span className="text-[12px] mr-1" style={{ color: "var(--color-text-secondary, #666)" }}>
              &euro;
            </span>
            <input
              type="number"
              value={lo}
              min={min}
              max={hi - 1}
              onChange={(e) =>
                onChange([Math.max(min, Math.min(Number(e.target.value), hi - 1)), hi])
              }
              className="w-full text-[13px] outline-none bg-transparent"
              style={{ fontFamily: "var(--font-body)", color: "var(--color-text, #1a1a1a)" }}
            />
          </div>
        </div>
        <span className="mt-5" style={{ color: "var(--color-border, #E5E5E5)" }}>
          —
        </span>
        <div className="flex-1">
          <label
            className="text-[10px] uppercase tracking-wider mb-1 block"
            style={{ color: "var(--color-text-secondary, #666)" }}
          >
            Prezzo massimo
          </label>
          <div
            className="flex items-center border rounded-md px-2.5 py-2"
            style={{ borderColor: "var(--color-border, #E5E5E5)" }}
          >
            <span className="text-[12px] mr-1" style={{ color: "var(--color-text-secondary, #666)" }}>
              &euro;
            </span>
            <input
              type="number"
              value={hi}
              min={lo + 1}
              max={max}
              onChange={(e) =>
                onChange([lo, Math.min(max, Math.max(Number(e.target.value), lo + 1))])
              }
              className="w-full text-[13px] outline-none bg-transparent"
              style={{ fontFamily: "var(--font-body)", color: "var(--color-text, #1a1a1a)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ Catalog Card ═══ */
function CatalogCard({
  slug,
  name,
  subtitle,
  price,
  originalPrice,
  image,
  soldOut,
}: {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  image: string | null;
  soldOut: boolean;
}) {
  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

  let variants: string[] = [];
  try {
    variants = getVariantImages(slug);
  } catch {}

  const [mainImg, setMainImg] = useState(image);

  return (
    <Link href={getProductHref(slug)} className="group block">
      <div
        className="rounded-xl border overflow-hidden bg-white transition-shadow duration-300 hover:shadow-lg"
        style={{ borderColor: "var(--color-border, #E5E5E5)" }}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: "#f5f5f5" }}>
          {mainImg ? (
            <img
              src={mainImg}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ccc"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}

          {/* Discount badge */}
          {discount > 0 && !soldOut && (
            <span
              className="absolute top-2.5 left-2.5 z-10 px-2 py-1 rounded-md text-[11px] font-bold text-white"
              style={{ backgroundColor: "var(--color-accent, #ab1a1a)" }}
            >
              -{discount}%
            </span>
          )}

          {/* Sold out overlay */}
          {soldOut && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full text-white"
                style={{ backgroundColor: "var(--color-text, #1a1a1a)" }}
              >
                Esaurito
              </span>
            </div>
          )}
        </div>

        {/* Variant swatches */}
        {variants.length > 1 && (
          <div className="flex gap-1.5 px-3 pt-2.5">
            {variants.map((src, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full overflow-hidden cursor-pointer border-2 transition-colors"
                style={{
                  borderColor:
                    mainImg === src ? "var(--color-accent, #ab1a1a)" : "transparent",
                }}
                onMouseEnter={() => setMainImg(src)}
                onClick={(e) => {
                  e.preventDefault();
                  setMainImg(src);
                }}
              >
                <img
                  src={src}
                  alt={`Variante ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Text content */}
        <div className="p-3 sm:p-4">
          <h3
            className="text-[12px] font-bold uppercase tracking-wider mb-0.5 line-clamp-1"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}
          >
            {name}
          </h3>
          <p
            className="text-[11px] sm:text-[12px] mb-2 line-clamp-2 sm:line-clamp-1"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary, #666)" }}
          >
            {subtitle}
          </p>
          <div className="flex items-baseline gap-2">
            <span
              className="text-[15px] font-extrabold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-accent, #ab1a1a)" }}
            >
              &euro;{Number(price).toFixed(2).replace(".", ",")}
            </span>
            {discount > 0 && (
              <span className="text-[12px] line-through" style={{ color: "#999" }}>
                &euro;{Number(originalPrice).toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ═══ Main Catalog ═══ */
export default function CatalogoClient({ products, categories }: Props) {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "";

  const [activeCat, setActiveCat] = useState(initialCat);
  const [sort, setSort] = useState<SortOption>("relevance");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const PER_PAGE = 12;

  const priceMin = useMemo(
    () => Math.floor(Math.min(...products.map((p) => Number(p.price)))),
    [products]
  );
  const priceMax = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => Number(p.original_price)))),
    [products]
  );

  const [priceRange, setPriceRange] = useState<[number, number]>([priceMin, priceMax]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    prezzo: true,
    categoria: true,
    cerca: false,
  });

  useEffect(() => {
    setActiveCat(searchParams.get("cat") || "");
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  const hasActiveFilters =
    activeCat !== "" || query !== "" || priceRange[0] !== priceMin || priceRange[1] !== priceMax;

  const clearAllFilters = () => {
    setActiveCat("");
    setQuery("");
    setPriceRange([priceMin, priceMax]);
    setSort("relevance");
  };

  const filtered = useMemo(() => {
    setPage(0);
    let result = [...products] as Product[];
    if (activeCat) result = result.filter((p) => p.category_slug === activeCat);
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)
      );
    }
    result = result.filter(
      (p) => Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1]
    );
    switch (sort) {
      case "price_asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  }, [products, activeCat, sort, query, priceRange]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  const activeCategory = categories.find((c) => c.slug === activeCat);

  /* ── Expandable Section ── */
  function ExpandableSection({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) {
    const isOpen = expandedSections[sectionKey] ?? false;
    const toggle = () =>
      setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));

    return (
      <div className="mb-5">
        <button
          onClick={toggle}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <span
            className="text-[13px] font-bold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}
          >
            {title}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-transform duration-200 flex-shrink-0"
            style={{
              transform: isOpen ? "rotate(45deg)" : "rotate(0)",
              color: "var(--color-text-secondary, #666)",
            }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        {isOpen && <div>{children}</div>}
      </div>
    );
  }

  /* ── Filter Sidebar Content ── */
  function FilterSidebar() {
    return (
      <div>
        {/* Count + reset */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-[13px] font-semibold"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-text, #1a1a1a)" }}
          >
            {filtered.length} prodott{filtered.length === 1 ? "o" : "i"}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-[12px] font-medium"
              style={{ color: "var(--color-accent, #ab1a1a)" }}
            >
              Rimuovi Filtri
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="w-full border rounded-md px-3 py-2.5 text-[13px] outline-none cursor-pointer mb-5"
          style={{
            fontFamily: "var(--font-body)",
            borderColor: "var(--color-border, #E5E5E5)",
            color: "var(--color-text, #1a1a1a)",
            backgroundColor: "#fff",
          }}
        >
          {Object.entries(sortLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <hr className="mb-5" style={{ borderColor: "var(--color-border, #E5E5E5)" }} />

        {/* Price */}
        {priceMin !== priceMax && (
          <>
            <ExpandableSection title="Prezzo" sectionKey="prezzo">
              <PriceRangeSlider
                min={priceMin}
                max={priceMax}
                value={priceRange}
                onChange={setPriceRange}
              />
            </ExpandableSection>
            <hr className="mb-5" style={{ borderColor: "var(--color-border, #E5E5E5)" }} />
          </>
        )}

        {/* Category */}
        <ExpandableSection title="Categoria" sectionKey="categoria">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat("")}
              className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: !activeCat ? "var(--color-accent, #ab1a1a)" : "transparent",
                color: !activeCat ? "#fff" : "var(--color-text, #1a1a1a)",
                border: !activeCat
                  ? "1px solid var(--color-accent, #ab1a1a)"
                  : "1px solid var(--color-border, #E5E5E5)",
              }}
            >
              Tutti
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCat(activeCat === cat.slug ? "" : cat.slug)}
                className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor:
                    activeCat === cat.slug ? "var(--color-accent, #ab1a1a)" : "transparent",
                  color: activeCat === cat.slug ? "#fff" : "var(--color-text, #1a1a1a)",
                  border:
                    activeCat === cat.slug
                      ? "1px solid var(--color-accent, #ab1a1a)"
                      : "1px solid var(--color-border, #E5E5E5)",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </ExpandableSection>

        <hr className="mb-5" style={{ borderColor: "var(--color-border, #E5E5E5)" }} />

        {/* Search */}
        <ExpandableSection title="Cerca" sectionKey="cerca">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca prodotti..."
              className="w-full border rounded-md px-3 py-2.5 text-[13px] outline-none pr-8"
              style={{
                fontFamily: "var(--font-body)",
                borderColor: "var(--color-border, #E5E5E5)",
                color: "var(--color-text, #1a1a1a)",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                aria-label="Cancella"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#999"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </ExpandableSection>
      </div>
    );
  }

  /* ── Mobile Filter Drawer ── */
  function MobileFilterDrawer() {
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }, []);

    return (
      <div className="fixed inset-0 z-[60] lg:hidden">
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />

        <div className="absolute inset-0 bg-white flex flex-col animate-filter-up">
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes filterUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            .animate-filter-up { animation: filterUp 0.3s ease-out; }
          `,
            }}
          />

          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--color-border, #E5E5E5)" }}
          >
            <span
              className="font-bold text-base"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}
            >
              Filtri & Ordine
            </span>
            <button onClick={() => setMobileFiltersOpen(false)} aria-label="Chiudi">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FilterSidebar />
          </div>

          {/* Sticky bottom */}
          <div
            className="border-t px-5 py-4 flex items-center gap-3"
            style={{ borderColor: "var(--color-border, #E5E5E5)" }}
          >
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[13px] font-medium px-4 py-3 rounded-full border"
                style={{
                  color: "var(--color-text-secondary, #666)",
                  borderColor: "var(--color-border, #E5E5E5)",
                }}
              >
                Rimuovi filtri
              </button>
            )}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="flex-1 py-3 rounded-full text-[14px] font-bold text-white text-center"
              style={{ backgroundColor: "var(--color-accent, #ab1a1a)" }}
            >
              {filtered.length} prodott{filtered.length === 1 ? "o" : "i"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      {/* ── Breadcrumb ── */}
      <div style={{ backgroundColor: "#f8f8f8", borderBottom: "1px solid #eee" }}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-3">
          <nav
            className="flex items-center gap-2 text-[12px]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Link
              href="/"
              className="transition-colors hover:opacity-70"
              style={{ color: "var(--color-accent, #ab1a1a)", fontWeight: 500 }}
            >
              HOME
            </Link>
            <span style={{ color: "#ccc" }}>/</span>
            {activeCat && activeCategory ? (
              <>
                <Link
                  href="/catalogo"
                  className="transition-colors hover:opacity-70"
                  style={{ color: "var(--color-accent, #ab1a1a)", fontWeight: 500 }}
                >
                  CATALOGO
                </Link>
                <span style={{ color: "#ccc" }}>/</span>
                <span style={{ color: "var(--color-text, #1a1a1a)", fontWeight: 600 }}>
                  {activeCategory.label.toUpperCase()}
                </span>
              </>
            ) : (
              <span style={{ color: "var(--color-text, #1a1a1a)", fontWeight: 600 }}>CATALOGO</span>
            )}
          </nav>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <div className="flex gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden w-full flex items-center justify-center gap-2 py-3 rounded-full text-[13px] font-bold uppercase tracking-wider text-white mb-5"
              style={{ backgroundColor: "var(--color-text, #1a1a1a)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="6" y1="12" x2="18" y2="12" />
                <line x1="8" y1="18" x2="16" y2="18" />
              </svg>
              Filtri & Ordine
            </button>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p
                  className="text-base font-bold mb-2"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-text, #1a1a1a)" }}
                >
                  Nessun prodotto trovato
                </p>
                <p
                  className="text-[14px] mb-6"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary, #666)" }}
                >
                  Prova a cambiare i filtri o la ricerca.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-[12px] font-bold uppercase tracking-wider px-8 py-3 rounded-full text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "var(--color-accent, #ab1a1a)" }}
                >
                  Mostra tutti i prodotti
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                  {paged.map((p) => (
                    <CatalogCard
                      key={p.id}
                      slug={p.slug}
                      name={p.name}
                      subtitle={p.subtitle}
                      price={Number(p.price)}
                      originalPrice={Number(p.original_price)}
                      image={p.image}
                      soldOut={p.sold_out}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-12">
                    <button
                      onClick={() => {
                        setPage(page - 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={page === 0}
                      className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity disabled:opacity-20"
                      aria-label="Pagina precedente"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: "var(--color-text, #1a1a1a)" }}
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>

                    {(() => {
                      const maxV = 5;
                      let start = 0;
                      let end = totalPages;
                      if (totalPages > maxV) {
                        start = Math.max(0, page - Math.floor(maxV / 2));
                        end = start + maxV;
                        if (end > totalPages) {
                          end = totalPages;
                          start = end - maxV;
                        }
                      }
                      return Array.from({ length: end - start }, (_, idx) => {
                        const i = start + idx;
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setPage(i);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="w-10 h-10 flex items-center justify-center text-[13px] font-semibold rounded-full transition-colors"
                            style={{
                              fontFamily: "var(--font-body)",
                              backgroundColor:
                                page === i ? "var(--color-accent, #ab1a1a)" : "transparent",
                              color: page === i ? "#fff" : "var(--color-text-secondary, #666)",
                            }}
                          >
                            {i + 1}
                          </button>
                        );
                      });
                    })()}

                    <button
                      onClick={() => {
                        setPage(page + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={page === totalPages - 1}
                      className="w-10 h-10 flex items-center justify-center rounded-full transition-opacity disabled:opacity-20"
                      aria-label="Pagina successiva"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: "var(--color-text, #1a1a1a)" }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && <MobileFilterDrawer />}
    </main>
  );
}
