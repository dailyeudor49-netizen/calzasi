import Link from "next/link";
import { getShopConfig } from "@/lib/db";

export default async function PrivacyPolicyPage() {
  const config = await getShopConfig();
  const companyName = config.shop_company || "Shop S.r.l.";
  const address = [config.shop_address, config.shop_zip, config.shop_city].filter(Boolean).join(", ");
  const email = config.shop_email || "info@calzasi.com";
  const piva = config.shop_vat || "";

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Informativa sulla Privacy</h1>
      <p className="text-xs text-text-muted mb-8">
        Ultimo aggiornamento: marzo 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-lg font-semibold text-text mb-2">1. Titolare del trattamento</h2>
          <p>
            Il titolare del trattamento dei dati personali è {companyName}, con
            sede in {address}, P.IVA {piva}. Per qualsiasi richiesta relativa
            alla privacy, contattaci all&apos;indirizzo email:{" "}
            <a href={`mailto:${email}`} className="underline">
              {email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">2. Dati personali raccolti</h2>
          <p>Raccogliamo i seguenti dati personali:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Nome e cognome</li>
            <li>Numero di telefono</li>
            <li>Indirizzo email</li>
            <li>Indirizzo di spedizione (via, civico, CAP, città, provincia)</li>
            <li>Indirizzo IP</li>
            <li>Dati di navigazione e cookie (vedi sezione dedicata)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">3. Finalità del trattamento</h2>
          <p>I dati personali vengono trattati per le seguenti finalità:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>
              <strong>Evasione degli ordini:</strong> gestione dell&apos;ordine,
              spedizione, comunicazioni relative all&apos;acquisto.
            </li>
            <li>
              <strong>Prevenzione delle frodi:</strong> verifica degli ordini,
              controllo IP e numeri di telefono per prevenire abusi.
            </li>
            <li>
              <strong>Pubblicità personalizzata:</strong> tramite cookie di
              profilazione di Google Ads e Facebook Pixel, utilizziamo i dati di
              navigazione per mostrarti annunci personalizzati su piattaforme di
              terze parti.
            </li>
            <li>
              <strong>Miglioramento del servizio:</strong> analisi statistica
              anonima delle visite e degli acquisti.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">4. Cookie e tecnologie di tracciamento</h2>
          <p>
            Utilizziamo cookie tecnici necessari al funzionamento del sito e
            cookie di profilazione per finalità pubblicitarie. Per informazioni
            dettagliate sui cookie utilizzati, consulta la nostra{" "}
            <Link href="/cookie-policy" className="underline text-primary">
              Cookie Policy
            </Link>
            .
          </p>
          <p className="mt-2">
            In particolare, utilizziamo cookie di profilazione di{" "}
            <strong>Google Ads</strong> e <strong>Facebook Pixel</strong> per
            finalità di remarketing e pubblicità personalizzata. Questi cookie
            consentono a Google e Facebook di raccogliere dati sulla tua
            navigazione per mostrarti annunci pertinenti.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">5. Condivisione dei dati con terze parti</h2>
          <p>I tuoi dati possono essere condivisi con:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>
              <strong>Corrieri e servizi di spedizione:</strong> per la consegna
              degli ordini (nome, indirizzo, telefono).
            </li>
            <li>
              <strong>Google (Google Ads):</strong> dati di navigazione per
              finalità pubblicitarie.
            </li>
            <li>
              <strong>Meta (Facebook Pixel):</strong> dati di navigazione per
              finalità di remarketing.
            </li>
            <li>
              <strong>Servizi di email:</strong> per l&apos;invio di conferme
              ordine.
            </li>
          </ul>
          <p className="mt-2">
            Non vendiamo i tuoi dati personali a terze parti.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">6. Periodo di conservazione dei dati</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Dati degli ordini:</strong> conservati per 10 anni come
              richiesto dalla normativa fiscale italiana.
            </li>
            <li>
              <strong>Dati IP per prevenzione frodi:</strong> conservati per 12
              mesi.
            </li>
            <li>
              <strong>Cookie di profilazione:</strong> durata massima di 12 mesi
              dalla raccolta del consenso.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">7. Diritti dell&apos;interessato (GDPR)</h2>
          <p>
            Ai sensi del Regolamento UE 2016/679 (GDPR), hai il diritto di:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>
              <strong>Accesso:</strong> ottenere conferma dell&apos;esistenza dei
              tuoi dati e riceverne una copia.
            </li>
            <li>
              <strong>Rettifica:</strong> richiedere la correzione di dati
              inesatti o incompleti.
            </li>
            <li>
              <strong>Cancellazione:</strong> richiedere la cancellazione dei
              tuoi dati personali.
            </li>
            <li>
              <strong>Portabilità:</strong> ricevere i tuoi dati in un formato
              strutturato e leggibile.
            </li>
            <li>
              <strong>Opposizione:</strong> opporti al trattamento dei dati per
              finalità di marketing.
            </li>
            <li>
              <strong>Reclamo:</strong> presentare reclamo al Garante per la
              Protezione dei Dati Personali.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">8. Contatti per richieste privacy</h2>
          <p>
            Per esercitare i tuoi diritti o per qualsiasi domanda relativa al
            trattamento dei tuoi dati personali, puoi contattarci a:
          </p>
          <p className="mt-2">
            <strong>Email:</strong>{" "}
            <a href={`mailto:${email}`} className="underline">
              {email}
            </a>
          </p>
          <p>
            <strong>Indirizzo:</strong> {companyName}, {address}
          </p>
        </section>
      </div>
    </main>
  );
}
