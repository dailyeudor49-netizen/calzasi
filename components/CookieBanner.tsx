"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cs_pref");
    if (!consent) setVisible(true);
  }, []);

  function accept(type: "all" | "necessary") {
    localStorage.setItem("cs_pref", type);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <p className="text-gray-300 text-xs sm:text-sm leading-tight">
          Per offrirti la migliore esperienza, questo sito utilizza cookie tecnici e analitici.{" "}
          <Link href="/cookie-policy" className="underline text-white">
            Scopri di più
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => accept("necessary")}
            className="px-3 py-1.5 text-xs border border-gray-500 rounded hover:bg-gray-700 transition-colors"
          >
            Solo tecnici
          </button>
          <button
            onClick={() => accept("all")}
            className="px-3 py-1.5 text-xs bg-white text-gray-900 rounded font-medium hover:bg-gray-200 transition-colors"
          >
            OK, accetto
          </button>
        </div>
      </div>
    </div>
  );
}
