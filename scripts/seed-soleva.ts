import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("ERROR: DATABASE_URL non impostato."); process.exit(1); }

const sql = neon(DATABASE_URL);

async function main() {
  console.log("Seed Soleva...");

  const [cat] = await sql`SELECT id FROM categories WHERE slug = 'sandali' LIMIT 1`;
  if (!cat) { console.error("ERROR: categoria 'sandali' non trovata"); process.exit(1); }

  const features = [
    "Tomaia in maglia elastica: abbraccia il piede come un calzino e segue ogni movimento",
    "Soletta in memory foam: si modella sulla pianta e ammortizza ogni appoggio",
    "Caviglia avvolta: fascia morbida che tiene il piede stabile senza stringere",
    "Suola curva: accompagna la rullata del passo e alleggerisce ginocchia e schiena",
    "Calzata senza lacci: si infila in un attimo, niente fibbie da chiudere",
    "Tessuto traspirante: leggero e fresco, pensato per le giornate calde",
  ];

  await sql`
    INSERT INTO products (
      name, slug, subtitle, description, price, original_price,
      image, category_id, features, color
    ) VALUES (
      'Soleva',
      'soleva',
      'Avvolge il piede come un calzino.',
      'Sandalo estivo con tomaia in maglia elastica che avvolge il piede come un calzino, adattandosi alla forma senza punti di pressione. La soletta in memory foam si modella sulla pianta e ammortizza ogni passo, mentre la fascia morbida sulla caviglia tiene il piede stabile e contenuto. La suola curva accompagna la rullata della camminata e alleggerisce il carico su ginocchia e schiena. Leggero e traspirante, pensato per il comfort delle giornate calde.',
      44.99,
      149.99,
      '/images/land/soleva/carosello/1.webp',
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

  const [prod] = await sql`SELECT id FROM products WHERE slug = 'soleva' LIMIT 1`;
  console.log(`Prodotto ID: ${prod.id}`);

  await sql`DELETE FROM reviews WHERE product_id = ${prod.id}`;

  const reviews = [
    { author: "Loredana Ferraro", rating: 5, body: "Devo dire che la sensazione appena li infili è particolare: il piede viene avvolto completamente, sembra davvero di mettere un calzino con la suola sotto. Li porto da tre settimane per andare in ufficio e la sera non ho più quel senso di pesantezza ai piedi che avevo prima. Presi nel tortora, colore elegante e versatile.", reply: "Grazie Loredana! L'effetto calzino è proprio quello che cercavamo. Buona estate da Calzasi.", days: 7 },
    { author: "g. dimartino", rating: 5, body: "comodissimi davvero. la fascia sulla caviglia tiene bene il piede ma non stringe. presi neri ci vado dappertutto", reply: "Grazie mille! Felici che ti trovi bene con Soleva.", days: 12 },
    { author: "Patrizia M.", rating: 5, body: "Avevo bisogno di una calzatura fresca per l'estate perché con il caldo i piedi mi si gonfiano tantissimo. Questi sandali sono leggerissimi e la maglia lascia respirare il piede. A fine giornata la differenza si sente eccome. Spedizione veloce e pagamento alla consegna, tutto liscio.", reply: "Che bella notizia Patrizia! Il tessuto traspirante fa davvero la differenza con il caldo. Grazie da Calzasi.", days: 16 },
    { author: "Carmela", rating: 5, body: "ho 71 anni e fatico a chinarmi per le scarpe con le fibbie. questi li infilo in piedi senza problemi e mi sento sicura quando cammino. la caviglia tenuta bene mi da stabilita. contentissima", reply: "Carmela grazie di cuore! L'autonomia conta tantissimo, siamo felici che Soleva la aiuti ogni giorno.", days: 21 },
    { author: "Federica Lombardi", rating: 4, body: "Belli e comodi, il bianco-beige è proprio come nelle foto. Toglierei solo mezza taglia perché con l'elastico tendono a calzare un pelo abbondanti. Comunque ottimo prodotto, li uso volentieri.", reply: "Grazie per il consiglio sulla taglia! Per chi è indeciso suggeriamo la misura abituale vista l'elasticità. A presto da Calzasi.", days: 26 },
    { author: "simo_b", rating: 5, body: "ordinati lunedì arrivati giovedì 🙌 pagato al corriere zero pensieri. la suola curva si sente camminando, spinge in avanti il passo. molto soddisfatta", reply: null, days: 30 },
    { author: "Anna Rita Greco", rating: 5, body: "Soffro di fascite plantare da un paio d'anni e camminare la mattina era diventato un incubo. La soletta morbida ammortizza la pianta e l'arco viene sostenuto bene. Non dico che sia una cura miracolosa ma il sollievo durante la camminata è reale. Ne ho ordinato un secondo paio.", reply: "Anna Rita, grazie per la fiducia e per il riacquisto! Continua con calma, anche le camminate brevi e regolari aiutano. Un saluto da Calzasi.", days: 34 },
    { author: "rosa.t", rating: 5, body: "li ho regalati a mia suocera che ha problemi di circolazione. li mette dalla mattina alla sera e dice che non sente piu i piedi stanchi. regalo azzeccato 😊", reply: "Che pensiero gentile! Salutaci la suocera, grazie da Calzasi.", days: 39 },
    { author: "Valeria Costa", rating: 5, body: "Non sembrano affatto sandali comodi-ortopedici, hanno una linea pulita e moderna. Li ho abbinati a vestitini estivi e a un paio di pantaloni di lino, stanno benissimo. Estetica e comfort insieme, finalmente.", reply: "Stile e comfort senza compromessi, è proprio il nostro obiettivo. Grazie Valeria!", days: 44 },
    { author: "M. Bianchi", rating: 5, body: "Lavoro come commessa e sto in piedi tutto il giorno. Da quando uso questi sandali la schiena e i polpacci ringraziano. La suola che accompagna il passo fa la differenza sulle lunghe ore.", reply: "Grazie! Per chi sta tante ore in piedi la rullata della suola è preziosa. Buon lavoro da Calzasi.", days: 49 },
    { author: "giuseppina lo bianco", rating: 5, body: "comodi comodi comodi. il piede sta avvolto come in una calza ma fresco. presi tortora bellissimo colore", reply: null, days: 54 },
    { author: "Daniela Ferri", rating: 4, body: "All'inizio la suola curva mi dava una sensazione strana, mi sembrava di dondolare. Dopo qualche giorno mi ci sono abituata e ora la trovo piacevole. Prodotto valido, consegna nei tempi previsti.", reply: "È normalissimo il breve periodo di adattamento alla suola curva! Felici che ora ti piaccia. Grazie da Calzasi.", days: 59 },
    { author: "Concetta R.", rating: 5, body: "Per l'estate non li lascio più. Tessuto leggero, piede contenuto ma libero, e con i miei piedi sensibili non ho avuto nessuno sfregamento perché non ci sono cuciture dure all'interno. Promossi a pieni voti.", reply: "Grazie Concetta! L'assenza di cuciture aggressive è pensata proprio per i piedi sensibili. Buona estate.", days: 65 },
    { author: "elena", rating: 5, body: "portati tutta la vacanza al mare, lungomare passeggiate la sera tutto ok. comodi e si lavano facile. promossi", reply: "Buone vacanze e grazie per averci scelto! Calzasi", days: 71 },
    { author: "Antonietta Marino", rating: 5, body: "Le ho prese per mia mamma di 80 anni. Aveva sempre paura di inciampare con le ciabatte, mentre con queste la caviglia è tenuta e cammina molto più sicura. Si veste da sola perché basta infilarli. Per noi famiglia è stato un sollievo vederla più serena.", reply: "Antonietta, leggere queste cose ci scalda il cuore. La sicurezza nel passo vale tantissimo. Tanti auguri alla mamma da Calzasi.", days: 78 },
    { author: "p. de luca", rating: 5, body: "presa misura solita 39 e calzano bene grazie all elastico. il piede respira anche con 35 gradi. consigliati a chi suda d estate", reply: null, days: 84 },
    { author: "Gloria Sanna", rating: 5, body: "Acquisto rifatto, è il secondo paio. Il primo dopo mesi di uso quotidiano è ancora in ottimo stato, materiali resistenti. Stavolta ho preso il nero per averne uno più sportivo. Affidabili.", reply: "Il riacquisto è la conferma più bella, grazie Gloria! A presto da Calzasi.", days: 91 },
    { author: "marilena.c", rating: 5, body: "cmq sono comodissimi nn me li aspettavo cosi belli dal vivo. il bianco beige è delicato e si abbina a tutto ❤️", reply: "Grazie Marilena! Il bianco-beige è tra i più amati. Calzasi", days: 98 },
    { author: "Rita Ferro", rating: 5, body: "Ho l'alluce un po' deformato e quasi tutti i sandali mi danno fastidio sul lato. Questi grazie alla maglia elastica si allargano dove serve e non comprimono. Camminata libera, niente dolore alla fine della giornata.", reply: "Rita, la maglia che si adatta al piede è pensata anche per chi ha bisogno di più spazio. Grazie e buona estate da Calzasi.", days: 104 },
    { author: "luigia s.", rating: 3, body: "il sandalo è comodo e leggero, pero mi aspettavo la suola un pochino più alta sotto al tallone. nulla di grave, è un gusto mio. la maglia e la soletta vanno benissimo", reply: "Grazie Luigia per la sincerità. La suola contenuta è una scelta per dare più stabilità, ma capiamo la preferenza personale. Un saluto da Calzasi.", days: 110 },
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
  const [pcheck] = await sql`SELECT slug, name, price, original_price, category_id FROM products WHERE slug='soleva'`;
  console.log(`DB check: ${cnt.n} recensioni, media ${avg.v}/5`);
  console.log("Prodotto:", pcheck);
}

main().catch((e) => { console.error(e); process.exit(1); });
