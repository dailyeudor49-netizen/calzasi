"use client";
import { useState } from "react";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

type FormState = { nome: string; numero_ordine: string; stelle: number; titolo: string; testo: string };

const emptyForm: FormState = { nome: "", numero_ordine: "", stelle: 0, titolo: "", testo: "" };

export default function ReviewForm() {
  const [form, setForm]       = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.numero_ordine || form.stelle === 0 || !form.testo) {
      setError("Compila tutti i campi obbligatori e seleziona una valutazione.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setDone(true);
    } catch {
      setError("Errore nell'invio. Riprova o scrivici a info@calzasi.com");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 52, borderRadius: 10,
    border: "1.5px solid var(--ml-border-subtle)",
    padding: "0 14px", fontSize: 16, fontFamily: FONT,
    color: "var(--ml-text-primary)", backgroundColor: "var(--ml-white-pure)", outline: "none",
  };

  return (
    <section style={{ backgroundColor: "var(--ml-sand-base)", padding: "64px 20px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <p style={{ textAlign: "center", fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ml-text-secondary)", marginBottom: 14 }}>
          LA TUA ESPERIENZA
        </p>
        <h2 style={{ textAlign: "center", fontFamily: FONT, fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "var(--ml-text-primary)", marginBottom: 12, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Lascia una recensione
        </h2>
        <p style={{ textAlign: "center", fontFamily: FONT, fontSize: 17, color: "var(--ml-text-secondary)", marginBottom: 36, lineHeight: 1.6 }}>
          Hai già acquistato Elaria? Raccontaci com&rsquo;è andata — ogni opinione autentica aiuta le altre clienti.
        </p>

        {done ? (
          <div style={{ backgroundColor: "var(--ml-white-pure)", borderRadius: 16, border: "1.5px solid var(--ml-border-subtle)", padding: "36px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>·</div>
            <h3 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: "var(--ml-text-primary)", marginBottom: 12, letterSpacing: "-0.02em" }}>
              Recensione ricevuta!
            </h3>
            <p style={{ fontFamily: FONT, fontSize: 16, color: "var(--ml-text-secondary)", lineHeight: 1.7 }}>
              Grazie per il tuo contributo. Per garantire un ambiente sicuro e rispettoso per tutte le clienti,
              il contenuto sarà verificato dal nostro team prima della pubblicazione.
              Di norma la revisione avviene entro 24-48 ore.
            </p>
          </div>
        ) : (
          <div style={{ backgroundColor: "var(--ml-white-pure)", borderRadius: 16, border: "1.5px solid var(--ml-border-subtle)", padding: "32px 28px" }}>
            <form onSubmit={handleSubmit}>
              {/* Star rating */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "var(--ml-text-secondary)", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Valutazione *
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, stelle: n }))}
                      aria-label={`${n} stelle`}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", lineHeight: 1 }}
                    >
                      <svg width={34} height={34} viewBox="0 0 20 20" fill={form.stelle >= n ? "#F4B860" : "#E8DFD1"} style={{ transition: "fill 0.15s" }}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Nome + Numero ordine */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "var(--ml-text-secondary)", display: "block", marginBottom: 6 }}>Nome *</label>
                  <input
                    style={inputStyle}
                    placeholder="Es. Giulia R."
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "var(--ml-text-secondary)", display: "block", marginBottom: 6 }}>N° ordine *</label>
                  <input
                    style={inputStyle}
                    placeholder="Es. ORD-00123"
                    value={form.numero_ordine}
                    onChange={(e) => setForm({ ...form, numero_ordine: e.target.value })}
                  />
                </div>
              </div>

              {/* Titolo (opzionale) */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "var(--ml-text-secondary)", display: "block", marginBottom: 6 }}>Titolo <span style={{ fontWeight: 400 }}>(opzionale)</span></label>
                <input
                  style={inputStyle}
                  placeholder="Es. Le indosso ogni giorno"
                  value={form.titolo}
                  onChange={(e) => setForm({ ...form, titolo: e.target.value })}
                />
              </div>

              {/* Testo recensione */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "var(--ml-text-secondary)", display: "block", marginBottom: 6 }}>La tua recensione *</label>
                <textarea
                  style={{ ...inputStyle, height: 130, padding: "12px 14px", resize: "vertical" } as React.CSSProperties}
                  placeholder="Raccontaci la tua esperienza con Elaria…"
                  value={form.testo}
                  onChange={(e) => setForm({ ...form, testo: e.target.value })}
                />
              </div>

              {error && (
                <p style={{ fontFamily: FONT, fontSize: 14, color: "var(--ml-red-urgency)", marginBottom: 14, textAlign: "center" }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", height: 56, borderRadius: 12,
                  background: loading ? "#ccc" : "linear-gradient(135deg, #E85D3F 0%, #C84A2E 100%)",
                  color: "#fff", fontSize: 17, fontWeight: 800, fontFamily: FONT,
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 4px 16px rgba(232,93,63,0.30)",
                  letterSpacing: "0.02em",
                  transition: "transform 0.15s",
                }}
              >
                {loading ? "Invio in corso…" : "INVIA LA MIA RECENSIONE"}
              </button>

              <p style={{ fontFamily: FONT, fontSize: 13, color: "var(--ml-text-secondary)", marginTop: 10, textAlign: "center", lineHeight: 1.5 }}>
                Le recensioni vengono verificate dal nostro team prima della pubblicazione.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
