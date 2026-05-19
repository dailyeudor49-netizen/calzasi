import Link from "next/link";
import { getShopConfig } from "@/lib/db";

export default async function Footer() {
  const config = await getShopConfig();

  const companyName = config.shop_company || "Shop S.r.l.";
  const shopName = config.shop_name || "Shop";
  const address = [config.shop_address, config.shop_zip, config.shop_city].filter(Boolean).join(", ");
  const piva = config.shop_vat || "";
  const email = config.shop_email || "";

  return (
    <footer className="text-sm" style={{ backgroundColor: "#f5f5f5", color: "#555" }}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 1024px) {
            .piumi-footer-grid { grid-template-columns: 1.2fr 1fr 1fr 1fr !important; gap: 48px !important; }
          }
          @media (min-width: 640px) and (max-width: 1023px) {
            .piumi-footer-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}} />
        <div className="piumi-footer-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
          {/* Brand + company data */}
          <div>
            <img src="/images/shop/logo.webp" alt={shopName} width={200} height={50} className="mb-4" style={{ height: 38, width: "auto" }} />
            <div className="h-px w-10 mb-4" style={{ backgroundColor: "#ccc" }} />
            <div className="space-y-1.5 text-[13px]" style={{ fontFamily: "'Proxima Nova', sans-serif", color: "#666" }}>
              <p>{companyName}</p>
              {address && <p>{address}</p>}
              {piva && <p>P.I e C.F {piva}</p>}
            </div>
          </div>

          {/* Chi siamo */}
          <div>
            <p className="font-bold mb-3 text-[11px] uppercase tracking-[0.15em]" style={{ fontFamily: "'Gotham', sans-serif", color: "#1a1a1a" }}>
              CHI SIAMO
            </p>
            <div className="h-px w-10 mb-4" style={{ backgroundColor: "#ccc" }} />
            <ul className="space-y-2">
              <li><Link href="/contatti" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Chi siamo</Link></li>
              <li><Link href="/catalogo?cat=ortopediche" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Calzature ortopediche</Link></li>
              <li><Link href="/catalogo?cat=fitness" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Calzature fitness</Link></li>
              <li><Link href="/catalogo?cat=posturali" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Calzature posturali</Link></li>
              <li><Link href="/catalogo?cat=trekking" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Calzature trekking</Link></li>
            </ul>
          </div>

          {/* Informazioni */}
          <div>
            <p className="font-bold mb-3 text-[11px] uppercase tracking-[0.15em]" style={{ fontFamily: "'Gotham', sans-serif", color: "#1a1a1a" }}>
              INFORMAZIONI
            </p>
            <div className="h-px w-10 mb-4" style={{ backgroundColor: "#ccc" }} />
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Cookie Policy</Link></li>
              <li><Link href="/termini-e-condizioni" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Termini e Condizioni</Link></li>
              <li><Link href="/politica-resi" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Diritto di recesso</Link></li>
            </ul>
          </div>

          {/* Servizio clienti */}
          <div>
            <p className="font-bold mb-3 text-[11px] uppercase tracking-[0.15em]" style={{ fontFamily: "'Gotham', sans-serif", color: "#1a1a1a" }}>
              SERVIZIO CLIENTI
            </p>
            <div className="h-px w-10 mb-4" style={{ backgroundColor: "#ccc" }} />
            <ul className="space-y-2">
              <li><Link href="/contatti" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Contattaci</Link></li>
              <li><Link href="/politica-resi" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Spedizioni</Link></li>
              <li><Link href="/politica-resi" className="hover:text-[#1a1a1a] transition-colors text-[13px]" style={{ color: "#666", fontFamily: "'Proxima Nova', sans-serif" }}>Resi e rimborsi</Link></li>
            </ul>

            <div className="mt-6">
              <p className="font-bold text-[10px] uppercase tracking-[0.15em] mb-3" style={{ fontFamily: "'Gotham', sans-serif", color: "#1a1a1a" }}>
                SERVIZIO ATTIVO DA LUNEDÌ A VENERDÌ
              </p>
              <div className="h-px w-10 mb-3" style={{ backgroundColor: "#ccc" }} />
              <div className="space-y-1.5 text-[13px]" style={{ fontFamily: "'Proxima Nova', sans-serif", color: "#666" }}>
                <p>E-mail: <a href={`mailto:${email}`} className="hover:text-[#1a1a1a] transition-colors">{email}</a></p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]" style={{ borderTop: "1px solid #ddd", color: "#999", fontFamily: "'Proxima Nova', sans-serif" }}>
          <div className="flex items-center gap-3">
            <Link href="/privacy-policy" className="hover:text-[#666] transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/cookie-policy" className="hover:text-[#666] transition-colors">Cookie Policy</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} {companyName}. Tutti i diritti riservati.</p>
          <p style={{ fontFamily: "'Proxima Nova', sans-serif", fontSize: 11, color: "#bbb" }}>
            Powered by <span style={{ color: "#bbb" }}>CORA</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
