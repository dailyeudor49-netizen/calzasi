import { getShopConfig } from "@/lib/db";

export default async function PoliticaResiPage() {
  const config = await getShopConfig();
  const companyName = config.shop_company || "Shop S.r.l.";
  const email = config.shop_email || "info@calzasi.com";

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Politica Resi</h1>
      <p className="text-xs text-text-muted mb-8">
        Ultimo aggiornamento: marzo 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-lg font-semibold text-text mb-2">1. Diritto di reso</h2>
          <p>
            Hai il diritto di restituire il prodotto acquistato entro{" "}
            <strong>30 giorni</strong> dalla data di ricezione, senza dover
            fornire alcuna motivazione, ai sensi del D.Lgs. 206/2005 (Codice del
            Consumo).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">2. Condizioni per il reso</h2>
          <p>Per poter effettuare il reso, il prodotto deve:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Essere integro e non utilizzato</li>
            <li>Essere nella confezione originale, completa di tutti gli accessori</li>
            <li>
              Non presentare segni di usura, danni o alterazioni causati dal
              cliente
            </li>
            <li>Essere accompagnato dallo scontrino o conferma d&apos;ordine</li>
          </ul>
          <p className="mt-2">
            Le scarpe devono essere state provate esclusivamente in ambienti
            interni. Prodotti con suole sporche o segni di utilizzo esterno non
            saranno accettati.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">3. Come richiedere un reso</h2>
          <p>Per richiedere un reso, segui questi passaggi:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>
              Invia una email a{" "}
              <a href={`mailto:${email}`} className="underline text-primary">
                {email}
              </a>{" "}
              indicando il numero d&apos;ordine e il motivo del reso.
            </li>
            <li>
              Riceverai una conferma con le istruzioni per la spedizione del
              reso.
            </li>
            <li>
              Imballa il prodotto in modo adeguato per evitare danni durante il
              trasporto.
            </li>
            <li>
              Spedisci il pacco all&apos;indirizzo indicato nelle istruzioni di
              reso.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">4. Spese di spedizione per il reso</h2>
          <p>
            Le spese di spedizione per il reso sono a carico del cliente, salvo
            che il reso sia dovuto a un nostro errore (prodotto errato o
            difettoso).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">5. Rimborso</h2>
          <p>
            Una volta ricevuto il prodotto e verificata la conformità alle
            condizioni di reso, procederemo al rimborso entro{" "}
            <strong>14 giorni lavorativi</strong>.
          </p>
          <p className="mt-2">
            Il rimborso verrà effettuato tramite bonifico bancario o con lo
            stesso metodo di pagamento utilizzato per l&apos;acquisto. Poiché il
            pagamento avviene in contrassegno, ti chiederemo le coordinate
            bancarie per il bonifico di rimborso.
          </p>
          <p className="mt-2">
            Il rimborso includerà il prezzo del prodotto. Le spese di spedizione
            originali non sono rimborsabili, salvo i casi previsti dalla legge.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">6. Prodotti difettosi</h2>
          <p>
            Se il prodotto ricevuto è difettoso o non conforme a quanto ordinato,
            hai diritto alla sostituzione o al rimborso completo, comprese le
            spese di spedizione. Contattaci entro 48 ore dalla ricezione
            allegando foto del difetto.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">7. Contatti</h2>
          <p>
            Per qualsiasi domanda relativa ai resi, contatta {companyName} a{" "}
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
