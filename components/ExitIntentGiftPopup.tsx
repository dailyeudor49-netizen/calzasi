"use client";

interface Props {
  open: boolean;
  onAccept: () => void;
  onDismiss: () => void;
  accent?: string;
  giftImage?: string;
}

export function ExitIntentGiftPopup({
  open,
  onAccept,
  onDismiss,
  giftImage = "/plantare-1.webp",
}: Props) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[2147483647] flex items-end sm:items-center justify-center bg-black/55 p-0 sm:p-5 animate-[fadeIn_0.18s_ease-out]"
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      <div
        className="w-full sm:max-w-[420px] bg-white border border-gray-200 sm:rounded-md rounded-t-md overflow-hidden animate-[slideUp_0.22s_ease-out]"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }}
      >
        <div className="offer-band relative text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
            </span>
            <span className="text-[11px] font-bold tracking-[0.22em] uppercase">
              Offerta riservata
            </span>
            <span className="hidden sm:inline text-[11px] text-blue-200 tracking-wider uppercase">
              · una sola volta
            </span>
          </div>
          <button
            onClick={onDismiss}
            aria-label="Chiudi"
            className="w-7 h-7 -mr-1 flex items-center justify-center text-blue-200 hover:text-white transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth={1.8} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pt-6">
          <h2 className="text-[22px] sm:text-[24px] font-semibold text-gray-900 leading-[1.2] tracking-tight">
            Aggiungi il plantare comfort al tuo ordine, in omaggio.
          </h2>
          <p className="text-[14px] text-gray-600 leading-relaxed mt-2.5">
            Solo per chi completa l&rsquo;ordine ora. Valore di listino 29,99&nbsp;€.
          </p>
        </div>

        <div className="px-6 mt-5">
          <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100">
            <div className="w-[80px] h-[80px] shrink-0 bg-gray-50 border border-gray-200 flex items-center justify-center">
              <img
                src={giftImage}
                alt="Plantare comfort"
                className="w-full h-full object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/plantare-1.webp"; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-gray-900 leading-tight">
                Plantare comfort
              </p>
              <p className="text-[12px] text-gray-500 mt-1 leading-snug">
                Supporto anatomico dell&rsquo;arco plantare. Taglia unica 35–44.
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-[12px] text-gray-400 line-through tabular-nums">29,99 €</span>
                <span className="text-[14px] font-semibold text-gray-900 tabular-nums">0,00 €</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pt-5 pb-6">
          <button
            type="button"
            onClick={onAccept}
            className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-semibold text-[14px] tracking-tight transition cursor-pointer"
          >
            Aggiungi al mio ordine
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full mt-2.5 py-2 text-[13px] text-gray-500 hover:text-gray-800 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-700 transition cursor-pointer"
          >
            Non mi interessa
          </button>
          <p className="text-[11px] text-gray-400 mt-4 leading-snug">
            Il plantare viene aggiunto all&rsquo;ordine senza costi aggiuntivi.
            Paghi tutto alla consegna.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes marchingAnts {
          0%   { background-position: 0 0, 0 100%, 0 0, 100% 0; }
          100% { background-position: 28px 0, -28px 100%, 0 -28px, 100% 28px; }
        }
        .offer-band {
          background-color: #1E3A8A;
          background-image:
            repeating-linear-gradient(90deg,  #F97316 0 14px, transparent 14px 28px),
            repeating-linear-gradient(90deg,  #F97316 0 14px, transparent 14px 28px),
            repeating-linear-gradient(0deg,   #F97316 0 14px, transparent 14px 28px),
            repeating-linear-gradient(0deg,   #F97316 0 14px, transparent 14px 28px);
          background-position: 0 0, 0 100%, 0 0, 100% 0;
          background-size: 28px 4px, 28px 4px, 4px 28px, 4px 28px;
          background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
          animation: marchingAnts 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
