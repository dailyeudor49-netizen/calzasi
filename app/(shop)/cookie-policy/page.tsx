import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Cookie Policy</h1>
      <p className="text-xs text-text-muted mb-8">
        Ultimo aggiornamento: marzo 2026
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-lg font-semibold text-text mb-2">1. Cosa sono i cookie</h2>
          <p>
            I cookie sono piccoli file di testo che vengono memorizzati sul tuo
            dispositivo (computer, tablet o smartphone) quando visiti un sito
            web. Servono a far funzionare il sito in modo efficiente e a fornire
            informazioni ai proprietari del sito.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">2. Cookie tecnici (necessari)</h2>
          <p>
            Questi cookie sono essenziali per il funzionamento del sito e non
            possono essere disattivati. Includono:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>
              <strong>Cookie di sessione:</strong> mantengono la tua sessione
              attiva durante la navigazione.
            </li>
            <li>
              <strong>Cookie di preferenze:</strong> memorizzano le tue
              preferenze (es. consenso cookie).
            </li>
            <li>
              <strong>Cookie CSRF:</strong> proteggono il sito da attacchi
              cross-site request forgery, garantendo la sicurezza dei moduli.
            </li>
          </ul>
          <p className="mt-2">
            Questi cookie non raccolgono informazioni personali identificabili e
            sono strettamente necessari per la fornitura del servizio.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">3. Cookie di profilazione e marketing</h2>
          <p>
            Utilizziamo cookie di profilazione di terze parti per finalità di
            pubblicità personalizzata e remarketing. Questi cookie vengono
            installati solo con il tuo consenso esplicito.
          </p>

          <div className="mt-4 space-y-4">
            <div className="bg-bg-alt p-4 rounded">
              <h3 className="font-semibold text-text">Google Ads</h3>
              <p className="mt-1">
                Utilizziamo i cookie di Google Ads per mostrarti annunci
                pubblicitari personalizzati basati sulla tua navigazione sul
                nostro sito. Google utilizza questi dati per proporti pubblicità
                pertinente sulla rete Google e su siti partner.
              </p>
              <p className="mt-1">
                <strong>Finalità:</strong> pubblicità mirata, remarketing,
                misurazione delle conversioni.
              </p>
              <p className="mt-1">
                <strong>Durata:</strong> fino a 12 mesi.
              </p>
              <p className="mt-1">
                <strong>Privacy:</strong>{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Informativa Google
                </a>
              </p>
            </div>

            <div className="bg-bg-alt p-4 rounded">
              <h3 className="font-semibold text-text">Facebook Pixel (Meta)</h3>
              <p className="mt-1">
                Utilizziamo Facebook Pixel per finalità di remarketing e per
                mostrarti annunci personalizzati su Facebook e Instagram. Il
                Pixel raccoglie dati sulle tue azioni sul nostro sito per
                ottimizzare le campagne pubblicitarie.
              </p>
              <p className="mt-1">
                <strong>Finalità:</strong> remarketing, pubblicità
                personalizzata, analisi delle conversioni.
              </p>
              <p className="mt-1">
                <strong>Durata:</strong> fino a 12 mesi.
              </p>
              <p className="mt-1">
                <strong>Privacy:</strong>{" "}
                <a
                  href="https://www.facebook.com/privacy/explanation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Informativa Meta
                </a>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">4. Come disattivare i cookie</h2>
          <p>
            Puoi gestire le preferenze sui cookie in qualsiasi momento
            attraverso le impostazioni del tuo browser. Ecco come fare per i
            browser più comuni:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>
              <strong>Chrome:</strong> Impostazioni &gt; Privacy e sicurezza
              &gt; Cookie e altri dati dei siti
            </li>
            <li>
              <strong>Firefox:</strong> Impostazioni &gt; Privacy e sicurezza
              &gt; Cookie e dati dei siti web
            </li>
            <li>
              <strong>Safari:</strong> Preferenze &gt; Privacy &gt; Gestisci
              dati dei siti web
            </li>
            <li>
              <strong>Edge:</strong> Impostazioni &gt; Cookie e autorizzazioni
              sito &gt; Cookie e dati del sito
            </li>
          </ul>
          <p className="mt-2">
            Tieni presente che la disattivazione dei cookie tecnici potrebbe
            compromettere il funzionamento del sito.
          </p>
          <p className="mt-2">
            Per disattivare specificamente i cookie di Google, puoi visitare{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              Impostazioni annunci Google
            </a>
            . Per Facebook, visita le{" "}
            <a
              href="https://www.facebook.com/settings?tab=ads"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              Impostazioni annunci Facebook
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">5. Gestione del consenso</h2>
          <p>
            Al primo accesso al nostro sito, ti viene mostrato un banner per la
            gestione del consenso ai cookie. Puoi scegliere di accettare tutti i
            cookie oppure solo quelli strettamente necessari.
          </p>
          <p className="mt-2">
            Puoi modificare le tue preferenze in qualsiasi momento cancellando i
            cookie dal browser e rivisitando il sito: il banner verrà mostrato
            nuovamente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-2">6. Maggiori informazioni</h2>
          <p>
            Per ulteriori dettagli sul trattamento dei tuoi dati personali,
            consulta la nostra{" "}
            <Link href="/privacy-policy" className="underline text-primary">
              Informativa sulla Privacy
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
