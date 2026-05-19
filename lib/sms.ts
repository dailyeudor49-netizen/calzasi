const SMSFACTOR_API_URL = "https://api.smsfactor.com/send";

interface SmsData {
  phone: string;
  orderId: string;
  productName: string;
  totalPrice: string;
  firstName: string;
}

interface SmsResult {
  success: boolean;
  ticket?: string;
  credits?: number;
  error?: string;
}

function normalizePhone(phone: string): string {
  // Remove spaces, dashes, dots
  let clean = phone.replace(/[\s\-.()]/g, "");
  // Remove leading +
  if (clean.startsWith("+")) clean = clean.slice(1);
  // Ensure starts with 39 (Italy)
  if (!clean.startsWith("39")) clean = "39" + clean;
  return clean;
}

function buildSmsText(data: SmsData): string {
  // Keep under 160 chars for 1 SMS credit
  const price = data.totalPrice.includes("€")
    ? data.totalPrice
    : `€${data.totalPrice}`;
  return `Ordine ${data.orderId} confermato! ${data.productName} - ${price}. Consegna 2-5gg lavorativi, pagamento al corriere. Info: info@calzasi.com`;
}

export async function sendOrderSms(data: SmsData): Promise<SmsResult> {
  const token = process.env.SMSFACTOR_API_TOKEN;
  if (!token) {
    console.warn("[sms] SMSFACTOR_API_TOKEN non configurato, SMS non inviato");
    return { success: false, error: "SMSFACTOR_API_TOKEN non configurato" };
  }

  const to = normalizePhone(data.phone);
  const text = buildSmsText(data);

  const url = new URL(SMSFACTOR_API_URL);
  url.searchParams.set("text", text);
  url.searchParams.set("to", to);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const json = await res.json();

    if (json.status === 1) {
      console.log(`[sms] SMS inviato a ${to}, ticket: ${json.ticket}, crediti: ${json.credits}`);
      return {
        success: true,
        ticket: String(json.ticket),
        credits: json.cost ?? json.credits,
      };
    }

    const errorMsg = `SMSFactor status ${json.status}: ${json.message || "errore sconosciuto"}`;
    console.error(`[sms] ${errorMsg}`);
    return { success: false, error: errorMsg };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[sms] Errore rete: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}
