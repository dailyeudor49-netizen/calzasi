import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const reviews = [
  { author_name: "Federica M.",    rating: 5, body: "Tre settimane e i glutei si sentono già più tonici. La suola curva si percepisce subito al passo. Pagamento alla consegna, zero pensieri.", reply: "Grazie Federica! I risultati arrivano e si vedono. Continua così!", days: 10 },
  { author_name: "carmela rosario", rating: 5, body: "consegnata in 3 giorni. molto comode, ho problemi alla schiena e da quando le uso sto decisamente meglio", reply: null, days: 13 },
  { author_name: "Valentina S.",   rating: 4, body: "Bella scarpa, comodissima per tutto il giorno. Devo ancora valutare i risultati sulla silhouette ma il comfort è già al top.", reply: "Ciao Valentina! Dai un mese e ci fai sapere. I risultati arrivano con costanza.", days: 16 },
  { author_name: "M. Gentile",     rating: 5, body: "Ne ho già preso un secondo paio. Pago sempre alla consegna, comodissimo come sistema. Le Belliva sono diventate le mie scarpe quotidiane.", reply: null, days: 21 },
  { author_name: "Giuseppina R.",  rating: 5, body: "Ho 62 anni e lavoro tutto il giorno in piedi. Con queste arrivo a sera senza gambe pesanti. Consiglio a tutte.", reply: "Grazie di cuore Giuseppina, proprio il risultato che volevamo sentire!", days: 28 },
  { author_name: "giada",          rating: 4, body: "carine e comode ma la taglia viene un filo larga, consiglio di prendere la stessa che usate di solito e non di più", reply: null, days: 33 },
  { author_name: "Rosa Pellegrini", rating: 5, body: "Acquistata dopo aver visto i risultati di un'amica. Non me ne pento! Glutei e cosce si notano dopo un mese di uso quotidiano.", reply: "Grazie Rosa! Il passaparola è la nostra pubblicità migliore.", days: 40 },
  { author_name: "Lorenza T.",     rating: 5, body: "Scarpa solida, tiene bene il piede. Noto già miglioramenti alla postura dopo due settimane. E pagare alla consegna è comodissimo.", reply: null, days: 52 },
  { author_name: "francesca l.",   rating: 5, body: "nn credevo funzionassero ma dopo 3 settimane i glutei si sentono davvero 💪 spedizione super veloce", reply: "Grazie francesca, ci rende felici sentirlo!", days: 65 },
  { author_name: "Antonella D.",   rating: 5, body: "La suola è completamente diversa da qualsiasi scarpa abbia mai indossato. Il passo è fluido, i muscoli lavorano. Tornerò ad ordinare senza dubbio.", reply: null, days: 81 },
];

async function main() {
  const product = await sql`SELECT id FROM products WHERE slug = 'belliva' LIMIT 1`;
  if (!product.length) { console.error("Prodotto belliva non trovato"); process.exit(1); }
  const pid = product[0].id;

  const existing = await sql`SELECT COUNT(*) as cnt FROM reviews WHERE product_id = ${pid}`;
  if (Number(existing[0].cnt) > 0) {
    console.log(`Già ${existing[0].cnt} recensioni per belliva, skip.`);
    process.exit(0);
  }

  for (const r of reviews) {
    const date = new Date();
    date.setDate(date.getDate() - r.days);
    await sql`
      INSERT INTO reviews (product_id, author_name, rating, body, reply, approved, created_at)
      VALUES (${pid}, ${r.author_name}, ${r.rating}, ${r.body}, ${r.reply}, true, ${date.toISOString()})
    `;
    console.log(`✓ ${r.author_name}`);
  }
  console.log("Done — 10 recensioni inserite.");
}

main().catch(console.error);
