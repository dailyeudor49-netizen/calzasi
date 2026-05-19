interface RefundGuaranteeProps {
  accentColor?: string;
}

export default function RefundGuarantee({ accentColor = "#1E3560" }: RefundGuaranteeProps) {
  return (
    <div
      className="mt-4 rounded-xl border p-4"
      style={{ borderColor: "#E2E4E8", backgroundColor: "#FCFCFA" }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 min-w-[32px] shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#E6F4EC" }}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#2B6E44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 15, color: "#1A1917", fontFamily: "var(--font-heading)" }} className="font-bold">
            Garanzia soddisfatto o rimborsato &mdash; 30 giorni
          </p>
          <p className="mt-1 leading-relaxed" style={{ fontSize: 14, color: "#5A5752" }}>
            Non sei soddisfatto? Restituisci entro 30 giorni. Ritiriamo noi il pacco e il rimborso e immediato.{" "}
            <strong style={{ color: "#1A1917" }}>Zero rischi.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
