"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

const navLinks = [
  { label: "Come funziona", href: "#order" },
  { label: "Le tecnologie", href: "#tecnologie" },
  { label: "Recensioni",    href: "#recensioni" },
  { label: "FAQ",           href: "#faq" },
];

export default function LandingHeader() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [menuTop,   setMenuTop]   = useState(64);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (menuOpen && headerRef.current) {
      setMenuTop(headerRef.current.getBoundingClientRect().bottom);
    }
  }, [menuOpen, scrolled]);

  /* close menu on route-anchor click */
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 transition-shadow duration-300"
        style={{
          backgroundColor: "var(--ml-white-pure)",
          boxShadow: scrolled ? "0 2px 12px rgba(30,27,24,0.10)" : "0 1px 0 var(--ml-border-subtle)",
          height: 64,
          display: "flex",
          alignItems: "center",
          paddingInline: "20px",
        }}
      >
        <div className="mx-auto w-full flex items-center justify-between" style={{ maxWidth: 1280 }}>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={menuOpen}
            style={{
              width: 44, height: 44,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
              border: "none", background: "transparent", cursor: "pointer",
              borderRadius: 10,
              padding: 8,
              flexShrink: 0,
            }}
          >
            <span style={{ display: "block", width: 22, height: 2, backgroundColor: "var(--ml-text-primary)", borderRadius: 2, transition: "transform 0.2s, opacity 0.2s", transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, backgroundColor: "var(--ml-text-primary)", borderRadius: 2, transition: "opacity 0.2s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, backgroundColor: "var(--ml-text-primary)", borderRadius: 2, transition: "transform 0.2s, opacity 0.2s", transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </button>

          {/* Logo — centrato */}
          <Link href="/" aria-label="Calzasi Home" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <Image
              src="/images/shop/logo.webp"
              alt="Calzasi"
              width={168}
              height={40}
              priority
              style={{ height: 40, width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Spacer destra per bilanciare */}
          <div style={{ width: 44 }} />
        </div>
      </header>

      {/* Dropdown menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed", top: menuTop, left: 0, right: 0, zIndex: 39,
            backgroundColor: "var(--ml-white-pure)",
            boxShadow: "0 8px 32px rgba(30,27,24,0.14)",
            borderTop: "1px solid var(--ml-border-subtle)",
            padding: "16px 20px 24px",
          }}
        >
          <nav style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                style={{
                  fontFamily: FONT, fontSize: 17, fontWeight: 600,
                  color: "var(--ml-text-primary)",
                  textDecoration: "none",
                  padding: "13px 12px",
                  borderRadius: 10,
                  display: "block",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "var(--ml-sand-base)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = ""; }}
              >
                {link.label}
              </a>
            ))}

            <div style={{ height: 1, backgroundColor: "var(--ml-border-subtle)", margin: "8px 0" }} />

            <a
              href="#order"
              onClick={closeMenu}
              style={{
                fontFamily: FONT, fontSize: 16, fontWeight: 800,
                color: "#fff",
                textDecoration: "none",
                background: "linear-gradient(135deg, #E8922A 0%, #C47818 100%)",
                padding: "15px 20px",
                borderRadius: 12,
                textAlign: "center",
                display: "block",
                letterSpacing: "0.02em",
                boxShadow: "0 4px 14px rgba(232,146,42,0.35)",
              }}
            >
              ORDINA ORA → PAGHI ALLA CONSEGNA
            </a>
          </nav>
        </div>
      )}

      {/* Backdrop click-away */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          style={{ position: "fixed", inset: 0, top: menuTop, zIndex: 38, background: "rgba(30,27,24,0.18)" }}
        />
      )}
    </>
  );
}
