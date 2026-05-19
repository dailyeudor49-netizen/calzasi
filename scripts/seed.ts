import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function createTables() {
  console.log("Dropping existing tables...");
  await sql`DROP TABLE IF EXISTS newsletter_subscribers CASCADE`;
  await sql`DROP TABLE IF EXISTS shop_config CASCADE`;
  await sql`DROP TABLE IF EXISTS ip_rate_settings CASCADE`;
  await sql`DROP TABLE IF EXISTS blocked_ips CASCADE`;
  await sql`DROP TABLE IF EXISTS orders CASCADE`;
  await sql`DROP TABLE IF EXISTS reviews CASCADE`;
  await sql`DROP TABLE IF EXISTS products CASCADE`;
  await sql`DROP TABLE IF EXISTS categories CASCADE`;
  await sql`DROP TABLE IF EXISTS schema_migrations CASCADE`;
  console.log("Tables dropped.");

  console.log("Creating tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      label TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      price NUMERIC(8,2) NOT NULL,
      original_price NUMERIC(8,2) NOT NULL,
      category_id INT NOT NULL REFERENCES categories(id),
      description TEXT NOT NULL,
      features TEXT[] NOT NULL DEFAULT '{}',
      color TEXT NOT NULL DEFAULT '#000000',
      accent_color TEXT NOT NULL DEFAULT '#333333',
      sold_out BOOLEAN NOT NULL DEFAULT false,
      image TEXT,
      is_upsell BOOLEAN NOT NULL DEFAULT false,
      hidden BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL,
      rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      body TEXT NOT NULL,
      verified BOOLEAN NOT NULL DEFAULT true,
      approved BOOLEAN NOT NULL DEFAULT false,
      reply TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES products(id),
      product TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      upsell BOOLEAN NOT NULL DEFAULT false,
      ip TEXT,
      first_name TEXT,
      last_name TEXT,
      address TEXT,
      city TEXT,
      province TEXT,
      zip TEXT,
      shipping_notes TEXT,
      selected_size TEXT,
      selected_color TEXT,
      source TEXT DEFAULT 'organica'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS blocked_ips (
      id SERIAL PRIMARY KEY,
      ip TEXT NOT NULL UNIQUE,
      blocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      reason TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ip_rate_settings (
      id INT PRIMARY KEY DEFAULT 1,
      enabled BOOLEAN NOT NULL DEFAULT true
    )
  `;

  await sql`INSERT INTO ip_rate_settings (id, enabled) VALUES (1, true) ON CONFLICT DO NOTHING`;

  await sql`
    CREATE TABLE IF NOT EXISTS shop_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  for (let v = 1; v <= 14; v++) {
    await sql`INSERT INTO schema_migrations (version) VALUES (${v}) ON CONFLICT DO NOTHING`;
  }

  console.log("Tables created.");
}

async function seedCategories() {
  console.log("Seeding categories...");

  const categories = [
    { slug: "ortopediche", name: "Ortopediche", label: "Calzature Ortopediche" },
    { slug: "posturali", name: "Posturali", label: "Calzature Posturali" },
    { slug: "fitness", name: "Fitness", label: "Calzature Fitness" },
    { slug: "trekking", name: "Trekking", label: "Calzature Trekking" },
  ];

  for (const c of categories) {
    await sql`
      INSERT INTO categories (slug, name, label)
      VALUES (${c.slug}, ${c.name}, ${c.label})
      ON CONFLICT (slug) DO NOTHING
    `;
  }

  console.log(`Seeded ${categories.length} categories.`);
}

async function seedProducts() {
  console.log("Seeding products...");

  const catRows = await sql`SELECT id, slug FROM categories`;
  const catMap: Record<string, number> = {};
  for (const row of catRows) {
    catMap[row.slug] = row.id;
  }

  const products = [
    {
      slug: "serenella",
      name: "Serenella",
      subtitle: "Ogni passo senza dolore, dalla mattina alla sera",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Serenella: supporto posturale, comfort avvolgente e leggerezza dal primo passo.",
      features: ["Soletta a micro-rilievi anatomici", "Supporto posturale integrato", "Sistema ammortizzante anti-urto", "Traspirante, impermeabile e antiscivolo"],
      color: "#C0687A",
      accent_color: "#D48A98",
      image: "/images/land/zen-comfort/carosello/1.webp",
    },
    {
      slug: "aurora",
      name: "Aurora",
      subtitle: "Supporto plantare e comfort che non finisce",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Aurora: supporto posturale, comfort avvolgente e leggerezza dal primo passo.",
      features: ["Soletta a micro-rilievi anatomici", "Supporto posturale integrato", "Sistema ammortizzante anti-urto", "Traspirante, impermeabile e antiscivolo"],
      color: "#C0687A",
      accent_color: "#D48A98",
      image: "/images/land/joy-move/carosello/1.webp",
    },
    {
      slug: "vivace",
      name: "Vivace",
      subtitle: "Tonifica glutei e gambe camminando",
      price: 49.99,
      original_price: 99.98,
      category: "fitness",
      description: "Calzatura con profilo rocker che accompagna ogni passo: riduci l'affaticamento e proteggi le articolazioni.",
      features: ["Profilo rocker a dondolo", "Soletta con sostegno anatomico", "Fodera termoregolante", "Traspirante e antiscivolo"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/active-tone/carosello/1.webp",
    },
    {
      slug: "levante",
      name: "Levante",
      subtitle: "Slancio invisibile e supporto ortopedico",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Levante: scarpe rialzanti donna con slancio nascosto e supporto ortopedico.",
      features: ["Slancio nascosto invisibile", "Supporto ortopedico integrato", "Soletta memory foam ortopedica", "Traspiranti e antiscivolo"],
      color: "#880e4f",
      accent_color: "#ad1457",
      image: "/images/land/lift-boost/carosello/1.webp",
    },
    {
      slug: "ondina",
      name: "Ondina",
      subtitle: "Meno fatica ad ogni passo",
      price: 49.99,
      original_price: 99.98,
      category: "fitness",
      description: "Scarpe ortopediche con suola curva per camminare con meno fatica e proteggere le articolazioni.",
      features: ["Suola rocker ortopedica curva", "Soletta con supporto arco plantare", "Fodera traspirante termoregolante", "Antiscivolo"],
      color: "#AA7947",
      accent_color: "#C4966A",
      image: "/images/land/curve-motion/carosello/1.webp",
    },
    {
      slug: "gentile",
      name: "Gentile",
      subtitle: "Correzione posturale per piedi sensibili",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Scarpe ortopediche correttive che supportano la postura e sono adatte a piedi sensibili.",
      features: ["Soletta a micro-rilievi plantari", "Supporto posturale correttivo", "Sistema ammortizzante integrato", "Tomaia traspirante in mesh"],
      color: "#AA7947",
      accent_color: "#C4966A",
      image: "/images/land/tender-fit/carosello/1.webp",
    },
    {
      slug: "velluto",
      name: "Velluto",
      subtitle: "Suola curva per camminare senza sforzo",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Velluto con suola rocker: comfort ortopedico reale per camminare tutto il giorno.",
      features: ["Suola rocker ortopedica", "Comfort prolungato", "Soletta memory foam ortopedica", "Traspiranti e antiscivolo"],
      color: "#d63384",
      accent_color: "#e75da3",
      image: "/images/land/plush-walk/carosello/1.webp",
    },
    {
      slug: "brezza",
      name: "Brezza",
      subtitle: "Ammortizzazione avanzata per camminate lunghe",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Brezza: scarpe ortopediche con supporto avanzato. Soletta Memory Foam, gel ammortizzante e suola antiscivolo.",
      features: ["Soletta Memory Foam ortopedica", "Gel ammortizzante anti-urto", "Traspiranti e antiscivolo", "Supporto posturale integrato"],
      color: "#1e40af",
      accent_color: "#3b82f6",
      image: "/images/land/breeze-air/carosello/1.webp",
    },
    {
      slug: "vertice",
      name: "Vertice",
      subtitle: "Statura extra con rialzo invisibile",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Vertice: scarpe rialzanti uomo con rialzo nascosto e soletta ortopedica.",
      features: ["Rialzo nascosto regolabile", "Design flush invisibile", "Soletta memory foam ortopedica", "Traspiranti e antiscivolo"],
      color: "#1a237e",
      accent_color: "#3949ab",
      image: "/images/land/rise-up/carosello/1.webp",
    },
    {
      slug: "stellina",
      name: "Stellina",
      subtitle: "Centimetri in più senza rinunciare al comfort",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Stellina: scarpe rialzanti donna con slancio nascosto e supporto ortopedico.",
      features: ["Slancio nascosto invisibile", "Supporto ortopedico integrato", "Soletta memory foam ortopedica", "Traspiranti e antiscivolo"],
      color: "#880e4f",
      accent_color: "#ad1457",
      image: "/images/land/nova-star/carosello/1.webp",
    },
    {
      slug: "saetta",
      name: "Saetta",
      subtitle: "Scarpe sportive per chi ha bisogno di supporto",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Saetta: scarpe sportive ortopediche per camminare e uso quotidiano.",
      features: ["Supporto posturale", "Comfort prolungato", "Adatte a piedi sensibili", "Impermeabili e antiscivolo"],
      color: "#1e40af",
      accent_color: "#3b82f6",
      image: "/images/land/sprint-one/carosello/1.webp",
    },
    {
      slug: "volata",
      name: "Volata",
      subtitle: "Running senza compromessi sulla postura",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Volata: scarpe da running ortopediche per camminare e uso quotidiano.",
      features: ["Supporto posturale", "Comfort prolungato", "Adatte a piedi sensibili", "Impermeabili e antiscivolo"],
      color: "#1e40af",
      accent_color: "#3b82f6",
      image: "/images/land/aero-run/carosello/1.webp",
    },
    {
      slug: "cimone",
      name: "Cimone",
      subtitle: "Sentieri e montagna con supporto plantare",
      price: 49.99,
      original_price: 99.98,
      category: "trekking",
      description: "Supporto ortopedico, comfort prolungato e struttura resistente per sentieri e terreni irregolari.",
      features: ["Suola scolpita grip multi-terreno", "Supporto ortopedico integrato", "Ammortizzazione e comfort prolungato", "Struttura robusta e impermeabile"],
      color: "#059669",
      accent_color: "#34d399",
      image: "/images/land/summit-x/carosello/1.webp",
    },
    {
      slug: "fortezza",
      name: "Fortezza",
      subtitle: "Protezione S3 e comfort ortopedico sul lavoro",
      price: 49.99,
      original_price: 166.99,
      category: "ortopediche",
      description: "Fortezza: certificazione S3, isolamento elettrico e supporto ortopedico.",
      features: ["Punta rinforzata e certificazione S3", "Isolamento elettrico integrato", "Clip di blocco lacci rapida", "Supporto ortopedico e gel anti-shock"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/shield-work/carosello/1.webp",
    },
    {
      slug: "marina",
      name: "Marina",
      subtitle: "Cammina meglio con la suola curva",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Marina con suola rocker ortopedica e soletta anatomica. Migliora la postura.",
      features: ["Suola rocker ortopedica curva", "Supporto posturale integrato", "Soletta con supporto arco plantare", "Fodera traspirante termoregolante"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/wave-step/carosello/1.webp",
    },
    {
      slug: "armonia",
      name: "Armonia",
      subtitle: "Equilibrio e postura ad ogni passo",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Armonia con suola rocker ortopedica e soletta anatomica. Migliora la postura.",
      features: ["Suola rocker ortopedica curva", "Supporto posturale integrato", "Soletta con supporto arco plantare", "Fodera traspirante termoregolante"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/balance-core/1.webp",
    },
    {
      slug: "corretta",
      name: "Corretta",
      subtitle: "Allineamento naturale per tutto il giorno",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Corretta supporta la postura ed è adatta a piedi sensibili. Comoda tutto il giorno.",
      features: ["Supporto posturale", "Comfort prolungato", "Adatte a piedi sensibili", "Impermeabili e antiscivolo"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/allinea-pro/carosello/1.webp",
    },
    {
      slug: "sentiero",
      name: "Sentiero",
      subtitle: "Resistenza e grip su ogni terreno",
      price: 49.99,
      original_price: 99.98,
      category: "trekking",
      description: "Supporto ortopedico, comfort prolungato e struttura resistente per sentieri e terreni irregolari.",
      features: ["Suola scolpita grip multi-terreno", "Supporto ortopedico integrato", "Ammortizzazione e comfort prolungato", "Struttura robusta e impermeabile"],
      color: "#059669",
      accent_color: "#34d399",
      image: "/images/land/trail-force/carosello/1.webp",
    },
    {
      slug: "dolomia",
      name: "Dolomia",
      subtitle: "Due vette, un solo paio di scarpe",
      price: 49.99,
      original_price: 99.98,
      category: "trekking",
      description: "Supporto ortopedico, comfort prolungato e struttura resistente per sentieri e terreni irregolari.",
      features: ["Suola scolpita grip multi-terreno", "Supporto ortopedico integrato", "Ammortizzazione e comfort prolungato", "Struttura robusta e impermeabile"],
      color: "#059669",
      accent_color: "#34d399",
      image: "/images/land/peak-duo/carosello/1.webp",
    },
    {
      slug: "acciaio",
      name: "Acciaio",
      subtitle: "Sicurezza certificata S3 e comfort ortopedico",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Acciaio: certificazione S3, isolamento elettrico e supporto ortopedico.",
      features: ["Punta rinforzata e certificazione S3", "Isolamento elettrico integrato", "Chiusura rapida con rotella", "Supporto ortopedico e gel anti-shock"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/iron-grip/carosello/1.webp",
    },
    {
      slug: "seta",
      name: "Seta",
      subtitle: "Delicate sui piedi, forti nel supporto",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Seta supporta la postura ed è adatta a piedi sensibili.",
      features: ["Supporto posturale", "Comfort prolungato", "Adatte a piedi sensibili", "Impermeabili e antiscivolo"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/soft-stride/carosello/1.webp",
    },
    {
      slug: "cirro",
      name: "Cirro",
      subtitle: "Leggerezza sportiva con supporto plantare",
      price: 49.99,
      original_price: 99.98,
      category: "ortopediche",
      description: "Cirro: scarpe ortopediche sportive per camminare e uso quotidiano.",
      features: ["Supporto posturale", "Comfort prolungato", "Adatte a piedi sensibili", "Impermeabili e antiscivolo"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/cloud-nine/carosello/1.webp",
    },
    {
      slug: "urbana",
      name: "Urbana",
      subtitle: "Postura corretta, piedi felici",
      price: 49.99,
      original_price: 99.98,
      category: "posturali",
      description: "Urbana supporta la postura ed è adatta a piedi sensibili.",
      features: ["Supporto posturale", "Comfort prolungato", "Adatte a piedi sensibili", "Impermeabili e antiscivolo"],
      color: "#700fa8",
      accent_color: "#a855f7",
      image: "/images/land/urban-flex/carosello/1.webp",
    },
    {
      slug: "mattina",
      name: "Mattina",
      subtitle: "Cammina di più con meno fatica",
      price: 49.99,
      original_price: 99.98,
      category: "fitness",
      description: "Scarpe ortopediche con suola curva per camminare con meno fatica.",
      features: ["Suola rocker ortopedica curva", "Supporto posturale integrato", "Soletta con supporto arco plantare", "Fodera traspirante termoregolante"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/daily-walk/carosello/1.webp",
    },
    {
      slug: "dinamica",
      name: "Dinamica",
      subtitle: "Tonifica i glutei ad ogni passo",
      price: 44.99,
      original_price: 149.99,
      category: "fitness",
      description: "Scarpe ortopediche con suola rocker che attiva i glutei e migliora la postura.",
      features: ["Suola rocker a dondolo", "Attivazione glutei integrata", "Soletta con supporto arco plantare", "Fodera traspirante termoregolante"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/power-rocker/carosello/1.webp",
    },
    {
      slug: "rapida",
      name: "Rapida",
      subtitle: "Indossale e vai: tonificazione senza lacci",
      price: 44.99,
      original_price: 149.99,
      category: "fitness",
      description: "Scarpe ortopediche con suola rocker che tonifica i glutei e migliora la postura.",
      features: ["Suola rocker a dondolo", "Attivazione glutei integrata", "Ammortizzazione anti-urto", "Soletta con supporto arco plantare"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/land/easy-on/carosello/1.webp",
    },
    {
      slug: "regina",
      name: "Regina",
      subtitle: "Eleganza rialzata con supporto ortopedico",
      price: 44.99,
      original_price: 149.99,
      category: "ortopediche",
      description: "Regina: scarpe rialzanti donna con slancio nascosto e supporto ortopedico.",
      features: ["Slancio nascosto invisibile", "Supporto ortopedico integrato", "Push-up glutei integrato", "Soletta memory foam ortopedica"],
      color: "#880e4f",
      accent_color: "#ad1457",
      image: "/images/land/royal-step/carosello/1.webp",
    },
    {
      slug: "primula",
      name: "Primula",
      subtitle: "Leggerezza e stile ad ogni passo",
      price: 44.99,
      original_price: 149.99,
      category: "ortopediche",
      description: "Primula: scarpe leggere con supporto ortopedico e design elegante.",
      features: ["Suola rocker ortopedica", "Design leggero e traspirante", "Soletta memory foam", "Traspiranti e antiscivolo"],
      color: "#880e4f",
      accent_color: "#ad1457",
      image: "/images/land/bloom-lite/carosello/1.webp",
    },
    {
      slug: "altea",
      name: "Altea",
      subtitle: "Solleva la tua camminata con comfort totale",
      price: 44.99,
      original_price: 149.99,
      category: "ortopediche",
      description: "Altea: supporto ortopedico avanzato con suola curva per il massimo comfort.",
      features: ["Suola rocker a dondolo", "Attivazione glutei integrata", "Ammortizzazione anti-urto", "Soletta con supporto arco plantare"],
      color: "#9B5FA3",
      accent_color: "#b088c4",
      image: "/images/land/eleva-plus/carosello/1.webp",
    },
    {
      slug: "placida",
      name: "Placida",
      subtitle: "Comfort avvolgente per piedi stanchi",
      price: 44.99,
      original_price: 149.99,
      category: "ortopediche",
      description: "Placida: scarpe ortopediche avvolgenti per piedi stanchi. Comfort dalla mattina alla sera.",
      features: ["Soletta Memory Foam ortopedica", "Ammortizzazione avanzata", "Tomaia traspirante", "Suola antiscivolo"],
      color: "#AA7947",
      accent_color: "#C4966A",
      image: "/images/land/serene-go/carosello/1.webp",
    },
    {
      slug: "plantare-ortopedico",
      name: "Plantare Ortopedico",
      subtitle: "Soletta ortopedica in memory foam",
      price: 4.99,
      original_price: 35.00,
      category: "ortopediche",
      description: "Plantare ortopedico in memory foam con supporto arco plantare.",
      features: ["Memory foam ad alta densità", "Supporto arco plantare", "Traspirante e antibatterico", "Taglia unica adattabile"],
      color: "#16a34a",
      accent_color: "#4ade80",
      image: "/images/upsell/plantare.webp",
      is_upsell: true,
    },
  ];

  let count = 0;
  for (const p of products) {
    const categoryId = catMap[p.category];
    if (!categoryId) {
      console.error(`  ERROR: category "${p.category}" not found for product "${p.slug}"`);
      continue;
    }

    await sql`
      INSERT INTO products (slug, name, subtitle, price, original_price, category_id, description, features, color, accent_color, sold_out, image, is_upsell)
      VALUES (
        ${p.slug},
        ${p.name},
        ${p.subtitle},
        ${p.price},
        ${p.original_price},
        ${categoryId},
        ${p.description},
        ${p.features},
        ${p.color},
        ${p.accent_color},
        ${false},
        ${p.image},
        ${p.is_upsell || false}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        subtitle = EXCLUDED.subtitle,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        category_id = EXCLUDED.category_id,
        description = EXCLUDED.description,
        features = EXCLUDED.features,
        color = EXCLUDED.color,
        accent_color = EXCLUDED.accent_color,
        sold_out = EXCLUDED.sold_out,
        image = EXCLUDED.image,
        is_upsell = EXCLUDED.is_upsell
    `;
    count++;
  }

  console.log(`Seeded ${count} products.`);
}

async function seedShopConfig() {
  console.log("Seeding shop config...");

  const config: Record<string, string> = {
    shop_name: "Calzasi",
    shop_company: "Calzasi S.r.l.",
    shop_vat: "03751648971",
    shop_address: "Via delle Manifatture 12",
    shop_city: "Vigevano (PV)",
    shop_zip: "27029",
    shop_province: "PV",
    shop_country: "Italia",
    shop_email: "info@calzasi.com",
    shop_phone: "",
    shop_pec: "",
    shop_capital: "€10.000",
    template: "template-pr",
    brand_logo: "/images/logo.webp",
    brand_favicon: "/images/favicon.ico",
    primary_color: "#1B3A5C",
    primary_light: "#24517E",
    primary_dark: "#122940",
    accent_color: "#C9813A",
    cta_color: "#C9813A",
    cta_dark: "#A86828",
    bg_color: "#FFFFFF",
    bg_alt: "#FAF7F2",
    text_color: "#1A1816",
    text_secondary: "#6E6560",
    border_color: "#E8E0D6",
    font_heading: "Gotham",
    font_body: "Proxima Nova",
    facebook_pixel_id: "",
    google_ads_id: "",
    domain: "calzasi.com",
    hero_title: "Ogni passo conta. Scegli le scarpe giuste.",
    hero_subtitle: "Calzature selezionate per il tuo benessere. Spedizione 4,99 €, paghi alla consegna.",
    hero_cta_text: "Scopri la Collezione",
    hero_image: "/images/hero.webp",
  };

  for (const [key, value] of Object.entries(config)) {
    await sql`
      INSERT INTO shop_config (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
  }

  console.log(`Seeded ${Object.keys(config).length} shop config entries.`);
}

async function main() {
  console.log("Starting seed...\n");

  await createTables();
  await seedCategories();
  await seedProducts();
  await seedShopConfig();

  console.log("\nSeed completed successfully.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
