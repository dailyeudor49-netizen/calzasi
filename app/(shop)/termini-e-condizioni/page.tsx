import { getShopConfig } from "@/lib/db";

export default async function TerminiPage() {
  const config = await getShopConfig();
  const companyName = config.shop_company || "Shop S.r.l.";
  const email = config.shop_email || "info@calzasi.com";

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Termini e Condizioni</h1>
      <p className="text-xs text-text-muted mb-8">
        Ultimo aggiornamento: marzo 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-lg font-semibold text-text mb-2">1. Disposizioni generali</h2>
          <p>
            Le presenti condizioni generali di vendita disciplinano l&apos;acquisto
            di prodotti tramite il sito web gestito da {companyName}. Effettuando
            un ordine, l&apos;utente accetta integralmente le presenti condizioni.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">2. Ordini</h2>
          <p>
            L&apos;ordine costituisce una proposta di acquisto da parte del cliente.
            L&apos;ordine si intende accettato al momento della conferma da parte
            nostra, comunicata tramite email o telefono. Ci riserviamo il diritto
            di rifiutare ordini sospetti o fraudolenti.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">3. Prezzi</h2>
          <p>
            Tutti i prezzi indicati sul sito sono in Euro e includono l&apos;IVA
            dove applicabile. I prezzi possono essere soggetti a variazioni senza
            preavviso, ma il prezzo applicato sarà quello visualizzato al momento
            dell&apos;ordine.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">4. Modalità di pagamento</h2>
          <p>
            Il pagamento avviene tramite <strong>contrassegno</strong> (pagamento
            in contanti alla consegna). L&apos;importo da corrispondere al
            corriere corrisponde al totale dell&apos;ordine, comprensivo di
            eventuali spese di spedizione indicate durante il processo di ordine.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">5. Spedizione e consegna</h2>
          <p>
            Gli ordini vengono spediti tramite corriere espresso. I tempi di
            consegna sono indicativi e generalmente compresi tra 2 e 5 giorni
            lavorativi dalla conferma dell&apos;ordine. Non siamo responsabili per
            ritardi causati dal corriere o da cause di forza maggiore.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">6. Diritto di recesso e resi</h2>
          <p>
            Il cliente ha diritto di recedere dall&apos;acquisto entro 30 giorni
            dalla ricezione del prodotto, secondo quanto previsto dalla nostra{" "}
            <a href="/politica-resi" className="underline text-primary">
              Politica Resi
            </a>
            . Il prodotto deve essere restituito integro, non utilizzato e nella
            confezione originale.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">7. Garanzia e responsabilità</h2>
          <p>
            Tutti i prodotti sono coperti dalla garanzia legale di conformità
            prevista dal Codice del Consumo (D.Lgs. 206/2005). Non siamo
            responsabili per danni derivanti da un uso improprio del prodotto.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">8. Proprietà intellettuale</h2>
          <p>
            Tutti i contenuti del sito (testi, immagini, loghi, grafica) sono di
            proprietà di {companyName} e sono protetti dalle leggi sulla proprietà
            intellettuale. È vietata la riproduzione senza autorizzazione.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">9. Legge applicabile e foro competente</h2>
          <p>
            Le presenti condizioni sono regolate dalla legge italiana. Per
            qualsiasi controversia sarà competente il foro del consumatore, come
            previsto dal Codice del Consumo.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">10. Contatti</h2>
          <p>
            Per domande relative ai presenti termini, contattaci a{" "}
            <a href={`mailto:${email}`} className="underline text-primary">
              {email}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
