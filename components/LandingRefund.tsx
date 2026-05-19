import { getShopConfig } from "@/lib/db";

interface Props {
  accentColor?: string;
}

export default async function LandingRefund({ accentColor = "#16a34a" }: Props) {
  const config = await getShopConfig();
  const email = config.shop_email || "info@calzasi.com";
  const company = config.shop_company || "";
  const address = [config.shop_address, config.shop_zip, config.shop_city].filter(Boolean).join(", ");
  const vat = config.shop_vat || "";

  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#faf8f5" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex justify-center">
            <img
              src="/images/rimborso.webp"
              alt="Garanzia soddisfatto o rimborsato"
              className="w-full max-w-sm rounded-2xl"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
              Garanzia
            </p>
            <h2
              className="font-extrabold mb-4"
              style={{ fontFamily: "var(--font-heading)", color: "#1A1917" }}
            >
              Soddisfatto o Rimborsato
            </h2>
            <p className="text-[16px] leading-relaxed mb-4" style={{ color: "#5A5752", fontFamily: "var(--font-body)" }}>
              Hai <b style={{ color: "#1A1917" }}>30 giorni di tempo</b> dalla ricezione del prodotto per richiedere un reso completo.
              Se per qualsiasi motivo non sei soddisfatto del tuo acquisto, ti rimborsiamo senza fare domande.
            </p>
            <p className="text-[16px] leading-relaxed" style={{ color: "#5A5752", fontFamily: "var(--font-body)" }}>
              Per avviare la procedura di reso, contattaci a{" "}
              <a href={`mailto:${email}`} className="font-semibold underline" style={{ color: accentColor }}>
                {email}
              </a>. Rispondiamo in <b style={{ color: "#1A1917" }}>24h</b>. Mandiamo noi il corriere e il <b style={{ color: "#1A1917" }}>rimborso e immediato</b>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
