import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("ERROR: DATABASE_URL non impostato."); process.exit(1); }

const sql = neon(DATABASE_URL);

/* ── Helpers ── */
function d(daysAgo: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() - daysAgo);
  return dt.toISOString();
}

async function main() {
  // ── 1. Aggiungi categorie (se non esistono) ──
  const cats = [
    { slug: "classiche", name: "Classiche", label: "Scarpe Classiche" },
    { slug: "sandali",   name: "Sandali",   label: "Sandali"          },
    { slug: "sportive",  name: "Sportive",  label: "Scarpe Sportive"  },
  ];
  for (const c of cats) {
    await sql`INSERT INTO categories (slug, name, label) VALUES (${c.slug}, ${c.name}, ${c.label}) ON CONFLICT (slug) DO NOTHING`;
  }
  console.log("Categorie OK");

  const rows = await sql`SELECT id, slug FROM categories`;
  const catMap: Record<string, number> = {};
  for (const r of rows) catMap[r.slug] = r.id;

  // ── 2. Prodotti ──
  const products = [
    {
      slug: "ambra", name: "Ambra", category: "classiche",
      subtitle: "Il loafer classico che si abbina a tutto",
      price: 69.99, original_price: 139.99,
      description: "Ambra è il mocassino con tacco basso in pelle champagne che non manca mai in un guardaroba curato. Design pulito, comfort dall'alba alla sera. Il classico intramontabile.",
      features: ["Pelle naturale traspirante", "Tacco ergonomico 4 cm", "Sottopiede imbottito", "Suola antiscivolo certificata"],
      color: "#A87B50", accent_color: "#A87B50",
      image: "/images/categories/ambra.webp",
    },
    {
      slug: "noir", name: "Noir", category: "classiche",
      subtitle: "La ballerina nera che ti veste ogni occasione",
      price: 59.99, original_price: 119.99,
      description: "Noir è la ballerina definitiva: linea essenziale, fiocco sottile, tomaia in pelle liscia. Zero complessità, massima eleganza per ogni look.",
      features: ["Pelle liscia premium", "Sottopiede anatomico imbottito", "Punta arrotondata morbida", "Suola flessibile ultraleggera"],
      color: "#1A1A1A", accent_color: "#333333",
      image: "/images/categories/noir.webp",
    },
    {
      slug: "miele", name: "Miele", category: "sandali",
      subtitle: "Il sandalo cuoio che accompagna tutta l'estate",
      price: 74.99, original_price: 149.99,
      description: "Miele è il sandalo con laccetti intrecciati in pelle cuoio naturale. Calzata precisa grazie ai laccetti regolabili, suola piana comoda. Compagno perfetto dell'estate.",
      features: ["Pelle cuoio naturale conciata", "Laccetti intrecciati regolabili", "Suola piatta in gomma", "Chiusura fibbia dorata"],
      color: "#A0633A", accent_color: "#A0633A",
      image: "/images/categories/miele.webp",
    },
    {
      slug: "perla", name: "Perla", category: "sandali",
      subtitle: "Eleganza estiva dal mattino alla sera",
      price: 79.99, original_price: 159.99,
      description: "Perla è il sandalo bianco con cinturino e tacco quadro da 6 cm. Porta l'eleganza dell'estate senza sacrificare il comfort, anche nelle occasioni più formali.",
      features: ["Tacco quadro stabile 6 cm", "Cinturino caviglia regolabile", "Pelle bianca naturale premium", "Suola antiscivolo"],
      color: "#C4B99F", accent_color: "#B89F6F",
      image: "/images/categories/perla.webp",
    },
    {
      slug: "corsa", name: "Corsa", category: "sportive",
      subtitle: "Cammina, corri, vivi — senza limiti",
      price: 89.99, original_price: 179.99,
      description: "Corsa è la sneaker da running con ammortizzazione avanzata per chi non si ferma. Tomaia in mesh traspirante, suola a reazione, palette fresca bianco-rosa.",
      features: ["Ammortizzazione EVA reattiva", "Mesh ultra-traspirante", "Plantare anatomico estraibile", "Grip direzionale rinforzato"],
      color: "#C9A0C8", accent_color: "#9B7BC8",
      image: "/images/categories/corsa.webp",
    },
    {
      slug: "sabbia", name: "Sabbia", category: "sportive",
      subtitle: "La chunky sneaker minimal che completa ogni outfit",
      price: 99.99, original_price: 199.99,
      description: "Sabbia è la chunky sneaker total beige con suola platform che aggiunge centimetri senza sacrificare il comfort. Design minimal, versatilità massima.",
      features: ["Suola platform 4 cm", "Tomaia in mesh e nabuk", "Imbottitura alta al colletto", "Lacci piatti waxed"],
      color: "#A0875E", accent_color: "#A0875E",
      image: "/images/categories/sabbia.webp",
    },
    {
      slug: "carbone", name: "Carbone", category: "sportive",
      subtitle: "Prestazioni serie, look da città",
      price: 94.99, original_price: 189.99,
      description: "Carbone è la sneaker running in total black con outsole a contrasto bianco. Tecnica e urbana insieme: dalla palestra alla strada senza cambiare scarpe.",
      features: ["Upper in flyknit tecnico", "Suola running ammortizzata", "Colletto imbottito alto", "Tomaia seamless antifrizzione"],
      color: "#1A1A1A", accent_color: "#444444",
      image: "/images/categories/carbone.webp",
    },
    {
      slug: "nobile", name: "Nobile", category: "classiche",
      subtitle: "L'Oxford che si porta per sempre",
      price: 129.99, original_price: 259.99,
      description: "Nobile è l'Oxford in pelle bordeaux lucida. Costruzione artigianale di qualità, suola in cuoio battuta a mano. Una scarpa che migliora col tempo.",
      features: ["Costruzione artigianale di qualità", "Pelle box calf bordeaux lucida", "Suola cuoio battuta a mano", "Puntale rinforzato"],
      color: "#7B2238", accent_color: "#7B2238",
      image: "/images/categories/nobile.webp",
    },
    {
      slug: "grazia", name: "Grazia", category: "classiche",
      subtitle: "Il décolleté slingback per ogni grande occasione",
      price: 109.99, original_price: 219.99,
      description: "Grazia è il décolleté slingback in pelle beige cipria con tacco stiletto da 7 cm. Punta affusolata, cinturino posteriore elasticizzato. Silhouette da grande occasione.",
      features: ["Tacco stiletto 7 cm", "Cinturino elastico posteriore", "Pelle beige naturale", "Soletta in pelle imbottita"],
      color: "#C9A882", accent_color: "#C9A882",
      image: "/images/categories/grazia.webp",
    },
    {
      slug: "estate", name: "Estate", category: "sandali",
      subtitle: "La zeppa in rafia che fa l'estate vera",
      price: 84.99, original_price: 169.99,
      description: "Estate è il sandalo con zeppa in rafia intrecciata e cinghie in pelle cuoio. Altezza 8 cm senza instabilità: cammini sicura anche sui sampietrini.",
      features: ["Zeppa in rafia naturale 8 cm", "Cinghie in pelle cuoio", "Base antiscivolo rinforzata", "Calzata regolabile fibbia"],
      color: "#A0633A", accent_color: "#8B5C30",
      image: "/images/categories/estate.webp",
    },
    {
      slug: "notte", name: "Notte", category: "sandali",
      subtitle: "Il sandalo platform black che accende la serata",
      price: 89.99, original_price: 179.99,
      description: "Notte è il sandalo platform in pelle nera con fascia larga e fibbia tono su tono. Platform da 4 cm, look contemporaneo potente, comfort inaspettato.",
      features: ["Platform 4 cm in gomma", "Fascia larga in pelle nera", "Fibbia tono su tono", "Sottopiede imbottito comfort"],
      color: "#1A1A1A", accent_color: "#444444",
      image: "/images/categories/notte.webp",
    },
    {
      slug: "cielo", name: "Cielo", category: "sportive",
      subtitle: "Lo stile retrò che non passa mai di moda",
      price: 119.99, original_price: 239.99,
      description: "Cielo è la sneaker ispirata allo stile runner anni '90, in bianco con dettagli azzurro cielo. Upper in mesh e suede, outsole in gomma vulcanizzata. Senza tempo.",
      features: ["Stile retro runner anni '90", "Upper mesh e suede bianco", "Dettagli azzurro ghiaccio", "Outsole vulcanizzata premium"],
      color: "#5B9BD5", accent_color: "#5B9BD5",
      image: "/images/categories/cielo.webp",
    },
    {
      slug: "confetto", name: "Confetto", category: "sportive",
      subtitle: "Infila e vai — il comfort di ogni giorno",
      price: 59.99, original_price: 119.99,
      description: "Confetto è lo slip-on in tessuto knit rosa antico da calzare senza allacciarti. Stretchy, leggerissimo, ideale per chi è sempre in movimento.",
      features: ["Knit elasticizzato stretch", "Slip-on senza allacciatura", "Suola ultraleggera 3 cm", "Imbottitura morbida al colletto"],
      color: "#D9A0A0", accent_color: "#C9A0A0",
      image: "/images/categories/confetto.webp",
    },
    {
      slug: "splendore", name: "Splendore", category: "sportive",
      subtitle: "La sneaker premium che si nota subito",
      price: 109.99, original_price: 219.99,
      description: "Splendore è la sneaker in pelle bianca con accenti champagne dorati. Dettagli oro discreti su tallone e linguetta, suola platform sottile. Raffinata anche nel casual.",
      features: ["Pelle bianca full-grain", "Accenti champagne dorati", "Suola platform bassa 3 cm", "Imbottitura memory foam"],
      color: "#B89F6F", accent_color: "#B89F6F",
      image: "/images/categories/splendore.webp",
    },
    {
      slug: "avventura", name: "Avventura", category: "sportive",
      subtitle: "Dalla città al sentiero senza cambiarti",
      price: 119.99, original_price: 239.99,
      description: "Avventura è la sneaker outdoor in mesh tecnico verde salvia con inserti beige. Suola trail con grip profondo, protezione punta rinforzata. Per chi non si ferma.",
      features: ["Mesh tecnico traspirante", "Suola trail grip profondo", "Protezione punta rinforzata", "Sistema lacci speed-lacing"],
      color: "#6B8C5A", accent_color: "#6B8C5A",
      image: "/images/categories/avventura.webp",
    },
    {
      slug: "cipria", name: "Cipria", category: "classiche",
      subtitle: "La ballerina con fiocco che non pesa nulla",
      price: 54.99, original_price: 109.99,
      description: "Cipria è la ballerina rosa cipria con fiocco decorativo in raso. Ultra-flat, leggerissima, soletta in memory foam. La compagna discreta di ogni look femminile.",
      features: ["Pelle morbida rosa cipria", "Fiocco in raso decorativo", "Soletta memory foam", "Suola piatta in gomma morbida"],
      color: "#C98888", accent_color: "#C98888",
      image: "/images/categories/cipria.webp",
    },
    {
      slug: "bianca", name: "Bianca", category: "sandali",
      subtitle: "Il sandalo minimal che funziona sempre",
      price: 74.99, original_price: 149.99,
      description: "Bianca è il sandalo con tacco quadro da 5 cm in pelle bianca naturale. Fascia singola larga, cinturino regolabile al collo del piede. Essenziale e versatile.",
      features: ["Tacco quadro stabile 5 cm", "Fascia larga in pelle bianca", "Cinturino regolabile", "Soletta imbottita comfort"],
      color: "#1B3A5C", accent_color: "#1B3A5C",
      image: "/images/categories/bianca.webp",
    },
    {
      slug: "tabacca", name: "Tabacca", category: "classiche",
      subtitle: "Il Mary Jane moderno per ogni guardaroba",
      price: 84.99, original_price: 169.99,
      description: "Tabacca è il Mary Jane in pelle tortora con fibbia dorata e tacco blocco da 5 cm. Retro e contemporaneo: si porta con gonne, pantaloni e jeans.",
      features: ["Pelle tortora premium", "Tacco blocco stabile 5 cm", "Fibbia regolabile dorata", "Punta arrotondata comfort"],
      color: "#8B7355", accent_color: "#8B7355",
      image: "/images/categories/tabacca.webp",
    },
    {
      slug: "viola", name: "Viola", category: "sportive",
      subtitle: "La chunky dai colori delicati che tutti vogliono",
      price: 79.99, original_price: 159.99,
      description: "Viola è la chunky sneaker in bianco con dettagli lilla e suola robusta rialzata. Tomaia in mesh e micro-suede, colletto imbottito. Dolce e decisa allo stesso tempo.",
      features: ["Dettagli lilla su fondo bianco", "Suola chunky rialzata 4 cm", "Mesh e micro-suede", "Imbottitura morbida al colletto"],
      color: "#9B7BC8", accent_color: "#9B7BC8",
      image: "/images/categories/viola.webp",
    },
  ];

  for (const p of products) {
    const catId = catMap[p.category];
    if (!catId) { console.error(`Categoria non trovata: ${p.category}`); continue; }
    await sql`
      INSERT INTO products (slug, name, subtitle, price, original_price, category_id, description, features, color, accent_color, sold_out, image, is_upsell)
      VALUES (
        ${p.slug}, ${p.name}, ${p.subtitle}, ${p.price}, ${p.original_price},
        ${catId}, ${p.description}, ${p.features}, ${p.color}, ${p.accent_color},
        false, ${p.image}, false
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name, subtitle = EXCLUDED.subtitle, price = EXCLUDED.price,
        original_price = EXCLUDED.original_price, description = EXCLUDED.description,
        features = EXCLUDED.features, color = EXCLUDED.color, accent_color = EXCLUDED.accent_color,
        image = EXCLUDED.image
    `;
  }
  console.log(`Inseriti/aggiornati ${products.length} prodotti.`);

  // ── 3. Recupera IDs prodotti appena inseriti ──
  const prodRows = await sql`SELECT id, slug FROM products WHERE slug = ANY(${products.map(p => p.slug)})`;
  const prodMap: Record<string, number> = {};
  for (const r of prodRows) prodMap[r.slug] = r.id;

  // ── 4. Recensioni ──
  type Review = { author: string; rating: number; body: string; reply: string | null; daysAgo: number };
  const reviews: Record<string, Review[]> = {
    "ambra": [
      { author: "Federica L.", rating: 5, body: "Finalmente un loafer che calza perfettamente dalla prima volta. La pelle è morbidissima, nessuna vescica. Le ho già messe tre giorni di fila.", reply: "Grazie Federica! Il mocassino Ambra è pensato proprio per chi lo vuole indossare subito senza rodaggio. Felici che ti piaccia!", daysAgo: 8 },
      { author: "Rosanna Ferretti", rating: 5, body: "Elegantissime. Le ho prese per andare a lavoro e le indosso anche nel weekend. il tacco è basso e stabile, non mi stanco affatto.", reply: "Grazie Rosanna, è il bello di un classico ben fatto: va bene sempre!", daysAgo: 15 },
      { author: "giada m.", rating: 4, body: "belle scarpe, colore identico alle foto. unico appunto: la suola potrebbe essere un po' più aderente sul bagnato. per il resto ottimo acquisto 👍", reply: "Ciao Giada, grazie per il feedback! Terremo presente il tuo suggerimento.", daysAgo: 22 },
      { author: "M. Colombo", rating: 5, body: "Ho aspettato qualche giorno prima di recensire per provare bene. Perfette. La pelle è vera, il tacco non cigola, la calzata è precisa nella mia taglia.", reply: null, daysAgo: 34 },
      { author: "Concetta Mele", rating: 5, body: "Mia figlia le ha adocchiate subito appena le ho messe. Alla fine ne ho preso un paio anche per lei. Sono davvero belle e il prezzo è onestissimo.", reply: "Che bello che vi piacciono entrambe! Grazie Concetta!", daysAgo: 47 },
      { author: "Teresa", rating: 3, body: "buone ma un po' rigide inizialmente. dopo una settimana di utilizzo si sono ammorbidite e adesso vanno bene. la qualità c'è.", reply: "Ciao Teresa! La pelle vera ha bisogno di qualche giorno per adattarsi al piede. Siamo contenti che siano migliorarte!", daysAgo: 61 },
    ],
    "noir": [
      { author: "Valentina Greco", rating: 5, body: "La ballerina nera perfetta. L'ho cercata per anni e l'ho trovata. Pelle morbida, taglia precisa, fiocco discreto. Ordinerò altri modelli.", reply: "Grazie Valentina! Il nero classico non tradisce mai. Ci fa molto piacere!", daysAgo: 6 },
      { author: "Elisa P.", rating: 5, body: "Arrivate in 3 giorni ben imballate. Calzano esattamente la mia taglia. Comode fin da subito, le sto già usando per ore senza problemi.", reply: "Perfetto Elisa, grazie per la fiducia!", daysAgo: 14 },
      { author: "giuseppina t.", rating: 4, body: "belle ma la suola è un po' sottile, quindi sul freddo si sente. primavera estate perfette però. 4 stelle per questo", reply: null, daysAgo: 29 },
      { author: "L. Santoro", rating: 5, body: "Comodissime. Le ho messe tutto il giorno a una cerimonia e i piedi stavano bene. Il sottopiede imbottito si sente davvero.", reply: "Grazie! Siamo contenti che abbiano retto la giornata lunga!", daysAgo: 41 },
      { author: "Chiara Benedetti", rating: 5, body: "Acquisto ripetuto, questa è la mia seconda Noir. Ho usurato la prima dopo quasi due anni di uso quotidiano — se non è qualità questa!", reply: "Acquisto ripetuto = il miglior complimento che potessimo ricevere. Grazie Chiara!", daysAgo: 56 },
    ],
    "miele": [
      { author: "Sara C.", rating: 5, body: "Sandali meravigliosi. Il cuoio è vero, si sente al tatto. I laccetti sono comodi e rimangono allacciati. Li porto tutto il giorno senza pensieri.", reply: "Grazie Sara! Il cuoio naturale è il nostro orgoglio per i Miele.", daysAgo: 7 },
      { author: "Daniela Russo", rating: 5, body: "Ho preso le Miele per le vacanze in Grecia. Perfette sui sampietrini, sulle spiagge, a cena. Un solo paio per tutto.", reply: "Il sandalo da vacanza definitivo! Grazie Daniela!", daysAgo: 18 },
      { author: "anna maria", rating: 4, body: "molto belle, pelle morbida. la fibbia dorata è un bel dettaglio. tolgo una stella xché ci ho messo un po' a capire come allacciarle bene al primo utilizzo", reply: "Ciao! I laccetti hanno una tecnica precisa, ma poi viene naturale. Grazie per la recensione!", daysAgo: 32 },
      { author: "Giovanna F.", rating: 5, body: "Finalmente sandali veri in pelle vera a un prezzo ragionevole. La suola tiene bene, i laccetti non si allentano. Ottimo acquisto.", reply: null, daysAgo: 48 },
      { author: "Roberta Marini", rating: 5, body: "Le ho regalate a mia sorella per il suo compleanno, è impazzita. Ha già scritto al servizio clienti per chiedere se esistono altri colori. Molto soddisfatta!", reply: "Che bel regalo! Dite alla tua sorella che ci può scrivere senza problemi, siamo qui.", daysAgo: 63 },
    ],
    "perla": [
      { author: "Alessandra V.", rating: 5, body: "Sandali elegantissimi. Il bianco è luminoso, non tende al giallino. Il tacco quadro è super stabile. Li ho portati a un matrimonio e stavo benissimo.", reply: "Grazie Alessandra! Il tacco quadro è pensato proprio per stare in piedi ore senza fatica.", daysAgo: 9 },
      { author: "Cristina Baldi", rating: 4, body: "Molto belli. Taglia precisa, cinturino comodo. Solo il tallone inizialmente segnava un po', poi sparito. 4 stelle ma quasi 5.", reply: "Ciao Cristina! Un cerotto nei primi giorni aiuta. Poi il cinturino si ammorbidisce. Grazie!", daysAgo: 21 },
      { author: "Laura", rating: 5, body: "ho preso il 38 come sempre e mi calzano perfettamente. bianchi luminosi, tacco stabile, cerniera di sicurezza — li adoro", reply: null, daysAgo: 35 },
      { author: "Marina Coppola", rating: 5, body: "Terzo acquisto da Calzasi. Sempre puntuali, sempre ben imballati, sempre qualità. Le Perla sono il mio sandalo elegante di riferimento ora.", reply: "Terzo ordine! Un grazie enorme Marina, sei la benvenuta!", daysAgo: 52 },
    ],
    "corsa": [
      { author: "Ilaria F.", rating: 5, body: "Ammortizzazione vera, non è marketing. Faccio 10.000 passi al giorno per lavoro e con queste non ho più i piedi gonfi la sera. Ottime.", reply: "Grazie Ilaria! Sono state progettate proprio per le giornate lunghe.", daysAgo: 5 },
      { author: "S. Pellegrino", rating: 5, body: "Correvo con scarpe da 200€ di altra marca. Queste le battono in comfort e a metà prezzo. Incredibile.", reply: "Siamo contenti che se ne accorga anche lei! Grazie!", daysAgo: 17 },
      { author: "francesca", rating: 4, body: "comode e leggere, il plantare anatomico si sente subito. le trovo un filo calde in estate ma per il resto sono ottime", reply: "Ciao Francesca! Per l'estate ti consigliamo calze tecniche molto sottili. Grazie!", daysAgo: 28 },
      { author: "Paola Neri", rating: 5, body: "Le ho comprate per camminare in montagna nei weekend. Tengono benissimo, la suola è aderente. Mi aspettavo meno a questo prezzo.", reply: null, daysAgo: 44 },
      { author: "Marta B.", rating: 5, body: "Colore identico alle foto, consegna veloce. Plantare estraibile comodissimo. Le uso sia in palestra che in ufficio casual.", reply: "Perfette per la doppia vita! Grazie Marta!", daysAgo: 59 },
    ],
    "sabbia": [
      { author: "Giorgia T.", rating: 5, body: "La chunky beige che cercavo da mesi. Total beige dall'alto al basso, suola robusta ma leggera. Abbinamento facile con qualsiasi outfit.", reply: "Grazie Giorgia! Il beige totale è una delle nostre scelte di stile preferite.", daysAgo: 6 },
      { author: "Veronica S.", rating: 5, body: "Altezza giusta, non troppo alte. Camminare è comodo anche per ore. La tomaia in mesh respira bene. Molto soddisfatta.", reply: null, daysAgo: 20 },
      { author: "k. russo", rating: 4, body: "belle ma leggermente larghe nel tallone. nn è un problema enorme ma se hai il piede stretto prendi mezzo numero in meno forse", reply: "Ciao! Grazie per il consiglio, lo segnaleremo. Puoi sempre scriverci per i dubbi di taglia.", daysAgo: 33 },
      { author: "Michela Longo", rating: 5, body: "Primo acquisto su Calzasi e sono rimasta colpita dall'imballaggio. Scarpe avvolte con cura, scatola solida. E le Sabbia sono bellissime.", reply: "Grazie Michela! La cura nel packaging è il nostro piccolo dettaglio di qualità.", daysAgo: 51 },
    ],
    "carbone": [
      { author: "Beatrice R.", rating: 5, body: "Sneaker running total black che finalmente non sembrano da ginnastica. Le porto anche in contesti semi-formali. Comode e stilose.", reply: "Esattamente l'effetto che volevamo! Grazie Beatrice.", daysAgo: 8 },
      { author: "N. Ferraro", rating: 5, body: "Upper flyknit che abbraccia il piede senza stringere. Nessuna area di pressione neanche dopo 6 ore. Le migliori che abbia mai provato.", reply: null, daysAgo: 19 },
      { author: "silvia m.", rating: 4, body: "molto comode, sneaker nere versatili. le lavo a mano di tanto in tanto e tornano come nuove. ottimo acquisto nn mi aspettavo questa qualità", reply: "Grazie Silvia! Per il lavaggio: acqua fredda e spazzola morbida. Reggeranno a lungo!", daysAgo: 36 },
      { author: "Annamaria Conte", rating: 5, body: "Le ho prese per mia figlia 18 anni, le ha indossate subito e non le toglie più. Dice che le comodissime. Ottima scelta.", reply: "Grazie Annamaria! Speriamo che sua figlia le ami a lungo!", daysAgo: 54 },
    ],
    "nobile": [
      { author: "G. Lombardi", rating: 5, body: "Oxford autentici. La pelle bordeaux è ricca e profumata, la suola in cuoio ha carattere. Si capisce subito che non sono una scarpa qualsiasi.", reply: "Grazie! Nobile è il nostro modello più classico e siamo orgogliosi di ogni paio.", daysAgo: 10 },
      { author: "Pietro Marchi", rating: 5, body: "Le indosso con abiti ma anche con jeans scuri e sembrano sempre a posto. Suola cuoio già suonata nel modo giusto. Soddisfatto.", reply: null, daysAgo: 24 },
      { author: "Roberto V.", rating: 4, body: "scarpa di qualità indiscutibile. la pelle è vera, il colore è intenso. unico appunto: inizialmente rigida, ma è normale per le oxford in box calf.", reply: "Ciao Roberto! Con un po' di utilizzo la pelle si ammorbidisce perfettamente. Grazie!", daysAgo: 38 },
      { author: "Luca Bianchi", rating: 5, body: "Regalo per mio padre 65 anni. Era scettico sugli acquisti online, ma quando le ha viste dal vivo ha detto 'queste valgono'. Missione compiuta.", reply: "Grazie Luca! Un giudizio così vale doppio. Complimenti al papà!", daysAgo: 57 },
    ],
    "grazia": [
      { author: "Alessia F.", rating: 5, body: "Décolleté perfetti per occasioni importanti. Tacco 7 cm ma il cinturino elastico dà sicurezza ad ogni passo. Non ho avuto paura neanche sul parquet.", reply: "Grazie Alessia! Il cinturino è il dettaglio che fa la differenza.", daysAgo: 7 },
      { author: "M. De Rosa", rating: 5, body: "Ho cercato un slingback beige naturale per mesi. Finalmente lo ho trovato. Il colore è esattamente quello in foto, la pelle è morbida.", reply: null, daysAgo: 22 },
      { author: "Patrizia G.", rating: 4, body: "elegantissimi, tacco molto stabile per essere uno stiletto. forse non da portare tutto il giorno ma per una serata o cerimonia sono perfetti", reply: "Ciao Patrizia! Esatto, sono pensati per le grandi occasioni. Grazie per la recensione!", daysAgo: 40 },
      { author: "Carla Rinaldi", rating: 5, body: "Li ho indossati al matrimonio di mia nipote. Tante complimentate. Il tacco regge senza problemi. Sono già il mio paio di cerimonia fisso.", reply: "Congratulazioni per il matrimonio! Grazie per la fiducia Carla.", daysAgo: 58 },
    ],
    "estate": [
      { author: "Irene B.", rating: 5, body: "Zeppa in rafia vera, non plastica. Cinghie cuoio di qualità. Alta 8 cm ma cammino come con le basse. Sono il sandalo delle vacanze quest'estate.", reply: "Grazie Irene! La zeppa naturale distribuisce il peso molto meglio di quelle sintetiche.", daysAgo: 9 },
      { author: "Cristina M.", rating: 5, body: "Le ho messe per un giro in centro, 4 ore in piedi su vari tipi di pavimento. Zero dolori, zero problemi. Bellissime e comode.", reply: null, daysAgo: 23 },
      { author: "valentina p.", rating: 4, body: "molto belle! la zeppa è stabile e comoda. le cinghie però all'inizio lasciano il segno. dopo due o tre utilizzi ok, pelle vera che si adatta", reply: "Ciao Valentina! È normale con la pelle vera. Tienitele per qualche ora inizialmente. Grazie!", daysAgo: 37 },
      { author: "Rita Conti", rating: 5, body: "Regalo di compleanno a me stessa! 8 cm di zeppa e non ho mai i talloni doloranti. Non pensavo fosse possibile. Grazie Calzasi.", reply: "Auguri Rita! Il regalo migliore che potevi farti. Grazie!", daysAgo: 55 },
    ],
    "notte": [
      { author: "Sofia V.", rating: 5, body: "Sandali platform neri perfetti per ogni serata. Il platform 4 cm è solido, non oscilla. Fascia larga comoda anche dopo ore di ballo.", reply: "Grazie Sofia! Il platform è costruito per reggere ore di utilizzo.", daysAgo: 11 },
      { author: "Eleonora G.", rating: 5, body: "Look contemporaneo ma confortevole. La pelle nera è lucida al punto giusto. Fibbia tono su tono è un dettaglio raffinato che ho apprezzato subito.", reply: null, daysAgo: 26 },
      { author: "d. ferrari", rating: 4, body: "bellissimi ma la pelle nera tende a prendere i graffi. normale per la pelle liscia ma da considerare. per il resto assolutamente top", reply: "Ciao! Un po' di crema per pelle nera le mantiene perfette. Grazie per il consiglio!", daysAgo: 42 },
      { author: "Barbara Mori", rating: 5, body: "Le ho comprate per la serata di Capodanno. Tutti me le hanno chiesto. Il platform tiene perfettamente. Riacquisto sicuro.", reply: "Che bel Capodanno allora! Grazie Barbara!", daysAgo: 60 },
    ],
    "cielo": [
      { author: "Greta T.", rating: 5, body: "Le sneaker anni '90 che sognavo. Il bianco e l'azzurro sono esattamente il combo che cercavo. Leggere, comode, iconiche. Indosso solo queste ora.", reply: "Grazie Greta! Lo stile retrò è intramontabile, siamo d'accordo con te.", daysAgo: 7 },
      { author: "Alessia Nanni", rating: 5, body: "Outsole vulcanizzata solida, non scivolosa. La mesh bianca respira bene. Il blu è proprio un azzurro ghiaccio delicato, non troppo carico. Perfette.", reply: null, daysAgo: 18 },
      { author: "m. mariani", rating: 4, body: "belle ma un filo strette sul mio piede largo. prenderei mezzo numero in più. la qualità però è evidente, si sentono robuste", reply: "Ciao! Per piede largo consigliamo sempre mezzo numero in più. Grazie per la segnalazione!", daysAgo: 31 },
      { author: "Camilla B.", rating: 5, body: "Terza volta che ordino su Calzasi. Sempre impeccabili. Le Cielo sono il mio ultimo acquisto e già le amo. Ottimo servizio.", reply: "Grazie Camilla, sei di casa qui! Sempre un piacere.", daysAgo: 49 },
      { author: "Laura Ferri", rating: 5, body: "Mia figlia ne è ossessionata. Ne ha parlato a tutte le amiche. Tre di loro le hanno già ordinate. Qualità riconoscibile.", reply: "Grazie Laura! Passaparola tra amiche è il nostro miglior segnale di qualità.", daysAgo: 65 },
    ],
    "confetto": [
      { author: "Simona V.", rating: 5, body: "Slip-on comodissimi, li infilo in 3 secondi. Il colore rosa è delicato, non stridulo. Li porto dal mattino alla sera senza toglierli.", reply: "Grazie Simona! Per la praticità non c'è niente come uno slip-on di qualità.", daysAgo: 8 },
      { author: "A. Moretti", rating: 5, body: "Leggere come niente. Le ho pesate: 280g l'una. Per camminare molto sono ideali. Knit traspirante, piede mai sudato. Ottimo acquisto.", reply: null, daysAgo: 19 },
      { author: "francesca g.", rating: 4, body: "comode sì, ma il colore in realtà è leggermente più scuro del rosa in foto. resto soddisfatta, qualità buona e prezzo onesto", reply: "Ciao Francesca! I monitor possono dare sfumature diverse. Il colore reale è un rosa antico caldo. Grazie!", daysAgo: 34 },
      { author: "Antonella Russo", rating: 5, body: "Le uso per camminare a lungo per lavoro. Piedi in ottima forma a fine giornata. Le consiglio a chiunque lavori in piedi.", reply: "Grazie Antonella! Lavorate molto per farle durare a lungo.", daysAgo: 50 },
    ],
    "splendore": [
      { author: "Valeria B.", rating: 5, body: "Sneaker bianche con dettagli oro. Sembrano costose, si portano bene, sono comode. Il memory foam si sente davvero. Qualità sopra le aspettative.", reply: "Grazie Valeria! Gli accenti dorati sono il dettaglio che fa la differenza.", daysAgo: 6 },
      { author: "Giuditta M.", rating: 5, body: "Le ho abbinate con un vestito da cerimonia e con i jeans. In entrambi i casi erano perfette. Sneaker versatilissime.", reply: null, daysAgo: 20 },
      { author: "c. bianchi", rating: 4, body: "belle e comode, il memory foam si sente subito. gli accenti dorati sono discreti, non pacchiani. perdo solo una stella xché il bianco si sporca facilmente", reply: "Ciao! Un pennello morbido e una crema per pelle bianca le mantengono splendenti. Grazie!", daysAgo: 35 },
      { author: "Luisa Caruso", rating: 5, body: "Regalo per i miei 50 anni. Ho preso le Splendore perché il nome mi piaceva e sono rimasta colpita. Qualità vera, suola solida. Auguri a me!", reply: "Auguri Luisa! Che bel regalo per un compleanno importante. Grazie!", daysAgo: 53 },
    ],
    "avventura": [
      { author: "Miriam T.", rating: 5, body: "Le uso per trekking leggero e per la città. Il grip è vero, non scivola. Peso contenuto per essere una scarpa outdoor. Acquisto riuscitissimo.", reply: "Grazie Miriam! Avventura è nata esattamente per l'uso misto che descrivi.", daysAgo: 9 },
      { author: "Federica Galli", rating: 5, body: "Protezione punta solida, mesh traspirante. Il verde salvia con il beige è una combinazione bellissima. Le ho indossate in 5 paesi quest'estate.", reply: "5 paesi con Avventura! Questo ci fa felici. Grazie Federica!", daysAgo: 21 },
      { author: "t. ferrari", rating: 4, body: "ottime per il trekking urbano, forse un po' rigide per percorsi lunghi in montagna vera. per sentieri facili e città però sono perfette", reply: "Ciao! Sono pensate per outdoor urbano e sentieri leggeri. Grazie per la precisione!", daysAgo: 38 },
      { author: "Nadia V.", rating: 5, body: "Speed-lacing praticissimo. In 10 secondi allaccio tutto perfettamente. La suola trail tiene su qualsiasi superficie. Le porto ovunque.", reply: null, daysAgo: 55 },
    ],
    "cipria": [
      { author: "Elena S.", rating: 5, body: "Ballerine delicate e femminili. Il fiocco in raso è un dettaglio curato. Piede a proprio agio tutto il giorno. Il memory foam si sente davvero.", reply: "Grazie Elena! Le Cipria sono pensate per chi vuole comfort e delicatezza insieme.", daysAgo: 8 },
      { author: "P. Ricci", rating: 5, body: "Colore rosa cipria identico alla foto, né troppo chiaro né troppo scuro. Suola morbida, si cammina bene. Primo ordine su Calzasi, non sarà l'ultimo.", reply: "Benvenuta P.! Siamo felici del primo acquisto. Ci vediamo al prossimo!", daysAgo: 22 },
      { author: "nunzia s.", rating: 4, body: "carine e leggere. il fiocco però col tempo si deforma un po'. la qualità generale è buona comunque, niente da dire sul comfort", reply: "Ciao! Il fiocco può essere riformato con un ferro da stiro a vapore da lontano. Grazie!", daysAgo: 40 },
      { author: "Roberta F.", rating: 5, body: "Le ho comprate per mia madre che ha problemi alle articolazioni. La suola morbida le aiuta molto. È contentissima. Acquisto ottimo.", reply: "Grazie Roberta! Siamo felici che portino sollievo anche a chi ha bisogno di più morbidezza.", daysAgo: 58 },
    ],
    "bianca": [
      { author: "Martina C.", rating: 5, body: "Sandalo bianco minimal esattamente come cercavo. Tacco stabile, cinturino sicuro. Abbinamento zero problemi con qualsiasi vestito estivo.", reply: "Grazie Martina! Il minimal ha il vantaggio di andare con tutto.", daysAgo: 10 },
      { author: "C. Palma", rating: 5, body: "Il tacco quadro da 5 cm è il mio preferito: abbastanza alto da slanciarti, abbastanza stabile da non far male. Le Bianca sono perfette.", reply: null, daysAgo: 25 },
      { author: "giovanna m.", rating: 4, body: "bella qualità, pelle bianca vera. il cinturino ci ho messo un po' ad abituarmi ma alla fine ok. li ho usati per 3 settimane di ferie senza problemi", reply: "Ciao Giovanna! Ottimo risultato per 3 settimane di ferie. Grazie!", daysAgo: 42 },
      { author: "Serena Pieri", rating: 5, body: "Ho sostituito i sandali dell'anno scorso con le Bianca. Decisamente migliori per qualità della pelle e stabilità del tacco. Scelta giusta.", reply: "Upgrade riuscito! Grazie Serena.", daysAgo: 59 },
    ],
    "tabacca": [
      { author: "Raffaella T.", rating: 5, body: "Mary Jane tortora delizioso. Il tacco blocco è super stabile, la fibbia dorata è discreta. Le porto con la gonna a palloncino e con i pantaloni: entrambi perfetti.", reply: "Grazie Raffaella! Il Mary Jane moderno è uno dei nostri preferiti.", daysAgo: 7 },
      { author: "E. Dantoni", rating: 5, body: "La pelle tortora è bellissima, tono caldo e neutro. Si abbina a colori diversi facilmente. Qualità costruttiva superiore alla fascia di prezzo.", reply: null, daysAgo: 21 },
      { author: "sara f.", rating: 4, body: "molto belle e originali. la punta arrotondata è più comoda di quella appuntita. unico neo: il tacco ha un po' di rumore su certi pavimenti", reply: "Ciao Sara! Un gommino sul tacco risolve facilmente il problema. Grazie!", daysAgo: 38 },
      { author: "Assunta L.", rating: 5, body: "Acquisto per mia figlia universitaria. Ha detto che è il regalo più bello che le abbia mai fatto. La fibbia dorata è la cosa che preferisce.", reply: "Un complimento meraviglioso! Grazie Assunta e complimenti alla sua ragazza.", daysAgo: 56 },
    ],
    "viola": [
      { author: "Nicole G.", rating: 5, body: "La chunky bianca e lilla è esattamente il vibe che cercavo. Colori dolci ma la suola è robusta. Comode anche per lunghe camminate.", reply: "Grazie Nicole! Dolce fuori, solida dentro — è la filosofia di Viola.", daysAgo: 6 },
      { author: "Francesca D.", rating: 5, body: "Le ho viste su instagram e le ho subito ordinate. In realtà sono ancora più belle dal vivo. Il lilla è tenue, non aggressivo. Adoro.", reply: null, daysAgo: 17 },
      { author: "elena m.", rating: 4, body: "carine e comode. la chunky 4cm è un po' alta per me che nn sono abituata ma ci si abitua. il colore è delizioso però, molto originale", reply: "Ciao Elena! Le chunky richiedono qualche giorno per abituarsi. Poi non si torna indietro!", daysAgo: 30 },
      { author: "Rossana Ferrari", rating: 5, body: "Mia nipote le ha ordinate in bianco-lilla dopo averle viste alle mie piedi. Ora le abbiamo uguali. Bellissime e comode entrambe.", reply: "Che abbinamento di stile tra zia e nipote! Grazie Rossana.", daysAgo: 46 },
      { author: "Ginevra B.", rating: 5, body: "Il micro-suede della tomaia è di qualità. Il mesh è traspirante. La suola chunky è comoda nonostante l'altezza. Ottimo per primavera.", reply: "Grazie Ginevra! Perfette per il cambio di stagione.", daysAgo: 62 },
    ],
  };

  let totalReviews = 0;
  for (const [slug, revList] of Object.entries(reviews)) {
    const prodId = prodMap[slug];
    if (!prodId) { console.error(`Prodotto non trovato: ${slug}`); continue; }
    for (const r of revList) {
      await sql`
        INSERT INTO reviews (product_id, author_name, rating, body, reply, verified, approved, created_at)
        VALUES (${prodId}, ${r.author}, ${r.rating}, ${r.body}, ${r.reply}, true, true, ${d(r.daysAgo)})
        ON CONFLICT DO NOTHING
      `;
      totalReviews++;
    }
  }
  console.log(`Inserite ${totalReviews} recensioni.`);

  // ── Verifica finale ──
  const countP = await sql`SELECT COUNT(*) as n FROM products WHERE slug = ANY(${products.map(p => p.slug)})`;
  const countR = await sql`SELECT COUNT(*) as n FROM reviews WHERE product_id = ANY(SELECT id FROM products WHERE slug = ANY(${products.map(p => p.slug)}))`;
  console.log(`\nVerifica DB:`);
  console.log(`  Prodotti: ${countP[0].n} / ${products.length}`);
  console.log(`  Recensioni: ${countR[0].n}`);
}

main().catch(err => { console.error(err); process.exit(1); });
