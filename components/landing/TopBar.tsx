"use client";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

export default function TopBar() {
  const items = [
    "✓ Pagamento alla Consegna — Zero anticipi",
    "✓ Consegna GLS 24-72h",
    "✓ Reso 30 Giorni",
    "✓ Boutique dal 1990 — Via della Spiga, Milano",
    "✓ Assistenza Italiana",
  ];
  const text = items.join("   ·   ");
  return (
    <div
      className="overflow-hidden"
      style={{ backgroundColor: "#4B3A9E", height: 46, display: "flex", alignItems: "center", flexShrink: 0 }}
    >
      <div className="modellia-ticker flex whitespace-nowrap" aria-hidden="true">
        {[0, 1].map((k) => (
          <span
            key={k}
            style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, letterSpacing: "0.04em", color: "#FFFFFF", paddingRight: "4rem", display: "inline-block" }}
          >
            {text}
          </span>
        ))}
      </div>
      <span className="sr-only">{text}</span>
    </div>
  );
}
