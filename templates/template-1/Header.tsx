"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CartDrawer from "./CartDrawer";

interface HeaderProps {
  brandName: string;
  logoSrc?: string;
}

export default function Header({ brandName, logoSrc = "/images/shop/logo.webp" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);
      if (currentY < 10) { setVisible(true); }
      else if (currentY > lastScrollY.current && currentY > 120) { setVisible(false); }
      else if (currentY < lastScrollY.current) { setVisible(true); }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Catalogo", href: "/catalogo" },
    { label: "Contatti", href: "/contatti" },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
        style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
      >
        {/* Thin amber accent line */}
        <div style={{ height: 3, backgroundColor: "var(--color-cta)" }} />

        {/* Trust strip — static, no animation */}
        <div style={{ backgroundColor: "var(--color-primary)", height: 32 }}>
          <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-center gap-8">
            {[
              "Spedizione 4,99 €",
              "Paghi alla Consegna",
              "Reso 30 giorni",
              "Assistenza italiana",
            ].map((text, i) => (
              <span key={i} className="hidden sm:flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-cta)", flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 10.5, fontWeight: 600, letterSpacing: "0.09em", color: "rgba(255,255,255,0.80)", textTransform: "uppercase" }}>
                  {text}
                </span>
              </span>
            ))}
            <span className="sm:hidden flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-cta)" }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.80)", textTransform: "uppercase" }}>
                Paghi alla Consegna &middot; Reso 30gg
              </span>
            </span>
          </div>
        </div>

        {/* Main navbar */}
        <div style={{
          background: "#FFFFFF",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: scrolled ? "0 2px 16px rgba(27,58,92,0.07)" : "none",
          transition: "box-shadow 0.3s ease",
        }}>
          <div className="mx-auto flex items-center justify-between px-5 lg:px-10" style={{ maxWidth: "80rem", height: 68 }}>

            <Link href="/" className="flex-shrink-0">
              <img src={logoSrc} alt={brandName} width={200} height={50} style={{ height: 36, width: "auto" }} />
            </Link>

            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontFamily: "var(--font-heading)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text)", textDecoration: "none" }}
                  className="hover:opacity-55 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/catalogo"
                className="hidden md:inline-flex items-center transition-opacity hover:opacity-85"
                style={{
                  fontFamily: "var(--font-heading)", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  backgroundColor: "var(--color-cta)", color: "#fff",
                  padding: "9px 22px", textDecoration: "none",
                }}
              >
                Acquista
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center transition-colors hover:bg-black/5"
                aria-label="Carrello"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text)" }}>
                  <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: "var(--color-cta)" }}>
                  0
                </span>
              </button>

              <button className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px]" onClick={() => setMenuOpen(true)} aria-label="Menu">
                <span className="block w-[22px] h-[1.5px]" style={{ backgroundColor: "var(--color-text)" }} />
                <span className="block w-[22px] h-[1.5px]" style={{ backgroundColor: "var(--color-text)" }} />
                <span className="block w-[14px] h-[1.5px]" style={{ backgroundColor: "var(--color-text)" }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ height: 103 }} />

      {menuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 shadow-2xl" style={{ backgroundColor: "var(--color-bg)" }}>
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--color-border)" }}>
              <img src={logoSrc} alt={brandName} style={{ height: 30, width: "auto" }} />
              <button onClick={() => setMenuOpen(false)} className="w-9 h-9 flex items-center justify-center" aria-label="Chiudi">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col p-5 gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="py-3 px-3 font-semibold transition-colors hover:opacity-70" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)", letterSpacing: "0.06em", fontSize: 15 }}>
                  {link.label}
                </Link>
              ))}
              <Link href="/catalogo" onClick={() => setMenuOpen(false)} className="mt-5 flex items-center justify-center py-3 font-bold text-white" style={{ backgroundColor: "var(--color-cta)", fontFamily: "var(--font-heading)", fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Acquista Ora
              </Link>
            </nav>
          </div>
        </div>
      )}

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
