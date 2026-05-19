import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import TrackingPixels from "@/components/TrackingPixels";
import { getTemplateConfig } from "@/lib/template";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Calzasi",
  description: "Calzature di qualità per il benessere dei tuoi piedi. Spedizione rapida, paghi alla consegna.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getTemplateConfig();
  const c = config.colors;

  return (
    <html lang="it">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: ${c.primary};
            --color-primary-light: ${c.primaryLight};
            --color-primary-dark: ${c.primaryDark};
            --color-accent: ${c.accent};
            --color-cta: ${c.cta};
            --color-cta-dark: ${c.ctaDark};
            --color-bg: ${c.bg};
            --color-bg-alt: ${c.bgAlt};
            --color-text: ${c.text};
            --color-text-secondary: ${c.textSecondary};
            --color-border: ${c.border};
            --font-heading: 'Gotham', ${config.fonts.heading}, sans-serif;
            --font-body: 'Proxima Nova', ${config.fonts.body}, sans-serif;
            --font-accent: ${config.fonts.mono}, monospace;
          }
        `}} />
      </head>
      <body className="antialiased">
        {children}
        <CookieBanner />
        <TrackingPixels />
      </body>
    </html>
  );
}
