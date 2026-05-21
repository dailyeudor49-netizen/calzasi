"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { OrderConfig } from "@/lib/order-config";
import comuniData from "@/lib/comuni-data.json";
import { ExitIntentGiftPopup } from "@/components/ExitIntentGiftPopup";

const COMUNI = comuniData as [string, string, string | null][];

/* ═══════════════════ Anti-spam ═══════════════════ */

const STORE_KEY = "sp_recent_order";
const SHOP_NAME = "mondocalzature";

function isBlocked(): boolean {
  try { return localStorage.getItem(STORE_KEY) === "1"; } catch { return false; }
}

function recordOrder() {
  try { localStorage.setItem(STORE_KEY, "1"); } catch {}
}

/* ═══════════════════ Province ═══════════════════ */

const PROVINCE = [
  { v: "AG", l: "Agrigento" }, { v: "AL", l: "Alessandria" }, { v: "AN", l: "Ancona" },
  { v: "AO", l: "Aosta" }, { v: "AR", l: "Arezzo" }, { v: "AP", l: "Ascoli Piceno" },
  { v: "AT", l: "Asti" }, { v: "AV", l: "Avellino" }, { v: "BA", l: "Bari" },
  { v: "BT", l: "Barletta-Andria-Trani" }, { v: "BL", l: "Belluno" }, { v: "BN", l: "Benevento" },
  { v: "BG", l: "Bergamo" }, { v: "BI", l: "Biella" }, { v: "BO", l: "Bologna" },
  { v: "BZ", l: "Bolzano" }, { v: "BS", l: "Brescia" }, { v: "BR", l: "Brindisi" },
  { v: "CA", l: "Cagliari" }, { v: "CL", l: "Caltanissetta" }, { v: "CB", l: "Campobasso" },
  { v: "CE", l: "Caserta" }, { v: "CT", l: "Catania" }, { v: "CZ", l: "Catanzaro" },
  { v: "CH", l: "Chieti" }, { v: "CO", l: "Como" }, { v: "CS", l: "Cosenza" },
  { v: "CR", l: "Cremona" }, { v: "KR", l: "Crotone" }, { v: "CN", l: "Cuneo" },
  { v: "EN", l: "Enna" }, { v: "FM", l: "Fermo" }, { v: "FE", l: "Ferrara" },
  { v: "FI", l: "Firenze" }, { v: "FG", l: "Foggia" }, { v: "FC", l: "Forlì-Cesena" },
  { v: "FR", l: "Frosinone" }, { v: "GE", l: "Genova" }, { v: "GO", l: "Gorizia" },
  { v: "GR", l: "Grosseto" }, { v: "IM", l: "Imperia" }, { v: "IS", l: "Isernia" },
  { v: "SP", l: "La Spezia" }, { v: "AQ", l: "L'Aquila" }, { v: "LT", l: "Latina" },
  { v: "LE", l: "Lecce" }, { v: "LC", l: "Lecco" }, { v: "LI", l: "Livorno" },
  { v: "LO", l: "Lodi" }, { v: "LU", l: "Lucca" }, { v: "MC", l: "Macerata" },
  { v: "MN", l: "Mantova" }, { v: "MS", l: "Massa-Carrara" }, { v: "MT", l: "Matera" },
  { v: "ME", l: "Messina" }, { v: "MI", l: "Milano" }, { v: "MO", l: "Modena" },
  { v: "MB", l: "Monza e Brianza" }, { v: "NA", l: "Napoli" }, { v: "NO", l: "Novara" },
  { v: "NU", l: "Nuoro" }, { v: "OR", l: "Oristano" }, { v: "PD", l: "Padova" },
  { v: "PA", l: "Palermo" }, { v: "PR", l: "Parma" }, { v: "PV", l: "Pavia" },
  { v: "PG", l: "Perugia" }, { v: "PU", l: "Pesaro e Urbino" }, { v: "PE", l: "Pescara" },
  { v: "PC", l: "Piacenza" }, { v: "PI", l: "Pisa" }, { v: "PT", l: "Pistoia" },
  { v: "PN", l: "Pordenone" }, { v: "PZ", l: "Potenza" }, { v: "PO", l: "Prato" },
  { v: "RG", l: "Ragusa" }, { v: "RA", l: "Ravenna" }, { v: "RC", l: "Reggio Calabria" },
  { v: "RE", l: "Reggio Emilia" }, { v: "RI", l: "Rieti" }, { v: "RN", l: "Rimini" },
  { v: "RM", l: "Roma" }, { v: "RO", l: "Rovigo" }, { v: "SA", l: "Salerno" },
  { v: "SS", l: "Sassari" }, { v: "SV", l: "Savona" }, { v: "SI", l: "Siena" },
  { v: "SR", l: "Siracusa" }, { v: "SO", l: "Sondrio" }, { v: "SU", l: "Sud Sardegna" },
  { v: "TA", l: "Taranto" }, { v: "TE", l: "Teramo" }, { v: "TR", l: "Terni" },
  { v: "TO", l: "Torino" }, { v: "TP", l: "Trapani" }, { v: "TN", l: "Trento" },
  { v: "TV", l: "Treviso" }, { v: "TS", l: "Trieste" }, { v: "UD", l: "Udine" },
  { v: "VA", l: "Varese" }, { v: "VE", l: "Venezia" }, { v: "VB", l: "Verbano-Cusio-Ossola" },
  { v: "VC", l: "Vercelli" }, { v: "VR", l: "Verona" }, { v: "VV", l: "Vibo Valentia" },
  { v: "VI", l: "Vicenza" }, { v: "VT", l: "Viterbo" },
];

/* ═══════════════════ Helpers ═══════════════════ */

function fmtPrice(n: number) {
  return n.toFixed(2).replace(".", ",") + " €";
}

/* ═══════════════════ Main Component ═══════════════════ */

export function OrderSection({ config, image }: { config: OrderConfig; image: string }) {
  const accent = "#7a1a1a"; // fisso per tutte le landing
  const hasColors = config.colors.length > 0;
  const [color, setColor] = useState(config.colors[0]?.name || "");
  const currentImage = config.colors.find((c) => c.name === color)?.image || image || "/images/placeholder-product.svg";
  const [size, setSize] = useState("39");
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<"form" | "blocked" | "phone-blocked">("form");
  const [upsell, setUpsell] = useState(false);
  const [giftAccepted, setGiftAccepted] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [source, setSource] = useState("organica");
  // ggm va letto SOLO dopo mount client — la lazy init di useState si esegue sul server (SSR)
  // dove window è undefined e il valore "organica" verrebbe poi idratato sul client senza
  // ri-eseguire la funzione → tutte le leads finivano come "organica".
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = new URLSearchParams(window.location.search).get("ggm") || "";
    const cleaned = raw.split("#")[0].split("&")[0].trim();
    if (cleaned) setSource(cleaned);
  }, []);

  const [csrfToken, setCsrfToken] = useState("");
  const [tokenError, setTokenError] = useState(false);
  const [tokenBlocked, setTokenBlocked] = useState(false);

  const fetchCsrfToken = useCallback(async () => {
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch("/api/csrf-token");
        if (res.status === 403) { setTokenBlocked(true); return; }
        const d = await res.json();
        if (d.token) { setCsrfToken(d.token); setTokenError(false); setTokenBlocked(false); return; }
      } catch {}
      if (i < 4) await new Promise((r) => setTimeout(r, 3000));
    }
    setTokenError(true);
  }, []);

  useEffect(() => { fetchCsrfToken(); }, [fetchCsrfToken]);

  const [showNotes, setShowNotes] = useState(false);
  const scrollYRef = useRef(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [form, setForm] = useState({
    firstName: "", lastName: "", phoneNumber: "", email: "",
    address: "", city: "", state: "", zip: "", shippingNotes: "",
  });

  const [civicPopup, setCivicPopup] = useState(false);
  const [civicNumber, setCivicNumber] = useState("");

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  /* ─── Autocompletamento comune ─── */
  const [citySuggestion, setCitySuggestion] = useState<string | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);

  const handleCityChange = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, city: value }));
    if (errors.city) setErrors((prev) => { const n = { ...prev }; delete n.city; return n; });

    const input = value.trim().toLowerCase();
    if (!input) {
      setCitySuggestion(null);
      if (autoFilled) {
        setForm((prev) => ({ ...prev, state: "", zip: "" }));
        setAutoFilled(false);
      }
      return;
    }

    // Trova comuni che iniziano con l'input
    const startsWith = COMUNI.filter(([nome]) => nome.toLowerCase().startsWith(input));

    // Suggerimento solo se c'è un unico match
    setCitySuggestion(startsWith.length === 1 ? startsWith[0][0] : null);

    // Cerca match esatto (case insensitive)
    const exact = COMUNI.filter(([nome]) => nome.toLowerCase() === input);

    if (exact.length === 1) {
      // Un solo comune con quel nome esatto -> auto-fill
      const [, prov, cap] = exact[0];
      setForm((prev) => ({ ...prev, state: prov, ...(cap ? { zip: cap } : {}) }));
      setAutoFilled(true);
    } else {
      // Nessun match esatto o più comuni con lo stesso nome -> togli auto-fill
      if (autoFilled) {
        setForm((prev) => ({ ...prev, state: "", zip: "" }));
        setAutoFilled(false);
      }
    }
  }, [autoFilled, errors.city]);

  const handleSuggestionClick = useCallback((nome: string) => {
    setForm((prev) => ({ ...prev, city: nome }));
    setCitySuggestion(null);
    if (errors.city) setErrors((prev) => { const n = { ...prev }; delete n.city; return n; });

    const exact = COMUNI.filter(([n]) => n.toLowerCase() === nome.toLowerCase());
    if (exact.length === 1) {
      const [, prov, cap] = exact[0];
      setForm((prev) => ({ ...prev, state: prov, ...(cap ? { zip: cap } : {}) }));
      setAutoFilled(true);
    }
  }, [errors.city]);

  /* Body scroll lock */
  useEffect(() => {
    if (modalOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [modalOpen]);

  /* Listen for sticky-order event from StickyOrderButton */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setSize(detail.size);
      if (detail.color) setColor(detail.color);
      setTimeout(() => {
        if (isBlocked()) {
          setModalOpen(true);
          setStep("blocked");
          return;
        }
        setModalOpen(true);
        setUpsell(false);
        setStep("form");
        setErrors({});
        setSubmitting(false);
        try {
          const w = window as unknown as Record<string, unknown>;
          if (typeof w.fbq === "function") (w.fbq as Function)("track", "InitiateCheckout", { content_ids: [String(config.sizeToFullship[detail.size] || 0)], content_type: "product", value: config.price, currency: "EUR" });
        } catch {}
      }, 50);
    };
    window.addEventListener("sticky-order", handler);
    return () => window.removeEventListener("sticky-order", handler);
  }, [config]);

  /* Listen for sync-variant from sticky popup */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setSize(detail.size);
      if (detail.color) setColor(detail.color);
    };
    window.addEventListener("sync-variant", handler);
    return () => window.removeEventListener("sync-variant", handler);
  }, []);

  const modalOpenedAtRef = useRef<number>(0);
  const [giftPopupOpen, setGiftPopupOpen] = useState(false);
  const giftPopupShownRef = useRef(false);

  const openModal = () => {
    if (isBlocked()) {
      setModalOpen(true);
      setStep("blocked");
      return;
    }
    setModalOpen(true);
    setUpsell(false);
    setStep("form");
    setErrors({});
    setSubmitting(false);
    modalOpenedAtRef.current = Date.now();
    try {
      const w = window as unknown as Record<string, unknown>;
      if (typeof w.fbq === "function") (w.fbq as Function)("track", "InitiateCheckout", { content_ids: [String(config.sizeToFullship[size] || 0)], content_type: "product", value: config.price, currency: "EUR" });
    } catch {}
  };

  const formTouched = () =>
    !!(form.firstName.trim() || form.lastName.trim() || form.phoneNumber.trim() ||
       form.address.trim() || form.city.trim() || form.zip.trim() || form.email.trim());

  const closeModal = () => {
    // Se l'utente ha passato almeno 10s nel modulo, ha compilato qualcosa,
    // non ha ancora visto il popup, e non ha già accettato → mostra popup invece di chiudere
    const elapsed = Date.now() - modalOpenedAtRef.current;
    if (
      step === "form" &&
      elapsed >= 10_000 &&
      formTouched() &&
      !giftAccepted &&
      !orderSubmitted &&
      !giftPopupShownRef.current
    ) {
      giftPopupShownRef.current = true;
      setGiftPopupOpen(true);
      return;
    }
    setModalOpen(false);
  };

  const goToStep = (s: "form" | "blocked" | "phone-blocked") => {
    setStep(s);
    if (modalRef.current) modalRef.current.scrollTop = 0;
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "Campo obbligatorio";
    if (!form.lastName.trim()) errs.lastName = "Campo obbligatorio";
    const digits = form.phoneNumber.replace(/\D/g, "");
    if (!form.phoneNumber.trim()) errs.phoneNumber = "Campo obbligatorio";
    else if (digits.length < 7) errs.phoneNumber = "Inserisci almeno 7 cifre";
    if (!form.address.trim()) errs.address = "Campo obbligatorio";
    if (!form.city.trim()) errs.city = "Campo obbligatorio";
    if (!form.state) errs.state = "Campo obbligatorio";
    if (!form.zip.trim()) errs.zip = "Campo obbligatorio";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitOrder = async (finalAddress: string) => {
    setSubmitting(true);

    const fid = config.sizeToFullship[size] || 0;
    const products: { variantId: number; quantity: number; subtotal: string }[] = [
      { variantId: fid, quantity: 1, subtotal: config.price.toFixed(2) },
    ];
    let totalPrice = config.price + 4.99;
    if (upsell && giftAccepted) {
      // 1 a pagamento + 1 omaggio → quantity 2, subtotal = solo il pezzo a pagamento
      products.push({ variantId: config.upsellFullshipId, quantity: 2, subtotal: config.upsellPrice.toFixed(2) });
      totalPrice += config.upsellPrice;
    } else if (upsell) {
      products.push({ variantId: config.upsellFullshipId, quantity: 1, subtotal: config.upsellPrice.toFixed(2) });
      totalPrice += config.upsellPrice;
    } else if (giftAccepted) {
      products.push({ variantId: config.upsellFullshipId, quantity: 1, subtotal: "0.00" });
    }

    const orderTimestamp = Date.now();
    const baseNotes = form.shippingNotes.trim();
    let giftNote = "";
    if (upsell && giftAccepted) {
      giftNote = "OMAGGIO POPUP ABBANDONO MODULO — Plantare quantità 2: 1 a pagamento + 1 in OMAGGIO (valore 29,99€)";
    } else if (giftAccepted) {
      giftNote = "OMAGGIO POPUP ABBANDONO MODULO — Plantare comfort gratuito (valore 29,99€)";
    }
    const combinedNotes = [baseNotes, giftNote].filter(Boolean).join(" | ");

    const payload = {
      cart: { cod: true, id: fid, code: String(orderTimestamp), totalPrice: totalPrice.toFixed(2), products, shopName: SHOP_NAME, productName: config.title },
      customer: {
        firstName: form.firstName.trim(), lastName: form.lastName.trim(),
        phoneNumber: "+39 " + form.phoneNumber.trim(),
        address: finalAddress, city: form.city.trim(), state: form.state,
        countryCode: "IT", zip: form.zip.trim(),
        email: form.email.trim(), shippingNotes: combinedNotes,
      },
      upsell,
      freeGift: giftAccepted && !upsell,
      variant: { color: color || undefined, size, image: currentImage },
      orderTimestamp,
      csrfToken,
      source,
    };

    /* Save for TY page */
    try {
      localStorage.setItem("mc_order_payload", JSON.stringify({
        product: { title: config.title, image: currentImage },
        variant: { color: color || undefined, size, price: config.price.toFixed(2) },
        customer: payload.customer,
        upsell: upsell ? { name: "Plantare Ortopedico", price: config.upsellPrice.toFixed(2) } : null,
        freeGift: giftAccepted && !upsell ? { name: "Plantare comfort", originalValue: "29,99 €" } : null,
        totalPrice: totalPrice.toFixed(2),
        timestamp: orderTimestamp,
        _payload: payload,
      }));
    } catch {}

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (res.status === 403) {
        window.location.reload();
        return;
      }
      if (res.status === 409 && body?.duplicate) {
        setSubmitting(false);
        goToStep("phone-blocked");
        return;
      }
      if (!res.ok) {
        let msg = `Errore ${res.status}: `;
        if (body?.cart?.non_field_errors) msg += body.cart.non_field_errors.join(", ");
        else if (body?.detail) msg += body.detail;
        else msg += JSON.stringify(body);
        alert(msg);
        setSubmitting(false);
        return;
      }
      recordOrder();
      setOrderSubmitted(true);
      window.location.href = `/ordine-confermato`;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "riprova";
      alert("Errore di rete: " + message);
      setSubmitting(false);
    }
  };

  const ensureFreshToken = async (): Promise<boolean> => {
    if (!csrfToken) return false;
    const ts = parseInt(csrfToken.split(".")[0], 10);
    if (!isNaN(ts) && Date.now() - ts < 23 * 60 * 60 * 1000) return true;
    // Token scaduto o quasi, refetch
    try {
      const res = await fetch("/api/csrf-token");
      if (res.ok) {
        const d = await res.json();
        if (d.token) { setCsrfToken(d.token); return true; }
      }
    } catch {}
    return false;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (isBlocked()) { goToStep("blocked"); return; }

    if (!csrfToken || tokenError || tokenBlocked) return;

    /* Check scadenza token pre-submit */
    const fresh = await ensureFreshToken();
    if (!fresh) return;

    /* Controllo numero civico */
    if (!/\d/.test(form.address)) {
      setCivicPopup(true);
      setCivicNumber("");
      return;
    }

    await submitOrder(form.address.trim());
  };

  const handleCivicConfirm = async () => {
    const trimmed = civicNumber.trim();
    if (!trimmed) return;
    setCivicPopup(false);
    await submitOrder(form.address.trim() + " " + trimmed);
  };

  const handleNoCivic = async () => {
    setCivicPopup(false);
    await submitOrder(form.address.trim() + " snc");
  };

  const SHIPPING = 4.99;
  const total = config.price + (upsell ? config.upsellPrice : 0) + SHIPPING;

  /* shared input class */
  const inputCls = (field: string) =>
    `w-full py-3.5 px-4 border-[1.5px] rounded-[10px] text-[15px] text-gray-700 bg-white outline-none transition-colors ${
      errors[field] ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-[#7a1a1a] focus:shadow-[0_0_0_3px_rgba(122,26,26,0.1)]"
    }`;

  const goldBtnCls = "w-full py-4 rounded-full text-white text-base font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(30,53,96,0.3)] hover:shadow-[0_6px_22px_rgba(30,53,96,0.4)]";
  const goldBg = { background: "linear-gradient(to bottom, #a83a3a, #7a1a1a)" };

  return (
    <>
      {/* ─── Variant Selectors ─── */}
      <div id="taglie" className="space-y-3 mb-4">
        {hasColors && (
          <div>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#9B9790", fontFamily: "var(--font-body)" }}>
              Colore:{" "}
              <span className="normal-case font-bold tracking-normal text-sm" style={{ color: "#1A1917" }}>{color}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {config.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => { setColor(c.name); window.dispatchEvent(new CustomEvent("hero-variant", { detail: { color: c.name } })); }}
                  className={`${c.image ? "flex flex-col items-center gap-1.5 px-2.5 py-2" : "flex items-center gap-2.5 px-3.5 py-2.5"} border text-sm font-semibold transition-all`}
                  style={{
                    borderRadius: 10,
                    borderWidth: color === c.name ? 2 : 1,
                    borderColor: color === c.name ? accent : "#D7DCE2",
                    backgroundColor: "#FFFFFF",
                    color: color === c.name ? "#1A1917" : "#5A5752",
                    boxShadow: color === c.name ? `0 0 0 1px ${accent}` : "none",
                  }}
                >
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="h-14 w-14 rounded-md object-cover shrink-0" style={{ border: "1.5px solid #D7DCE2" }} />
                  ) : (
                    <span className="inline-block h-4 w-4 rounded-full" style={{ background: c.dot || c.bg, border: "1.5px solid #D7DCE2" }} />
                  )}
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#9B9790", fontFamily: "var(--font-body)" }}>
            Taglia:{" "}
            {size
              ? <span className="normal-case font-bold tracking-normal text-sm" style={{ color: "#1A1917" }}>EU {size}</span>
              : <span className="normal-case font-normal tracking-normal text-sm" style={{ color: "#B83030" }}>seleziona una taglia</span>
            }
          </p>
          <div className="grid grid-cols-4 gap-2">
            {config.sizes.map((s) => (
              <button
                key={s}
                onClick={() => { setSize(s); window.dispatchEvent(new CustomEvent("hero-variant", { detail: { size: s } })); }}
                className="flex h-[46px] items-center justify-center border text-sm font-semibold transition-all"
                style={{
                  borderRadius: 10,
                  ...(size === s
                    ? { borderColor: "#7a1a1a", backgroundColor: "#7a1a1a", color: "#fff", borderWidth: 2, boxShadow: "0 0 0 1px #7a1a1a" }
                    : { borderColor: "#D7DCE2", backgroundColor: "#FFFFFF", color: "#5A5752", borderWidth: 1 }),
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-2.5 flex items-start gap-2 border px-3 py-2.5"
            style={{ backgroundColor: "#F4F6FA", borderColor: "#D1D8E6", borderRadius: 10 }}>
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 mt-0.5 shrink-0" fill="#7a1a1a">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 10.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z"/>
            </svg>
            <p className="text-xs leading-relaxed" style={{ color: "#7a1a1a" }}>
              <strong>Calzata regolare.</strong>{" "}
              Se sei tra due misure, scegli la più grande.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Trigger Button ─── */}
      <div className="flex flex-col items-center w-full my-3" id="ordina">
        <button
          onClick={openModal}
          className="w-full py-4 text-base font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
          style={{
            borderRadius: 12,
            backgroundColor: "#7a1a1a",
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.01em",
            boxShadow: "0 4px 16px rgba(30,53,96,0.28)",
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Ordina ora — Paghi al Corriere
          </span>
        </button>
      </div>

      {/* ─── Modal Overlay ─── */}
      {modalOpen && (
        <div
          data-sp-checkout
          className={`fixed inset-0 z-[99990] flex items-center justify-center ${step === "form" && isMobile ? "bg-white" : "bg-black/80 p-4"}`}
          onClick={(e) => { if (e.target === e.currentTarget && !(step === "form" && isMobile)) closeModal(); }}
        >
          <div
            ref={modalRef}
            className={`animate-sp-rise bg-white relative overflow-y-auto ${step === "form" && isMobile ? "w-full h-full" : "rounded-2xl w-full max-w-[480px] shadow-[0_25px_60px_rgba(0,0,0,0.2)] max-h-[92vh]"}`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 pt-[18px] pb-3.5 border-b border-gray-100">
              <span className="text-base font-bold text-gray-900">
                {step === "form" ? "Completa il tuo ordine" : ""}
              </span>
              <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-gray-500 fill-none" strokeWidth={2.5}><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* ══════════ FORM ══════════ */}
            {step === "form" && (
              <div className="px-5 pt-4 pb-5">
                {/* Banner regalo incluso */}
                {giftAccepted && (
                  <div className="mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl text-white font-bold text-[14px] shadow-md" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" aria-hidden="true">
                      <path d="M20 7h-2.18A3 3 0 0 0 18 6a3 3 0 0 0-5.5-1.67L12 5l-.5-.67A3 3 0 0 0 6 6a3 3 0 0 0 .18 1H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h1v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z" />
                    </svg>
                    <span className="flex-1 leading-tight">Plantare in regalo incluso <span className="font-normal opacity-90">— valore 29,99€</span></span>
                  </div>
                )}

                {/* Product card */}
                <div className="flex gap-4 items-center p-3.5 bg-[#fafafa] border border-gray-200 rounded-[12px] mb-4">
                  <div className="w-[110px] h-[110px] rounded-xl border border-gray-200 overflow-hidden shrink-0 bg-white shadow-sm">
                    <img src={currentImage} alt={config.title} className="w-full h-full object-cover block" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder-product.svg"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px] font-bold text-gray-900 leading-tight">{config.title}</p>
                    <p className="text-[13px] text-gray-500 font-medium mt-1">{hasColors ? <>{color} &middot; </> : null}Taglia {size}</p>
                    <span className="inline-block mt-2 text-[17px] font-bold text-[#137333]">{fmtPrice(config.price)}</span>
                  </div>
                </div>

                {/* Plantare omaggio (popup recupero abbandono) */}
                {giftAccepted && !upsell && (
                  <div className="flex items-center gap-2.5 p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                        <path d="M20 7h-2.18A3 3 0 0 0 18 6a3 3 0 0 0-5.5-1.67L12 5l-.5-.67A3 3 0 0 0 6 6a3 3 0 0 0 .18 1H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h1v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-emerald-900 leading-tight">Plantare comfort omaggio aggiunto</p>
                      <p className="text-[12px] text-emerald-700 mt-0.5">Valore 29,99€ &middot; <strong>incluso a 0€</strong></p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGiftAccepted(false)}
                      aria-label="Rimuovi omaggio"
                      className="w-7 h-7 rounded-full hover:bg-emerald-100 flex items-center justify-center shrink-0 transition"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-emerald-700 fill-none" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Upsell inline */}
                <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-2 px-0.5">
                  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-[#f5a623] shrink-0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
                  <span>Il <strong className="text-gray-600">72%</strong> dei clienti aggiunge questo prodotto al proprio ordine</span>
                </div>
                <div
                  onClick={() => setUpsell(!upsell)}
                  className={`flex items-start gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all select-none mb-5 flex-wrap ${
                    upsell ? "border-[#035d87] bg-[#eff6ff]" : "border-[#035d87] hover:bg-[#eff6ff]"
                  }`}
                >
                  <div className={`w-[22px] h-[22px] border-2 rounded-[5px] flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    upsell ? "bg-[#137333] border-[#137333]" : "border-gray-300"
                  }`}>
                    <svg viewBox="0 0 24 24" className={`w-[13px] h-[13px] stroke-white fill-none transition-opacity ${upsell ? "opacity-100" : "opacity-0"}`} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-[#fafafa]">
                    <img src="/images/plantare.webp" alt="Plantare Ortopedico" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-gray-900 mb-0.5">Aggiungi al tuo ordine</p>
                    <p className="text-[18px] font-semibold text-[#035d87]">Plantare Ortopedico</p>
                    <p className="text-[14px] text-gray-400 leading-snug">Comfort prolungato, supporto della postura e dell&apos;arco plantare.<br />Taglia unica (35-45).</p>
                    <p className="text-[14px] font-semibold text-gray-600 mb-1.5">Adatto ad ogni scarpa.</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[16px] text-gray-400 line-through">35,00 &euro;</span>
                      <span className="text-[22px] font-extrabold text-[#137333]">+4,99 &euro;</span>
                    </div>
                    <p className="text-[13px] font-semibold mt-1" style={{ color: "#e67e00" }}>A questo prezzo solo se abbinato a {config.title}</p>
                  </div>
                </div>

                {/* Form */}
                <div className="flex gap-2.5 max-md:flex-col">
                  <div className="flex-1 mb-3.5">
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1.5">Nome <span className="text-red-500">*</span></label>
                    <input ref={firstInputRef} type="text" name="given-name" autoComplete="given-name" placeholder="Mario" value={form.firstName} onChange={(e) => updateForm("firstName", e.target.value)} className={inputCls("firstName")} />
                    {errors.firstName && <p className="text-[11px] text-red-500 mt-0.5">{errors.firstName}</p>}
                  </div>
                  <div className="flex-1 mb-3.5">
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1.5">Cognome <span className="text-red-500">*</span></label>
                    <input type="text" name="family-name" autoComplete="family-name" placeholder="Rossi" value={form.lastName} onChange={(e) => updateForm("lastName", e.target.value)} className={inputCls("lastName")} />
                    {errors.lastName && <p className="text-[11px] text-red-500 mt-0.5">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mb-3.5">
                  <label className="block text-[15px] font-semibold text-gray-700 mb-1.5">Telefono <span className="text-red-500">*</span></label>
                  <div className={`flex items-stretch border-[1.5px] rounded-[10px] overflow-hidden transition-colors ${errors.phoneNumber ? "border-red-500 bg-red-50" : "border-gray-300 focus-within:border-[#7a1a1a] focus-within:shadow-[0_0_0_3px_rgba(122,26,26,0.1)]"}`}>
                    <span className="py-3.5 px-3.5 text-[15px] font-semibold text-gray-500 bg-gray-100 border-r-[1.5px] border-gray-300 flex items-center shrink-0">+39</span>
                    <input type="tel" name="tel" autoComplete="tel-national" inputMode="tel" placeholder="333 123 4567" value={form.phoneNumber} onChange={(e) => updateForm("phoneNumber", e.target.value)} className="flex-1 py-3.5 px-4 text-[15px] text-gray-700 outline-none bg-transparent" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">Necessario per il contatto del corriere e la conferma d&apos;ordine</p>
                  {errors.phoneNumber && <p className="text-[11px] text-red-500 mt-0.5">{errors.phoneNumber}</p>}
                </div>

                <div className="mb-3.5">
                  <label className="block text-[15px] font-semibold text-gray-700 mb-1.5">Indirizzo completo <span className="text-red-500">*</span></label>
                  <input type="text" name="street-address" autoComplete="street-address" placeholder="Via Roma 1, interno 5" value={form.address} onChange={(e) => updateForm("address", e.target.value)} className={inputCls("address")} />
                  {errors.address && <p className="text-[11px] text-red-500 mt-0.5">{errors.address}</p>}
                </div>

                <div className="flex gap-2.5">
                  <div className="flex-1 mb-3.5 relative">
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1.5">Città <span className="text-red-500">*</span></label>
                    <input type="text" name="address-level2" autoComplete="address-level2" placeholder="Milano" value={form.city} onChange={(e) => handleCityChange(e.target.value)} className={inputCls("city")} />
                    {citySuggestion && citySuggestion.toLowerCase() !== form.city.trim().toLowerCase() && (
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(citySuggestion)}
                        className="absolute left-0 right-0 top-full z-10 mt-0.5 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-left text-[14px] text-gray-700 shadow-lg hover:bg-gray-50 transition-colors"
                      >
                        {(() => {
                          const match = COMUNI.find(([n]) => n.toLowerCase() === citySuggestion.toLowerCase());
                          if (!match) return citySuggestion;
                          const [nome, prov, cap] = match;
                          return <>{nome} <span className="text-gray-400">({prov}){cap ? ` — ${cap}` : ""}</span></>;
                        })()}
                      </button>
                    )}
                    {errors.city && <p className="text-[11px] text-red-500 mt-0.5">{errors.city}</p>}
                  </div>
                  <div className="flex-1 mb-3.5">
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1.5">Provincia <span className="text-red-500">*</span></label>
                    <select name="address-level1" autoComplete="address-level1" value={form.state} onChange={(e) => { updateForm("state", e.target.value); setAutoFilled(false); }} className={inputCls("state")}>
                      <option value="">--</option>
                      {PROVINCE.map((p) => <option key={p.v} value={p.v}>{p.l}</option>)}
                    </select>
                    {errors.state && <p className="text-[11px] text-red-500 mt-0.5">{errors.state}</p>}
                  </div>
                  <div className="w-[85px] shrink-0 mb-3.5">
                    <label className="block text-[15px] font-semibold text-gray-700 mb-1.5">CAP <span className="text-red-500">*</span></label>
                    <input type="text" name="postal-code" autoComplete="postal-code" inputMode="numeric" placeholder="20100" value={form.zip} onChange={(e) => { updateForm("zip", e.target.value); setAutoFilled(false); }} className={inputCls("zip")} />
                    {errors.zip && <p className="text-[11px] text-red-500 mt-0.5">{errors.zip}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3.5">
                  <label className="block text-[15px] font-semibold text-gray-700 mb-1.5">Email <span className="text-xs font-normal text-[#22c55e]">(facoltativo)</span></label>
                  <input type="email" name="email" autoComplete="email" placeholder="mario.rossi@email.com" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className={inputCls("email")} />
                  <p className="text-[11px] text-gray-400 mt-0.5">Per ricevere la conferma d&apos;ordine via email</p>
                </div>

                {/* Note corriere (collapsible) */}
                <div className="mb-3.5">
                  {!showNotes ? (
                    <button type="button" onClick={() => setShowNotes(true)} className="text-[13px] font-semibold text-[#7a1a1a] hover:underline flex items-center gap-1">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={2}><path d="M12 5v14m-7-7h14" strokeLinecap="round" /></svg>
                      Aggiungi note per il corriere <span className="text-xs font-normal text-[#22c55e]">(facoltativo)</span>
                    </button>
                  ) : (
                    <>
                      <label className="block text-[15px] font-semibold text-gray-700 mb-1.5">Note per il corriere <span className="text-xs font-normal text-[#22c55e]">(facoltativo)</span></label>
                      <textarea placeholder="Es. citofono non funzionante, lasciare al vicino, secondo piano..." rows={2} value={form.shippingNotes} onChange={(e) => updateForm("shippingNotes", e.target.value)} className="w-full py-3 px-3.5 border-[1.5px] border-gray-300 rounded-[10px] text-sm text-gray-700 bg-white outline-none transition-colors resize-y min-h-[56px] focus:border-[#7a1a1a] focus:shadow-[0_0_0_3px_rgba(122,26,26,0.1)]" />
                    </>
                  )}
                </div>

                {/* Breakdown */}
                <div className="border-t border-gray-200 mt-[18px] pt-4 mb-4">
                  <div className="flex justify-between items-center py-1.5 text-[15px] text-gray-600">
                    <span className="font-medium">{config.title}</span><span className="font-semibold">{fmtPrice(config.price)}</span>
                  </div>
                  {upsell && giftAccepted && (
                    <div className="flex justify-between items-center py-1.5 text-[15px] text-gray-600">
                      <span className="font-medium">
                        Plantare Ortopedico <span className="text-gray-900 font-bold">× 2</span>
                        <span className="block text-[11px] font-semibold uppercase text-emerald-700 tracking-wide mt-0.5">+1 in omaggio</span>
                      </span>
                      <span className="font-semibold">{fmtPrice(config.upsellPrice)}</span>
                    </div>
                  )}
                  {upsell && !giftAccepted && (
                    <div className="flex justify-between items-center py-1.5 text-[15px] text-gray-600">
                      <span className="font-medium">Plantare Ortopedico</span><span className="font-semibold">{fmtPrice(config.upsellPrice)}</span>
                    </div>
                  )}
                  {!upsell && giftAccepted && (
                    <div className="flex justify-between items-center py-1.5 text-[15px]">
                      <span className="font-medium text-emerald-700">Plantare comfort <span className="text-[12px] font-semibold uppercase">(omaggio)</span></span>
                      <span className="font-bold text-emerald-700"><span className="line-through text-gray-400 text-[12px] mr-1.5">29,99 €</span>0,00 €</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-1.5 text-[15px] text-gray-600">
                    <span className="font-medium">Spedizione Express 2-5 Giorni</span><span className="font-semibold">{fmtPrice(SHIPPING)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-2 border-t-2 border-gray-900 text-[17px] font-bold text-gray-900">
                    <span>Totale da pagare al corriere</span>
                    <span className="text-[19px] text-[#137333]">{fmtPrice(total)}</span>
                  </div>
                </div>

                {/* COD warning */}
                <div className="bg-[#E8EDF5] border-[1.5px] border-[#B0C4DE] rounded-[10px] p-3.5 mb-[18px] text-xs text-[#2A3F5F] leading-relaxed">
                  <strong className="font-bold text-[#137333]">Importante:</strong> Cliccando su &quot;Conferma Ordine&quot; ti impegni a ricevere il pacco e pagare <strong className="font-bold text-[#137333]">{fmtPrice(total)}</strong> in contanti al corriere. Inserisci dati reali, un nostro operatore potrebbe contattarti per la conferma.
                </div>

                {/* Submit */}
                <button onClick={handleSubmit} disabled={submitting || !csrfToken || tokenError || tokenBlocked} style={{ background: "linear-gradient(to bottom, #22c55e, #16a34a)" }} className="w-full py-4 rounded-full text-white text-base font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(22,163,74,0.35)] hover:shadow-[0_6px_22px_rgba(22,163,74,0.45)] disabled:opacity-60 disabled:cursor-wait">
                  {submitting ? (
                    <div className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="inline-flex items-center gap-1.5"><svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current shrink-0" strokeWidth={2.5}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>Conferma Ordine &mdash; Paga alla Consegna</span>
                  )}
                </button>
              </div>
            )}

            {/* ══════════ BLOCKED ══════════ */}
            {step === "blocked" && (
              <div className="text-center py-[30px] px-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #e74c3c, #c0392b)" }}>
                  <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-white fill-none" strokeWidth={3}><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                </div>
                <h3 className="text-lg font-extrabold text-red-500 mb-2">Ordine non disponibile</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">Hai già effettuato un ordine su questo sito. Non è possibile effettuare ulteriori ordini.</p>
                <button onClick={closeModal} className="py-3.5 px-8 bg-gray-400 text-white rounded-full text-[15px] font-semibold cursor-pointer w-full">Chiudi</button>
              </div>
            )}

            {/* ══════════ PHONE BLOCKED ══════════ */}
            {step === "phone-blocked" && (
              <div className="text-center py-[30px] px-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, #e74c3c, #c0392b)" }}>
                  <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-white fill-none" strokeWidth={3}><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                </div>
                <h3 className="text-lg font-extrabold text-red-500 mb-2">Ordine non disponibile</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">Hai già effettuato un ordine. Se stai cercando di ottenere un reso, scrivici tramite il modulo della pagina Contatti.</p>
                <a href="/contatti" className="inline-block py-3.5 px-8 text-white rounded-full text-[15px] font-semibold cursor-pointer w-full text-center no-underline" style={{ backgroundColor: "#7a1a1a" }}>Vai a Contatti</a>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ══════════ CIVIC NUMBER POPUP (fuori dal modal scrollabile) ══════════ */}
      {civicPopup && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center bg-black/50 p-5">
          <div className="relative w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={() => { setCivicPopup(false); setCivicNumber(""); }}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              aria-label="Chiudi"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "#fff3cd" }}>
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#7a1a1a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v4m0 4h.01" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-center text-[17px] font-bold text-gray-900">Hai dimenticato il numero civico?</h3>
            <p className="mb-5 text-center text-[14px] leading-relaxed text-gray-500">Sembra che nel tuo indirizzo manchi il numero civico. Per favore, inseriscilo.</p>
            <input
              type="text"
              placeholder="Es. 12, 5/A, 3 int. 2"
              value={civicNumber}
              onChange={(e) => setCivicNumber(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && civicNumber.trim()) handleCivicConfirm(); }}
              className="mb-3 w-full rounded-[10px] border-[1.5px] border-gray-300 bg-white px-4 py-3.5 text-[15px] text-gray-700 outline-none transition-colors focus:border-[#7a1a1a] focus:shadow-[0_0_0_3px_rgba(122,26,26,0.1)]"
              autoFocus
            />
            <button
              onClick={handleCivicConfirm}
              disabled={!civicNumber.trim()}
              style={{ background: "linear-gradient(to bottom, #22c55e, #16a34a)" }}
              className="mb-3 w-full rounded-full py-3.5 text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(22,163,74,0.35)] transition-all hover:shadow-[0_6px_22px_rgba(22,163,74,0.45)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Conferma
            </button>
            <button
              onClick={handleNoCivic}
              className="w-full rounded-full border-[1.5px] border-gray-300 bg-white py-3 text-[14px] font-semibold text-gray-600 transition-colors hover:bg-gray-50 cursor-pointer"
            >
              Il mio indirizzo non ha il civico
            </button>
          </div>
        </div>
      )}

      {/* Popup recupero abbandono — plantare omaggio (mostrato alla chiusura del modulo) */}
      <ExitIntentGiftPopup
        open={giftPopupOpen}
        onAccept={() => {
          setGiftPopupOpen(false);
          setGiftAccepted(true);
          // Resta nel modulo: il modale è ancora aperto. Scroll al primo input.
          setTimeout(() => {
            firstInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            if (!form.firstName) firstInputRef.current?.focus({ preventScroll: true });
          }, 150);
        }}
        onDismiss={() => {
          // L'utente ha davvero scelto di andarsene: chiudi il popup E il modale
          setGiftPopupOpen(false);
          setModalOpen(false);
        }}
        accent={config.accentColor || "#E8922A"}
        giftImage="/images/plantare.webp"
      />
    </>
  );
}
