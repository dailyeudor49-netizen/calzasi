"use client";

import { useRef } from "react";
import Link from "next/link";

interface Product {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  original_price: number;
  image: string | null;
  created_at?: string;
}

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const displayed = products.slice(0, 10);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector("a")?.offsetWidth || 280;
    scrollRef.current.scrollBy({
      left: dir === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-14 md:py-20">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
        <h2
          className="font-bold mb-8 md:mb-10"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text)",
            fontSize: "clamp(1.3rem, 2.2vw, 1.7rem)",
          }}
        >
          Nuovi Arrivi
        </h2>
      </div>

      <div className="relative">
        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-0 overflow-x-auto scrollbar-hide pl-5 lg:pl-10"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

          {displayed.map((product, i) => (
            <Link
              key={product.id}
              href={`/land/${product.slug}`}
              className="group flex-shrink-0 block"
              style={{
                width: "clamp(200px, 22vw, 280px)",
                scrollSnapAlign: "start",
              }}
            >
              <div
                className="relative overflow-hidden w-full"
                style={{ paddingBottom: "120%", backgroundColor: "#f5f5f5" }}
              >
                {i < 2 && (
                  <span
                    className="absolute top-3 left-3 z-10 text-xs font-bold"
                    style={{ color: "#c4122f" }}
                  >
                    Nuovo
                  </span>
                )}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="pt-3 pb-2 px-1">
                <p
                  className="text-sm font-bold leading-snug"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-text)",
                  }}
                >
                  {product.name}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {product.subtitle}
                </p>
                <p
                  className="text-sm font-medium mt-1"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--color-text)",
                  }}
                >
                  &euro;{Number(product.price).toFixed(2).replace(".", ",")}
                </p>
              </div>
            </Link>
          ))}

          {/* Spacer */}
          <div className="flex-shrink-0 w-10" />
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-3 top-1/3 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-white shadow-md transition-opacity hover:opacity-80"
          style={{ borderRadius: "50%" }}
          aria-label="Scorri avanti"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Link */}
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 mt-6 flex justify-center">
        <Link
          href="/catalogo"
          className="text-sm font-medium underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text)",
          }}
        >
          Acquista i nuovi arrivi
        </Link>
      </div>
    </section>
  );
}
