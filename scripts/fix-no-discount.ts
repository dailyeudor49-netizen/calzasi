import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
const slugs = ["noir","perla","carbone","grazia","confetto","cipria","bianca","tabacca","viola"];
(async () => {
  await sql`UPDATE products SET original_price = price WHERE slug = ANY(${slugs})`;
  const rows = await sql`SELECT slug, price::numeric as p, original_price::numeric as op FROM products WHERE slug = ANY(${slugs})`;
  for (const r of rows) console.log(`${r.slug}: price=${r.p} original=${r.op}`);
  console.log("Done");
})().catch(console.error);
