"use client";

import { useEffect } from "react";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col shadow-2xl animate-slide-in-right"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text)" }}>
              <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <span
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
            >
              Carrello
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5"
            aria-label="Chiudi carrello"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text-secondary)" }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Empty state */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-bg-alt)" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text-secondary)" }}>
              <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </div>
          <h3
            className="mt-4 text-lg font-semibold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            Il tuo carrello e vuoto
          </h3>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-text-secondary)" }}
          >
            Esplora il nostro catalogo e trova le calzature perfette per te.
          </p>
          <Link
            href="/catalogo"
            onClick={onClose}
            className="mt-6 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-cta)", fontFamily: "var(--font-heading)" }}
          >
            Scopri il Catalogo
          </Link>
        </div>

        {/* Footer */}
        <div className="px-6 py-4" style={{ borderTop: "1px solid var(--color-border)" }}>
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>Subtotale</span>
            <span className="font-semibold" style={{ color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>&euro;0,00</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
