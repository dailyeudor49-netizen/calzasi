import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("ERROR: DATABASE_URL non impostato."); process.exit(1); }

const sql = neon(DATABASE_URL);

async function main() {
  console.log("Seed Bellavia...");

  /* ── Categoria ── */
  await sql`
    INSERT INTO categories (name, slug, label)
    VALUES ('Scarpe Ortopediche', 'ortopediche', 'Ortopediche')
    ON CONFLICT (slug) DO NOTHING
  `;

  const [cat] = await sql`SELECT id FROM categories WHERE slug = 'ortopediche' LIMIT 1`;

  const features = [
    "Suola curva attiva: oscillazione naturale, cammini con meno fatica",
    "Effetto scolpente: attiva glutei e polpacci ad ogni passo",
    "Plantare anatomico: arco e tallone supportati, postura allineata",
    "Doppio ammortizzamento: impatti assorbiti, comfort tutto il giorno",
    "Tomaia traspirante: piede asciutto, fresco e senza odori",
    "Suola anti-scivolo: aderenza sicura su qualsiasi superficie",
  ];

  /* ── Prodotto ── */
  await sql`
    INSERT INTO products (
      name, slug, subtitle, description, price, original_price,
      image, category_id, features, color
    ) VALUES (
      'Bellavia',
      'bellavia',
      'Scarpe ortopediche con suola curva attiva',
      'Suola curva attiva che ti spinge in avanti ad ogni passo: cammini con meno fatica, attivi i glutei e migliori la postura. Plantare anatomico con supporto all''arco e al tallone per un comfort duraturo. Tomaia traspirante e suola anti-scivolo per ogni superficie.',
      49.99,
      149.99,
      '/images/categories/tabacca.webp',
      ${cat.id},
      ${features},
      '#C9813A'
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      subtitle = EXCLUDED.subtitle,
      description = EXCLUDED.description,
      price = EXCLUDED.price,
      original_price = EXCLUDED.original_price,
      features = EXCLUDED.features,
      color = EXCLUDED.color
  `;

  const [prod] = await sql`SELECT id FROM products WHERE slug = 'bellavia' LIMIT 1`;
  console.log(`✅ Prodotto ID: ${prod.id}`);

  /* ── Elimina vecchie recensioni ── */
  await sql`DELETE FROM reviews WHERE product_id = ${prod.id}`;

  /* ── 18 recensioni ── */
  const reviews = [
    { author: "Giovanna M.", rating: 5, body: "Le uso ogni mattina per la passeggiata. Cammino più dritta e alla sera non ho più le gambe pesanti. Consigliatissime.", reply: "Grazie Giovanna! Siamo felici che Bellavia faccia parte della tua routine quotidiana." },
    { author: "teresa.c", rating: 5, body: "arrivate in 3 giorni, le ho messe subito. La suola si sente diversa da subito, più fluida nel passo. Molto soddisfatta", reply: "Grazie Teresa! Buon cammino con Bellavia." },
    { author: "Federica Longo", rating: 5, body: "Lavoro 8 ore in piedi come commessa. Da quando le uso la schiena non mi fa più male la sera. Migliori di quelle che avevo prima.", reply: "È proprio per chi lavora in piedi tutto il giorno che Bellavia fa la differenza. Grazie Federica!" },
    { author: "M. Esposito", rating: 4, body: "Belle e comode, calzata nella norma. Ho il piede un po' largo e avrei forse preso mezza taglia in più. Per il resto ottimo acquisto.", reply: "Grazie per il consiglio! Per piede largo suggeriamo sempre una taglia sopra. Speriamo di rivederti presto." },
    { author: "Lucia", rating: 5, body: "Ho 65 anni e soffro di fascite plantare da anni. Con queste scarpe riesco a fare una passeggiata intera senza dolore. Non le cambio con niente.", reply: "Grazie Lucia, questo è esattamente il risultato per cui abbiamo scelto Bellavia. Un abbraccio!" },
    { author: "valentina bianchi", rating: 5, body: "ordinate la settimana scorsa, già consegnate! pagato alla consegna, zero problemi. la suola dà proprio quella sensazione di spinta che descrivono, non è marketing", reply: null },
    { author: "Concetta P.", rating: 5, body: "Mia figlia me le ha consigliate per il mal di schiena. Dopo due settimane cammino con più facilità e la schiena è meno tesa. Grazie!", reply: "Grazie Concetta! La suola curva riduce proprio lo stress sulla colonna. Contenti che funzioni!" },
    { author: "Roberta F.", rating: 5, body: "Sono andata al lavoro con le Bellavia il primo giorno e tutti i colleghi mi hanno chiesto che scarpe portassi. Esteticamente bellissime e comode.", reply: "Che bella soddisfazione! Bellavia nasce per essere bella e funzionale allo stesso tempo. Grazie Roberta." },
    { author: "silvana.t87", rating: 4, body: "comode dal primo utilizzo, la qualità si vede. ho notato i glutei più attivi già dopo pochi giorni di camminata. solo un po' rigide all'inizio", reply: "Normale che ci voglia qualche giorno per adattarsi. Dopo si ammorbidiscono e il comfort aumenta ancora! Grazie Silvana." },
    { author: "Angela De Rosa", rating: 5, body: "Finalmente una scarpa che tiene conto della postura. Dopo un mese di uso regolare la mia fisioterapista ha notato un miglioramento nell'appoggio del piede. Consiglio.", reply: null },
    { author: "Elisa R.", rating: 5, body: "Le ho prese in Tortora e sono bellissime. Stanno bene con tutto, jeans, vestiti, leggings. E il piede non stanca.", reply: "Il Tortora è un colore versatilissimo. Grazie Elisa." },
    { author: "Mariangela V.", rating: 5, body: "Ho ordinato per me e per mia sorella. Siamo entrambe entusiaste. La spedizione è stata puntuale e il pagamento alla consegna ci ha tranquillizzate.", reply: "Doppia soddisfazione! Grazie a entrambe per la fiducia." },
    { author: "G. Cattaneo", rating: 3, body: "Le trovo comode ma ci ho messo una settimana ad abituarmi alla suola curva. Adesso le uso volentieri ma all'inizio sembravano strane.", reply: "È normalissimo! La suola curva richiede qualche giorno di adattamento. Contenti che ora le usi con piacere." },
    { author: "Carmela Iovino", rating: 5, body: "Ho provato tante scarpe ortopediche. Queste sono le uniche che mi piacciono anche esteticamente. Non sembra una scarpa ortopedica, sembra normale.", reply: null },
    { author: "paola.m.", rating: 5, body: "secondo acquisto. il primo paio l'ho usurato tanto che ne ho ordinato subito un secondo. qualità elevata e comfort invariato nel tempo", reply: "Grazie Paola! Il secondo acquisto è il complimento più bello che possiamo ricevere." },
    { author: "Bruna Sartori", rating: 5, body: "Cammino un'ora al giorno con le amiche. Da quando ho le Bellavia non ho più i piedi gonfi la sera. Mie amiche le vogliono anche loro.", reply: "Effetto passaparola. Grazie Bruna, buone camminate a tutta la compagnia." },
    { author: "C. Ferrara", rating: 4, body: "Buon prodotto, spedizione nei tempi indicati. La taglia calza bene. Mi aspettavo qualcosina in più sull'effetto tonicità ma sono passate solo 2 settimane quindi aspetto.", reply: "L'effetto tonificante si vede meglio dopo 4 settimane con camminate regolari. Siamo curiosi di sapere come va!" },
    { author: "Nicoletta B.", rating: 5, body: "Ho regalato un paio a mia mamma che ha 70 anni e problemi alle ginocchia. È contentissima, dice che cammina meglio e senza dolore. Non potevo fare regalo migliore.", reply: "Che bel regalo! Siamo felici che facciano bene alla tua mamma. Tanti auguri a lei." },
  ];

  let ok = 0;
  for (const r of reviews) {
    const daysAgo = Math.floor(Math.random() * 90) + 1;
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
    await sql`
      INSERT INTO reviews (product_id, author_name, rating, body, reply, created_at)
      VALUES (${prod.id}, ${r.author}, ${r.rating}, ${r.body}, ${r.reply ?? null}, ${createdAt})
    `;
    ok++;
  }

  console.log(`✅ ${ok} recensioni inserite`);

  /* ── Verifica ── */
  const [cnt] = await sql`SELECT COUNT(*)::int AS n FROM reviews WHERE product_id = ${prod.id}`;
  const [avg] = await sql`SELECT ROUND(AVG(rating)::numeric, 1) AS v FROM reviews WHERE product_id = ${prod.id}`;
  console.log(`DB check: ${cnt.n} recensioni, media ${avg.v}/5`);
}

main().catch(console.error);
