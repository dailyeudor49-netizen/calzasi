import sharp from "sharp";
import fs from "fs";
import path from "path";

const pub = path.join(process.cwd(), "public", "images");

async function webp(src: string, dest: string, q = 85) {
  await sharp(src).webp({ quality: q }).toFile(dest);
  console.log(`  ✓  ${path.relative(pub, src).padEnd(55)}→  ${path.relative(pub, dest)}`);
}

async function main() {
  const shop = path.join(pub, "shop");
  const cat  = path.join(pub, "categories");
  const land = path.join(pub, "land");

  // ── Shop images ────────────────────────────────────────
  console.log("\n── Shop images ──");
  await webp(path.join(shop, "ChatGPT Image 19 mag 2026, 11_09_32.png"), path.join(shop, "hero-store.webp"));
  await webp(path.join(shop, "ChatGPT Image 19 mag 2026, 11_11_24.png"), path.join(shop, "store-exterior.webp"));
  await webp(path.join(shop, "ChatGPT Image 19 mag 2026, 11_13_46.png"), path.join(shop, "store-interior.webp"));
  await webp(path.join(shop, "ChatGPT Image 19 mag 2026, 11_17_54.png"), path.join(shop, "store-sneakers.webp"));
  await webp(path.join(shop, "ChatGPT Image 19 mag 2026, 11_21_35.png"), path.join(shop, "store-counter.webp"));
  await webp(path.join(shop, "LOGO.png"), path.join(shop, "logo.webp"));

  // ── Scarpe: categories + carosello ─────────────────────
  const shoes: { png: string; slug: string }[] = [
    { png: "ChatGPT Image 19 mag 2026, 12_13_09 (1).png", slug: "ambra"     },
    { png: "ChatGPT Image 19 mag 2026, 12_13_09 (2).png", slug: "noir"      },
    { png: "ChatGPT Image 19 mag 2026, 12_13_09 (3).png", slug: "miele"     },
    { png: "ChatGPT Image 19 mag 2026, 12_13_09 (4).png", slug: "perla"     },
    { png: "ChatGPT Image 19 mag 2026, 12_13_09 (5).png", slug: "corsa"     },
    { png: "ChatGPT Image 19 mag 2026, 12_13_09 (6).png", slug: "sabbia"    },
    { png: "ChatGPT Image 19 mag 2026, 12_13_09 (7).png", slug: "carbone"   },
    { png: "ChatGPT Image 19 mag 2026, 12_15_16 (1).png", slug: "nobile"    },
    { png: "ChatGPT Image 19 mag 2026, 12_15_17 (2).png", slug: "grazia"    },
    { png: "ChatGPT Image 19 mag 2026, 12_15_17 (3).png", slug: "estate"    },
    { png: "ChatGPT Image 19 mag 2026, 12_15_17 (4).png", slug: "notte"     },
    { png: "ChatGPT Image 19 mag 2026, 12_15_19 (5).png", slug: "cielo"     },
    { png: "ChatGPT Image 19 mag 2026, 12_15_19 (6).png", slug: "confetto"  },
    { png: "ChatGPT Image 19 mag 2026, 12_15_20 (7).png", slug: "splendore" },
    { png: "ChatGPT Image 19 mag 2026, 12_15_20 (8).png", slug: "avventura" },
    { png: "ChatGPT Image 19 mag 2026, 12_17_01 (1).png", slug: "cipria"    },
    { png: "ChatGPT Image 19 mag 2026, 12_17_01 (2).png", slug: "bianca"    },
    { png: "ChatGPT Image 19 mag 2026, 12_17_02 (3).png", slug: "tabacca"   },
    { png: "ChatGPT Image 19 mag 2026, 12_17_02 (4).png", slug: "viola"     },
  ];

  console.log("\n── Scarpe: categories + carosello ──");
  for (const { png, slug } of shoes) {
    const src = path.join(cat, png);
    await webp(src, path.join(cat, `${slug}.webp`));
    const dir = path.join(land, slug, "carosello");
    fs.mkdirSync(dir, { recursive: true });
    await webp(src, path.join(dir, "1.webp"));
  }

  // ── Delete originals ────────────────────────────────────
  console.log("\n── Delete originals ──");
  const toDelete = [
    path.join(shop, "ChatGPT Image 19 mag 2026, 11_09_32.png"),
    path.join(shop, "ChatGPT Image 19 mag 2026, 11_11_24.png"),
    path.join(shop, "ChatGPT Image 19 mag 2026, 11_13_46.png"),
    path.join(shop, "ChatGPT Image 19 mag 2026, 11_17_54.png"),
    path.join(shop, "ChatGPT Image 19 mag 2026, 11_21_35.png"),
    path.join(shop, "LOGO.png"),
    ...shoes.map(s => path.join(cat, s.png)),
  ];
  for (const f of toDelete) {
    fs.unlinkSync(f);
    console.log(`  🗑  ${path.relative(pub, f)}`);
  }

  console.log("\n✅ Conversione completata!\n");
}

main().catch(err => { console.error(err); process.exit(1); });
