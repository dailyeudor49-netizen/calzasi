import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("ERROR: DATABASE_URL non impostato."); process.exit(1); }

const sql = neon(DATABASE_URL);

async function main() {
  console.log("Seed Arceria...");

  const [cat] = await sql`SELECT id FROM categories WHERE slug = 'sandali' LIMIT 1`;
  if (!cat) { console.error("ERROR: categoria 'sandali' non trovata"); process.exit(1); }

  const features = [
    "Tomaia a maglia elastica: si adatta al piede come un calzino, senza punti di pressione",
    "Calzata immediata senza lacci né fibbie: infili e via",
    "Supporto alla caviglia e all'arco plantare per un passo stabile",
    "Soletta in memory foam anatomica: si modella al piede e allevia la pressione",
    "Punta ampia: spazio naturale per le dita, adatto anche con alluce valgo",
    "Suola curva rocker: scarica ginocchia e schiena, attiva i glutei camminando",
  ];

  await sql`
    INSERT INTO products (
      name, slug, subtitle, description, price, original_price,
      image, category_id, features, color
    ) VALUES (
      'Arceria',
      'arceria',
      'Sandalo ortopedico elastico: lo infili come un calzino',
      'Sandalo ortopedico elastico che si infila come un calzino. La tomaia a maglia si adatta al piede senza stringere, la soletta in memory foam allevia la pressione e la suola curva scarica ginocchia e schiena ad ogni passo. Punta ampia adatta anche a chi soffre di alluce valgo. Comfort estivo, senza rinunciare al supporto ortopedico.',
      44.99,
      149.99,
      '/images/land/arceria/carosello/1.webp',
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

  const [prod] = await sql`SELECT id FROM products WHERE slug = 'arceria' LIMIT 1`;
  console.log(`Prodotto ID: ${prod.id}`);

  await sql`DELETE FROM reviews WHERE product_id = ${prod.id}`;

  const reviews = [
    { author: "Annarita Pellegrino", rating: 5, body: "Cercavo un sandalo che potessi mettere in fretta senza chinarmi a chiudere fibbie. Questi sono perfetti, li infilo come una calza e sono pronta in due secondi. La punta è larga, le mie dita non sono compresse e l'alluce non duole più la sera. Per chi ha problemi ai piedi sono una manna.", reply: "Grazie Annarita! Arceria è nato proprio per chi vuole comfort vero senza complicazioni. Ti aspettiamo per il prossimo acquisto.", days: 6 },
    { author: "marisa t.", rating: 5, body: "wow non mi aspettavo cosi comodi. sembrano una calza ma con la suola dura sotto. piede contenuto ma libero, non stringono. ottimo acquisto", reply: "Grazie Marisa! Buona estate con Arceria.", days: 11 },
    { author: "Federica Conti", rating: 5, body: "Ho preso il colore champagne, foto fedeli al prodotto reale. La consegna è stata rapida e il pagamento alla consegna mi ha rassicurata molto perché era il primo acquisto qui. Li uso tutti i giorni per andare al lavoro, sto in piedi 7 ore e non sento più la stanchezza che avevo con le altre scarpe.", reply: "Che bella conferma Federica! Siamo contenti che il primo acquisto sia andato bene.", days: 18 },
    { author: "G. Marinelli", rating: 4, body: "Comodi e leggeri, il colore caffè è bellissimo. Mezza taglia in meno sarebbe stata più precisa, ma stanno comunque bene grazie all'elasticità della tomaia. Per la prossima volta vado di 39 invece di 40.", reply: "Grazie per il consiglio sulla taglia! Per chi è incerto suggeriamo di restare sulla propria misura abituale. Speriamo di rivederti.", days: 22 },
    { author: "Concetta", rating: 5, body: "Ho 68 anni e da quando ho la fascite plantare cammino male. Questi sandali mi hanno cambiato l'estate: arco sostenuto, suola morbida, e l'avvolgenza sulla caviglia mi fa sentire stabile. Niente più male sotto al piede dopo la passeggiata serale.", reply: "Concetta che bella notizia! Continui a usarli con regolarità, anche brevi camminate quotidiane aiutano molto. Un abbraccio.", days: 28 },
    { author: "valentina r", rating: 5, body: "ordinati venerdì arrivati martedì. pagati al corriere, nessuna sorpresa. la suola curva si sente proprio camminando, sembra che ti spinga in avanti", reply: null, days: 31 },
    { author: "Giovanna Lo Russo", rating: 5, body: "Soffro di alluce valgo da anni e quasi tutti i sandali mi creano dolore alla base dell'alluce. Questi no, la punta è abbastanza larga da non comprimere nulla. Sono una rivelazione. Ne ho già consigliati 3 paia alle amiche.", reply: "Grazie Giovanna, il passaparola è il complimento più grande. Buona estate alla tua compagnia!", days: 35 },
    { author: "Renata B.", rating: 5, body: "Esteticamente belli, soprattutto il nude rose. Non sembrano scarpe ortopediche ma lo sono. Indossati con jeans, gonna lunga, vestitini estivi: vanno con tutto.", reply: "Il nude rose è uno dei preferiti delle nostre clienti. Grazie Renata!", days: 41 },
    { author: "rosalba.m", rating: 4, body: "comodi, ma all'inizio la suola curva mi sembrava strana. dopo qualche giorno mi sono abituata e ora non li lascio piu. consegna ok", reply: "Normalissimo il periodo di adattamento alla suola rocker. Contenti che ora vadano bene!", days: 47 },
    { author: "Maria Pia Santoro", rating: 5, body: "Mia figlia me li ha regalati per il compleanno e devo dire che sono una meraviglia. Avevo paura che fossero scomodi come tanti sandali ortopedici, invece la sensazione è proprio quella di indossare una pantofola con il supporto giusto. Li metto anche per andare a fare la spesa.", reply: "Bel regalo! La sensazione di pantofola con il supporto è proprio quello che cercavamo. Grazie Maria Pia.", days: 52 },
    { author: "Elena G.", rating: 5, body: "Avevo dubbi sull'acquisto online ma il pagamento alla consegna mi ha convinto. Ottima scelta. I miei piedi gonfi a fine giornata sono finalmente un ricordo. Ne prenderò un altro paio in caffè.", reply: "Grazie Elena! Aspettiamo il tuo secondo ordine.", days: 58 },
    { author: "Mariangela", rating: 5, body: "Per me che ho i piedi sensibili e i talloni screpolati questo modello è una salvezza. La soletta morbida ammortizza il tallone e la chiusura a calzino non sfrega da nessuna parte.", reply: null, days: 64 },
    { author: "P. Russo", rating: 5, body: "Ho preso una taglia 38 come al solito e calzano perfettamente. Il piede è contenuto ma respira. Per chi soffre di sudorazione estiva la tomaia a maglia è top.", reply: "Grazie! La tomaia traspirante è uno dei punti forti per l'estate. Buona stagione.", days: 70 },
    { author: "luciana p.", rating: 5, body: "li ho gia portati in vacanza, camminato anche su sentieri sterrati e tenuto fino a sera senza problemi. felice dell'acquisto", reply: "Buona vacanza Luciana!", days: 76 },
    { author: "Antonella Vitale", rating: 5, body: "Le compro per mia madre che ha 78 anni e fatica a chinarsi per allacciare le scarpe. Con queste si veste in autonomia e ha riacquistato sicurezza nella camminata. Cosa più importante: la caviglia avvolta la fa sentire stabile e non ha più paura di cadere.", reply: "Antonella, leggere queste parole ci fa felici. L'autonomia è impagabile. Tanti saluti alla mamma.", days: 82 },
    { author: "C. Marotta", rating: 4, body: "Buoni, leggeri, comodi. Mi aspettavo una soletta ancora più morbida ma è una questione personale. Per il resto il prodotto è di qualità e la consegna puntuale.", reply: "Grazie per il feedback. La soletta è morbida ma anche sostenuta per non perdere il supporto ortopedico, è un equilibrio che abbiamo cercato.", days: 88 },
    { author: "francesca", rating: 5, body: "li metto col vestito lungo e nessuno direbbe che sono ortopedici. comfort dal primo momento, niente vesciche niente sfregamenti", reply: "Stile e comfort senza compromessi. Grazie Francesca!", days: 94 },
    { author: "Bruna Caputo", rating: 5, body: "Sono diabetica e devo stare attenta alla scelta delle calzature. Il fatto che siano elastici e senza cuciture interne aggressive è stato decisivo. La mia podologa li ha approvati senza riserve.", reply: "Bruna, grazie per la fiducia. La struttura morbida senza punti di sfregamento è proprio adatta a chi ha piedi sensibili.", days: 101 },
    { author: "claudia.f", rating: 3, body: "carini e comodi pero li avrei preferiti con una suola un filo piu alta sul tacco. per il resto ok", reply: "Grazie Claudia per la sincerità. La suola bassa è una scelta per chi cerca stabilità massima ma capiamo il gusto personale.", days: 108 },
    { author: "Gabriella Esposito", rating: 5, body: "Acquisto secondo paio. Il primo lo uso quotidianamente da inizio stagione e dopo mesi sono ancora come nuovi. Materiali resistenti e ottima fattura. Soddisfatta al 100%.", reply: "Il secondo acquisto vale più di mille recensioni. Grazie Gabriella!", days: 115 },
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
  const [pcheck] = await sql`SELECT slug, name, price, original_price, category_id FROM products WHERE slug='arceria'`;
  console.log(`DB check: ${cnt.n} recensioni, media ${avg.v}/5`);
  console.log("Prodotto:", pcheck);
}

main().catch((e) => { console.error(e); process.exit(1); });
