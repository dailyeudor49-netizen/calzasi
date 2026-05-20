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
const PRIMARY_DARK = "#5B3CD0";
const BG_PAGE = "#f6f6f7";
const BORDER = "#e1e1e1";
const BORDER_SOFT = "#f0f0f0";
const TEXT = "#1a1a1a";
const TEXT_MUTED = "#5f6368";
const LABEL = "#888888";
const GREEN = "#137333";
const GREEN_BG = "#e6f4ea";

function fmtPrice(s: string | undefined): string {
  if (!s) return "0,00";
  const n = parseFloat(String(s).replace(",", "."));
  if (isNaN(n)) return String(s);
  return n.toFixed(2).replace(".", ",");
}

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

  const priceFmt = fmtPrice(data.price);
  const upsellPriceFmt = fmtPrice(data.upsellPrice);
  const totalPriceFmt = fmtPrice(data.totalPrice);

  const colorChip = data.color
    ? `<span style="display:inline-block;font-size:13px;color:#444;background:#f5f5f5;border:1px solid #e8e8e8;border-radius:6px;padding:4px 10px;font-weight:500;margin:0 6px 6px 0;">
        <span style="color:#888;font-weight:400;">Colore:</span> ${data.color}
      </span>`
    : "";
  const sizeChip = data.size
    ? `<span style="display:inline-block;font-size:13px;color:#444;background:#f5f5f5;border:1px solid #e8e8e8;border-radius:6px;padding:4px 10px;font-weight:500;margin:0 6px 6px 0;">
        <span style="color:#888;font-weight:400;">Taglia:</span> ${data.size}
      </span>`
    : "";

  const upsellRow = data.upsell
    ? `<tr>
        <td style="padding:4px 0;font-size:14px;color:${TEXT_MUTED};font-weight:500;">Plantare Ortopedico</td>
        <td style="padding:4px 0;font-size:14px;color:${TEXT_MUTED};text-align:right;font-weight:500;">${upsellPriceFmt} &euro;</td>
      </tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Conferma ordine ${data.orderId}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_PAGE};font-family:'Inter','Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:${TEXT};line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_PAGE};padding:0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

        <!-- LOGO BAR -->
        <tr>
          <td style="background-color:${PRIMARY};padding:14px 20px;text-align:center;border-radius:0 0 12px 12px;">
            <img src="https://${DOMAIN}/images/logo-white.svg" alt="${SHOP_NAME}" height="28" style="display:inline-block;height:28px;width:auto;" />
          </td>
        </tr>

        <!-- WRAPPER -->
        <tr><td style="padding:40px 20px 64px;">

          <!-- HEADER -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid ${BORDER};padding-bottom:32px;margin-bottom:28px;">
            <tr><td align="center" style="text-align:center;padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                <tr><td style="width:56px;height:56px;border-radius:50%;background-color:${GREEN_BG};text-align:center;vertical-align:middle;">
                  <span style="font-size:26px;color:${GREEN};line-height:56px;font-weight:700;">&#10003;</span>
                </td></tr>
              </table>
              <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:${LABEL};text-transform:uppercase;letter-spacing:1.2px;">Ordine ${data.orderId}</p>
              <h1 style="margin:0 0 4px;font-family:'Poppins','Helvetica Neue',sans-serif;font-size:26px;font-weight:700;color:${TEXT};letter-spacing:-0.3px;">Grazie per il tuo ordine!</h1>
              <p style="margin:0;font-size:15px;color:${TEXT_MUTED};">${data.firstName}, il tuo ordine è stato ricevuto correttamente.</p>
            </td></tr>
          </table>

          <!-- CARD: PRODOTTO -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BORDER};border-radius:10px;margin-bottom:16px;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid ${BORDER_SOFT};font-family:'Poppins','Helvetica Neue',sans-serif;font-size:14px;font-weight:700;color:${TEXT};text-transform:uppercase;letter-spacing:0.4px;">Il tuo prodotto</p>

              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  ${imageUrl ? `<td style="width:100px;vertical-align:middle;padding-right:18px;">
                    <img src="${imageUrl}" alt="${data.productName}" width="100" height="100" style="display:block;width:100px;height:100px;border-radius:10px;object-fit:cover;border:1px solid #e8e8e8;background:#fafafa;" />
                  </td>` : ""}
                  <td style="vertical-align:middle;">
                    <p style="margin:0 0 10px;font-size:16px;font-weight:600;color:${TEXT};line-height:1.3;">${data.productName}</p>
                    <div>${colorChip}${sizeChip}</div>
                  </td>
                </tr>
              </table>

              <!-- PRICES -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:18px;padding-top:14px;border-top:1px solid ${BORDER_SOFT};">
                <tr>
                  <td style="padding:4px 0;font-size:14px;color:${TEXT_MUTED};font-weight:500;">Subtotale</td>
                  <td style="padding:4px 0;font-size:14px;color:${TEXT_MUTED};text-align:right;font-weight:500;">${priceFmt} &euro;</td>
                </tr>
                ${upsellRow}
                <tr>
                  <td style="padding:4px 0;font-size:14px;color:${TEXT_MUTED};font-weight:500;">Spedizione express</td>
                  <td style="padding:4px 0;font-size:14px;color:${TEXT_MUTED};text-align:right;font-weight:500;">4,99 &euro;</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-size:14px;color:${GREEN};font-weight:600;">Contrassegno</td>
                  <td style="padding:4px 0;font-size:14px;color:${GREEN};text-align:right;font-weight:600;">Gratis</td>
                </tr>
                <tr>
                  <td style="padding:12px 0 4px;margin-top:8px;border-top:2px solid ${TEXT};font-family:'Poppins','Helvetica Neue',sans-serif;font-size:17px;font-weight:700;color:${TEXT};">Totale da pagare</td>
                  <td style="padding:12px 0 4px;border-top:2px solid ${TEXT};font-family:'Poppins','Helvetica Neue',sans-serif;font-size:19px;font-weight:700;color:${TEXT};text-align:right;">${totalPriceFmt} &euro;</td>
                </tr>
              </table>

              <!-- CASH WARNING -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;">
                <tr>
                  <td style="width:30px;vertical-align:top;padding:12px 0 12px 14px;">
                    <span style="font-size:16px;color:#d97706;line-height:1;">&#9888;</span>
                  </td>
                  <td style="padding:12px 14px 12px 4px;font-size:13px;color:#92400e;line-height:1.5;">
                    <strong>Importante:</strong> Il pagamento viene effettuato in <strong>contanti</strong> al corriere. Il corriere potrebbe non avere il resto, ti preghiamo di preparare l'importo esatto di <strong>${totalPriceFmt} &euro;</strong>.
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- CARD: COSA SUCCEDE ORA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BORDER};border-radius:10px;margin-bottom:16px;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid ${BORDER_SOFT};font-family:'Poppins','Helvetica Neue',sans-serif;font-size:14px;font-weight:700;color:${TEXT};text-transform:uppercase;letter-spacing:0.4px;">Cosa succede ora?</p>

              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="width:42px;vertical-align:top;padding:14px 0 14px 0;border-bottom:1px solid #f3f3f3;">
                    <span style="display:inline-block;width:28px;height:28px;border-radius:50%;background-color:${PRIMARY};color:#fff;font-size:13px;font-weight:700;line-height:28px;text-align:center;">1</span>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #f3f3f3;">
                    <strong style="display:block;font-size:14px;font-weight:600;color:${TEXT};margin-bottom:2px;">Conferma dell'ordine</strong>
                    <span style="display:block;font-size:13px;color:${TEXT_MUTED};line-height:1.5;">Riceverai una chiamata o un messaggio di conferma per verificare i dati di spedizione.</span>
                    <span style="display:block;margin-top:6px;font-size:13px;color:#92400e;font-weight:600;">Attenzione: se non riusciamo a contattarti, il pacco sarà spedito automaticamente.</span>
                    <span style="display:block;margin-top:6px;font-size:12px;color:${LABEL};">Call center: Lun&ndash;Ven 9:00&ndash;17:00. Gli ordini del venerdì dopo le 17:00 verranno confermati il lunedì seguente.</span>
                  </td>
                </tr>
                <tr>
                  <td style="width:42px;vertical-align:top;padding:14px 0;border-bottom:1px solid #f3f3f3;">
                    <span style="display:inline-block;width:28px;height:28px;border-radius:50%;background-color:${PRIMARY};color:#fff;font-size:13px;font-weight:700;line-height:28px;text-align:center;">2</span>
                  </td>
                  <td style="padding:14px 0;border-bottom:1px solid #f3f3f3;">
                    <strong style="display:block;font-size:14px;font-weight:600;color:${TEXT};margin-bottom:2px;">Spedizione express</strong>
                    <span style="display:block;font-size:13px;color:${TEXT_MUTED};line-height:1.5;">Una volta confermato, il tuo ordine verrà spedito immediatamente con corriere espresso. <b>Spedizione 4,99 &euro;</b></span>
                  </td>
                </tr>
                <tr>
                  <td style="width:42px;vertical-align:top;padding:14px 0 0;">
                    <span style="display:inline-block;width:28px;height:28px;border-radius:50%;background-color:${PRIMARY};color:#fff;font-size:13px;font-weight:700;line-height:28px;text-align:center;">3</span>
                  </td>
                  <td style="padding:14px 0 0;">
                    <strong style="display:block;font-size:14px;font-weight:600;color:${TEXT};margin-bottom:2px;">Ricevi e paga in contanti</strong>
                    <span style="display:block;font-size:13px;color:${TEXT_MUTED};line-height:1.5;">Il tuo ordine arriverà in pochi giorni. Paga comodamente al corriere. Il contrassegno <b style="color:${GREEN};">non ha alcun costo aggiuntivo</b>.</span>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- CARD: DATI SPEDIZIONE -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BORDER};border-radius:10px;margin-bottom:16px;">
            <tr><td style="padding:24px;">
              <p style="margin:0 0 16px;padding-bottom:12px;border-bottom:1px solid ${BORDER_SOFT};font-family:'Poppins','Helvetica Neue',sans-serif;font-size:14px;font-weight:700;color:${TEXT};text-transform:uppercase;letter-spacing:0.4px;">Dati di spedizione</p>

              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td width="50%" style="vertical-align:top;padding:0 9px 18px 0;">
                    <p style="margin:0 0 3px;font-size:11px;text-transform:uppercase;letter-spacing:0.7px;color:${LABEL};font-weight:600;">Nome e cognome</p>
                    <p style="margin:0;font-size:14px;color:${TEXT};font-weight:500;line-height:1.4;">${data.firstName} ${data.lastName}</p>
                  </td>
                  <td width="50%" style="vertical-align:top;padding:0 0 18px 9px;">
                    <p style="margin:0 0 3px;font-size:11px;text-transform:uppercase;letter-spacing:0.7px;color:${LABEL};font-weight:600;">Telefono</p>
                    <p style="margin:0;font-size:14px;color:${TEXT};font-weight:500;line-height:1.4;">${data.phone}</p>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="vertical-align:top;padding:0 9px 18px 0;">
                    <p style="margin:0 0 3px;font-size:11px;text-transform:uppercase;letter-spacing:0.7px;color:${LABEL};font-weight:600;">Email</p>
                    <p style="margin:0;font-size:14px;color:${TEXT};font-weight:500;line-height:1.4;word-break:break-word;">${data.email}</p>
                  </td>
                  <td width="50%" style="vertical-align:top;padding:0 0 18px 9px;">
                    <p style="margin:0 0 3px;font-size:11px;text-transform:uppercase;letter-spacing:0.7px;color:${LABEL};font-weight:600;">Indirizzo</p>
                    <p style="margin:0;font-size:14px;color:${TEXT};font-weight:500;line-height:1.4;">${data.address}</p>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="vertical-align:top;padding:0 9px 0 0;">
                    <p style="margin:0 0 3px;font-size:11px;text-transform:uppercase;letter-spacing:0.7px;color:${LABEL};font-weight:600;">Città e CAP</p>
                    <p style="margin:0;font-size:14px;color:${TEXT};font-weight:500;line-height:1.4;">${data.city}, ${data.zip}</p>
                  </td>
                  <td width="50%" style="vertical-align:top;padding:0 0 0 9px;">
                    <p style="margin:0 0 3px;font-size:11px;text-transform:uppercase;letter-spacing:0.7px;color:${LABEL};font-weight:600;">Provincia</p>
                    <p style="margin:0;font-size:14px;color:${TEXT};font-weight:500;line-height:1.4;">${data.state}</p>
                  </td>
                </tr>
              </table>

              <div style="margin-top:14px;padding-top:12px;border-top:1px solid #f3f3f3;">
                <p style="margin:0 0 3px;font-size:11px;text-transform:uppercase;letter-spacing:0.7px;color:${LABEL};font-weight:600;">Metodo di pagamento</p>
                <p style="margin:0;font-size:14px;color:${PRIMARY};font-weight:600;line-height:1.4;">Contrassegno (contanti)</p>
              </div>
            </td></tr>
          </table>

          <!-- CARD: MANCATO RITIRO -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid ${BORDER};border-radius:10px;margin-bottom:16px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:${TEXT};">Cosa succede se non ritiro l'ordine?</p>
              <p style="margin:0 0 12px;font-size:13px;color:${TEXT_MUTED};line-height:1.6;">Il mancato ritiro dell'ordine senza giustificato motivo può comportare penali economiche e controversie legali. Purtroppo, per noi le spedizioni anche se non consegnate hanno un costo importante. Ti ringraziamo per la comprensione e per la gentile collaborazione.</p>
              <p style="margin:0;font-size:13px;color:${GREEN};line-height:1.6;font-weight:500;">Tranquillo, se non sei soddisfatto del tuo acquisto, puoi chiedere un rimborso gratuito a domicilio (veniamo noi a ritirarlo). Il rimborso è completo e il reso non ha costi aggiuntivi.</p>
            </td></tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
            <tr><td align="center">
              <a href="https://${DOMAIN}" style="display:inline-block;padding:15px 40px;background:${PRIMARY};color:#fff;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none;font-family:'Inter','Helvetica Neue',sans-serif;">Continua lo shopping</a>
            </td></tr>
          </table>

          <!-- FOOTER -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;border-top:1px solid ${BORDER};padding-top:20px;">
            <tr><td align="center">
              <p style="margin:0;font-size:12px;color:${LABEL};">&copy; ${SHOP_NAME} &mdash; ${DOMAIN}</p>
            </td></tr>
          </table>

        </td></tr>
      </table>
    </td></tr>
  </table>
  ${PRIMARY_DARK ? "" : ""}
</body>
</html>`;

  try {
    await resend.emails.send({
      from: `${SHOP_NAME} <ordini@${DOMAIN}>`,
      to: data.email.trim(),
      replyTo: `info@${DOMAIN}`,
      subject: `Conferma ordine ${data.orderId} — ${SHOP_NAME}`,
      html,
    });
  } catch (err) {
    console.error("[email] Errore invio email conferma:", err);
  }
}
