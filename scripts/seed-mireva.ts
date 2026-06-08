import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("ERROR: DATABASE_URL non impostato."); process.exit(1); }

const sql = neon(DATABASE_URL);

async function main() {
  console.log("Seed Mireva...");

  const [cat] = await sql`SELECT id FROM categories WHERE slug = 'sandali' LIMIT 1`;
  if (!cat) { console.error("ERROR: categoria 'sandali' non trovata"); process.exit(1); }

  const features = [
    "Tomaia a maglia elastica: abbraccia il piede come un calzino e si adatta a ogni forma",
    "Soletta in memory foam: si modella sotto il peso e attutisce ogni passo",
    "Suola curva: accompagna il movimento naturale del piede e alleggerisce gambe e schiena",
    "Caviglia avvolta e sostenuta: maggiore stabilità a ogni appoggio",
    "Punta larga: spazio comodo per le dita, anche per chi soffre di alluce valgo",
    "Tessuto traspirante: piede fresco e asciutto anche nelle giornate più calde",
  ];

  await sql`
    INSERT INTO products (
      name, slug, subtitle, description, price, original_price,
      image, category_id, features, color
    ) VALUES (
      'Mireva',
      'mireva',
      'Comodo come un calzino.',
      'Mireva è il sandalo estivo con effetto calzino che avvolge il piede senza stringere. La tomaia in maglia elastica si adatta a ogni forma, mentre la soletta in memory foam si modella sotto il peso e ammortizza ogni passo. La suola curva accompagna il movimento naturale del piede e la fascia avvolge la caviglia per un appoggio stabile. Leggero e traspirante, è il comfort di una pantofola con il sostegno di una calzatura vera.',
      44.99,
      149.99,
      '/images/land/mireva/carosello/1.webp',
      ${cat.id},
      ${features},
      '#1B3A5C'
    )
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      subtitle = EXCLUDED.subtitle,
      description = EXCLUDED.description,
      price = EXCLUDED.price,
      original_price = EXCLUDED.original_price,
      features = EXCLUDED.features,
      color = EXCLUDED.color,
      category_id = EXCLUDED.category_id,
      image = EXCLUDED.image
  `;

  const [prod] = await sql`SELECT id FROM products WHERE slug = 'mireva' LIMIT 1`;
  console.log(`Prodotto ID: ${prod.id}`);

  await sql`DELETE FROM reviews WHERE product_id = ${prod.id}`;

  const reviews = [
    { author: "Loredana Festa", rating: 5, body: "Devo ammettere che ero scettica: un sandalo che si infila come un calzino mi sembrava una trovata pubblicitaria. Invece la sensazione è esattamente quella, il piede è avvolto ma non costretto e dopo una giornata intera in piedi non sento più quella tensione sotto la pianta. Li ho presi in tortora e il colore è ancora più bello dal vivo.", reply: "Grazie Loredana! Siamo felici di aver smentito lo scetticismo. Mireva è proprio pensato per chi passa tante ore in piedi.", days: 5 },
    { author: "anna m.", rating: 5, body: "li ho ordinati per le vacanze al mare e sono stati la scelta giusta. leggeri freschi e non sudano i piedi. camminato tantissimo sul lungomare senza un dolore", reply: "Buone vacanze Anna! Felici che ti abbiano accompagnata bene.", days: 9 },
    { author: "Giuseppina Carbone", rating: 5, body: "Ho 71 anni e con l'artrosi alle dita ogni scarpa mi dava fastidio. Questi sandali hanno la punta larga e morbida, non premono da nessuna parte. Finalmente cammino senza pensare ai piedi.", reply: "Giuseppina, leggere questo ci riempie di gioia. La punta ampia è proprio pensata per chi ha bisogno di spazio e morbidezza.", days: 13 },
    { author: "francesca lo bianco", rating: 4, body: "comodissimi davvero, la soletta morbida si sente subito. ho tolto una stella solo perchè il pacco è arrivato con qualche giorno di ritardo ma colpa del corriere non del negozio", reply: "Grazie Francesca, ci dispiace per il ritardo della spedizione. Buona estate con Mireva!", days: 17 },
    { author: "M. Tortora", rating: 5, body: "Presi per mia moglie che lavora come infermiera e sta in piedi tutto il turno. Mi ha detto che è il sandalo più comodo che abbia mai avuto e che la sera i piedi non le fanno più male. Riacquisto sicuro.", reply: "Un grande grazie a tua moglie per il lavoro che fa e per la fiducia! Aspettiamo il prossimo ordine.", days: 21 },
    { author: "rita", rating: 5, body: "che dire... una nuvola sotto i piedi. li metto dalla mattina alla sera e non vedo l'ora di ricomprarli in un altro colore 😍", reply: "Grazie Rita! Il nero e il bianco ti aspettano.", days: 24 },
    { author: "Carmela Esposito", rating: 5, body: "Soffro di fascite plantare da due anni e camminare la mattina era un incubo. Con questi la soletta sostiene l'arco e la suola curva mi aiuta a spingere in avanti senza forzare il tallone. Non dico che mi abbiano guarita ma il sollievo è reale e quotidiano.", reply: "Carmela, grazie per la testimonianza sincera. Il supporto costante fa davvero la differenza nelle giornate. Un caro saluto.", days: 28 },
    { author: "valeria.p", rating: 5, body: "ordinato lunedì arrivato giovedì pagato in contanti al corriere. tutto liscio. il bianco è elegante e sta bene anche con i vestiti", reply: null, days: 32 },
    { author: "Pierangela Donati", rating: 5, body: "Me li ha regalati mia nuora dopo avermi sentito lamentare dei piedi gonfi. Sono leggerissimi e la tomaia elastica si allarga quando il piede si gonfia nel pomeriggio, quindi non stringono mai. Una bella sorpresa.", reply: "Che pensiero gentile! La tomaia elastica è perfetta proprio per chi ha il piede che cambia durante la giornata. Grazie Pierangela.", days: 36 },
    { author: "g. fontana", rating: 4, body: "Buon prodotto, comodo e ben fatto. Mi aspettavo una suola un pelo più alta per camminare sull'asfalto caldo, ma per il resto promosso. Colore tortora fedele alla foto.", reply: "Grazie per il riscontro! Teniamo conto della suggestione sulla suola. Buona estate.", days: 40 },
    { author: "Antonietta", rating: 5, body: "Li uso per il mercato il sabato mattina, cammino ore tra i banchi e i piedi restano freschi e riposati. La cosa che apprezzo di più è che si infilano in un secondo, niente fibbie da chiudere.", reply: null, days: 45 },
    { author: "Sabrina L.", rating: 5, body: "Presa la misura solita 39 e calzano alla perfezione. Il piede è contenuto ma libero di respirare, niente sfregamenti né vesciche neanche il primo giorno. Ottimo acquisto, consigliatissimo a chi sta tanto in piedi.", reply: "Grazie Sabrina! Felici che la calzata sia stata giusta da subito.", days: 49 },
    { author: "morena", rating: 5, body: "nn pensavo fossero cosi belli dal vivo. comodi x davvero e cmq il prezzo è onesto rispetto alla qualità. arrivati in 3 giorni", reply: "Grazie Morena! Qualità e prezzo giusto sono la nostra priorità.", days: 54 },
    { author: "Rosaria Mancuso", rating: 5, body: "Lavoro in un negozio di abbigliamento e passo otto ore in piedi. Avevo provato di tutto, plantari, scarpe costose, niente funzionava davvero. Questi sandali invece la sera mi lasciano i piedi come se avessi appena iniziato il turno. La soletta in memory foam è una cosa seria.", reply: "Rosaria, otto ore in piedi non sono uno scherzo. Siamo davvero contenti di darti sollievo ogni giorno!", days: 58 },
    { author: "L. Pagano", rating: 5, body: "Eleganti e comodi insieme, cosa rara. Li ho abbinati sia ai pantaloni che agli abiti estivi e fanno sempre la loro figura. Nessuno immagina che sotto ci sia tutto quel comfort.", reply: "Stile e comfort senza compromessi, grazie L. Pagano!", days: 63 },
    { author: "deborah f.", rating: 5, body: "comodi leggeri e traspiranti. con il caldo di questi giorni il piede non suda affatto. felicissima dell'acquisto", reply: "Grazie Deborah! Il tessuto traspirante fa la differenza con queste temperature.", days: 68 },
    { author: "Nunzia Greco", rating: 5, body: "Diabetica, devo fare molta attenzione alle calzature. Niente cuciture interne che danno fastidio, tomaia morbida che non sfrega: per i miei piedi sono perfetti. Anche la mia podologa li ha visti con favore.", reply: "Nunzia, grazie per la fiducia. La struttura senza punti di sfregamento è proprio adatta a chi ha bisogno di attenzione particolare.", days: 73 },
    { author: "patrizia", rating: 5, body: "li ho regalati a mia mamma di 80 anni che non riusciva piu a chinarsi per allacciare le scarpe. ora si veste da sola ed è felice come una bambina ❤️", reply: "Patrizia, l'autonomia ritrovata è impagabile. Un abbraccio alla tua mamma!", days: 78 },
    { author: "Daniela Ferraro", rating: 5, body: "Secondo paio in due mesi. Il primo, comprato in nero, lo porto tutti i giorni ed è ancora come nuovo nonostante l'uso intenso. Materiali davvero resistenti. Ora ho preso il bianco per le occasioni più curate.", reply: "Il riacquisto è il complimento più bello! Grazie Daniela, goditi anche il bianco.", days: 84 },
    { author: "Concetta D.", rating: 5, body: "Comodi sin dal primo momento, nessun periodo di rodaggio. Avevo paura di dover soffrire i primi giorni come con le scarpe nuove, invece niente. Il piede è subito a casa.", reply: "Grazie Concetta! Comfort immediato senza attese, è esattamente l'obiettivo.", days: 90 },
    { author: "elisa.r", rating: 5, body: "perfetti x stare in casa e anche x uscire. li infilo come una pantofola ma poi esco tranquilla. cmq molto soddisfatta", reply: null, days: 96 },
    { author: "Margherita Sanna", rating: 3, body: "Sandalo comodo e ben fatto, su questo niente da dire. Ho dato tre stelle solo perchè avevo ordinato il tortora e mi è arrivato un tortora leggermente più chiaro rispetto alla foto. Per il comfort comunque ottimi.", reply: "Grazie Margherita per la sincerità, ci dispiace per la differenza di tonalità. Le sfumature possono variare un po' con la luce delle foto. Restiamo a disposizione.", days: 105 },
    { author: "anna maria b.", rating: 3, body: "primo acquisto online di scarpe quindi ero un pò titubante. il prodotto è valido e comodo, magari avrei preferito una soletta ancora piu spessa ma è gusto mio. consegna nei tempi", reply: "Grazie Anna Maria per aver dato fiducia al primo acquisto! La soletta è morbida ma anche sostenuta per non perdere stabilità, è un equilibrio voluto.", days: 113 },
  ];

  let ok = 0;
  for (const r of reviews) {
    const createdAt = new Date(Date.now() - r.days * 86400000).toISOString();
    await sql`
      INSERT INTO reviews (product_id, author_name, rating, body, reply, created_at, approved)
      VALUES (${prod.id}, ${r.author}, ${r.rating}, ${r.body}, ${r.reply ?? null}, ${createdAt}, true)
    `;
    ok++;
  }

  console.log(`${ok} recensioni inserite`);

  const [cnt] = await sql`SELECT COUNT(*)::int AS n FROM reviews WHERE product_id = ${prod.id}`;
  const [avg] = await sql`SELECT ROUND(AVG(rating)::numeric, 1) AS v FROM reviews WHERE product_id = ${prod.id}`;
  const [pcheck] = await sql`SELECT slug, name, price, original_price, category_id FROM products WHERE slug='mireva'`;
  console.log(`DB check: ${cnt.n} recensioni, media ${avg.v}/5`);
  console.log("Prodotto:", pcheck);
}

main().catch((e) => { console.error(e); process.exit(1); });
