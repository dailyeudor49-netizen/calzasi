import { Resend } from "resend";

interface OrderEmailData {
  email: string;
  orderId: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  productName: string;
  productImage?: string;
  color?: string;
  size: string;
  price: string;
  upsell: boolean;
  upsellPrice?: string;
  totalPrice: string;
}

const SHOP_NAME = "Calzasi";
const DOMAIN = "calzasi.com";
const PRIMARY = "#7B5CF0";
const BG_EMAIL = "#F5F5F5";
const ACCENT = "#7B5CF0";

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!data.email || !data.email.trim()) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY non configurata, email non inviata");
    return;
  }

  const resend = new Resend(apiKey);

  const imageUrl = data.productImage
    ? (data.productImage.startsWith("http") ? data.productImage : `https://${DOMAIN}${data.productImage}`)
    : "";

  const variantLine = data.color
    ? `${data.color} &middot; Taglia EU ${data.size}`
    : `Taglia EU ${data.size}`;

  const upsellRow = data.upsell
    ? `<tr>
        <td style="padding:10px 16px;font-size:14px;color:#5A5752;">Plantare Ortopedico</td>
        <td style="padding:10px 16px;font-size:14px;color:#1A1917;text-align:right;font-weight:600;">${data.upsellPrice} &euro;</td>
      </tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Conferma ordine #${data.orderId}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_EMAIL};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_EMAIL};padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

        <!-- HEADER -->
        <tr>
          <td style="background-color:${PRIMARY};padding:28px 32px;text-align:center;">
            <img src="https://${DOMAIN}/images/logo-white.svg" alt="${SHOP_NAME}" width="200" height="60" style="display:inline-block;width:200px;height:auto;" />
          </td>
        </tr>

        <!-- CONFERMA -->
        <tr>
          <td style="padding:36px 32px 20px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
              <tr><td style="width:56px;height:56px;border-radius:50%;background-color:#E6F4EC;text-align:center;vertical-align:middle;">
                <span style="font-size:26px;color:#2B6E44;line-height:56px;">&#10003;</span>
              </td></tr>
            </table>
            <h1 style="margin:0 0 6px;font-size:24px;font-weight:800;color:#1A1917;letter-spacing:-0.3px;">Ordine confermato</h1>
            <p style="margin:0 0 4px;font-size:15px;color:#9B9790;">Ordine <strong style="color:#1A1917;">#${data.orderId}</strong></p>
            <p style="margin:0;font-size:15px;color:#5A5752;">Grazie ${data.firstName}, il tuo ordine è stato ricevuto con successo.</p>
          </td>
        </tr>

        <!-- RIEPILOGO -->
        <tr>
          <td style="padding:0 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #E6E2DA;border-radius:12px;overflow:hidden;">
              <tr>
                <td colspan="2" style="padding:14px 16px 10px;font-size:13px;font-weight:700;color:#9B9790;text-transform:uppercase;letter-spacing:0.8px;border-bottom:1px solid #F2EFE9;">
                  Riepilogo ordine
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding:12px 16px;">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      ${imageUrl ? `<td style="width:64px;vertical-align:top;padding-right:12px;">
                        <img src="${imageUrl}" alt="${data.productName}" width="64" height="64" style="display:block;width:64px;height:64px;border-radius:8px;object-fit:cover;border:1px solid #E6E2DA;" />
                      </td>` : ""}
                      <td style="vertical-align:top;">
                        <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#1A1917;">${data.productName}</p>
                        <p style="margin:0;font-size:13px;color:#9B9790;">${variantLine}</p>
                      </td>
                      <td style="vertical-align:top;text-align:right;white-space:nowrap;">
                        <p style="margin:0;font-size:15px;font-weight:700;color:#1A1917;">${data.price} &euro;</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              ${upsellRow}
              <tr>
                <td style="padding:10px 16px;font-size:14px;color:#5A5752;border-top:1px solid #F2EFE9;">Spedizione Express</td>
                <td style="padding:10px 16px;font-size:14px;color:#1A1917;text-align:right;font-weight:600;border-top:1px solid #F2EFE9;">4,99 &euro;</td>
              </tr>
              <tr>
                <td style="padding:14px 16px;font-size:17px;font-weight:800;color:#1A1917;border-top:2px solid #1A1917;">Totale da pagare</td>
                <td style="padding:14px 16px;font-size:19px;font-weight:800;color:#2B6E44;text-align:right;border-top:2px solid #1A1917;">${data.totalPrice} &euro;</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- PAGAMENTO -->
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2A14F;border-radius:12px;">
              <tr>
                <td style="padding:18px 20px;">
                  <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#FFFFFF;text-transform:uppercase;letter-spacing:0.5px;">Pagamento alla consegna</p>
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr><td style="padding:4px 0;font-size:14px;color:#FFFFFF;line-height:1.5;">&#8226;&ensp;Paghi <strong>${data.totalPrice} &euro;</strong> in contanti direttamente al corriere</td></tr>
                    <tr><td style="padding:4px 0;font-size:14px;color:#FFFFFF;line-height:1.5;">&#8226;&ensp;Il corriere <strong>non dà resto</strong> &mdash; prepara l'importo esatto</td></tr>
                    <tr><td style="padding:4px 0;font-size:14px;color:#FFFFFF;line-height:1.5;">&#8226;&ensp;Non è possibile pagare con carta al corriere</td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- SPEDIZIONE -->
        <tr>
          <td style="padding:16px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #E6E2DA;border-radius:12px;overflow:hidden;">
              <tr>
                <td colspan="2" style="padding:14px 16px 10px;font-size:13px;font-weight:700;color:#9B9790;text-transform:uppercase;letter-spacing:0.8px;border-bottom:1px solid #F2EFE9;">Spedizione</td>
              </tr>
              <tr>
                <td style="padding:14px 16px;">
                  <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#1A1917;">${data.firstName} ${data.lastName}</p>
                  <p style="margin:0;font-size:14px;color:#5A5752;line-height:1.6;">${data.address}<br>${data.city} (${data.state}) ${data.zip}<br>${data.phone}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 16px 14px;">
                  <table cellpadding="0" cellspacing="0"><tr><td style="background-color:#E6F4EC;border-radius:6px;padding:6px 12px;">
                    <span style="font-size:13px;font-weight:600;color:#2B6E44;">Consegna in 2-5 giorni lavorativi</span>
                  </td></tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- PROSSIMI PASSI -->
        <tr>
          <td style="padding:20px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #E6E2DA;border-radius:12px;overflow:hidden;">
              <tr><td style="padding:14px 16px 10px;font-size:13px;font-weight:700;color:#9B9790;text-transform:uppercase;letter-spacing:0.8px;border-bottom:1px solid #F2EFE9;">Prossimi passi</td></tr>
              <tr>
                <td style="padding:14px 16px;">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="width:28px;vertical-align:top;padding:4px 0;"><span style="display:inline-block;width:22px;height:22px;border-radius:50%;background-color:${PRIMARY};color:#fff;font-size:12px;font-weight:700;line-height:22px;text-align:center;">1</span></td>
                      <td style="padding:4px 0;font-size:14px;color:#5A5752;line-height:1.5;">Un nostro operatore potrebbe contattarti telefonicamente per confermare l'ordine</td>
                    </tr>
                    <tr><td colspan="2" style="height:8px;"></td></tr>
                    <tr>
                      <td style="width:28px;vertical-align:top;padding:4px 0;"><span style="display:inline-block;width:22px;height:22px;border-radius:50%;background-color:${PRIMARY};color:#fff;font-size:12px;font-weight:700;line-height:22px;text-align:center;">2</span></td>
                      <td style="padding:4px 0;font-size:14px;color:#5A5752;line-height:1.5;">Se non riusciamo a contattarti, spediamo automaticamente il pacco</td>
                    </tr>
                    <tr><td colspan="2" style="height:8px;"></td></tr>
                    <tr>
                      <td style="width:28px;vertical-align:top;padding:4px 0;"><span style="display:inline-block;width:22px;height:22px;border-radius:50%;background-color:${PRIMARY};color:#fff;font-size:12px;font-weight:700;line-height:22px;text-align:center;">3</span></td>
                      <td style="padding:4px 0;font-size:14px;color:#5A5752;line-height:1.5;">Il corriere consegna il pacco e paghi <strong style="color:#1A1917;">${data.totalPrice} &euro;</strong> in contanti</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ORARI -->
        <tr>
          <td style="padding:12px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2EFE9;border-radius:10px;">
              <tr><td style="padding:12px 16px;text-align:center;">
                <p style="margin:0;font-size:13px;color:#78716c;line-height:1.5;">&#128222; Orari call center: <strong style="color:#1A1917;">Lun&ndash;Ven 9:30&ndash;17:00</strong></p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- FATTURA -->
        <tr>
          <td style="padding:16px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2EFE9;border-radius:12px;">
              <tr><td style="padding:14px 20px;">
                <p style="margin:0;font-size:13px;color:#5A5752;line-height:1.6;">
                  <strong style="color:#1A1917;">Hai bisogno della fattura?</strong> Dopo aver ricevuto l'ordine, richiedila scrivendo a
                  <a href="mailto:info@calzasi.com" style="color:${ACCENT};text-decoration:underline;font-weight:600;">info@calzasi.com</a>
                  oppure tramite il <a href="https://${DOMAIN}/contatti" style="color:${ACCENT};text-decoration:underline;font-weight:600;">modulo contatti</a>.
                </p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- MANCATO RITIRO -->
        <tr>
          <td style="padding:16px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1.5px solid #E6E2DA;border-radius:12px;overflow:hidden;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1A1917;">Cosa succede se non ritiro l'ordine?</p>
                <p style="margin:0 0 14px;font-size:13px;color:#5A5752;line-height:1.6;">Il mancato ritiro dell'ordine senza giustificato motivo può comportare penali economiche e controversie legali. Purtroppo, per noi le spedizioni anche se non consegnate hanno un costo importante. Ti ringraziamo per la comprensione e per la gentile collaborazione.</p>
                <p style="margin:0;font-size:13px;color:#2B6E44;line-height:1.6;font-weight:500;">Tranquillo, se non sei soddisfatto del tuo acquisto, puoi chiedere un rimborso gratuito a domicilio (veniamo noi a ritirarlo). Il rimborso è completo e il reso non ha costi aggiuntivi.</p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:28px 32px 32px;text-align:center;">
            <div style="border-top:1px solid #E6E2DA;padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#9B9790;">&copy; ${SHOP_NAME} &mdash; ${DOMAIN}</p>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: `${SHOP_NAME} <ordini@${DOMAIN}>`,
      to: data.email.trim(),
      replyTo: `info@${DOMAIN}`,
      subject: `Conferma ordine #${data.orderId} — ${SHOP_NAME}`,
      html,
    });
  } catch (err) {
    console.error("[email] Errore invio email conferma:", err);
  }
}
