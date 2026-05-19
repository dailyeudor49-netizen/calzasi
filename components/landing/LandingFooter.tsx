import Image from "next/image";
import Link from "next/link";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

export default function LandingFooter() {
  const cols = [
    { heading: "SHOP",          links: [{ l: "Catalogo", h: "/catalogo" }, { l: "Novità", h: "/catalogo?sort=new" }, { l: "Offerte", h: "/catalogo?sort=sale" }] },
    { heading: "INFORMAZIONI",  links: [{ l: "Contatti", h: "/contatti" }, { l: "Resi e Rimborsi", h: "/politica-resi" }, { l: "FAQ", h: "#faq" }] },
    { heading: "LEGALE",        links: [{ l: "Privacy Policy", h: "/privacy-policy" }, { l: "Termini e Condizioni", h: "/termini-e-condizioni" }, { l: "Politica Resi", h: "/politica-resi" }] },
  ];

  return (
    <footer style={{ backgroundColor: "#1E1240", padding: "56px 20px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <Image src="/images/shop/logo.webp" alt="Calzasi" width={168} height={40} style={{ height: 40, width: "auto", filter: "brightness(0) invert(1)", marginBottom: 10 }} />
          <p style={{ fontFamily: FONT, fontStyle: "italic", fontSize: 15, color: "rgba(250,247,242,0.80)" }}>
            Boutique dal 1990 · Via della Spiga · Milano
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 32, marginBottom: 40 }}>
          {cols.map((col) => (
            <div key={col.heading}>
              <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(250,247,242,0.50)", marginBottom: 16 }}>
                {col.heading}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((lk) => (
                  <Link key={lk.l} href={lk.h} style={{ fontFamily: FONT, fontSize: 15, color: "rgba(250,247,242,0.78)", textDecoration: "none" }}>
                    {lk.l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, backgroundColor: "rgba(250,247,242,0.18)", marginBottom: 28 }} />

        <p style={{ fontFamily: FONT, fontSize: 14, color: "rgba(250,247,242,0.65)", lineHeight: 1.7 }}>
          Calzasi S.r.l. · Via delle Manifatture 12, 27029 Vigevano (PV) · P.IVA: IT03751648971<br />
          Assistenza:{" "}
          <a href="mailto:info@calzasi.com" style={{ color: "rgba(250,247,242,0.85)" }}>info@calzasi.com</a>
          <br />© 2026 Calzasi S.r.l. — Tutti i diritti riservati.
        </p>
        <p style={{ fontFamily: FONT, fontSize: 12, color: "rgba(250,247,242,0.35)", marginTop: 16 }}>
          Powered by <span style={{ color: "rgba(250,247,242,0.45)" }}>CORA</span>
        </p>
      </div>
    </footer>
  );
}
