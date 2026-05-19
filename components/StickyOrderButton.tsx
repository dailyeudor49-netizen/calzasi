"use client";

import { useState, useEffect } from "react";
import type { OrderConfig } from "@/lib/order-config";

export function StickyOrderButton({ config }: { config: OrderConfig }) {
  const hasColors = config.colors.length > 0;
  const [hide, setHide] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupSize, setPopupSize] = useState("39");
  const [popupColor, setPopupColor] = useState(config.colors[0]?.name || "");

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === footer) {
            setHide(entry.isIntersecting);
          }
        }
      },
      { threshold: 0 }
    );

    io.observe(footer);
    return () => io.disconnect();
  }, []);

  /* Listen for "open-sticky-popup" from OrderModal Modifica */
  useEffect(() => {
    const handler = () => setPopupOpen(true);
    window.addEventListener("open-sticky-popup", handler);
    return () => window.removeEventListener("open-sticky-popup", handler);
  }, []);

  /* Listen for hero variant changes */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.size) setPopupSize(detail.size);
      if (detail.color) setPopupColor(detail.color);
    };
    window.addEventListener("hero-variant", handler);
    return () => window.removeEventListener("hero-variant", handler);
  }, []);

  /* Close popup on outside click */
  useEffect(() => {
    if (!popupOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-sticky-popup]") || target.closest("[data-sticky-btn]")) return;
      setPopupOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [popupOpen]);

  /* Sync popup selections → landing #taglie section */
  useEffect(() => {
    if (popupOpen) {
      window.dispatchEvent(new CustomEvent("sync-variant", { detail: { size: popupSize, color: popupColor || undefined } }));
    }
  }, [popupSize, popupColor, popupOpen]);

  if (hide) return null;

  const handleProceed = () => {
    window.dispatchEvent(new CustomEvent("sticky-order", { detail: { size: popupSize, color: popupColor || undefined } }));
    setPopupOpen(false);
  };

  const fmtPrice = (n: number) => n.toFixed(2).replace(".", ",");

  return (
    <>
      {/* Overlay oscurato */}
      {popupOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 transition-opacity"
          onClick={() => setPopupOpen(false)}
        />
      )}
      <div className="fixed bottom-0 inset-x-0 z-50">
        {/* Popup */}
        {popupOpen && (
          <div
            data-sticky-popup
            className="bg-white px-6 pt-6 pb-5 shadow-[0_-4px_24px_rgba(0,0,0,0.15)] border-t border-x border-gray-200 rounded-t-2xl"
            style={{ animation: "cf-slide-up .25s ease-out" }}
          >
            {/* Close */}
            <button
              onClick={() => setPopupOpen(false)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition"
              aria-label="Chiudi"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#555" strokeWidth="2.5" strokeLinecap="round" /></svg>
            </button>

            {/* Color selector */}
            {hasColors && (
              <div className="mb-4">
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#9B9790", fontFamily: "var(--font-body)" }}>
                  Colore: <span className="normal-case font-bold tracking-normal text-sm" style={{ color: "#1A1917" }}>{popupColor}</span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {config.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setPopupColor(c.name)}
                      className="flex items-center gap-2.5 border px-3.5 py-2.5 text-sm font-semibold transition-all"
                      style={{
                        borderRadius: 10,
                        borderWidth: popupColor === c.name ? 2 : 1,
                        borderColor: popupColor === c.name ? "#1E3560" : "#D7DCE2",
                        backgroundColor: "#FFFFFF",
                        color: popupColor === c.name ? "#1A1917" : "#5A5752",
                        boxShadow: popupColor === c.name ? "0 0 0 1px #1E3560" : "none",
                      }}
                    >
                      <span className="inline-block h-4 w-4 rounded-full" style={{ background: c.dot || c.bg, border: "1.5px solid #D7DCE2" }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-5">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#9B9790", fontFamily: "var(--font-body)" }}>
                Taglia: <span className="normal-case font-bold tracking-normal text-sm" style={{ color: "#1A1917" }}>EU {popupSize}</span>
              </p>
              <div className="grid grid-cols-4 gap-2">
                {config.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setPopupSize(s)}
                    className="flex h-[46px] items-center justify-center border text-sm font-semibold transition-all"
                    style={{
                      borderRadius: 10,
                      ...(popupSize === s
                        ? { borderColor: "#1E3560", backgroundColor: "#1E3560", color: "#fff", borderWidth: 2, boxShadow: "0 0 0 1px #1E3560" }
                        : { borderColor: "#D7DCE2", backgroundColor: "#fff", color: "#5A5752", borderWidth: 1 }),
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Proceed button */}
            <button
              onClick={handleProceed}
              className="w-full py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90"
              style={{ borderRadius: 12, backgroundColor: "#1E3560", fontFamily: "var(--font-heading)", boxShadow: "0 4px 14px rgba(255,145,77,0.25)" }}
            >
              Procedi
            </button>
          </div>
        )}

        {/* Sticky bar */}
        {!popupOpen && (
          <div className="flex items-center gap-3 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            style={{ borderTop: "1px solid #E2E4E8", boxShadow: "0 -2px 20px rgba(26,25,23,0.10)" }}>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold" style={{ color: "#9B9790", fontFamily: "var(--font-heading)" }}>{config.title}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[20px] font-extrabold leading-none" style={{ color: "#1E3560", fontFamily: "var(--font-heading)" }}>&euro;{fmtPrice(config.price)}</span>
                <span className="text-sm line-through" style={{ color: "#9B9790" }}>&euro;{fmtPrice(config.comparePrice)}</span>
              </div>
            </div>
            <button
              data-sticky-btn
              onClick={() => setPopupOpen(true)}
              className="shrink-0 px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ borderRadius: 12, backgroundColor: "#1E3560", fontFamily: "var(--font-heading)", boxShadow: "0 4px 14px rgba(255,145,77,0.25)" }}
            >
              Ordina ora
            </button>
          </div>
        )}
      </div>
    </>
  );
}
