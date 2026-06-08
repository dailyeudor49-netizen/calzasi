import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("ERROR: DATABASE_URL non impostato."); process.exit(1); }

const sql = neon(DATABASE_URL);

async function main() {
  console.log("Seed Lunera...");

  const [cat] = await sql`SELECT id FROM categories WHERE slug = 'sandali' LIMIT 1`;
  if (!cat) { console.error("ERROR: categoria 'sandali' non trovata"); process.exit(1); }

  const features = [
    "Tomaia in maglia elastica: abbraccia il piede come un calzino, senza cuciture rigide né punti di pressione",
    "Calzata immediata: niente lacci né fibbie, basta infilarli e sei pronta",
    "Caviglia avvolta e sostenuta: passo stabile e sensazione di sicurezza ad ogni movimento",
    "Soletta in memory foam: si modella al piede e aiuta ad alleviare la pressione su tallone e avampiede",
    "Punta ampia: spazio naturale per le dita, comodi anche con avampiede largo o alluce valgo",
    "Suola curva: accompagna il rollio del passo e alleggerisce il carico su ginocchia e schiena",
  ];

  await sql`
    INSERT INTO products (
      name, slug, subtitle, description, price, original_price,
      image, category_id, features, color
    ) VALUES (
      'Lunera',
      'lunera',
      'Si adatta come un calzino.',
      'Sandalo estivo dalla tomaia in maglia elastica che si adatta al piede come un calzino, avvolgendolo senza stringere e senza creare punti di sfregamento. La soletta in memory foam si modella alla forma del piede e aiuta ad alleviare la pressione ad ogni passo, mentre la suola curva accompagna il rollio della camminata. La caviglia resta sostenuta per un appoggio stabile e sicuro. Comfort estivo dalla mattina alla sera, leggero e traspirante.',
      44.99,
      89.98,
      '/images/land/lunera/carosello/1.webp',
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

  const [prod] = await sql`SELECT id FROM products WHERE slug = 'lunera' LIMIT 1`;
  console.log(`Prodotto ID: ${prod.id}`);

  await sql`DELETE FROM reviews WHERE product_id = ${prod.id}`;

  const reviews = [
    { author: "Donatella Ferraro", rating: 5, body: "Lavoro in una farmacia e passo otto ore in piedi dietro al bancone. A fine turno avevo sempre i polpacci che scoppiavano e la pianta del piede indolenzita. Da quando uso questi sandali la differenza è netta: la soletta morbida assorbe gli urti e la maglia elastica non mi segna mai il collo del piede. Ho preso il tortora, elegante e si abbina a tutto.", reply: "Grazie Donatella! Per chi sta tante ore in piedi Lunera fa davvero la differenza. Buon lavoro e buona estate.", days: 5 },
    { author: "rita c.", rating: 5, body: "comodissimi davvero. li infili e sembra di avere addosso una calza ma sotto c'è la suola che sostiene. azzurro bellissimo dal vivo, foto fedeli", reply: "Grazie Rita! L'azzurro è uno dei colori più richiesti. Ci fa piacere ti piaccia.", days: 9 },
    { author: "Mariagrazia Lombardi", rating: 5, body: "Ho una fascite plantare che mi tormenta da due anni e cambiare scarpe per me è una tragedia. Questi sono tra i pochi che riesco a portare tutto il giorno senza quel dolore lancinante sotto al tallone al mattino. Non dico che mi abbia risolto tutto, ma camminare è tornato sopportabile. Già un sollievo enorme.", reply: "Mariagrazia, siamo felici che ti diano sollievo. La soletta è pensata proprio per ammortizzare il tallone. Un abbraccio!", days: 13 },
    { author: "valentina", rating: 5, body: "presi per le vacanze al mare, camminato sul lungomare ogni sera e mai un fastidio. leggerissimi, si asciugano in fretta se prendono un po d'acqua. promossi", reply: null, days: 17 },
    { author: "G. Battaglia", rating: 4, body: "Belli e comodi, prendo sempre il 40 e questi mi stanno bene anche se forse un 39 sarebbe stato più aderente vista l'elasticità. Consiglio di non andare oltre la propria taglia abituale. Il bianco avorio è molto raffinato.", reply: "Grazie del consiglio sulla taglia! Per Lunera suggeriamo di restare sulla misura abituale. A presto.", days: 21 },
    { author: "antonella.p", rating: 5, body: "li ho regalati a mia suocera che ha 74 anni e fa fatica a piegarsi per allacciare le scarpe. ora se li mette da sola in autonomia ed è felicissima. la caviglia tenuta le da sicurezza quando cammina, non barcolla piu", reply: "Che bella notizia! L'autonomia per chi ha qualche difficoltà è impagabile. Tanti saluti alla tua suocera.", days: 26 },
    { author: "Ornella Mancuso", rating: 5, body: "Esteticamente non sembrano affatto scarpe comode da nonna, anzi. Ho preso il tortora e li metto con i pantaloni di lino e con i vestitini. Nessuno immagina che dentro abbiano una soletta così imbottita. Comfort e stile insieme, finalmente.", reply: "Stile e comfort insieme è proprio l'obiettivo di Lunera. Grazie Ornella!", days: 30 },
    { author: "loredana m", rating: 4, body: "all'inizio la suola arrotondata mi dava una sensazione strana, sembrava di dondolare. dopo due o tre giorni mi ci sono abituata e ora cammino benissimo. consegna veloce e pagamento alla consegna comodo", reply: "Normale il piccolo periodo di adattamento alla suola curva. Contenti che ora vadano alla grande!", days: 35 },
    { author: "Pierina Greco", rating: 5, body: "Ho i piedi che si gonfiano tantissimo con il caldo, soprattutto verso sera. La tomaia elastica si allarga insieme al piede senza stringere e questa per me è stata la svolta. Niente più sandali che la mattina vanno e il pomeriggio mi tagliano la circolazione.", reply: "Pierina, la maglia elastica nasce proprio per chi ha questo problema. Buona estate con piedi leggeri!", days: 40 },
    { author: "f. de luca", rating: 5, body: "secondo paio che prendo. il primo lo porto da inizio stagione e regge benissimo, materiali di qualità. stavolta ho preso l'azzurro per cambiare", reply: "Il riacquisto è il complimento più grande! Grazie mille, buona estate con il nuovo colore.", days: 45 },
    { author: "Carmela", rating: 5, body: "Avevo paura a comprare online ma il pagamento alla consegna mi ha tranquillizzata. Pacco arrivato in quattro giorni, tutto regolare. I sandali sono leggeri come piume e morbidi dentro. Per chi come me ha l'alluce valgo la punta larga è una benedizione, non mi preme da nessuna parte.", reply: "Grazie Carmela! La punta ampia è studiata proprio per non comprimere. Siamo contenti del tuo acquisto.", days: 51 },
    { author: "Giuseppina Romano", rating: 5, body: "Li uso per andare al mercato e per le commissioni del mattino. Cammino molto e non sento mai stanchezza ai piedi come prima. La soletta morbida ammortizza ogni passo sull'asfalto. A 70 anni suonati ho ritrovato il piacere di passeggiare.", reply: null, days: 57 },
    { author: "sabri", rating: 5, body: "comodi pazzeschi 😍 sembra di camminare scalza ma con il sostegno giusto. nn me li tolgo piu, anche in casa", reply: "Grazie Sabrina! La sensazione di piede libero ma sostenuto è proprio ciò che cercavamo. ❤️", days: 62 },
    { author: "Teresa Fiore", rating: 5, body: "Sono infermiera e in reparto cammino chilometri ogni turno. Cercavo qualcosa di chiuso sulla caviglia ma fresco per l'estate e questi sono perfetti. La maglia traspira, il piede non suda come dentro alle scarpe chiuse e la soletta regge anche i doppi turni. Promossi a pieni voti.", reply: "Teresa, grazie per il lavoro che fai e per la fiducia. Lunera è pensato proprio per chi macina chilometri. A presto!", days: 68 },
    { author: "M. Bellini", rating: 5, body: "Presi il bianco avorio, colore stupendo dal vivo. Li indosso dalla mattina alla sera senza mai un fastidio, niente vesciche niente sfregamenti perché non ci sono cuciture interne dure. Qualità ottima per il prezzo.", reply: "Il bianco avorio è elegantissimo. Grazie del feedback, buona estate!", days: 74 },
    { author: "nunzia.t", rating: 5, body: "li ho comprati per mia madre allettata che ora prova a fare due passi con il deambulatore. sono leggeri e la tengono salda alla caviglia, il fisioterapista li ha approvati", reply: "Nunzia, leggere questo ci commuove. Auguri di cuore a tua madre per i suoi progressi.", days: 81 },
    { author: "Rossana Pace", rating: 4, body: "Comodi e ben fatti, mi aspettavo solo una soletta un pelo più spessa ma è un gusto mio. Per il resto nulla da dire, leggeri e freschi. La consegna è arrivata puntuale nei tempi indicati.", reply: "Grazie Rossana! La soletta è morbida ma anche di sostegno, è un equilibrio voluto per non perdere stabilità.", days: 87 },
    { author: "anna", rating: 5, body: "freschissimi col caldo, il piede respira e non puzza a fine giornata come mi capitava con altri sandali in similpelle. ottimo il tortora", reply: "La traspirazione è uno dei punti forti. Grazie Anna!", days: 93 },
    { author: "Filomena Esposito", rating: 5, body: "Soffro di diabete e devo fare molta attenzione alle calzature, qualsiasi sfregamento per me diventa un problema serio. Questi sandali sono morbidi all'interno, senza cuciture aggressive, e la maglia elastica non crea mai punti di pressione. La mia podologa li ha visti e mi ha detto di tenerli pure. Per me sono ideali.", reply: "Filomena, grazie per la fiducia. La struttura morbida e senza punti di sfregamento è proprio adatta a piedi delicati. Un caro saluto.", days: 100 },
    { author: "rosaria f.", rating: 3, body: "carini e comodi pero secondo me poteva esserci una suola un filino piu alta sotto al tacco. per il resto materiali buoni e arrivati in fretta", reply: "Grazie Rosaria per la sincerità. La suola contenuta è una scelta per garantire la massima stabilità, ma comprendiamo che sia una preferenza personale.", days: 106 },
    { author: "Lucia Marchetti", rating: 5, body: "Le ho regalate a mia figlia che è una commessa e sta tutto il giorno in negozio. Mi ha ringraziato dopo una settimana dicendo che non aveva mai avuto i piedi così riposati a fine giornata. Bel regalo azzeccato, materiali resistenti e fattura curata. Ne prenderò un paio anche per me.", reply: "Lucia, che bel regalo! Aspettiamo allora il tuo ordine. Grazie di cuore.", days: 110 },
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
  const [pcheck] = await sql`SELECT slug, name, price, original_price, category_id FROM products WHERE slug='lunera'`;
  console.log(`DB check: ${cnt.n} recensioni, media ${avg.v}/5`);
  console.log("Prodotto:", pcheck);
}

main().catch((e) => { console.error(e); process.exit(1); });
