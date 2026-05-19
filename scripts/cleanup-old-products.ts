import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const KEEP = ["ambra","noir","miele","perla","corsa","sabbia","carbone","nobile",
              "grazia","estate","notte","cielo","confetto","splendore","avventura",
              "cipria","bianca","tabacca","viola"];

(async () => {
  const before = await sql`SELECT COUNT(*) as n FROM products`;
  console.log(`Prodotti prima: ${before[0].n}`);

  await sql`DELETE FROM products WHERE slug != ALL(${KEEP})`;

  const after = await sql`SELECT COUNT(*) as n FROM products`;
  console.log(`Prodotti dopo: ${after[0].n}`);

  // Rimuovi anche le vecchie categorie (ortopediche, posturali, fitness, trekking)
  await sql`DELETE FROM categories WHERE slug NOT IN ('classiche','sandali','sportive')`;
  const cats = await sql`SELECT slug, name FROM categories`;
  console.log("Categorie rimaste:", cats.map((c: any) => c.slug).join(", "));

  const rev = await sql`SELECT COUNT(*) as n FROM reviews`;
  console.log(`Recensioni rimaste: ${rev[0].n}`);
})().catch(console.error);
