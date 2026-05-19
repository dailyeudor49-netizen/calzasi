"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const GADS_ID   = "";
const GADS_CONV = "";

export default function TrackingPixels() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    let raw: string | null = null;
    try {
      raw = localStorage.getItem("cz_order_data");
    } catch {}
    if (!raw) return;

    let d: {
      product?: { title?: string };
      variant?: { id?: string; price?: string };
      upsell?: { price?: string } | null;
      totalPrice?: string;
      timestamp?: number;
    };
    try {
      d = JSON.parse(raw);
    } catch {
      return;
    }

    /* Deduplica */
    const orderKey = "cz_tracked_" + (d.timestamp || "");
    try {
      if (localStorage.getItem(orderKey) === "1") return;
    } catch {}

    const price = parseFloat(d.variant?.price || "0") || 0;
    const ups   = d.upsell ? parseFloat(d.upsell.price || "0") || 0 : 0;
    const value = price + ups;
    const txId  = "IT-" + String(d.timestamp || Date.now()).slice(-6);

    /* Facebook Pixel - Purchase */
    const tryFb = () => {
      const w = window as unknown as Record<string, unknown>;
      if (typeof w.fbq === "function") {
        (w.fbq as Function)("track", "Purchase", {
          content_ids: [d.variant?.id ? String(d.variant.id) : ""],
          content_type: "product",
          content_name: d.product?.title || "",
          value,
          currency: "EUR",
        });
        return true;
      }
      return false;
    };

    /* Google Ads - Conversion */
    const tryGtag = () => {
      if (!GADS_CONV) return true;
      const w = window as unknown as Record<string, unknown>;
      if (typeof w.gtag === "function") {
        (w.gtag as Function)("event", "conversion", {
          send_to: GADS_CONV,
          value,
          currency: "EUR",
          transaction_id: txId,
        });
        return true;
      }
      return false;
    };

    const markFired = () => {
      try { localStorage.setItem(orderKey, "1"); } catch {}
    };

    let fbOk = tryFb();
    let gOk  = tryGtag();
    if (fbOk && gOk) {
      markFired();
    } else {
      let attempts = 0;
      const iv = setInterval(() => {
        attempts++;
        if (!fbOk) fbOk = tryFb();
        if (!gOk)  gOk  = tryGtag();
        if ((fbOk && gOk) || attempts >= 10) {
          clearInterval(iv);
          if (fbOk && gOk) markFired();
        }
      }, 500);
    }
  }, []);

  if (!GADS_ID) return null;

  return (
    <>
      {/* Google Ads gtag */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GADS_ID}');
      `}</Script>
    </>
  );
}
