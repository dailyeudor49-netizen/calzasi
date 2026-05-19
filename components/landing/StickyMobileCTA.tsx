"use client";

const FONT = "var(--font-manrope, 'Manrope', 'Inter', system-ui, sans-serif)";

export default function StickyMobileCTA({ onOrder }: { onOrder: () => void }) {
  return (
    <div
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 50,
        height: 76,
        backgroundColor: "var(--ml-white-pure)",
        boxShadow: "0 -4px 12px rgba(30,27,24,0.10)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <p style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: "var(--ml-text-primary)", lineHeight: 1, marginBottom: 2, letterSpacing: "-0.02em" }}>€44,99</p>
        <p style={{ fontFamily: FONT, fontSize: 13, color: "var(--ml-text-secondary)", textDecoration: "line-through" }}>€149,99</p>
      </div>

      <button
        onClick={onOrder}
        style={{
          flex: 1,
          height: "100%",
          borderRadius: 12,
          background: "linear-gradient(135deg, #E8922A 0%, #C47818 100%)",
          color: "#fff",
          fontSize: 17,
          fontWeight: 800,
          letterSpacing: "0.02em",
          fontFamily: FONT,
          border: "none",
          boxShadow: "0 4px 16px rgba(232,146,42,0.35)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        ORDINA ORA →
      </button>
    </div>
  );
}
