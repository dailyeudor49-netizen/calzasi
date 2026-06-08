import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("ERROR: DATABASE_URL non impostato."); process.exit(1); }

const sql = neon(DATABASE_URL);

async function main() {
  console.log("Seed Melvia...");

  const [cat] = await sql`SELECT id FROM categories WHERE slug = 'sandali' LIMIT 1`;
  if (!cat) { console.error("ERROR: categoria 'sandali' non trovata"); process.exit(1); }

  const features = [
    "Tomaia in maglia elastica: abbraccia il piede e ne segue ogni movimento, senza zone di pressione",
    "Si calza in un attimo: nessun laccio né fibbia, basta infilarli come un calzino",
    "Caviglia avvolta e sostenuta: il bordo morbido tiene il piede stabile ad ogni passo",
    "Soletta in memory foam: si adatta alla forma del piede e aiuta ad alleviare la fatica",
    "Punta generosa: lascia spazio naturale alle dita, comoda anche con alluce valgo",
    "Suola curva: accompagna il passo in modo fluido e alleggerisce ginocchia e schiena",
  ];

  await sql`
    INSERT INTO products (
      name, slug, subtitle, description, price, original_price,
      image, category_id, features, color
    ) VALUES (
      'Melvia',
      'melvia',
      'Si infila come un calzino.',
      'Sandalo estivo dall''effetto calzino, con tomaia in maglia elastica che si adatta alla forma del piede e ne asseconda ogni movimento. La soletta in memory foam si modella sotto al peso e aiuta ad alleviare la fatica a fine giornata, mentre la suola curva accompagna il passo in modo naturale e fluido. Il bordo morbido avvolge e sostiene la caviglia per una camminata più stabile. Comfort estivo, leggero e traspirante, pronto da indossare in un attimo.',
      44.99,
      149.99,
      '/images/land/melvia/carosello/1.webp',
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

  const [prod] = await sql`SELECT id FROM products WHERE slug = 'melvia' LIMIT 1`;
  console.log(`Prodotto ID: ${prod.id}`);

  await sql`DELETE FROM reviews WHERE product_id = ${prod.id}`;

  const reviews = [
    { author: "Loredana Ferraro", rating: 5, body: "Finalmente un sandalo che si infila davvero come un calzino. Ho preso il tortora e si abbina a tutto, dai pantaloni leggeri ai vestitini. La tomaia elastica avvolge il piede senza stringerlo e alla sera non ho più quella sensazione di gonfiore che avevo con le altre scarpe. Comodissimi.", reply: "Grazie Loredana! Il tortora è uno dei più amati, sta bene con tutto. Buona estate con Melvia.", days: 5 },
    { author: "gabriella t.", rating: 5, body: "comodi davvero. li metto e tolgo in un secondo, niente fibbie da chiudere. il blu navy poi è elegante", reply: "Grazie Gabriella! La praticità è proprio il punto forte di Melvia.", days: 9 },
    { author: "Maria Cristina Bellini", rating: 5, body: "Lavoro come infermiera e passo otto ore in piedi tra i reparti. Questi sandali sono una salvezza: la soletta morbida ammortizza ogni passo e la caviglia avvolta mi tiene il piede stabile anche quando cammino veloce. Ne ho ordinati subito due paia, tortora e verde.", reply: "Maria Cristina, grazie per il lavoro che fai! Siamo felici che Melvia ti accompagni durante i turni.", days: 13 },
    { author: "rossana", rating: 5, body: "presi per mia mamma di 80 anni che non riesce piu a chinarsi per le scarpe. ora si veste da sola ed è felicissima. la caviglia tenuta bene la fa sentire sicura quando cammina", reply: "Che bella notizia rossana! L'autonomia ritrovata è la cosa più importante. Un saluto alla mamma.", days: 17 },
    { author: "F. Damiani", rating: 4, body: "Belli e comodi, il verde è proprio il colore della foto. Forse una mezza taglia abbondanti, ma grazie alla maglia elastica si adattano comunque bene. Consegna puntuale e pagamento alla consegna, tutto liscio.", reply: "Grazie per il feedback sulla taglia! Per chi è indeciso consigliamo la misura abituale. A presto.", days: 21 },
    { author: "Concetta Lo Bianco", rating: 5, body: "Soffro di fascite plantare da due anni e camminare era diventato un incubo. Con questi sandali sento il piede sostenuto e la suola curva mi aiuta ad alleviare la pressione sotto il tallone. Non dico che ho risolto tutto ma le passeggiate serali sono tornate piacevoli.", reply: "Concetta, grazie per la fiducia. Un uso costante anche su brevi tragitti aiuta molto. Continui così!", days: 26 },
    { author: "valeria m", rating: 5, body: "ordinati lunedì arrivati giovedì, pagato al corriere senza problemi. la suola si sente proprio mentre cammini, ti accompagna in avanti. soddisfattissima", reply: null, days: 30 },
    { author: "Giuseppina", rating: 5, body: "Ho 72 anni e i piedi che si gonfiano facilmente con il caldo. Questi sandali sono leggeri e la maglia lascia respirare il piede, non sudo come con altri modelli. Li tengo tutto il giorno e la sera tolgo le scarpe senza quel sollievo dolente di sempre.", reply: "Giuseppina, grazie! La tomaia traspirante è pensata proprio per le giornate calde. Buona estate.", days: 34 },
    { author: "Antonella P.", rating: 5, body: "Regalati a mia suocera per la festa della mamma. Li ha adorati, dice che sono come pantofole ma con il sostegno giusto per uscire. Il blu navy è elegante e non sembra affatto una scarpa ortopedica.", reply: "Bel pensiero! Felici che la suocera sia soddisfatta. Grazie Antonella.", days: 39 },
    { author: "marilena.c", rating: 5, body: "comodissimi dal primo momento, niente vesciche niente sfregamenti. li ho portati in vacanza in puglia e camminato tutto il giorno tra i borghi senza un dolore", reply: "Buona vacanza marilena! Grazie per averci scelto.", days: 44 },
    { author: "Greta Fontana", rating: 5, body: "Cercavo qualcosa di comodo ma anche carino, perché di solito le scarpe per i piedi che fanno male sono brutte. Questi invece sono belli, ho preso il tortora e ricevo complimenti. Comfort e stile insieme, finalmente.", reply: "Grazie Greta! Comfort e stile non devono escludersi, è proprio la nostra filosofia.", days: 49 },
    { author: "rita lo presti", rating: 4, body: "buoni e leggeri. all inizio la suola curva mi sembrava un po strana sotto al piede, poi mi sono abituata in qualche giorno e ora vanno benissimo", reply: "Il piccolo adattamento alla suola curva è normalissimo. Contenti che ora siano perfetti!", days: 54 },
    { author: "P. Costa", rating: 5, body: "Taglia 38 come sempre, calzano alla perfezione. Il piede è contenuto ma libero di muoversi. Per chi come me ha i piedi un po' larghi davanti, la punta ampia fa tutta la differenza.", reply: "Grazie! La punta ampia è pensata proprio per chi ha bisogno di spazio davanti. A presto.", days: 60 },
    { author: "carla", rating: 5, body: "secondo paio in due mesi. il primo lo uso ogni giorno ed è ancora come nuovo. stavolta ho preso il verde xchè mi piaceva troppo 😍", reply: "Il secondo acquisto è il complimento più bello! Grazie carla, il verde è splendido.", days: 65 },
    { author: "Daniela Marchetti", rating: 5, body: "Mia figlia me li ha consigliati dopo che li aveva comprati lei. Avevo i miei dubbi sui sandali comprati online ma il pagamento alla consegna mi ha tranquillizzata. Ottima scelta: piede avvolto, caviglia sostenuta, e una leggerezza che non avevo mai provato.", reply: "Grazie Daniela! Il passaparola in famiglia ci rende orgogliosi. Benvenuta tra le clienti Melvia.", days: 71 },
    { author: "anna r.", rating: 5, body: "li metto con la gonna lunga e nessuno si accorge che sono comodi e sostengono il piede. perfetti per chi sta tanto in piedi come me che lavoro al mercato", reply: null, days: 77 },
    { author: "Vincenza Esposito", rating: 5, body: "Ho i piedi sensibili e i talloni che si screpolano facilmente. Questo modello non ha cuciture interne fastidiose e la chiusura a calzino non sfrega da nessuna parte. La soletta morbida poi è una coccola per il tallone. Promossi a pieni voti.", reply: "Vincenza, grazie! L'assenza di cuciture aggressive è proprio ciò che cercavamo per i piedi sensibili.", days: 83 },
    { author: "g. ferri", rating: 5, body: "leggerissimi, sembra di non avere niente ai piedi ma con il giusto sostegno. il blu navy è bellissimo dal vivo, anche piu bello che nelle foto", reply: "Grazie! Il blu navy è uno dei nostri preferiti. A presto.", days: 89 },
    { author: "Teresa Lombardi", rating: 5, body: "Sono diabetica e devo scegliere con cura le calzature. Il fatto che siano elastici, morbidi e senza punti di pressione è stato decisivo per me. Li ho mostrati alla mia podologa e me li ha approvati. Comodi e sicuri.", reply: "Teresa, grazie per la fiducia. La struttura morbida e senza sfregamenti è adatta a chi ha piedi delicati.", days: 96 },
    { author: "loredana s", rating: 3, body: "carini e comodi pero mi aspettavo una soletta un filo piu morbida. niente di grave, si cammina bene cmq. il colore tortora è bello", reply: "Grazie loredana per la sincerità. La soletta è morbida ma anche sostenuta per non perdere stabilità, è un equilibrio voluto.", days: 103 },
    { author: "Filomena Greco", rating: 3, body: "Il prodotto va bene ma il corriere ci ha messo quasi due settimane e ho dovuto sollecitare. I sandali in sé sono comodi e leggeri, peccato per la spedizione lenta al primo ordine.", reply: "Filomena, ci dispiace per l'attesa con il corriere. Segnaliamo il disservizio. Grazie per la pazienza, siamo felici che i sandali ti piacciano.", days: 110 },
    { author: "Gabriella Russo", rating: 5, body: "Li uso da inizio stagione tutti i giorni per il lavoro e dopo mesi sono ancora in ottimo stato. Materiali resistenti, cuciture solide, fattura curata. Avevo paura di buttare soldi e invece è stato uno degli acquisti migliori dell'anno. Consigliatissimi.", reply: "Gabriella, grazie di cuore! La resistenza nel tempo è una delle cose di cui andiamo più fieri.", days: 115 },
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
  const [pcheck] = await sql`SELECT slug, name, price, original_price, category_id FROM products WHERE slug='melvia'`;
  console.log(`DB check: ${cnt.n} recensioni, media ${avg.v}/5`);
  console.log("Prodotto:", pcheck);
}

main().catch((e) => { console.error(e); process.exit(1); });
