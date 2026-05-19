import type { Metadata } from "next";
import { getShopConfig } from "@/lib/db";
import ContattiClient from "./ContattiClient";

export const metadata: Metadata = {
  title: "Contatti e Assistenza",
  description: "Contattaci per informazioni su ordini, spedizioni, resi e prodotti.",
};

export const dynamic = "force-dynamic";

export default async function ContattiPage() {
  const config = await getShopConfig();
  return <ContattiClient config={config} />;
}
