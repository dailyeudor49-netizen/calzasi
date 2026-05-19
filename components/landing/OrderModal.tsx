"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { HeroSelection } from "./HeroGallery";
import { PROVINCE } from "@/lib/province";
import { ExitIntentGiftPopup } from "@/components/ExitIntentGiftPopup";

interface Props {
  selection: HeroSelection;
  onClose: () => void;
  initialBump?: boolean;
  productCode?: string;
  productName?: string;
  colorImgMap?: Record<string, string>;
  confirmationPath?: string;
}

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

const SHOE_PRICE  = 45.00;
const SHIP_PRICE  = 4.99;
const BUMP_PRICE  = 4.99;

const INSOLE_VARIANT_ID = 5932;

const DEFAULT_COLOR_IMG: Record<string, string> = {
  "Rosa":     "/images/land/modellia/hero-1.webp",
  "Bordeaux": "/images/land/modellia/hero-2.webp",
  "Verde":    "/images/land/modellia/hero-3.webp",
};
const SIZE_VARIANTS: Record<string, number> = {
  "35": 5921, "36": 5922, "37": 5923, "38": 5924, "39": 5925,
  "40": 5926, "41": 5927, "42": 5928, "43": 5929, "44": 5930,
};

export default function OrderModal({ selection, onClose, initialBump = false, productCode = "elaria", productName = "Elaria", colorImgMap, confirmationPath = "/land/elaria/grazie" }: Props) {
  const COLOR_IMG = colorImgMap ?? DEFAULT_COLOR_IMG;
  const [bump, setBump] = useState(initialBump);
  const [form, setForm] = useState({ nome: "", cognome: "", telefono: "", email: "", indirizzo: "", citta: "", provincia: "", cap: "", note: "" });
  const [utmParams, setUtmParams] = useState({ source: "", campaign: "", content: "" });
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [giftAccepted, setGiftAccepted] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [giftPopupOpen, setGiftPopupOpen] = useState(false);
  const giftPopupShownRef = useRef(false);
  const openedAtRef = useRef<number>(Date.now());
  const backdropRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const formTouched = !!(form.nome || form.cognome || form.telefono || form.email || form.indirizzo || form.citta || form.provincia || form.cap);

  const handleClose = () => {
    const elapsed = Date.now() - openedAtRef.current;
    if (
      elapsed >= 10_000 &&
      formTouched &&
      !giftAccepted &&
      !orderSubmitted &&
      !giftPopupShownRef.current
    ) {
      giftPopupShownRef.current = true;
      setGiftPopupOpen(true);
      return;
    }
    onClose();
  };

  const total = (SHOE_PRICE + SHIP_PRICE + (bump ? BUMP_PRICE : 0)).toFixed(2).replace(".", ",");
  const totalNum = SHOE_PRICE + SHIP_PRICE + (bump ? BUMP_PRICE : 0);
  const formComplete = !!(form.nome && form.cognome && form.telefono && form.indirizzo && form.citta && form.provincia && form.cap);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setUtmParams({
      source: p.get("utm_source") || "",
      campaign: p.get("utm_campaign") || "",
      content: p.get("utm_content") || "",
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.cognome || !form.telefono || !form.indirizzo || !form.citta || !form.provincia || !form.cap) {
      setError("Compila tutti i campi per procedere.");
      return;
    }
    if (!/\d/.test(form.indirizzo.trim())) {
      setError("Inserisci l'indirizzo completo con il numero civico (es. Via Roma 1).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // CSRF token
      let csrfToken = "";
      try {
        const t = await fetch("/api/csrf-token");
        if (t.ok) { const d = await t.json(); csrfToken = d.token || ""; }
      } catch { /* proceed anyway */ }

      const variantId = SIZE_VARIANTS[selection.size] ?? 0;
      const shoeTotal = SHOE_PRICE.toFixed(2);
      const cartProducts: { variantId: number; quantity: number; subtotal: string }[] = [
        { variantId, quantity: 1, subtotal: shoeTotal },
      ];
      const includeGift = giftAccepted;
      if (bump && giftAccepted) {
        // 1 a pagamento + 1 omaggio → quantity 2, subtotal = solo il pezzo a pagamento
        cartProducts.push({ variantId: INSOLE_VARIANT_ID, quantity: 2, subtotal: BUMP_PRICE.toFixed(2) });
      } else if (bump) {
        cartProducts.push({ variantId: INSOLE_VARIANT_ID, quantity: 1, subtotal: BUMP_PRICE.toFixed(2) });
      } else if (giftAccepted) {
        cartProducts.push({ variantId: INSOLE_VARIANT_ID, quantity: 1, subtotal: "0.00" });
      }
      const cartTotal = (SHOE_PRICE + SHIP_PRICE + (bump ? BUMP_PRICE : 0)).toFixed(2);

      let giftNote = "";
      if (bump && giftAccepted) {
        giftNote = "OMAGGIO POPUP ABBANDONO MODULO — Plantare quantità 2: 1 a pagamento + 1 in OMAGGIO (valore 29,99€)";
      } else if (giftAccepted) {
        giftNote = "OMAGGIO POPUP ABBANDONO MODULO — Plantare comfort gratuito (valore 29,99€)";
      }
      const combinedNotes = [form.note.trim(), giftNote].filter(Boolean).join(" | ");

      const phone = form.telefono.startsWith("+39") ? form.telefono : `+39${form.telefono.replace(/^\s*0?/, "")}`;

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csrfToken,
          cart: {
            cod: true,
            code: productCode,
            totalPrice: cartTotal,
            products: cartProducts,
          },
          customer: {
            firstName: form.nome.trim(),
            lastName: form.cognome.trim(),
            phoneNumber: phone.replace(/\s/g, ""),
            address: form.indirizzo.trim(),
            city: form.citta.trim(),
            state: form.provincia.trim().toUpperCase(),
            zip: form.cap.trim(),
            countryCode: "IT",
            email: form.email.trim(),
            shippingNotes: combinedNotes,
          },
          freeGift: includeGift,
          meta: {
            size: selection.size,
            color: selection.color,
            productName,
            slug: productCode,
            utm_source: utmParams.source,
            utm_campaign: utmParams.campaign,
            utm_content: utmParams.content,
          },
        }),
      });
      if (!res.ok) throw new Error();
      setOrderSubmitted(true);
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Purchase", { value: totalNum, currency: "EUR" });
      }
      const qs = new URLSearchParams({
        v: totalNum.toFixed(2),
        n: form.nome.trim(),
        s: selection.size,
        c: selection.color,
        b: bump ? "1" : "0",
        g: includeGift ? "1" : "0",
      });
      window.location.href = `${confirmationPath}?${qs.toString()}`;
    } catch {
      setError("Errore nell'invio. Riprova o scrivici a info@calzasi.com");
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 52,
    borderRadius: 10,
    border: "1.5px solid var(--ml-border-subtle)",
    padding: "0 14px",
    fontSize: 16,
    fontFamily: FONT,
    color: "var(--ml-text-primary)",
    backgroundColor: "var(--ml-white-pure)",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--ml-text-primary)",
    marginBottom: 6,
  };

  const reqStyle: React.CSSProperties = { color: "var(--ml-red-urgency, #DC2626)", marginLeft: 2 };
  const optStyle: React.CSSProperties = { fontFamily: FONT, fontSize: 12, fontWeight: 400, color: "var(--ml-text-secondary)" };
  const hintStyle: React.CSSProperties = { fontFamily: FONT, fontSize: 12, color: "var(--ml-text-secondary)", marginTop: 4 };

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) handleClose(); }}
      data-page="modellia"
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        backgroundColor: "rgba(30,27,24,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-end",
        justifyContent: "center",
        padding: "0",
      }}
    >
      <div
        style={{
          width: "100%", maxWidth: 600,
          maxHeight: "92dvh",
          overflowY: "auto",
          borderRadius: "20px 20px 0 0",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 -8px 40px rgba(30,27,24,0.18)",
          padding: "0 0 env(safe-area-inset-bottom, 16px)",
        }}
      >
        {/* Handle + close */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: "var(--ml-border-subtle)", margin: "0 auto" }} />
          <button
            onClick={handleClose}
            aria-label="Chiudi"
            style={{ position: "absolute", right: 16, top: 16, width: 36, height: 36, borderRadius: "50%", border: "none", backgroundColor: "var(--ml-sand-base)", color: "var(--ml-text-secondary)", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >×</button>
        </div>

        <div style={{ padding: "16px 20px 24px" }}>
          {/* Banner regalo incluso */}
          {giftAccepted && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", marginBottom: 16, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: 12, boxShadow: "0 4px 14px rgba(16,185,129,0.25)", color: "#fff" }}>
              <svg viewBox="0 0 24 24" width={20} height={20} fill="#fff" style={{ flexShrink: 0 }} aria-hidden="true">
                <path d="M20 7h-2.18A3 3 0 0 0 18 6a3 3 0 0 0-5.5-1.67L12 5l-.5-.67A3 3 0 0 0 6 6a3 3 0 0 0 .18 1H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h1v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z" />
              </svg>
              <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, lineHeight: 1.25, flex: 1 }}>
                Plantare in regalo incluso{" "}
                <span style={{ fontWeight: 400, opacity: 0.9 }}>— valore 29,99€</span>
              </span>
            </div>
          )}

          {/* Order summary */}
          <div style={{ backgroundColor: "var(--ml-sand-base)", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
            <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ml-text-secondary)", marginBottom: 10 }}>
              IL TUO ORDINE
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 110, height: 110, borderRadius: 12, overflow: "hidden", flexShrink: 0, backgroundColor: "#FFFFFF", position: "relative", border: "1px solid var(--ml-border-subtle)", boxShadow: "0 2px 8px rgba(30,27,24,0.08)" }}>
                  <Image
                    src={COLOR_IMG[selection.color] || Object.values(COLOR_IMG)[0] || "/images/land/modellia/hero-1.webp"}
                    alt={`${productName} ${selection.color}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="110px"
                  />
                </div>
                <div>
                  <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: "var(--ml-text-primary)", marginBottom: 2 }}>{productName}</p>
                  <p style={{ fontFamily: FONT, fontSize: 15, color: "var(--ml-text-secondary)" }}>
                    {selection.color} · Taglia {selection.size}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontFamily: FONT, fontSize: 14, color: "var(--ml-text-secondary)", textDecoration: "line-through" }}>€149,99</span>
                <p style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: "var(--ml-text-primary)" }}>€44,99</p>
              </div>
            </div>
          </div>

          {/* Social proof cross-sell hint */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT, fontSize: 12, color: "var(--ml-text-secondary)", marginBottom: 8, paddingLeft: 2 }}>
            <svg viewBox="0 0 24 24" width={14} height={14} fill="#F5A623" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
            </svg>
            <span>Il <strong style={{ color: "var(--ml-text-primary)" }}>72%</strong> dei clienti aggiunge questo prodotto al proprio ordine</span>
          </div>

          {/* Bump offer */}
          <div
            onClick={() => setBump(!bump)}
            style={{
              border: bump ? "2px solid var(--ml-terra-cta)" : "1.5px solid var(--ml-border-subtle)",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 20,
              cursor: "pointer",
              backgroundColor: bump ? "#FFF3F0" : "var(--ml-white-pure)",
              transition: "border 0.2s, background 0.2s",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            {/* Checkbox */}
            <div style={{
              width: 22, height: 22, borderRadius: 6,
              border: bump ? "none" : "2px solid var(--ml-border-subtle)",
              backgroundColor: bump ? "var(--ml-terra-cta)" : "transparent",
              flexShrink: 0, marginTop: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, border 0.2s",
            }}>
              {bump && <svg width={13} height={13} viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>

            {/* Plantare image */}
            <div style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", flexShrink: 0, backgroundColor: "#FFFFFF" }}>
              <Image
                src="/plantare-1.webp"
                alt="Plantare Comfort+"
                width={64}
                height={64}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "var(--ml-text-primary)" }}>
                  Plantare Comfort+ — offerta esclusiva
                </p>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                  <span style={{ fontFamily: FONT, fontSize: 13, color: "var(--ml-text-secondary)", textDecoration: "line-through" }}>€19,99</span>
                  <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 800, color: "var(--ml-terra-cta)" }}>€4,99</p>
                </div>
              </div>
              <p style={{ fontFamily: FONT, fontSize: 13, color: "var(--ml-text-secondary)", lineHeight: 1.55, marginBottom: 6 }}>
                Soletta ergonomica extra-spessa con supporto all&rsquo;arco plantare. Rende ogni passo più morbido — ideale se stai molto in piedi o hai il piede che stanca.
              </p>
              <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "var(--ml-terra-cta)" }}>
                Disponibile solo con questo ordine — non venduto separatamente.
              </p>
            </div>
          </div>

          {/* Badge plantare omaggio (da popup) */}
          {giftAccepted && !bump && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", marginBottom: 20, backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, backgroundColor: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width={18} height={18} fill="#fff" aria-hidden="true">
                  <path d="M20 7h-2.18A3 3 0 0 0 18 6a3 3 0 0 0-5.5-1.67L12 5l-.5-.67A3 3 0 0 0 6 6a3 3 0 0 0 .18 1H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h1v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8h1a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#065F46", lineHeight: 1.25 }}>Plantare comfort omaggio aggiunto</p>
                <p style={{ fontFamily: FONT, fontSize: 12, color: "#047857", marginTop: 2 }}>Valore 29,99 € · <strong>incluso a 0 €</strong></p>
              </div>
              <button
                type="button"
                onClick={() => setGiftAccepted(false)}
                aria-label="Rimuovi omaggio"
                style={{ width: 28, height: 28, borderRadius: 999, background: "transparent", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
              >
                <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="#065F46" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Form */}
          <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ml-text-secondary)", marginBottom: 14 }}>
            DATI DI SPEDIZIONE
          </p>
          <form onSubmit={handleSubmit}>
            {/* Nome / Cognome */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Nome <span style={reqStyle}>*</span></label>
                <input ref={firstInputRef} style={inputStyle} name="given-name" autoComplete="given-name" placeholder="Mario" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Cognome <span style={reqStyle}>*</span></label>
                <input style={inputStyle} name="family-name" autoComplete="family-name" placeholder="Rossi" value={form.cognome} onChange={(e) => setForm({ ...form, cognome: e.target.value })} />
              </div>
            </div>

            {/* Telefono con prefisso +39 */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Telefono <span style={reqStyle}>*</span></label>
              <div style={{ display: "flex", alignItems: "stretch", border: "1.5px solid var(--ml-border-subtle)", borderRadius: 10, overflow: "hidden", backgroundColor: "var(--ml-white-pure)" }}>
                <span style={{ display: "flex", alignItems: "center", padding: "0 14px", fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "var(--ml-text-secondary)", backgroundColor: "var(--ml-sand-base)", borderRight: "1.5px solid var(--ml-border-subtle)" }}>+39</span>
                <input style={{ flex: 1, height: 52, border: "none", padding: "0 14px", fontSize: 16, fontFamily: FONT, color: "var(--ml-text-primary)", backgroundColor: "transparent", outline: "none" }} type="tel" name="tel" autoComplete="tel-national" inputMode="tel" placeholder="333 123 4567" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <p style={hintStyle}>Necessario per il contatto del corriere e la conferma d&rsquo;ordine</p>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email <span style={optStyle}>(facoltativo)</span></label>
              <input style={inputStyle} type="email" name="email" autoComplete="email" placeholder="mario.rossi@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <p style={hintStyle}>Per ricevere la conferma d&rsquo;ordine via email</p>
            </div>

            {/* Indirizzo */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Indirizzo completo <span style={reqStyle}>*</span></label>
              <input style={inputStyle} name="street-address" autoComplete="street-address" placeholder="Via Roma 1, int. 5" value={form.indirizzo} onChange={(e) => setForm({ ...form, indirizzo: e.target.value })} />
            </div>

            {/* Città / CAP / Provincia */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 10, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Città <span style={reqStyle}>*</span></label>
                <input style={inputStyle} name="address-level2" autoComplete="address-level2" placeholder="Milano" value={form.citta} onChange={(e) => setForm({ ...form, citta: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>CAP <span style={reqStyle}>*</span></label>
                <input style={inputStyle} name="postal-code" autoComplete="postal-code" inputMode="numeric" placeholder="20100" value={form.cap} onChange={(e) => setForm({ ...form, cap: e.target.value })} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Provincia <span style={reqStyle}>*</span></label>
              <select style={{ ...inputStyle, appearance: "auto" }} name="address-level1" autoComplete="address-level1" value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })}>
                <option value="">-- Seleziona provincia --</option>
                {PROVINCE.map((p) => <option key={p.v} value={p.v}>{p.l} ({p.v})</option>)}
              </select>
            </div>

            {/* Note corriere (collapsible) */}
            <div style={{ marginBottom: 20 }}>
              {!showNotes ? (
                <button type="button" onClick={() => setShowNotes(true)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "var(--ml-terra-cta)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Aggiungi note per il corriere <span style={optStyle}>(facoltativo)</span>
                </button>
              ) : (
                <>
                  <label style={labelStyle}>Note per il corriere <span style={optStyle}>(facoltativo)</span></label>
                  <textarea
                    rows={2}
                    placeholder="Es. citofono non funzionante, lasciare al vicino, secondo piano..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    style={{ ...inputStyle, height: "auto", minHeight: 64, padding: "12px 14px", resize: "vertical", fontFamily: FONT }}
                  />
                </>
              )}
            </div>

            {/* Total box */}
            <div style={{ backgroundColor: "var(--ml-sand-base)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 15, color: "var(--ml-text-secondary)", marginBottom: 6 }}>
                <span>{productName}</span><span>€44,99</span>
              </div>
              {bump && giftAccepted && (
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 15, color: "var(--ml-text-secondary)", marginBottom: 6 }}>
                  <span>
                    Plantare Comfort+ <span style={{ color: "#111", fontWeight: 700 }}>× 2</span>
                    <span style={{ display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#047857", letterSpacing: "0.05em", marginTop: 2 }}>+1 in omaggio</span>
                  </span>
                  <span>€4,99</span>
                </div>
              )}
              {bump && !giftAccepted && (
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 15, color: "var(--ml-text-secondary)", marginBottom: 6 }}>
                  <span>Plantare Comfort+</span><span>€4,99</span>
                </div>
              )}
              {!bump && giftAccepted && (
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 15, marginBottom: 6 }}>
                  <span style={{ color: "#047857", fontWeight: 600 }}>Plantare comfort <span style={{ fontSize: 11, textTransform: "uppercase" }}>(omaggio)</span></span>
                  <span style={{ color: "#047857", fontWeight: 700 }}>
                    <span style={{ textDecoration: "line-through", color: "var(--ml-text-secondary)", fontSize: 12, marginRight: 6, fontWeight: 400 }}>29,99 €</span>
                    0,00 €
                  </span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontSize: 15, color: "var(--ml-text-secondary)", fontWeight: 500, marginBottom: 10 }}>
                <span>Spedizione GLS</span><span>€4,99</span>
              </div>
              <div style={{ borderTop: "1px solid var(--ml-border-subtle)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: "var(--ml-text-primary)" }}>Totale alla consegna</span>
                <span style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: "var(--ml-text-primary)" }}>€{total}</span>
              </div>
            </div>

            {error && (
              <p style={{ fontFamily: FONT, fontSize: 14, color: "var(--ml-red-urgency)", marginBottom: 12, textAlign: "center" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", height: 60,
                borderRadius: 14,
                background: loading ? "#aaa" : formComplete ? "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" : "#C8C8C8",
                color: "#fff",
                fontSize: 18, fontWeight: 800,
                fontFamily: FONT,
                border: "none",
                boxShadow: loading || !formComplete ? "none" : "0 6px 20px rgba(22,163,74,0.35)",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.25s, box-shadow 0.15s, transform 0.15s",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
            >
              {loading ? "Invio in corso…" : `CONFERMA ORDINE — €${total}`}
            </button>

            <p style={{ textAlign: "center", fontFamily: FONT, fontSize: 13, color: "var(--ml-text-secondary)", marginTop: 12, lineHeight: 1.5 }}>
              Cliccando confermi di aver letto i{" "}
              <a href="/termini-e-condizioni" target="_blank" style={{ color: "var(--ml-terra-cta)" }}>Termini e Condizioni</a>
              {" "}e la{" "}
              <a href="/privacy-policy" target="_blank" style={{ color: "var(--ml-terra-cta)" }}>Privacy Policy</a>.
              Il corriere GLS ti contatterà per la consegna.
            </p>
          </form>
        </div>
      </div>

      {/* Popup recupero abbandono — plantare omaggio (mostrato alla chiusura del modulo) */}
      <ExitIntentGiftPopup
        open={giftPopupOpen}
        onAccept={() => {
          setGiftPopupOpen(false);
          setGiftAccepted(true);
          setTimeout(() => {
            firstInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            if (!form.nome) firstInputRef.current?.focus({ preventScroll: true });
          }, 150);
        }}
        onDismiss={() => {
          setGiftPopupOpen(false);
          onClose();
        }}
        accent="#E8922A"
        giftImage="/plantare-1.webp"
      />
    </div>
  );
}
