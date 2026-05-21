"use client";

import { useEffect, useState } from "react";
import ThankYouContent from "@/components/ThankYouContent";

const DEMO_PAYLOAD = {
  product: { title: "Modello Demo", image: "/images/shop/scarpisa-brand-logo.webp" },
  variant: { size: "39", color: "Nero", price: "49.99" },
  customer: {
    firstName: "Cliente",
    lastName: "Demo",
    phoneNumber: "+39 333 1234567",
    email: "demo@calzasi.com",
    address: "Via Milano 12",
    city: "Milano",
    state: "MI",
    zip: "20100",
  },
  upsell: null,
  freeGift: null,
  timestamp: Date.now(),
};

export default function PreviewTYCalzasi() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem("cf_thankyou", JSON.stringify(DEMO_PAYLOAD));
      localStorage.removeItem("cf_phone_fixed");
    } catch {}
    setReady(true);
  }, []);
  if (!ready) return <div className="min-h-[60vh]" />;
  return <ThankYouContent landingSlug="preview" />;
}
