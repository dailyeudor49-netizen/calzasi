import { getShopConfig } from "@/lib/db";

export default async function SpedizioniPage() {
  const config = await getShopConfig();
  const email = config.shop_email || "info@calzasi.com";

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Informazioni sulle Spedizioni</h1>
      <p className="text-xs text-text-muted mb-8">
        Ultimo aggiornamento: aprile 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-lg font-semibold text-text mb-2">1. Costi di spedizione</h2>
          <p>
            La spedizione ha un costo fisso di <strong>4,99 &euro;</strong> per tutti gli ordini in Italia,
            isole comprese. Le spese di contrassegno sono gi&agrave; comprese nel prezzo:
            non ci sono costi aggiuntivi al momento della consegna.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">2. Come funziona dopo l&apos;ordine</h2>
          <p>Una volta confermato l&apos;ordine, il processo &egrave; il seguente:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-2">
            <li>
              <strong>Conferma telefonica</strong> &mdash; Un nostro operatore ti contatter&agrave;
              telefonicamente per verificare i dati dell&apos;ordine e l&apos;indirizzo di consegna.
            </li>
            <li>
              <strong>Preparazione e spedizione</strong> &mdash; Dopo la conferma, il pacco viene
              preparato e affidato al corriere <strong>GLS</strong>.
            </li>
            <li>
              <strong>Se non riusciamo a contattarti</strong> &mdash; Nel caso in cui non sia possibile
              raggiungerti telefonicamente, procediamo comunque con la spedizione
              all&apos;indirizzo indicato nell&apos;ordine.
            </li>
            <li>
              <strong>Consegna e pagamento</strong> &mdash; Il corriere consegna il pacco e paghi
              l&apos;importo totale in contanti direttamente a lui.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">3. Tempi di consegna</h2>
          <p>
            Spediamo con corriere <strong>GLS Express</strong>. I tempi di consegna sono
            di <strong>2-5 giorni lavorativi</strong> dalla data di spedizione, su tutto il territorio
            italiano, isole comprese.
          </p>
          <p className="mt-2">
            In periodi di forte richiesta (festivit&agrave;, promozioni, ecc.) i tempi
            potrebbero allungarsi leggermente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">4. Pagamento alla consegna</h2>
          <p>
            Tutti gli ordini vengono spediti in <strong>contrassegno</strong>: paghi direttamente
            al corriere al momento della consegna. Le spese di contrassegno sono
            gi&agrave; incluse nel prezzo indicato in fase d&apos;ordine.
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Pagamento esclusivamente in <strong>contanti</strong></li>
            <li>Il corriere <strong>non d&agrave; resto</strong>: prepara l&apos;importo esatto</li>
            <li>Non &egrave; possibile pagare con carta al corriere</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">5. Errore nell&apos;ordine o prodotto sbagliato</h2>
          <p>
            Se hai ricevuto un prodotto diverso da quello ordinato o con un errore (taglia,
            colore, articolo), contattaci immediatamente a{" "}
            <a href={`mailto:${email}`} className="underline text-primary">
              {email}
            </a>
            .
          </p>
          <p className="mt-2">
            In caso di errore, <strong>&egrave; necessario ritirare comunque il pacco</strong> dal corriere.
            Successivamente, potrai richiedere il reso gratuito: veniamo noi a ritirarlo
            a domicilio, senza alcun costo aggiuntivo. Il rimborso &egrave; completo.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">6. Mancato ritiro del pacco</h2>
          <p>
            Il mancato ritiro dell&apos;ordine senza giustificato motivo pu&ograve; comportare
            penali economiche e controversie legali. Per noi le spedizioni, anche se non
            consegnate, hanno un costo importante.
          </p>
          <p className="mt-2">
            Se non sei soddisfatto del tuo acquisto, puoi chiedere un{" "}
            <strong>reso gratuito a domicilio</strong>: veniamo noi a ritirarlo.
            Il rimborso &egrave; completo e il reso non ha costi aggiuntivi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">7. Contatti</h2>
          <p>
            Per qualsiasi domanda relativa alle spedizioni, scrivici a{" "}
            <a href={`mailto:${email}`} className="underline text-primary">
              {email}
            </a>{" "}
            oppure visita la pagina{" "}
            <a href="/contatti" className="underline text-primary">
              Contatti
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
